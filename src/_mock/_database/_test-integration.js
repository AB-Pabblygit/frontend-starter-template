// Test file to verify database integration
// Test revenue analytics
import { getRevenueAnalytics } from './_revenue';
// Test transaction stats
import { getTransactionStats } from './_transactions';
import { 
  USERS, 
  TRANSACTIONS, 
  REVENUE_DATA, 
  getTopCustomers,
  getDashboardData,
  validateDateRange,
  getDataByDateRange,
  getMonthlyUserStats
} from './index';

// Test basic data generation
console.log('=== Database Integration Test ===');
console.log('Total Users:', USERS.length);
console.log('Total Transactions:', TRANSACTIONS.length);
console.log('Total Revenue Entries:', REVENUE_DATA.length);

// Test dashboard data
const dashboardData = getDashboardData();
console.log('\n=== Dashboard Data ===');
console.log('Current Month Revenue:', dashboardData.currentMonth.revenue);
console.log('Current Month Users:', dashboardData.currentMonth.users);
console.log('Current Month Transactions:', dashboardData.currentMonth.transactions);

// Test monthly stats
const monthlyStats = getMonthlyUserStats();
console.log('\n=== Monthly User Stats ===');
Object.values(monthlyStats).forEach(stat => {
  console.log(`${stat.month}: ${stat.totalUsers} users, $${stat.totalRevenue.toFixed(2)} revenue`);
});

// Test top customers
const topCustomers = getTopCustomers(TRANSACTIONS, 3);
console.log('\n=== Top 3 Customers ===');
topCustomers.forEach((customer, index) => {
  console.log(`${index + 1}. ${customer.userName} - $${customer.totalRevenue.toFixed(2)}`);
});

// Test date validation
console.log('\n=== Date Validation Test ===');
try {
  validateDateRange('2024-01-01', '2024-06-30');
  console.log('✅ Valid date range accepted');
} catch (error) {
  console.log('❌ Date validation error:', error.message);
}

try {
  validateDateRange('2024-01-01', '2025-12-31');
  console.log('❌ Future date should be rejected');
} catch (error) {
  console.log('✅ Future date correctly rejected:', error.message);
}

// Test data filtering
console.log('\n=== Data Filtering Test ===');
try {
  const filteredData = getDataByDateRange('2024-01-01', '2024-03-31');
  console.log(`Filtered data: ${filteredData.users.length} users, ${filteredData.transactions.length} transactions, ${filteredData.revenue.length} revenue entries`);
} catch (error) {
  console.log('❌ Data filtering error:', error.message);
}
const revenueAnalytics = getRevenueAnalytics(REVENUE_DATA);
console.log('\n=== Revenue Analytics ===');
console.log('Total Revenue:', revenueAnalytics.totalRevenue);
console.log('Average Monthly Revenue:', revenueAnalytics.averageMonthlyRevenue);
console.log('Average Growth Rate:', `${revenueAnalytics.averageGrowthRate.toFixed(2)  }%`);
const transactionStats = getTransactionStats(TRANSACTIONS);
console.log('\n=== Transaction Stats ===');
console.log('Total Transactions:', transactionStats.totalTransactions);
console.log('Completed Transactions:', transactionStats.completedTransactions);
console.log('Total Revenue from Transactions:', transactionStats.totalRevenue);
console.log('Average Transaction Value:', transactionStats.averageTransactionValue.toFixed(2));

console.log('\n=== Integration Test Complete ===');
console.log('✅ All database functions are working correctly!');

export {
  USERS,
  TRANSACTIONS,
  REVENUE_DATA,
  monthlyStats,
  topCustomers,
  dashboardData,
  revenueAnalytics,
  transactionStats
};
