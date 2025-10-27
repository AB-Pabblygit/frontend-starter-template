import dayjs from 'dayjs';

// Helper functions
const getRandomElement = (array) => array[Math.floor(Math.random() * array.length)];
const getRandomNumber = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const getRandomFloat = (min, max, decimals = 2) => parseFloat((Math.random() * (max - min) + min).toFixed(decimals));

// Revenue sources and categories
const revenueSources = [
  'Subscription Revenue', 'One-time Sales', 'API Usage', 'Premium Features', 
  'Consulting Services', 'Training Programs', 'Integration Fees', 'Support Packages'
];

const revenueCategories = [
  'Recurring', 'One-time', 'Usage-based', 'Professional Services', 'Training', 'Support'
];

// Generate revenue data for the last 6 months
const generateRevenueData = (users, transactions) => {
  const revenueData = [];
  const currentDate = dayjs();
  
  // Generate revenue entries for each of the last 6 months
  for (let monthOffset = 5; monthOffset >= 0; monthOffset -= 1) {
    const monthDate = currentDate.subtract(monthOffset, 'month');
    const monthKey = monthDate.format('YYYY-MM');
    
    // Get transactions for this month
    const monthTransactions = transactions.filter(transaction => {
      const transactionDate = dayjs(transaction.transactionDate);
      return transactionDate.format('YYYY-MM') === monthKey && transaction.status === 'completed';
    });
    
    // Calculate monthly metrics
    const totalRevenue = monthTransactions.reduce((sum, t) => sum + t.amount, 0);
    const subscriptionRevenue = monthTransactions
      .filter(t => t.type === 'subscription')
      .reduce((sum, t) => sum + t.amount, 0);
    const oneTimeRevenue = monthTransactions
      .filter(t => t.type === 'one-time')
      .reduce((sum, t) => sum + t.amount, 0);
    
    // Generate additional revenue metrics
    const newCustomers = users.filter(user => {
      const userDate = dayjs(user.registrationDate);
      return userDate.format('YYYY-MM') === monthKey;
    }).length;
    
    const churnRate = getRandomFloat(2, 8); // 2-8% churn rate
    const customerLifetimeValue = getRandomFloat(500, 5000);
    const averageRevenuePerUser = totalRevenue / Math.max(newCustomers, 1);
    
    // Generate revenue by source
    const revenueBySource = revenueSources.reduce((acc, source) => {
      acc[source] = getRandomFloat(1000, 10000);
      return acc;
    }, {});
    
    // Generate revenue by category
    const revenueByCategory = revenueCategories.reduce((acc, category) => {
      acc[category] = getRandomFloat(500, 8000);
      return acc;
    }, {});
    
    // Generate revenue by plan
    const revenueByPlan = users.reduce((acc, user) => {
      if (dayjs(user.registrationDate).format('YYYY-MM') === monthKey) {
        const {plan} = user.subscription;
        acc[plan] = (acc[plan] || 0) + user.subscription.monthlyRevenue;
      }
      return acc;
    }, {});
    
    const revenueEntry = {
      id: `revenue_${monthKey}`,
      month: monthKey,
      monthName: monthDate.format('MMMM YYYY'),
      totalRevenue,
      subscriptionRevenue,
      oneTimeRevenue,
      newCustomers,
      churnRate,
      customerLifetimeValue,
      averageRevenuePerUser,
      revenueBySource,
      revenueByCategory,
      revenueByPlan,
      metrics: {
        monthlyRecurringRevenue: subscriptionRevenue,
        annualRecurringRevenue: subscriptionRevenue * 12,
        customerAcquisitionCost: getRandomFloat(50, 200),
        revenueGrowthRate: getRandomFloat(-5, 25), // -5% to 25% growth
        grossMargin: getRandomFloat(70, 95), // 70-95% gross margin
        netRevenueRetention: getRandomFloat(90, 120) // 90-120% retention
      },
      breakdown: {
        domestic: totalRevenue * getRandomFloat(0.6, 0.8),
        international: totalRevenue * getRandomFloat(0.2, 0.4),
        enterprise: totalRevenue * getRandomFloat(0.3, 0.5),
        smb: totalRevenue * getRandomFloat(0.5, 0.7)
      }
    };
    
    revenueData.push(revenueEntry);
  }
  
  return revenueData.sort((a, b) => a.month.localeCompare(b.month));
};

// Generate revenue data (this will be called after users and transactions are generated)
export const generateRevenueDataForPeriod = (users, transactions) => generateRevenueData(users, transactions);

