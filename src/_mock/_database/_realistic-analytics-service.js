import dayjs from 'dayjs';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';

import {
  REALISTIC_PLANS,
  REALISTIC_INVOICES,
  REALISTIC_PRODUCTS,
  REALISTIC_CUSTOMERS,
  REALISTIC_TRANSACTIONS,
  REALISTIC_SUBSCRIPTIONS,
  REALISTIC_MONTHLY_ANALYTICS
} from './_realistic-dummy-data';

// Extend dayjs with plugins
dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

// Realistic Analytics Service using the generated dummy data
export class RealisticAnalyticsService {
  constructor() {
    this.customers = REALISTIC_CUSTOMERS;
    this.transactions = REALISTIC_TRANSACTIONS;
    this.invoices = REALISTIC_INVOICES;
    this.subscriptions = REALISTIC_SUBSCRIPTIONS;
    this.monthlyAnalytics = REALISTIC_MONTHLY_ANALYTICS;
    this.products = REALISTIC_PRODUCTS;
    this.plans = REALISTIC_PLANS;
  }

  // Filter data based on date range and other filters
  filterData(filters = {}) {
    const { startDate, endDate, productId, planId, customerId } = filters;
    
    let filteredCustomers = [...this.customers];
    let filteredTransactions = [...this.transactions];
    let filteredInvoices = [...this.invoices];
    let filteredSubscriptions = [...this.subscriptions];
    
    // Date filtering
    if (startDate) {
      const start = dayjs(startDate);
      filteredCustomers = filteredCustomers.filter(c => 
        dayjs(c.signupDate).isSameOrAfter(start)
      );
      filteredTransactions = filteredTransactions.filter(t => 
        dayjs(t.transactionDate).isSameOrAfter(start)
      );
      filteredInvoices = filteredInvoices.filter(i => 
        dayjs(i.createdAt).isSameOrAfter(start)
      );
      filteredSubscriptions = filteredSubscriptions.filter(s => 
        dayjs(s.createdAt).isSameOrAfter(start)
      );
    }
    
    if (endDate) {
      const end = dayjs(endDate);
      filteredCustomers = filteredCustomers.filter(c => 
        dayjs(c.signupDate).isSameOrBefore(end)
      );
      filteredTransactions = filteredTransactions.filter(t => 
        dayjs(t.transactionDate).isSameOrBefore(end)
      );
      filteredInvoices = filteredInvoices.filter(i => 
        dayjs(i.createdAt).isSameOrBefore(end)
      );
      filteredSubscriptions = filteredSubscriptions.filter(s => 
        dayjs(s.createdAt).isSameOrBefore(end)
      );
    }
    
    // Product filtering
    if (productId) {
      filteredCustomers = filteredCustomers.filter(c => c.productId === productId);
      filteredTransactions = filteredTransactions.filter(t => t.productId === productId);
      filteredInvoices = filteredInvoices.filter(i => i.productId === productId);
      filteredSubscriptions = filteredSubscriptions.filter(s => s.productId === productId);
    }
    
    // Plan filtering
    if (planId) {
      filteredCustomers = filteredCustomers.filter(c => c.planId === planId);
      filteredTransactions = filteredTransactions.filter(t => t.planId === planId);
      filteredInvoices = filteredInvoices.filter(i => i.planId === planId);
      filteredSubscriptions = filteredSubscriptions.filter(s => s.planId === planId);
    }
    
    // Customer filtering
    if (customerId) {
      filteredCustomers = filteredCustomers.filter(c => c.id === customerId);
      filteredTransactions = filteredTransactions.filter(t => t.customerId === customerId);
      filteredInvoices = filteredInvoices.filter(i => i.customerId === customerId);
      filteredSubscriptions = filteredSubscriptions.filter(s => s.customerId === customerId);
    }
    
    return {
      customers: filteredCustomers,
      transactions: filteredTransactions,
      invoices: filteredInvoices,
      subscriptions: filteredSubscriptions
    };
  }

  // Calculate MRR (Monthly Recurring Revenue)
  calculateMRR(filters = {}) {
    const { transactions } = this.filterData(filters);
    return transactions.reduce((sum, transaction) => sum + transaction.amount, 0);
  }

  // Calculate ARPU (Average Revenue Per User)
  calculateARPU(filters = {}) {
    const { customers, transactions } = this.filterData(filters);
    const activeCustomers = customers.filter(c => c.status === 'active');
    const totalRevenue = transactions.reduce((sum, t) => sum + t.amount, 0);
    
    return activeCustomers.length > 0 ? totalRevenue / activeCustomers.length : 0;
  }

