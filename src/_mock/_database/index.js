import { USERS, USER_STATS, validateDateRange, getUsersByDateRange, getMonthlyUserStats } from './_users';
import { getTopCustomers, getTransactionStats, generateTransactionsData, getMonthlyTransactionStats, getTransactionsByDateRange } from './_transactions';
import { getRevenueForecast, getRevenueAnalytics, getRevenueBySegment, getRevenueByDateRange, getRevenueEfficiencyMetrics, generateRevenueDataForPeriod } from './_revenue';
import { getTrialUsers, ENHANCED_USERS, getUsersByPlan, getActiveUsers, getRefundedUsers, getUsersByProduct, getCancelledUsers, ENHANCED_MONTHLY_STATS, getUsersByProductAndPlan, getUsersByDateRange as getEnhancedUsersByDateRange } from './_enhanced-users';

// Generate all data
const TRANSACTIONS = generateTransactionsData(USERS);
const REVENUE_DATA = generateRevenueDataForPeriod(USERS, TRANSACTIONS);

// Export all data
export {
  USERS,
  USER_STATS,
  TRANSACTIONS,
  REVENUE_DATA
};

// Export user functions
export {
  validateDateRange,
  getUsersByDateRange,
  getMonthlyUserStats
};

// Export transaction functions
export {
  getTopCustomers,
  getTransactionStats,
  getMonthlyTransactionStats,
  getTransactionsByDateRange
};

// Export revenue functions
export {
  getRevenueForecast,
  getRevenueAnalytics,
  getRevenueBySegment,
  getRevenueByDateRange,
  getRevenueEfficiencyMetrics
};


// Export enhanced database
export {
  getTrialUsers,
  ENHANCED_USERS,
  getUsersByPlan,
  getActiveUsers,
  getRefundedUsers,
  getUsersByProduct,
  getCancelledUsers,
  ENHANCED_MONTHLY_STATS,
  getUsersByProductAndPlan,
  getEnhancedUsersByDateRange
};

// Export realistic analytics service
export {
  getMRRTrend,
  getChurnTrend,
  getAllAnalytics,
  getPlansBreakdown,
  getCustomerMetrics,
  getAnalyticsSummary,
  getProductsBreakdown,
  RealisticAnalyticsService,
  realisticAnalyticsService
} from './_realistic-analytics-service';

// Export realistic dummy data
export {
  REALISTIC_PLANS,
  getSummaryStats,
  REALISTIC_INVOICES,
  REALISTIC_PRODUCTS,
  getInvoicesByMonth,
  getCustomersByPlan,
  getActiveCustomers,
  REALISTIC_CUSTOMERS,
  getCustomersByMonth,
  getAnalyticsByMonth,
  REALISTIC_DUMMY_DATA,
  getRefundedCustomers,
  getCustomersByProduct,
  getCancelledCustomers,
  REALISTIC_TRANSACTIONS,
  getTransactionsByMonth,
  REALISTIC_SUBSCRIPTIONS,
  REALISTIC_MONTHLY_ANALYTICS
} from './_realistic-dummy-data';


// Combined analytics
export const getCombinedAnalytics = () => {
  const userStats = getMonthlyUserStats();
  const transactionStats = getMonthlyTransactionStats(TRANSACTIONS);
  const revenueAnalytics = getRevenueAnalytics(REVENUE_DATA);
  
  return {
    users: userStats,
    transactions: transactionStats,
    revenue: revenueAnalytics,
    summary: {
      totalUsers: USER_STATS.totalUsers,
      totalRevenue: USER_STATS.totalRevenue,
      totalTransactions: TRANSACTIONS.length,
      averageRevenuePerUser: USER_STATS.averageRevenue,
      growthRate: revenueAnalytics.averageGrowthRate
    }
  };
};

// Dashboard data
export const getDashboardData = () => {
  const currentMonth = new Date().toISOString().slice(0, 7);
  const currentMonthData = REVENUE_DATA.find(entry => entry.month === currentMonth);
  
  return {
    currentMonth: {
      revenue: currentMonthData?.totalRevenue || 0,
      users: currentMonthData?.newCustomers || 0,
      transactions: TRANSACTIONS.filter(t => 
        t.transactionDate.startsWith(currentMonth) && t.status === 'completed'
      ).length,
      growth: currentMonthData?.metrics.revenueGrowthRate || 0
    },
    trends: {
      revenue: REVENUE_DATA.map(entry => ({
        month: entry.monthName,
        value: entry.totalRevenue
      })),
      users: Object.values(getMonthlyUserStats()).map(entry => ({
        month: entry.month,
        value: entry.totalUsers
      })),
      transactions: Object.values(getMonthlyTransactionStats(TRANSACTIONS)).map(entry => ({
        month: entry.month,
        value: entry.totalTransactions
      }))
    },
    topCustomers: getTopCustomers(TRANSACTIONS, 5),
    revenueSources: REVENUE_DATA.reduce((acc, entry) => {
      Object.entries(entry.revenueBySource).forEach(([source, amount]) => {
        acc[source] = (acc[source] || 0) + amount;
      });
      return acc;
    }, {}),
    revenueCategories: REVENUE_DATA.reduce((acc, entry) => {
      Object.entries(entry.revenueByCategory).forEach(([category, amount]) => {
        acc[category] = (category || 0) + amount;
      });
      return acc;
    }, {})
  };
};

// Date range validation for all data
export const getDataByDateRange = (startDate, endDate) => {
  validateDateRange(startDate, endDate);
  
  return {
    users: getUsersByDateRange(startDate, endDate),
    transactions: getTransactionsByDateRange(TRANSACTIONS, startDate, endDate),
    revenue: getRevenueByDateRange(REVENUE_DATA, startDate, endDate)
  };
};

// Export all data as default
export default {
  users: USERS,
  transactions: TRANSACTIONS,
  revenue: REVENUE_DATA,
  stats: {
    users: USER_STATS,
    transactions: getTransactionStats(TRANSACTIONS),
    revenue: getRevenueAnalytics(REVENUE_DATA)
  },
  analytics: getCombinedAnalytics(),
  dashboard: getDashboardData()
};