// Revenue analytics functions
export const getRevenueAnalytics = (revenueData) => {
  const totalRevenue = revenueData.reduce((sum, entry) => sum + entry.totalRevenue, 0);
  const averageMonthlyRevenue = totalRevenue / revenueData.length;
  
  // Calculate growth rates
  const growthRates = [];
  for (let i = 1; i < revenueData.length; i += 1) {
    const current = revenueData[i].totalRevenue;
    const previous = revenueData[i - 1].totalRevenue;
    const growthRate = ((current - previous) / previous) * 100;
    growthRates.push(growthRate);
  }
  
  const averageGrowthRate = growthRates.reduce((sum, rate) => sum + rate, 0) / growthRates.length;
  
  // Calculate trends
  const revenueTrend = revenueData.map(entry => ({
    month: entry.month,
    revenue: entry.totalRevenue,
    growth: entry.metrics.revenueGrowthRate
  }));
  
  return {
    totalRevenue,
    averageMonthlyRevenue,
    averageGrowthRate,
    revenueTrend,
    topRevenueSource: Object.entries(
      revenueData.reduce((acc, entry) => {
        Object.entries(entry.revenueBySource).forEach(([source, amount]) => {
          acc[source] = (acc[source] || 0) + amount;
        });
        return acc;
      }, {})
    ).sort(([,a], [,b]) => b - a)[0],
    topRevenueCategory: Object.entries(
      revenueData.reduce((acc, entry) => {
        Object.entries(entry.revenueByCategory).forEach(([category, amount]) => {
          acc[category] = (acc[category] || 0) + amount;
        });
        return acc;
      }, {})
    ).sort(([,a], [,b]) => b - a)[0]
  };
};

// Get revenue by date range
export const getRevenueByDateRange = (revenueData, startDate, endDate) => revenueData.filter(entry => {
    const entryDate = dayjs(entry.month);
    return entryDate.isAfter(startDate) && entryDate.isBefore(endDate);
  });

// Get revenue forecast (simple linear projection)
export const getRevenueForecast = (revenueData, months = 3) => {
  if (revenueData.length < 2) return [];
  
  const recentData = revenueData.slice(-3); // Use last 3 months for trend
  const averageGrowth = recentData.reduce((sum, entry, index) => {
    if (index === 0) return sum;
    const growth = (entry.totalRevenue - recentData[index - 1].totalRevenue) / recentData[index - 1].totalRevenue;
    return sum + growth;
  }, 0) / (recentData.length - 1);
  
  const forecast = [];
  const lastEntry = revenueData[revenueData.length - 1];
  let currentRevenue = lastEntry.totalRevenue;
  
  for (let i = 1; i <= months; i += 1) {
    const forecastDate = dayjs(lastEntry.month).add(i, 'month');
    currentRevenue *= (1 + averageGrowth);
    
    forecast.push({
      month: forecastDate.format('YYYY-MM'),
      monthName: forecastDate.format('MMMM YYYY'),
      forecastedRevenue: Math.round(currentRevenue),
      confidence: Math.max(0, 100 - (i * 15)) // Decreasing confidence
    });
  }
  
  return forecast;
};

// Get revenue by customer segment
export const getRevenueBySegment = (revenueData) => revenueData.reduce((acc, entry) => {
    Object.entries(entry.breakdown).forEach(([segment, revenue]) => {
      acc[segment] = (acc[segment] || 0) + revenue;
    });
    return acc;
  }, {});

// Get revenue efficiency metrics
export const getRevenueEfficiencyMetrics = (revenueData) => {
  const totalRevenue = revenueData.reduce((sum, entry) => sum + entry.totalRevenue, 0);
  const totalCustomers = revenueData.reduce((sum, entry) => sum + entry.newCustomers, 0);
  
  return {
    revenuePerCustomer: totalRevenue / Math.max(totalCustomers, 1),
    averageMonthlyGrowth: revenueData.reduce((sum, entry) => sum + entry.metrics.revenueGrowthRate, 0) / revenueData.length,
    revenueConcentration: revenueData.reduce((sum, entry) => {
      const topSource = Math.max(...Object.values(entry.revenueBySource));
      return sum + (topSource / entry.totalRevenue);
    }, 0) / revenueData.length,
    revenueStability: revenueData.reduce((sum, entry) => sum + entry.metrics.netRevenueRetention, 0) / revenueData.length
  };
};