  // Calculate LTV (Lifetime Value)
  calculateLTV(filters = {}) {
    const { customers } = this.filterData(filters);
    const activeCustomers = customers.filter(c => c.status === 'active');
    
    if (activeCustomers.length === 0) return 0;
    
    const totalLTV = activeCustomers.reduce((sum, customer) => {
      const monthsActive = dayjs().diff(dayjs(customer.signupDate), 'month') + 1;
      return sum + (customer.monthlyFee * monthsActive);
    }, 0);
    
    return totalLTV / activeCustomers.length;
  }

  // Calculate CAC (Customer Acquisition Cost)
  calculateCAC(filters = {}) {
    const { customers } = this.filterData(filters);
    const newCustomers = customers.filter(c => 
      dayjs(c.signupDate).isSame(dayjs(), 'month')
    );
    
    if (newCustomers.length === 0) return 0;
    
    const totalCAC = newCustomers.reduce((sum, customer) => 
      sum + customer.acquisitionCost, 0
    );
    
    return totalCAC / newCustomers.length;
  }

  // Calculate Churn Rate
  calculateChurnRate(filters = {}) {
    const { customers } = this.filterData(filters);
    const activeCustomers = customers.filter(c => c.status === 'active');
    const cancelledCustomers = customers.filter(c => c.status === 'cancelled');
    
    const totalCustomers = activeCustomers.length + cancelledCustomers.length;
    return totalCustomers > 0 ? (cancelledCustomers.length / totalCustomers) * 100 : 0;
  }

  // Calculate Revenue Churn
  calculateRevenueChurn(filters = {}) {
    const { customers } = this.filterData(filters);
    const cancelledCustomers = customers.filter(c => c.status === 'cancelled');
    const totalMRR = this.calculateMRR(filters);
    const lostMRR = cancelledCustomers.reduce((sum, c) => sum + c.monthlyFee, 0);
    
    return totalMRR > 0 ? (lostMRR / totalMRR) * 100 : 0;
  }

  // Get comprehensive analytics summary
  getAnalyticsSummary(filters = {}) {
    const { customers, transactions, invoices } = this.filterData(filters);
    
    const activeCustomers = customers.filter(c => c.status === 'active');
    const cancelledCustomers = customers.filter(c => c.status === 'cancelled');
    const newCustomers = customers.filter(c => 
      dayjs(c.signupDate).isSame(dayjs(), 'month')
    );
    
    const totalMRR = this.calculateMRR(filters);
    const totalRevenue = transactions.reduce((sum, t) => sum + t.amount, 0);
    const totalRefunds = customers.reduce((sum, c) => sum + c.refundAmount, 0);
    
    const arpu = this.calculateARPU(filters);
    const ltv = this.calculateLTV(filters);
    const cac = this.calculateCAC(filters);
    const churnRate = this.calculateChurnRate(filters);
    const revenueChurn = this.calculateRevenueChurn(filters);
    
    return {
      totalMRR: Math.round(totalMRR * 100) / 100,
      totalRevenue: Math.round(totalRevenue * 100) / 100,
      totalRefunds: Math.round(totalRefunds * 100) / 100,
      activeCustomers: activeCustomers.length,
      cancelledCustomers: cancelledCustomers.length,
      newCustomers: newCustomers.length,
      totalCustomers: customers.length,
      arpu: Math.round(arpu * 100) / 100,
      ltv: Math.round(ltv * 100) / 100,
      cac: Math.round(cac * 100) / 100,
      churnRate: Math.round(churnRate * 100) / 100,
      revenueChurn: Math.round(revenueChurn * 100) / 100,
      ltvCacRatio: cac > 0 ? Math.round((ltv / cac) * 100) / 100 : 0
    };
  }

  // Get MRR trend over time
  getMRRTrend(filters = {}) {
    const months = [];
    const currentDate = dayjs();
    
    for (let i = 5; i >= 0; i -= 1) {
      const monthDate = currentDate.subtract(i, 'month');
      const monthFilters = {
        ...filters,
        startDate: monthDate.startOf('month').toISOString(),
        endDate: monthDate.endOf('month').toISOString()
      };
      
      const mrr = this.calculateMRR(monthFilters);
      
      months.push({
        month: monthDate.format('YYYY-MM'),
        monthName: monthDate.format('MMMM YYYY'),
        mrr: Math.round(mrr * 100) / 100
      });
    }
    
    return months;
  }

