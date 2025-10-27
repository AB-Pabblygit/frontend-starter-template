import dayjs from 'dayjs';

import { ENHANCED_USERS, ENHANCED_MONTHLY_STATS } from './_enhanced-users';

// Comprehensive Analytics Calculator with all SaaS metrics
export class AnalyticsCalculator {
  constructor(users = ENHANCED_USERS, monthlyStats = ENHANCED_MONTHLY_STATS) {
    this.users = users;
    this.monthlyStats = monthlyStats;
  }

  // Filter users by criteria
  filterUsers(filters = {}) {
    let filteredUsers = [...this.users];
    
    if (filters.product && filters.product !== 'All Products') {
      filteredUsers = filteredUsers.filter(user => user.product === filters.product);
    }
    
    if (filters.plan && filters.plan !== 'All Plans') {
      filteredUsers = filteredUsers.filter(user => user.plan === filters.plan);
    }
    
    if (filters.startDate && filters.endDate) {
      filteredUsers = filteredUsers.filter(user => {
        const userDate = dayjs(user.signupDate);
        return userDate.isAfter(filters.startDate) && userDate.isBefore(filters.endDate);
      });
    }
    
    return filteredUsers;
  }

  // Get current month data
  getCurrentMonthData(filters = {}) {
    const currentMonth = dayjs().format('YYYY-MM');
    const filteredUsers = this.filterUsers(filters);
    
    const currentMonthUsers = filteredUsers.filter(user => 
      dayjs(user.signupDate).format('YYYY-MM') === currentMonth
    );
    
    const activeUsers = currentMonthUsers.filter(user => user.status === 'active');
    const cancelledUsers = currentMonthUsers.filter(user => user.status === 'cancelled');
    const newUsers = currentMonthUsers;
    
    return {
      totalUsers: currentMonthUsers.length,
      activeUsers: activeUsers.length,
      cancelledUsers: cancelledUsers.length,
      newUsers: newUsers.length,
      monthlyMRR: activeUsers.reduce((sum, user) => sum + user.monthlyFee, 0),
      totalRevenue: currentMonthUsers.reduce((sum, user) => sum + user.subscription.totalRevenue, 0),
      totalRefunds: currentMonthUsers.reduce((sum, user) => sum + user.refundAmount, 0),
      totalAcquisitionCost: currentMonthUsers.reduce((sum, user) => sum + user.acquisitionCost, 0)
    };
  }

  // Get previous month data
  getPreviousMonthData(filters = {}) {
    const previousMonth = dayjs().subtract(1, 'month').format('YYYY-MM');
    const filteredUsers = this.filterUsers(filters);
    
    const previousMonthUsers = filteredUsers.filter(user => 
      dayjs(user.signupDate).format('YYYY-MM') === previousMonth
    );
    
    const activeUsers = previousMonthUsers.filter(user => user.status === 'active');
    
    return {
      totalUsers: previousMonthUsers.length,
      activeUsers: activeUsers.length,
      monthlyMRR: activeUsers.reduce((sum, user) => sum + user.monthlyFee, 0),
      totalRevenue: previousMonthUsers.reduce((sum, user) => sum + user.subscription.totalRevenue, 0)
    };
  }

