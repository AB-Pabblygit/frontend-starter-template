/**
 * Mock Analytics Service for when MongoDB is not available
 * This provides realistic mock data that matches the expected API structure
 */

// Mock data that matches the frontend expectations
const mockData = {
  summary: {
    totalMRR: 153001.28,
    activeCustomers: 88,
    revenueChurn: 1.0,
    userChurn: 0.0,
    arpu: 1738.65,
    ltv: 499.00,
    previousMonthMRR: 145000.00,
    cancelledCustomersMRR: 153001.28,
    newCustomerMRR: 8001.28,
    refunds: 2500.00,
    overallCAC: 252.19,
    cacPerCustomer: 2.87,
    customersLeft: 2,
    newJoinedCustomers: 8,
    totalCustomersThisMonth: 88,
    avgMonthsCustomerRemains: 3.2
  },
  mrr: [
    { month: '01-2025', mrr: 120000, invoiceCount: 65, avgAmount: 1846.15 },
    { month: '02-2025', mrr: 125000, invoiceCount: 68, avgAmount: 1838.24 },
    { month: '03-2025', mrr: 130000, invoiceCount: 70, avgAmount: 1857.14 },
    { month: '04-2025', mrr: 135000, invoiceCount: 72, avgAmount: 1875.00 },
    { month: '05-2025', mrr: 140000, invoiceCount: 75, avgAmount: 1866.67 },
    { month: '06-2025', mrr: 145000, invoiceCount: 78, avgAmount: 1858.97 },
    { month: '07-2025', mrr: 147000, invoiceCount: 80, avgAmount: 1837.50 },
    { month: '08-2025', mrr: 149000, invoiceCount: 82, avgAmount: 1817.07 },
    { month: '09-2025', mrr: 151000, invoiceCount: 85, avgAmount: 1776.47 },
    { month: '10-2025', mrr: 153001.28, invoiceCount: 88, avgAmount: 1738.65 }
  ],
  churn: [
    { month: '01-2025', revenueChurn: 2.1, userChurn: 1.2, lostRevenue: 2520, lostCustomers: 1 },
    { month: '02-2025', revenueChurn: 1.8, userChurn: 0.8, lostRevenue: 2250, lostCustomers: 1 },
    { month: '03-2025', revenueChurn: 1.5, userChurn: 0.6, lostRevenue: 1950, lostCustomers: 1 },
    { month: '04-2025', revenueChurn: 1.3, userChurn: 0.4, lostRevenue: 1755, lostCustomers: 1 },
    { month: '05-2025', revenueChurn: 1.1, userChurn: 0.3, lostRevenue: 1540, lostCustomers: 1 },
    { month: '06-2025', revenueChurn: 0.9, userChurn: 0.2, lostRevenue: 1305, lostCustomers: 1 },
    { month: '07-2025', revenueChurn: 0.8, userChurn: 0.1, lostRevenue: 1176, lostCustomers: 1 },
    { month: '08-2025', revenueChurn: 0.7, userChurn: 0.1, lostRevenue: 1043, lostCustomers: 1 },
    { month: '09-2025', revenueChurn: 0.6, userChurn: 0.0, lostRevenue: 906, lostCustomers: 0 },
    { month: '10-2025', revenueChurn: 1.0, userChurn: 0.0, lostRevenue: 1530.01, lostCustomers: 0 }
  ],
  plans: [
    { planId: 'basic', planName: 'Basic Plan', mrr: 45000, customers: 25, avgAmount: 1800 },
    { planId: 'pro', planName: 'Pro Plan', mrr: 68000, customers: 35, avgAmount: 1942.86 },
    { planId: 'enterprise', planName: 'Enterprise Plan', mrr: 40001.28, customers: 28, avgAmount: 1428.62 }
  ],
  products: [
    { productId: 'email-marketing', productName: 'Email Marketing', mrr: 95000, customers: 50, avgAmount: 1900 },
    { productId: 'automation', productName: 'Automation', mrr: 38001.28, customers: 25, avgAmount: 1520.05 },
    { productId: 'analytics', productName: 'Analytics', mrr: 20000, customers: 13, avgAmount: 1538.46 }
  ],
  customers: [
    {
      id: 'cust_001',
      email: 'john.doe@example.com',
      name: 'John Doe',
      plan: 'Pro Plan',
      product: 'Email Marketing',
      mrr: 1942.86,
      monthlyFee: 1942.86,
      totalRevenue: 19420.00,
      status: 'active',
      joinDate: '2025-01-15',
      lastPayment: '2025-10-01'
    },
    {
      id: 'cust_002',
      email: 'jane.smith@example.com',
      name: 'Jane Smith',
      plan: 'Enterprise Plan',
      product: 'Automation',
      mrr: 1428.62,
      monthlyFee: 1428.62,
      totalRevenue: 14286.20,
      status: 'active',
      joinDate: '2025-02-20',
      lastPayment: '2025-10-01'
    },
    {
      id: 'cust_003',
      email: 'bob.wilson@example.com',
      name: 'Bob Wilson',
      plan: 'Basic Plan',
      product: 'Analytics',
      mrr: 1800.00,
      monthlyFee: 1800.00,
      totalRevenue: 18000.00,
      status: 'active',
      joinDate: '2025-03-10',
      lastPayment: '2025-10-01'
    },
    {
      id: 'cust_004',
      email: 'alice.johnson@example.com',
      name: 'Alice Johnson',
      plan: 'Pro Plan',
      product: 'Email Marketing',
      mrr: 1942.86,
      monthlyFee: 1942.86,
      totalRevenue: 19420.00,
      status: 'active',
      joinDate: '2025-04-05',
      lastPayment: '2025-10-01'
    },
    {
      id: 'cust_005',
      email: 'charlie.brown@example.com',
      name: 'Charlie Brown',
      plan: 'Enterprise Plan',
      product: 'Automation',
      mrr: 1428.62,
      monthlyFee: 1428.62,
      totalRevenue: 14286.20,
      status: 'active',
      joinDate: '2025-05-12',
      lastPayment: '2025-10-01'
    }
  ]
};