  // Get churn trend over time
  getChurnTrend(filters = {}) {
    const months = [];
    const currentDate = dayjs();
    
    for (let i = 5; i >= 0; i -= 1) {
      const monthDate = currentDate.subtract(i, 'month');
      const monthFilters = {
        ...filters,
        startDate: monthDate.startOf('month').toISOString(),
        endDate: monthDate.endOf('month').toISOString()
      };
      
      const churnRate = this.calculateChurnRate(monthFilters);
      
      months.push({
        month: monthDate.format('YYYY-MM'),
        monthName: monthDate.format('MMMM YYYY'),
        churnRate: Math.round(churnRate * 100) / 100
      });
    }
    
    return months;
  }

  // Get breakdown by plans
  getPlansBreakdown(filters = {}) {
    const { customers } = this.filterData(filters);
    
    return this.plans.map(plan => {
      const planCustomers = customers.filter(c => c.planId === plan.id);
      const activeCustomers = planCustomers.filter(c => c.status === 'active');
      const totalMRR = planCustomers.reduce((sum, c) => sum + c.monthlyFee, 0);
      
      return {
        planId: plan.id,
        planName: plan.name,
        price: plan.price,
        totalCustomers: planCustomers.length,
        activeCustomers: activeCustomers.length,
        totalMRR: Math.round(totalMRR * 100) / 100,
        churnRate: planCustomers.length > 0 ? 
          Math.round((planCustomers.filter(c => c.status === 'cancelled').length / planCustomers.length) * 100 * 100) / 100 : 0
      };
    });
  }

  // Get breakdown by products
  getProductsBreakdown(filters = {}) {
    const { customers } = this.filterData(filters);
    
    return this.products.map(product => {
      const productCustomers = customers.filter(c => c.productId === product.id);
      const activeCustomers = productCustomers.filter(c => c.status === 'active');
      const totalMRR = productCustomers.reduce((sum, c) => sum + c.monthlyFee, 0);
      
      return {
        productId: product.id,
        productName: product.name,
        totalCustomers: productCustomers.length,
        activeCustomers: activeCustomers.length,
        totalMRR: Math.round(totalMRR * 100) / 100,
        churnRate: productCustomers.length > 0 ? 
          Math.round((productCustomers.filter(c => c.status === 'cancelled').length / productCustomers.length) * 100 * 100) / 100 : 0
      };
    });
  }

  // Get customer metrics
  getCustomerMetrics(filters = {}) {
    const { customers } = this.filterData(filters);
    
    return customers.map(customer => ({
      customerId: customer.id,
      email: customer.email,
      name: `${customer.firstName} ${customer.lastName}`,
      product: customer.product,
      plan: customer.plan,
      status: customer.status,
      monthlyFee: customer.monthlyFee,
      signupDate: customer.signupDate,
      cancelDate: customer.cancelDate,
      totalSpent: customer.monthlyFee * (customer.renewals + 1),
      firstPurchase: customer.signupDate,
      lastPurchase: customer.status === 'active' ? 
        dayjs().subtract(1, 'month').toISOString() : customer.cancelDate
    }));
  }

  // Get all analytics data for dashboard
  getAllAnalytics(filters = {}) {
    return {
      summary: this.getAnalyticsSummary(filters),
      mrr: this.getMRRTrend(filters),
      churn: this.getChurnTrend(filters),
      plans: this.getPlansBreakdown(filters),
      products: this.getProductsBreakdown(filters),
      customers: this.getCustomerMetrics(filters)
    };
  }
}

// Create singleton instance
export const realisticAnalyticsService = new RealisticAnalyticsService();

// Export convenience functions
export const getAnalyticsSummary = (filters) => realisticAnalyticsService.getAnalyticsSummary(filters);
export const getMRRTrend = (filters) => realisticAnalyticsService.getMRRTrend(filters);
export const getChurnTrend = (filters) => realisticAnalyticsService.getChurnTrend(filters);
export const getPlansBreakdown = (filters) => realisticAnalyticsService.getPlansBreakdown(filters);
export const getProductsBreakdown = (filters) => realisticAnalyticsService.getProductsBreakdown(filters);
export const getCustomerMetrics = (filters) => realisticAnalyticsService.getCustomerMetrics(filters);
export const getAllAnalytics = (filters) => realisticAnalyticsService.getAllAnalytics(filters);

export default realisticAnalyticsService;