  // Calculate all metrics
  calculateAllMetrics(filters = {}) {
    const current = this.getCurrentMonthData(filters);
    const previous = this.getPreviousMonthData(filters);
    
    // A. Previous Month MRR
    const previousMonthMRR = previous.monthlyMRR;
    
    // B. Active Customers MRR (Current Month)
    const activeCustomersMRR = current.monthlyMRR;
    
    // C. Cancelled Customers MRR
    const cancelledCustomersMRR = Math.max(0, previousMonthMRR - activeCustomersMRR);
    
    // D. New Customer MRR
    const newCustomerMRR = current.monthlyMRR * 0.18; // 18% from new customers
    
    // G. Overall MRR
    const overallMRR = activeCustomersMRR + newCustomerMRR;
    
    // H. Total Revenue
    const totalRevenue = current.totalRevenue + current.monthlyMRR - current.totalRefunds;
    
    // I. Revenue Churn %
    const revenueChurnPercent = previousMonthMRR > 0 ? 
      (cancelledCustomersMRR / previousMonthMRR) * 100 : 0;
    
    // L. Total Customers Last Month
    const totalCustomersLastMonth = previous.totalUsers;
    
    // M. Active Customers (Current Month)
    const activeCustomers = current.activeUsers;
    
    // N. Customers Left
    const customersLeft = Math.max(0, totalCustomersLastMonth - activeCustomers);
    
    // O. New Joined Customers
    const newJoinedCustomers = current.newUsers;
    
    // P. Total Customers This Month
    const totalCustomersThisMonth = activeCustomers + newJoinedCustomers;
    
    // Q. User Churn %
    const userChurnPercent = totalCustomersLastMonth > 0 ? 
      (customersLeft / totalCustomersLastMonth) * 100 : 0;
    
    // R. Avg Customer Lifetime (in months)
    const avgCustomerLifetime = userChurnPercent > 0 ? 
      1 / (userChurnPercent / 100) : 12; // Default to 12 months if no churn
    
    // S. ARPU (Average Revenue Per User)
    const arpu = activeCustomers > 0 ? activeCustomersMRR / activeCustomers : 0;
    
    // T. LTV (Lifetime Value)
    const ltv = arpu * avgCustomerLifetime;
    
    // CAC (Customer Acquisition Cost)
    const cac = current.newUsers > 0 ? 
      current.totalAcquisitionCost / current.newUsers : 0;
    
    // LTV:CAC Ratio
    const ltvCacRatio = cac > 0 ? ltv / cac : 0;
    
    // Additional metrics
    const expansionMRR = current.monthlyMRR * 0.12; // 12% expansion
    const contractionMRR = current.monthlyMRR * 0.08; // 8% contraction
    const netRevenueRetention = 95 + Math.random() * 20; // 95-115%
    const grossRevenueRetention = 85 + Math.random() * 10; // 85-95%
    
    // Growth rates
    const mrrGrowthRate = previousMonthMRR > 0 ? 
      ((activeCustomersMRR - previousMonthMRR) / previousMonthMRR) * 100 : 0;
    
    const customerGrowthRate = totalCustomersLastMonth > 0 ? 
      ((activeCustomers - totalCustomersLastMonth) / totalCustomersLastMonth) * 100 : 0;
    
    return {
      // Core MRR Metrics
      previousMonthMRR: Math.round(previousMonthMRR),
      activeCustomersMRR: Math.round(activeCustomersMRR),
      cancelledCustomersMRR: Math.round(cancelledCustomersMRR),
      newCustomerMRR: Math.round(newCustomerMRR),
      overallMRR: Math.round(overallMRR),
      totalRevenue: Math.round(totalRevenue),
      
      // Churn Metrics
      revenueChurnPercent: Math.round(revenueChurnPercent * 100) / 100,
      userChurnPercent: Math.round(userChurnPercent * 100) / 100,
      
      // Customer Metrics
      totalCustomersLastMonth,
      activeCustomers,
      customersLeft,
      newJoinedCustomers,
      totalCustomersThisMonth,
      
      // Lifetime Metrics
      avgCustomerLifetime: Math.round(avgCustomerLifetime * 100) / 100,
      arpu: Math.round(arpu * 100) / 100,
      ltv: Math.round(ltv * 100) / 100,
      cac: Math.round(cac * 100) / 100,
      ltvCacRatio: Math.round(ltvCacRatio * 100) / 100,
      
      // Additional Metrics
      expansionMRR: Math.round(expansionMRR),
      contractionMRR: Math.round(contractionMRR),
      netRevenueRetention: Math.round(netRevenueRetention * 100) / 100,
      grossRevenueRetention: Math.round(grossRevenueRetention * 100) / 100,
      
      // Growth Metrics
      mrrGrowthRate: Math.round(mrrGrowthRate * 100) / 100,
      customerGrowthRate: Math.round(customerGrowthRate * 100) / 100,
      
      // Refund Metrics
      totalRefunds: Math.round(current.totalRefunds),
      refundRate: current.totalRevenue > 0 ? 
        Math.round((current.totalRefunds / current.totalRevenue) * 10000) / 100 : 0
    };
  }

  // Get product-wise breakdown
  getProductBreakdown() {
    const products = [...new Set(this.users.map(user => user.product))];
    const breakdown = {};
    
    products.forEach(product => {
      const productUsers = this.users.filter(user => user.product === product);
      const activeUsers = productUsers.filter(user => user.status === 'active');
      const monthlyMRR = activeUsers.reduce((sum, user) => sum + user.monthlyFee, 0);
      const totalRevenue = productUsers.reduce((sum, user) => sum + user.subscription.totalRevenue, 0);
      
      breakdown[product] = {
        totalUsers: productUsers.length,
        activeUsers: activeUsers.length,
        monthlyMRR,
        totalRevenue,
        averageRevenuePerUser: activeUsers.length > 0 ? monthlyMRR / activeUsers.length : 0
      };
    });
    
    return breakdown;
  }

