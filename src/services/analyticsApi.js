// Analytics API service for database communication
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/analytics';

class AnalyticsApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  /**
   * Make HTTP request with error handling and authentication
   */
  async makeRequest(endpoint, options = {}) {
    try {
      const url = `${this.baseURL}${endpoint}`;
      const config = {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${AnalyticsApiService.getAuthToken()}`,
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
   * Get authentication token from localStorage or session
   */
  static getAuthToken() {
    return localStorage.getItem('authToken') || sessionStorage.getItem('authToken') || '';
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
   * Expected database response structure:
   * {
   *   success: true,
   *   data: {
   *     startMRR: number,
   *     endMRR: number,
   *     newMRR: number,
   *     upgradeMRR: number,
   *     downgradeMRR: number,
   *     churnedMRR: number,
   *     netNewMRR: number,
   *     totalCustomers: number,
   *     activeCustomers: number,
   *     newCustomers: number,
   *     churnedCustomers: number,
   *     refundedRevenue: number,
   *     overallCAC: number,
   *     cacPerCustomer: number,
   *     avgMonthsCustomerRemains: number
   *   }
   * }
   */
  async getSummary(filters = {}) {
    const queryString = AnalyticsApiService.buildQueryString(filters);
    return this.makeRequest(`/summary?${queryString}`);
  }

  /**
   * Get MRR trend over time
   * Expected database response structure:
   * {
   *   success: true,
   *   data: [
   *     {
   *       date: string (YYYY-MM-DD),
   *       mrr: number,
   *       newMRR: number,
   *       churnedMRR: number,
   *       netNewMRR: number
   *     }
   *   ]
   * }
   */
  async getMRR(filters = {}) {
    const queryString = AnalyticsApiService.buildQueryString(filters);
    return this.makeRequest(`/mrr?${queryString}`);
  }

  /**
   * Get churn analysis and trends
   * Expected database response structure:
   * {
   *   success: true,
   *   data: {
   *     customerChurnRate: number,
   *     revenueChurnRate: number,
   *     churnTrends: [
   *       {
   *         date: string,
   *         churnedCustomers: number,
   *         churnedMRR: number
   *       }
   *     ]
   *   }
   * }
   */
  async getChurn(filters = {}) {
    const queryString = AnalyticsApiService.buildQueryString(filters);
    return this.makeRequest(`/churn?${queryString}`);
  }

  /**
   * Get metrics breakdown by plan
   * Expected database response structure:
   * {
   *   success: true,
   *   data: [
   *     {
   *       planId: string,
   *       planName: string,
   *       productId: string,
   *       productName: string,
   *       totalCustomers: number,
   *       mrr: number,
   *       churnRate: number,
   *       avgLifetime: number
   *     }
   *   ]
   * }
   */
  async getPlans(filters = {}) {
    const queryString = AnalyticsApiService.buildQueryString(filters);
    return this.makeRequest(`/plans?${queryString}`);
  }

  /**
   * Get metrics breakdown by product
   * Expected database response structure:
   * {
   *   success: true,
   *   data: [
   *     {
   *       productId: string,
   *       productName: string,
   *       totalCustomers: number,
   *       mrr: number,
   *       churnRate: number
   *     }
   *   ]
   * }
   */
  async getProducts(filters = {}) {
    const queryString = AnalyticsApiService.buildQueryString(filters);
    return this.makeRequest(`/products?${queryString}`);
  }

  /**
   * Get customer-level metrics
   * Expected database response structure:
   * {
   *   success: true,
   *   data: [
   *     {
   *       id: string,
   *       name: string,
   *       email: string,
   *       status: 'active' | 'cancelled' | 'paused',
   *       signupDate: string (YYYY-MM-DD),
   *       planId: string,
   *       productId: string,
   *       monthlyRevenue: number,
   *       subscriptions: [
   *         {
   *           id: string,
   *           productId: string,
   *           planId: string,
   *           monthly: number,
   *           start: string (YYYY-MM-DD),
   *           end: string (YYYY-MM-DD) | null,
   *           active: boolean
   *         }
   *       ],
   *       transactions: [
   *         {
   *           date: string (YYYY-MM-DD),
   *           amount: number,
   *           type: 'invoice' | 'refund',
   *           refunded: boolean
   *         }
   *       ]
   *     }
   *   ]
   * }
   */
  async getCustomers(filters = {}) {
    const queryString = AnalyticsApiService.buildQueryString(filters);
    return this.makeRequest(`/customers?${queryString}`);
  }

  /**
   * Get all analytics data in one request
   * This is the main method used by the dashboard
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
          generatedAt: new Date().toISOString(),
        },
      };
    } catch (error) {
      console.error('Failed to fetch all analytics:', error);
      throw error;
    }
  }

  /**
   * Health check endpoint
   */
  async healthCheck() {
    return this.makeRequest('/health');
  }

  /**
   * Update filters and refresh data
   */
  async updateFilters(newFilters) {
    const queryString = AnalyticsApiService.buildQueryString(newFilters);
    return this.makeRequest(`/refresh?${queryString}`);
  }
}

// Create singleton instance
const analyticsApi = new AnalyticsApiService();

export default analyticsApi;