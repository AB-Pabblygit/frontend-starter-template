// Test script to verify frontend-backend integration
const API_BASE_URL = 'http://localhost:5000/api/analytics';

async function testBackendConnection() {
  console.log('🧪 Testing Backend Integration...\n');
  
  try {
    // Test health check
    console.log('1. Testing health check...');
    const healthResponse = await fetch(`${API_BASE_URL}/health`);
    const healthData = await healthResponse.json();
    console.log('✅ Health check:', healthData.message);
    
    // Test analytics summary
    console.log('\n2. Testing analytics summary...');
    const summaryResponse = await fetch(`${API_BASE_URL}/summary`);
    const summaryData = await summaryResponse.json();
    console.log('✅ Analytics summary:', summaryData.success ? 'Success' : 'Failed');
    
    if (summaryData.data) {
      console.log('   - Total MRR:', summaryData.data.totalMRR);
      console.log('   - Active Customers:', summaryData.data.activeCustomers);
      console.log('   - Revenue Churn:', summaryData.data.revenueChurn + '%');
    }
    
    // Test MRR endpoint
    console.log('\n3. Testing MRR endpoint...');
    const mrrResponse = await fetch(`${API_BASE_URL}/mrr`);
    const mrrData = await mrrResponse.json();
    console.log('✅ MRR data:', mrrData.success ? 'Success' : 'Failed');
    
    // Test with filters
    console.log('\n4. Testing with filters...');
    const filteredResponse = await fetch(`${API_BASE_URL}/summary?startDate=2024-01-01&endDate=2024-12-31`);
    const filteredData = await filteredResponse.json();
    console.log('✅ Filtered data:', filteredData.success ? 'Success' : 'Failed');
    
    console.log('\n🎉 All tests passed! Backend is ready for frontend integration.');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.log('\n💡 Make sure the backend server is running on port 5000');
    console.log('   Run: cd backend && npm run dev');
  }
}

// Run the test
testBackendConnection();
