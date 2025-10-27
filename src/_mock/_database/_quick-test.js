// Quick test to verify database functionality
import { USERS, TRANSACTIONS, REVENUE_DATA, getTopCustomers, getDashboardData } from './index';

console.log('=== Quick Database Test ===');
console.log('Users count:', USERS.length);
console.log('Transactions count:', TRANSACTIONS.length);
console.log('Revenue entries count:', REVENUE_DATA.length);

// Test getTopCustomers function
try {
  const topCustomers = getTopCustomers(TRANSACTIONS, 3);
  console.log('Top customers test:', topCustomers.length, 'customers found');
  console.log('First customer:', topCustomers[0]?.userName || 'No customers');
} catch (error) {
  console.error('getTopCustomers error:', error.message);
}

// Test getDashboardData function
try {
  const dashboardData = getDashboardData();
  console.log('Dashboard data test:', dashboardData.currentMonth.revenue > 0 ? 'Success' : 'Failed');
} catch (error) {
  console.error('getDashboardData error:', error.message);
}

console.log('=== Test Complete ===');
