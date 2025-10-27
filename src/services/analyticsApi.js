// Analytics API service for backend communication
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/analytics';

class AnalyticsApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  /**
   * Make HTTP request with error handling
   */
  async makeRequest(endpoint, options = {}) {
    try {
      const url = `${this.baseURL}${endpoint}`;
      const config = {
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': import.meta.env.VITE_API_KEY || 'your-api-key-for-authentication',
          ...options.headers,
        },
        ...options,
      };

      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error(`API request failed for ${endpoint}:`, error);
      }
      throw error;
    }
  }

  /**
   * Build query string from filters
   */
  static buildQueryString(filters = {}) {
    const params = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        params.append(key, value);
      }
    });
    
    return params.toString();
  }

  /**
   * Get comprehensive analytics summary
   */
  async getSummary(filters = {}) {
    const queryString = AnalyticsApiService.buildQueryString(filters);
    return this.makeRequest(`/summary?${queryString}`);
  }

  /**
   * Get MRR trend over time
   */
  async getMRR(filters = {}) {
    const queryString = AnalyticsApiService.buildQueryString(filters);
    return this.makeRequest(`/mrr?${queryString}`);
  }

  /**
   * Get churn analysis and trends
   */
  async getChurn(filters = {}) {
    const queryString = AnalyticsApiService.buildQueryString(filters);
    return this.makeRequest(`/churn?${queryString}`);
  }

  /**
   * Get metrics breakdown by plan
   */
  async getPlans(filters = {}) {
    const queryString = AnalyticsApiService.buildQueryString(filters);
    return this.makeRequest(`/plans?${queryString}`);
  }

  /**
   * Get metrics breakdown by product
   */
  async getProducts(filters = {}) {
    const queryString = AnalyticsApiService.buildQueryString(filters);
    return this.makeRequest(`/products?${queryString}`);
  }

  /**
   * Get customer-level metrics
   */
  async getCustomers(filters = {}) {
    const queryString = AnalyticsApiService.buildQueryString(filters);
    return this.makeRequest(`/customers?${queryString}`);
  }

  /**
   * Generate dummy data for testing (Development only)
   */
  async generateDummyData(months = 6, usersPerPlan = 50) {
    return this.makeRequest('/simulate', {
      method: 'POST',
      body: JSON.stringify({ months, usersPerPlan }),
    });
  }

  /**
   * Health check
   */
  async healthCheck() {
    return this.makeRequest('/health');
  }

  /**
   * Get all analytics data in one request
   */
  async getAllAnalytics(filters = {}) {
    try {
      const [summary, mrr, churn, plans, products, customers] = await Promise.all([
        this.getSummary(filters),
        this.getMRR(filters),
        this.getChurn(filters),
        this.getPlans(filters),
        this.getProducts(filters),
        this.getCustomers(filters),
      ]);

      return {
        success: true,
        data: {
          summary: summary.data,
          mrr: mrr.data,
          churn: churn.data,
          plans: plans.data,
          products: products.data,
          customers: customers.data,
        },
        meta: {
          filters,
          generatedAt: new Date(),
        },
      };
    } catch (error) {
      console.error('Failed to fetch all analytics:', error);
      throw error;
    }
  }
}

// Create singleton instance
const analyticsApi = new AnalyticsApiService();

export default analyticsApi;
