import * as analyticsService from '../services/analyticsService.js';
import * as mockAnalyticsService from '../services/mockAnalyticsService.js';
import { validateDateRange, buildFilters } from '../utils/calcUtils.js';
import mongoose from 'mongoose';

/**
 * Check if MongoDB is connected
 */
const isMongoConnected = () => {
  return mongoose.connection.readyState === 1;
};

/**
 * Get comprehensive analytics summary
 */
export const getSummary = async (req, res) => {
  try {
    const { startDate, endDate, productId, planId, userId } = req.query;
    
    // Validate date range
    const dateValidation = validateDateRange(startDate, endDate);
    if (!dateValidation.valid) {
      return res.status(400).json({
        error: 'Invalid date range',
        details: dateValidation.error
      });
    }

    // Build filters
    const filters = buildFilters({ startDate, endDate, productId, planId, userId });
    
    let summary;
    if (isMongoConnected()) {
      summary = await analyticsService.getAnalyticsSummary(filters);
    } else {
      console.log('🔄 MongoDB not connected, using mock data for summary');
      summary = await mockAnalyticsService.getAnalyticsSummary(filters);
    }
    
    res.status(200).json({
      success: true,
      data: summary.data,
      meta: {
        filters: {
          startDate: filters.createdAt?.$gte,
          endDate: filters.createdAt?.$lte,
          productId: filters.product_id,
          planId: filters.plan_id,
          userId: filters.user_id
        },
        generatedAt: new Date(),
        dataSource: isMongoConnected() ? 'database' : 'mock'
      }
    });
  } catch (error) {
    console.error('Error in getSummary:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch analytics summary',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Get MRR trend over time
 */
export const getMRR = async (req, res) => {
  try {
    const { startDate, endDate, productId, planId, userId } = req.query;
    
    const dateValidation = validateDateRange(startDate, endDate);
    if (!dateValidation.valid) {
      return res.status(400).json({
        error: 'Invalid date range',
        details: dateValidation.error
      });
    }

    const filters = buildFilters({ startDate, endDate, productId, planId, userId });
    
    let mrrData;
    if (isMongoConnected()) {
      mrrData = await analyticsService.getMRRTrend(filters);
    } else {
      console.log('🔄 MongoDB not connected, using mock data for MRR');
      mrrData = await mockAnalyticsService.getMRRData(filters);
    }
    
    res.status(200).json({
      success: true,
      data: mrrData.data,
      meta: {
        filters: {
          startDate: filters.createdAt?.$gte,
          endDate: filters.createdAt?.$lte,
          productId: filters.product_id,
          planId: filters.plan_id,
          userId: filters.user_id
        },
        generatedAt: new Date(),
        dataSource: isMongoConnected() ? 'database' : 'mock'
      }
    });
  } catch (error) {
    console.error('Error in getMRR:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch MRR data',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Get churn analysis
 */
export const getChurn = async (req, res) => {
  try {
    const { startDate, endDate, productId, planId, userId } = req.query;
    
    const dateValidation = validateDateRange(startDate, endDate);
    if (!dateValidation.valid) {
      return res.status(400).json({
        error: 'Invalid date range',
        details: dateValidation.error
      });
    }

    const filters = buildFilters({ startDate, endDate, productId, planId, userId });
    
    let churnData;
    if (isMongoConnected()) {
      churnData = await analyticsService.getChurnAnalysis(filters);
    } else {
      console.log('🔄 MongoDB not connected, using mock data for churn');
      churnData = await mockAnalyticsService.getChurnData(filters);
    }
    
    res.status(200).json({
      success: true,
      data: churnData.data,
      meta: {
        filters: {
          startDate: filters.createdAt?.$gte,
          endDate: filters.createdAt?.$lte,
          productId: filters.product_id,
          planId: filters.plan_id,
          userId: filters.user_id
        },
        generatedAt: new Date(),
        dataSource: isMongoConnected() ? 'database' : 'mock'
      }
    });
  } catch (error) {
    console.error('Error in getChurn:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch churn data',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Get metrics breakdown by plan
 */
export const getPlans = async (req, res) => {
  try {
    const { startDate, endDate, productId, planId, userId } = req.query;
    
    const dateValidation = validateDateRange(startDate, endDate);
    if (!dateValidation.valid) {
      return res.status(400).json({
        error: 'Invalid date range',
        details: dateValidation.error
      });
    }

    const filters = buildFilters({ startDate, endDate, productId, planId, userId });
    
    let planData;
    if (isMongoConnected()) {
      planData = await analyticsService.getPlanBreakdown(filters);
    } else {
      console.log('🔄 MongoDB not connected, using mock data for plans');
      planData = await mockAnalyticsService.getPlansData(filters);
    }
    
    res.status(200).json({
      success: true,
      data: planData.data,
      meta: {
        filters: {
          startDate: filters.createdAt?.$gte,
          endDate: filters.createdAt?.$lte,
          productId: filters.product_id,
          planId: filters.plan_id,
          userId: filters.user_id
        },
        generatedAt: new Date(),
        dataSource: isMongoConnected() ? 'database' : 'mock'
      }
    });
  } catch (error) {
    console.error('Error in getPlans:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch plan breakdown',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Get metrics breakdown by product
 */
export const getProducts = async (req, res) => {
  try {
    const { startDate, endDate, productId, planId, userId } = req.query;
    
    const dateValidation = validateDateRange(startDate, endDate);
    if (!dateValidation.valid) {
      return res.status(400).json({
        error: 'Invalid date range',
        details: dateValidation.error
      });
    }

    const filters = buildFilters({ startDate, endDate, productId, planId, userId });
    
    let productData;
    if (isMongoConnected()) {
      productData = await analyticsService.getProductBreakdown(filters);
    } else {
      console.log('🔄 MongoDB not connected, using mock data for products');
      productData = await mockAnalyticsService.getProductsData(filters);
    }
    
    res.status(200).json({
      success: true,
      data: productData.data,
      meta: {
        filters: {
          startDate: filters.createdAt?.$gte,
          endDate: filters.createdAt?.$lte,
          productId: filters.product_id,
          planId: filters.plan_id,
          userId: filters.user_id
        },
        generatedAt: new Date(),
        dataSource: isMongoConnected() ? 'database' : 'mock'
      }
    });
  } catch (error) {
    console.error('Error in getProducts:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch product breakdown',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Get customer-level metrics
 */
export const getCustomers = async (req, res) => {
  try {
    const { startDate, endDate, productId, planId, userId, limit = 50 } = req.query;
    
    const dateValidation = validateDateRange(startDate, endDate);
    if (!dateValidation.valid) {
      return res.status(400).json({
        error: 'Invalid date range',
        details: dateValidation.error
      });
    }

    const filters = buildFilters({ startDate, endDate, productId, planId, userId });
    
    let customerData;
    if (isMongoConnected()) {
      customerData = await analyticsService.getCustomerMetrics(filters, parseInt(limit));
    } else {
      console.log('🔄 MongoDB not connected, using mock data for customers');
      customerData = await mockAnalyticsService.getCustomersData(filters);
    }
    
    res.status(200).json({
      success: true,
      data: customerData.data,
      meta: {
        filters: {
          startDate: filters.createdAt?.$gte,
          endDate: filters.createdAt?.$lte,
          productId: filters.product_id,
          planId: filters.plan_id,
          userId: filters.user_id
        },
        limit: parseInt(limit),
        generatedAt: new Date(),
        dataSource: isMongoConnected() ? 'database' : 'mock'
      }
    });
  } catch (error) {
    console.error('Error in getCustomers:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch customer metrics',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Generate dummy data for testing (Development only)
 */
export const generateDummyData = async (req, res) => {
  try {
    // Only allow in development environment
    if (process.env.NODE_ENV === 'production') {
      return res.status(403).json({
        success: false,
        error: 'Dummy data generation is not allowed in production'
      });
    }

    const { months = 6, usersPerPlan = 50 } = req.body;
    
    const dummyData = await analyticsService.generateDummyData(months, usersPerPlan);
    
    res.status(200).json({
      success: true,
      message: 'Dummy data generated successfully',
      data: dummyData
    });
  } catch (error) {
    console.error('Error in generateDummyData:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate dummy data',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Health check endpoint
 */
export const healthCheck = async (req, res) => {
  try {
    const healthStatus = {
      success: true,
      message: 'Analytics API is healthy',
      timestamp: new Date(),
      version: '1.0.0',
      services: {
        database: 'connected',
        cache: 'available',
        api: 'operational'
      }
    };

    // Check database connection
    try {
      await mongoose.connection.db.admin().ping();
      healthStatus.services.database = 'connected';
    } catch (error) {
      healthStatus.services.database = 'disconnected';
      healthStatus.success = false;
    }

    res.status(healthStatus.success ? 200 : 503).json(healthStatus);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Health check failed',
      message: error.message
    });
  }
};