/**
 * Get analytics summary with mock data
 */
export const getAnalyticsSummary = async (filters) => {
  console.log('📊 Using mock analytics data (MongoDB not available)');
  
  // Simulate some processing time
  await new Promise(resolve => setTimeout(resolve, 100));
  
  return {
    success: true,
    data: mockData.summary
  };
};

/**
 * Get MRR data with mock data
 */
export const getMRRData = async (filters) => {
  console.log('📈 Using mock MRR data (MongoDB not available)');
  
  await new Promise(resolve => setTimeout(resolve, 50));
  
  return {
    success: true,
    data: mockData.mrr
  };
};

/**
 * Get churn data with mock data
 */
export const getChurnData = async (filters) => {
  console.log('📉 Using mock churn data (MongoDB not available)');
  
  await new Promise(resolve => setTimeout(resolve, 50));
  
  return {
    success: true,
    data: mockData.churn
  };
};

/**
 * Get plans data with mock data
 */
export const getPlansData = async (filters) => {
  console.log('📋 Using mock plans data (MongoDB not available)');
  
  await new Promise(resolve => setTimeout(resolve, 50));
  
  return {
    success: true,
    data: mockData.plans
  };
};

/**
 * Get products data with mock data
 */
export const getProductsData = async (filters) => {
  console.log('🛍️ Using mock products data (MongoDB not available)');
  
  await new Promise(resolve => setTimeout(resolve, 50));
  
  return {
    success: true,
    data: mockData.products
  };
};

/**
 * Get customers data with mock data
 */
export const getCustomersData = async (filters) => {
  console.log('👥 Using mock customers data (MongoDB not available)');
  
  await new Promise(resolve => setTimeout(resolve, 50));
  
  return {
    success: true,
    data: mockData.customers
  };
};
