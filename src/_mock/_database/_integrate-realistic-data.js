// Integration script to update analytics page with realistic data
import { realisticAnalyticsService } from './_realistic-analytics-service';

// Example of how to integrate realistic data into the analytics page
export const getRealisticAnalyticsData = (filters = {}) => {
  try {
    // Get all analytics data using the realistic service
    const analyticsData = realisticAnalyticsService.getAllAnalytics(filters);
    
    // Transform data to match the expected format for the analytics page
    const transformedData = {
      summary: {
        totalMRR: analyticsData.summary.totalMRR,
        previousMRR: analyticsData.summary.totalMRR * 0.9, // Simulate previous month
        activeCustomers: analyticsData.summary.activeCustomers,
        cancelledCustomers: analyticsData.summary.cancelledCustomers,
        newCustomers: analyticsData.summary.newCustomers,
        totalCustomers: analyticsData.summary.totalCustomers,
        arpu: analyticsData.summary.arpu,
        ltv: analyticsData.summary.ltv,
        cac: analyticsData.summary.cac,
        churnRate: analyticsData.summary.churnRate,
        revenueChurn: analyticsData.summary.revenueChurn,
        ltvCacRatio: analyticsData.summary.ltvCacRatio,
        totalRefunds: analyticsData.summary.totalRefunds
      },
      mrr: analyticsData.mrr.map(month => ({
        month: month.month,
        monthName: month.monthName,
        mrr: month.mrr
      })),
      products: analyticsData.products.map(product => ({
        productId: product.productId,
        productName: product.productName,
        totalCustomers: product.totalCustomers,
        activeCustomers: product.activeCustomers,
        totalMRR: product.totalMRR,
        churnRate: product.churnRate
      })),
      plans: analyticsData.plans.map(plan => ({
        planId: plan.planId,
        planName: plan.planName,
        price: plan.price,
        totalCustomers: plan.totalCustomers,
        activeCustomers: plan.activeCustomers,
        totalMRR: plan.totalMRR,
        churnRate: plan.churnRate
      })),
      customers: analyticsData.customers.map(customer => ({
        customerId: customer.customerId,
        email: customer.email,
        name: customer.name,
        product: customer.product,
        plan: customer.plan,
        status: customer.status,
        monthlyFee: customer.monthlyFee,
        signupDate: customer.signupDate,
        cancelDate: customer.cancelDate,
        totalSpent: customer.totalSpent,
        firstPurchase: customer.firstPurchase,
        lastPurchase: customer.lastPurchase
      }))
    };
    
    return {
      success: true,
      data: transformedData
    };
  } catch (error) {
    console.error('Error getting realistic analytics data:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Example usage for different scenarios
export const getAnalyticsForCurrentMonth = () => {
  const currentMonth = new Date().toISOString().slice(0, 7);
  return getRealisticAnalyticsData({
    startDate: `${currentMonth}-01`,
    endDate: `${currentMonth}-31`
  });
};

export const getAnalyticsForProduct = (productId) => getRealisticAnalyticsData({
    productId
  });

export const getAnalyticsForPlan = (planId) => getRealisticAnalyticsData({
    planId
  });

export const getAnalyticsForDateRange = (startDate, endDate) => getRealisticAnalyticsData({
    startDate,
    endDate
  });

// Export the main function
export default getRealisticAnalyticsData;