  // Get plan-wise breakdown
  getPlanBreakdown() {
    const plans = [...new Set(this.users.map(user => user.plan))];
    const breakdown = {};
    
    plans.forEach(plan => {
      const planUsers = this.users.filter(user => user.plan === plan);
      const activeUsers = planUsers.filter(user => user.status === 'active');
      const monthlyMRR = activeUsers.reduce((sum, user) => sum + user.monthlyFee, 0);
      const totalRevenue = planUsers.reduce((sum, user) => sum + user.subscription.totalRevenue, 0);
      
      breakdown[plan] = {
        totalUsers: planUsers.length,
        activeUsers: activeUsers.length,
        monthlyMRR,
        totalRevenue,
        averageRevenuePerUser: activeUsers.length > 0 ? monthlyMRR / activeUsers.length : 0,
        averagePrice: planUsers.length > 0 ? monthlyMRR / planUsers.length : 0
      };
    });
    
    return breakdown;
  }

  // Get monthly trends
  getMonthlyTrends() {
    const trends = {
      revenue: [],
      customers: [],
      mrr: [],
      churn: []
    };
    
    const months = Object.keys(this.monthlyStats).sort();
    
    months.forEach(month => {
      const stats = this.monthlyStats[month];
      trends.revenue.push({
        month: stats.monthName,
        value: stats.totalRevenue
      });
      trends.customers.push({
        month: stats.monthName,
        value: stats.totalUsers
      });
      trends.mrr.push({
        month: stats.monthName,
        value: stats.monthlyMRR
      });
      trends.churn.push({
        month: stats.monthName,
        value: stats.churnRate
      });
    });
    
    return trends;
  }

  // Get top customers by revenue
  getTopCustomers(limit = 10) {
    const activeUsers = this.users.filter(user => user.status === 'active');
    
    return activeUsers
      .map(user => ({
        id: user.id,
        name: `${user.firstName} ${user.lastName}`,
        email: user.email,
        product: user.product,
        plan: user.plan,
        monthlyRevenue: user.monthlyFee,
        totalRevenue: user.subscription.totalRevenue,
        status: user.status,
        signupDate: user.signupDate
      }))
      .sort((a, b) => b.totalRevenue - a.totalRevenue)
      .slice(0, limit);
  }

  // Get churn risk analysis
  getChurnRiskAnalysis() {
    const activeUsers = this.users.filter(user => user.status === 'active');
    
    return activeUsers.map(user => {
      const daysSinceLastLogin = dayjs().diff(dayjs(user.lastLoginDate), 'day');
      const daysSinceSignup = dayjs().diff(dayjs(user.signupDate), 'day');
      const {plan} = user;
      const {monthlyFee} = user;
      
      // Calculate risk score
      let riskScore = 0;
      
      // Time-based factors
      if (daysSinceLastLogin > 30) riskScore += 30;
      if (daysSinceLastLogin > 60) riskScore += 20;
      if (daysSinceSignup < 7) riskScore += 15;
      
      // Plan-based factors
      if (plan === 'Basic') riskScore += 10;
      if (plan === 'Enterprise') riskScore -= 10;
      
      // Revenue-based factors
      if (monthlyFee < 50) riskScore += 15;
      if (monthlyFee > 500) riskScore -= 15;
      
      const riskLevel = riskScore > 50 ? 'High' : riskScore > 25 ? 'Medium' : 'Low';
      
      return {
        id: user.id,
        name: `${user.firstName} ${user.lastName}`,
        email: user.email,
        product: user.product,
        plan: user.plan,
        monthlyRevenue: monthlyFee,
        riskScore,
        riskLevel,
        daysSinceLastLogin,
        recommendedAction: AnalyticsCalculator.getRecommendedAction(riskLevel)
      };
    }).sort((a, b) => b.riskScore - a.riskScore);
  }

  static getRecommendedAction(riskLevel) {
    if (riskLevel === 'High') {
      return 'Immediate intervention required - offer discount or personal outreach';
    }
    if (riskLevel === 'Medium') {
      return 'Send engagement campaign or feature update';
    }
    return 'Monitor and maintain current service level';
  }
}

// Export singleton instance
export const analyticsCalculator = new AnalyticsCalculator();
