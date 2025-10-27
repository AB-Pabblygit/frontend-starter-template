import redis from 'redis';

// Redis client configuration
const redisClient = redis.createClient({
  host: process.env.REDIS_HOST || 'localhost',
  port: process.env.REDIS_PORT || 6379,
  password: process.env.REDIS_PASSWORD || undefined,
  retry_strategy: (options) => {
    if (options.error && options.error.code === 'ECONNREFUSED') {
      console.error('Redis server connection refused');
      return new Error('Redis server connection refused');
    }
    if (options.total_retry_time > 1000 * 60 * 60) {
      console.error('Redis retry time exhausted');
      return new Error('Retry time exhausted');
    }
    if (options.attempt > 10) {
      console.error('Redis max retry attempts reached');
      return undefined;
    }
    return Math.min(options.attempt * 100, 3000);
  }
});

// Redis error handling
redisClient.on('error', (err) => {
  console.error('Redis Client Error:', err);
});

redisClient.on('connect', () => {
  console.log('Connected to Redis');
});

redisClient.on('ready', () => {
  console.log('Redis client ready');
});

/**
 * Generate cache key from request parameters
 */
export const generateCacheKey = (prefix, params) => {
  const sortedParams = Object.keys(params)
    .sort()
    .reduce((result, key) => {
      result[key] = params[key];
      return result;
    }, {});
  
  return `${prefix}:${JSON.stringify(sortedParams)}`;
};

/**
 * Get data from cache
 */
export const getFromCache = async (key) => {
  try {
    if (!redisClient.isOpen) {
      return null;
    }
    const cached = await redisClient.get(key);
    return cached ? JSON.parse(cached) : null;
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.warn('Cache unavailable, continuing without cache:', error.message);
    }
    return null;
  }
};

/**
 * Set data in cache with TTL
 */
export const setInCache = async (key, data, ttlSeconds = 3600) => {
  try {
    if (!redisClient.isOpen) {
      return false;
    }
    await redisClient.setEx(key, ttlSeconds, JSON.stringify(data));
    return true;
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.warn('Cache unavailable, continuing without cache:', error.message);
    }
    return false;
  }
};

/**
 * Delete data from cache
 */
export const deleteFromCache = async (key) => {
  try {
    await redisClient.del(key);
    return true;
  } catch (error) {
    console.error('Error deleting from cache:', error);
    return false;
  }
};

/**
 * Clear all cache keys with a specific prefix
 */
export const clearCacheByPrefix = async (prefix) => {
  try {
    const keys = await redisClient.keys(`${prefix}:*`);
    if (keys.length > 0) {
      await redisClient.del(...keys);
    }
    return true;
  } catch (error) {
    console.error('Error clearing cache by prefix:', error);
    return false;
  }
};

/**
 * Cache middleware for analytics endpoints
 */
export const cacheMiddleware = (ttlSeconds = 3600) => {
  return async (req, res, next) => {
    try {
      // Generate cache key from request parameters
      const cacheKey = generateCacheKey('analytics', {
        path: req.path,
        query: req.query,
        method: req.method
      });

      // Try to get from cache
      const cachedData = await getFromCache(cacheKey);
      
      if (cachedData) {
        console.log(`Cache hit for key: ${cacheKey}`);
        return res.json({
          ...cachedData,
          cached: true,
          cacheKey
        });
      }

      // Store original json method
      const originalJson = res.json;
      
      // Override json method to cache response
      res.json = async (data) => {
        try {
          await setInCache(cacheKey, data, ttlSeconds);
          console.log(`Cached response for key: ${cacheKey}`);
        } catch (error) {
          console.error('Error caching response:', error);
        }
        
        // Call original json method
        originalJson.call(res, {
          ...data,
          cached: false,
          cacheKey
        });
      };

      next();
    } catch (error) {
      console.error('Cache middleware error:', error);
      next(); // Continue without caching if Redis fails
    }
  };
};

/**
 * Invalidate cache for specific patterns
 */
export const invalidateCache = async (patterns) => {
  try {
    const promises = patterns.map(async (pattern) => {
      const keys = await redisClient.keys(pattern);
      if (keys.length > 0) {
        await redisClient.del(...keys);
        console.log(`Invalidated ${keys.length} cache keys for pattern: ${pattern}`);
      }
    });
    
    await Promise.all(promises);
    return true;
  } catch (error) {
    console.error('Error invalidating cache:', error);
    return false;
  }
};

/**
 * Get cache statistics
 */
export const getCacheStats = async () => {
  try {
    const info = await redisClient.info('memory');
    const keyspace = await redisClient.info('keyspace');
    
    return {
      memory: info,
      keyspace: keyspace,
      timestamp: new Date()
    };
  } catch (error) {
    console.error('Error getting cache stats:', error);
    return null;
  }
};

/**
 * Warm up cache with frequently accessed data
 */
export const warmUpCache = async (analyticsService) => {
  try {
    console.log('Starting cache warm-up...');
    
    // Get last 6 months data
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    
    const filters = {
      createdAt: {
        $gte: sixMonthsAgo,
        $lte: new Date()
      }
    };

    // Warm up summary data
    const summaryKey = generateCacheKey('analytics', {
      path: '/summary',
      query: { startDate: sixMonthsAgo.toISOString().split('T')[0] },
      method: 'GET'
    });
    
    const summaryData = await analyticsService.getAnalyticsSummary(filters);
    await setInCache(summaryKey, summaryData, 3600);
    
    // Warm up MRR trend
    const mrrKey = generateCacheKey('analytics', {
      path: '/mrr',
      query: { startDate: sixMonthsAgo.toISOString().split('T')[0] },
      method: 'GET'
    });
    
    const mrrData = await analyticsService.getMRRTrend(filters);
    await setInCache(mrrKey, mrrData, 3600);
    
    console.log('Cache warm-up completed');
    return true;
  } catch (error) {
    console.error('Error during cache warm-up:', error);
    return false;
  }
};

/**
 * Cache TTL configurations for different endpoints
 */
export const CACHE_TTL = {
  SUMMARY: 3600,      // 1 hour
  MRR: 1800,         // 30 minutes
  CHURN: 1800,       // 30 minutes
  PLANS: 3600,       // 1 hour
  PRODUCTS: 3600,    // 1 hour
  CUSTOMERS: 1800,   // 30 minutes
  DEFAULT: 3600      // 1 hour
};

export default redisClient;
