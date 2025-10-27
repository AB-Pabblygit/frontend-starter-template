// Usage examples for the dummy database
import { getTransactionStats } from './_transactions';
import { getRevenueForecast, getRevenueEfficiencyMetrics } from './_revenue';
import { 
  USERS, 
  TRANSACTIONS, 
  REVENUE_DATA, 
  getTopCustomers, 
  getDashboardData,
  validateDateRange,
  getDataByDateRange,
  getUsersByDateRange,
  getMonthlyUserStats,
  getRevenueAnalytics,
  getRevenueByDateRange,
  getTransactionsByDateRange,
  getMonthlyTransactionStats
} from './index';

// Example 1: Get all users
console.log('Total users:', USERS.length);

// Example 2: Get users from a specific date range
try {
  const usersInRange = getUsersByDateRange('2024-01-01', '2024-03-31');
  console.log('Users in Q1 2024:', usersInRange.length);
} catch (error) {
  console.error('Date validation error:', error.message);
}

// Example 3: Get monthly user statistics
const monthlyUserStats = getMonthlyUserStats();
console.log('Monthly user stats:', monthlyUserStats);

// Example 4: Get top customers by revenue
const topCustomers = getTopCustomers(TRANSACTIONS, 10);
console.log('Top 10 customers:', topCustomers);

// Example 5: Get dashboard data
const dashboardData = getDashboardData();
console.log('Dashboard data:', dashboardData);

// Example 6: Get revenue analytics
const revenueAnalytics = getRevenueAnalytics(REVENUE_DATA);
console.log('Revenue analytics:', revenueAnalytics);

// Example 7: Validate date range (this will throw an error for future dates)
try {
  validateDateRange('2024-01-01', '2025-12-31'); // This will fail
} catch (error) {
  console.log('Future date validation works:', error.message);
}

// Example 8: Get data by date range
try {
  const dataByRange = getDataByDateRange('2024-01-01', '2024-06-30');
  console.log('Data by range:', {
    users: dataByRange.users.length,
    transactions: dataByRange.transactions.length,
    revenue: dataByRange.revenue.length
  });
} catch (error) {
  console.error('Date range error:', error.message);
}

// Example 9: Get monthly transaction stats
const monthlyTransactionStats = getMonthlyTransactionStats(TRANSACTIONS);
console.log('Monthly transaction stats:', monthlyTransactionStats);

// Example 10: Filter users by status
const activeUsers = USERS.filter(user => user.status === 'active');
const inactiveUsers = USERS.filter(user => user.status === 'inactive');
console.log('Active users:', activeUsers.length);
console.log('Inactive users:', inactiveUsers.length);

// Example 11: Get users by subscription plan
const usersByPlan = USERS.reduce((acc, user) => {
  acc[user.subscription.plan] = (acc[user.subscription.plan] || 0) + 1;
  return acc;
}, {});
console.log('Users by plan:', usersByPlan);

// Example 12: Get revenue by source
const revenueBySource = REVENUE_DATA.reduce((acc, entry) => {
  Object.entries(entry.revenueBySource).forEach(([source, amount]) => {
    acc[source] = (acc[source] || 0) + amount;
  });
  return acc;
}, {});
console.log('Revenue by source:', revenueBySource);

// Example 13: Get transaction statistics
const transactionStats = getTransactionStats(TRANSACTIONS);
console.log('Transaction stats:', transactionStats);

// Example 14: Get revenue efficiency metrics
const efficiencyMetrics = getRevenueEfficiencyMetrics(REVENUE_DATA);
console.log('Revenue efficiency:', efficiencyMetrics);

// Example 15: Get revenue forecast
const forecast = getRevenueForecast(REVENUE_DATA, 3);
console.log('Revenue forecast for next 3 months:', forecast);

export {
  // Re-export for convenience
  USERS,
  TRANSACTIONS,
  REVENUE_DATA,
  getTopCustomers,
  getDashboardData,
  validateDateRange,
  getUsersByDateRange,
  getMonthlyUserStats,
  getRevenueAnalytics,
  getRevenueByDateRange,
  getTransactionsByDateRange,
  getMonthlyTransactionStats
};
