import dayjs from 'dayjs';

import { USERS } from './_users';

// Advanced Analytics Service with comprehensive calculations
export class AnalyticsService {
  constructor(users = USERS, transactions = [], revenueData = []) {
    this.users = users;
    this.transactions = transactions;
    this.revenueData = revenueData;
  }

  // Cohort Analysis
  getCohortAnalysis() {
    const cohorts = {};
    
    this.users.forEach(user => {
      const {cohortMonth} = { cohortMonth: dayjs(user.registrationDate).format('YYYY-MM') };
      if (!cohorts[cohortMonth]) {
        cohorts[cohortMonth] = {
          month: cohortMonth,
          totalUsers: 0,
          retention: {}
        };
      }
      cohorts[cohortMonth].totalUsers += 1;
    });

    // Calculate retention rates for each cohort
    Object.keys(cohorts).forEach(cohortMonth => {
      const cohortUsers = this.users.filter(user => 
        dayjs(user.registrationDate).format('YYYY-MM') === cohortMonth
      );
      
      for (let monthOffset = 0; monthOffset < 12; monthOffset += 1) {
        const targetMonth = dayjs(cohortMonth).add(monthOffset, 'month').format('YYYY-MM');
        const activeUsers = cohortUsers.filter(user => {
          const lastLogin = dayjs(user.lastLoginDate);
          return lastLogin.format('YYYY-MM') === targetMonth;
        }).length;
        
        cohorts[cohortMonth].retention[monthOffset] = {
          month: targetMonth,
          activeUsers,
          retentionRate: (activeUsers / cohortUsers.length) * 100
        };
      }
    });

    return cohorts;
  }

  // Revenue Forecasting
  getRevenueForecast(months = 6) {
    const recentData = this.revenueData.slice(-3); // Last 3 months
    const growthRates = [];
    
    for (let i = 1; i < recentData.length; i += 1) {
      const current = recentData[i].totalRevenue;
      const previous = recentData[i - 1].totalRevenue;
      const growthRate = ((current - previous) / previous) * 100;
      growthRates.push(growthRate);
    }
    
    const averageGrowth = growthRates.reduce((sum, rate) => sum + rate, 0) / growthRates.length;
    const lastEntry = this.revenueData[this.revenueData.length - 1];
    
    const forecast = [];
    let currentRevenue = lastEntry.totalRevenue;
    
    for (let i = 1; i <= months; i += 1) {
      const forecastDate = dayjs(lastEntry.month).add(i, 'month');
      currentRevenue *= (1 + averageGrowth / 100);
      
      forecast.push({
        month: forecastDate.format('YYYY-MM'),
        monthName: forecastDate.format('MMMM YYYY'),
        forecastedRevenue: Math.round(currentRevenue),
        confidence: Math.max(0, 100 - (i * 15))
      });
    }
    
    return forecast;
  }

  // Customer Segmentation
  getCustomerSegmentation() {
    const segments = {
      enterprise: { users: [], revenue: 0, count: 0 },
      smb: { users: [], revenue: 0, count: 0 },
      startup: { users: [], revenue: 0, count: 0 },
      individual: { users: [], revenue: 0, count: 0 }
    };

    this.users.forEach(user => {
      const userRevenue = user.subscription.totalRevenue;
      const plan = user.subscription.plan.toLowerCase();
      
      let segment = 'individual';
      if (plan === 'enterprise' || userRevenue > 1000) {
        segment = 'enterprise';
      } else if (plan === 'pro' || (userRevenue > 200 && userRevenue <= 1000)) {
        segment = 'smb';
      } else if (plan === 'premium' || (userRevenue > 100 && userRevenue <= 200)) {
        segment = 'startup';
      }
      
      segments[segment].users.push(user);
      segments[segment].revenue += userRevenue;
      segments[segment].count += 1;
    });

    // Calculate metrics for each segment
    Object.keys(segments).forEach(segment => {
      const seg = segments[segment];
      seg.averageRevenue = seg.count > 0 ? seg.revenue / seg.count : 0;
      seg.percentage = (seg.count / this.users.length) * 100;
    });

    return segments;
  }

  // Churn Prediction Model
  getChurnPrediction() {
    const churnRisk = this.users.map(user => {
      const daysSinceLastLogin = dayjs().diff(dayjs(user.lastLoginDate), 'day');
      const daysSinceRegistration = dayjs().diff(dayjs(user.registrationDate), 'day');
      const plan = user.subscription.plan.toLowerCase();
      const {monthlyRevenue} = user.subscription;
      
      // Simple churn risk calculation
      let riskScore = 0;
      
      // Time-based factors
      if (daysSinceLastLogin > 30) riskScore += 30;
      if (daysSinceLastLogin > 60) riskScore += 20;
      if (daysSinceRegistration < 7) riskScore += 15;
      
      // Plan-based factors
      if (plan === 'basic') riskScore += 10;
      if (plan === 'enterprise') riskScore -= 10;
      
      // Revenue-based factors
      if (monthlyRevenue < 50) riskScore += 15;
      if (monthlyRevenue > 500) riskScore -= 15;
      
      // Status-based factors
      if (user.status === 'inactive') riskScore += 40;
      
      const riskLevel = riskScore > 50 ? 'High' : riskScore > 25 ? 'Medium' : 'Low';
      
      return {
        userId: user.id,
        userName: `${user.firstName} ${user.lastName}`,
        email: user.email,
        plan: user.subscription.plan,
        monthlyRevenue,
        riskScore,
        riskLevel,
        daysSinceLastLogin,
        recommendedAction: AnalyticsService.getRecommendedAction(riskLevel, plan)
      };
    });

    return churnRisk.sort((a, b) => b.riskScore - a.riskScore);
  }

  static getRecommendedAction(riskLevel, plan) {
    if (riskLevel === 'High') {
      return 'Immediate intervention required - offer discount or personal outreach';
    }
    if (riskLevel === 'Medium') {
      return 'Send engagement campaign or feature update';
    }
    return 'Monitor and maintain current service level';
  }

  // Revenue Attribution
  getRevenueAttribution() {
    const attribution = {
      byPlan: {},
      bySource: {},
      byGeography: {},
      byTime: {}
    };

    // Revenue by plan
    this.users.forEach(user => {
      const {plan} = user.subscription;
      if (!attribution.byPlan[plan]) {
        attribution.byPlan[plan] = 0;
      }
      attribution.byPlan[plan] += user.subscription.totalRevenue;
    });

    // Revenue by geography
    this.users.forEach(user => {
      const {country} = user.address;
      if (!attribution.byGeography[country]) {
        attribution.byGeography[country] = 0;
      }
      attribution.byGeography[country] += user.subscription.totalRevenue;
    });

    // Revenue by time (monthly breakdown)
    this.revenueData.forEach(entry => {
      attribution.byTime[entry.month] = entry.totalRevenue;
    });

    return attribution;
  }

  // Advanced Metrics
  getAdvancedMetrics() {
    const totalRevenue = this.users.reduce((sum, user) => sum + user.subscription.totalRevenue, 0);
    const totalUsers = this.users.length;
    const avgRevenuePerUser = totalRevenue / totalUsers;
    
    // Calculate MRR
    const currentMonth = dayjs().format('YYYY-MM');
    const currentMonthRevenue = this.revenueData.find(entry => entry.month === currentMonth)?.totalRevenue || 0;
    
    // Calculate ARR (Annual Recurring Revenue)
    const arr = currentMonthRevenue * 12;
    
    // Calculate Magic Number (Sales Efficiency)
    const marketingSpend = totalUsers * 70; // Estimated marketing spend
    const magicNumber = (currentMonthRevenue - (currentMonthRevenue * 0.1)) / marketingSpend; // 10% churn assumption
    
    // Calculate Net Promoter Score (simulated)
    const nps = 25 + Math.random() * 30; // 25-55 NPS range
    
    // Calculate Customer Health Score
    const healthyUsers = this.users.filter(user => 
      user.status === 'active' && 
      dayjs().diff(dayjs(user.lastLoginDate), 'day') < 30
    ).length;
    const healthScore = (healthyUsers / totalUsers) * 100;

    return {
      totalRevenue,
      totalUsers,
      avgRevenuePerUser,
      mrr: currentMonthRevenue,
      arr,
      magicNumber,
      nps: Math.round(nps),
      customerHealthScore: Math.round(healthScore),
      revenueGrowthRate: this.calculateGrowthRate(),
      customerGrowthRate: this.calculateCustomerGrowthRate()
    };
  }

  calculateGrowthRate() {
    if (this.revenueData.length < 2) return 0;
    const current = this.revenueData[this.revenueData.length - 1].totalRevenue;
    const previous = this.revenueData[this.revenueData.length - 2].totalRevenue;
    return ((current - previous) / previous) * 100;
  }

  calculateCustomerGrowthRate() {
    const currentMonth = dayjs().format('YYYY-MM');
    const previousMonth = dayjs().subtract(1, 'month').format('YYYY-MM');
    
    const currentUsers = this.users.filter(user => 
      dayjs(user.registrationDate).format('YYYY-MM') === currentMonth
    ).length;
    
    const previousUsers = this.users.filter(user => 
      dayjs(user.registrationDate).format('YYYY-MM') === previousMonth
    ).length;
    
    if (previousUsers === 0) return 0;
    return ((currentUsers - previousUsers) / previousUsers) * 100;
  }

  // Get comprehensive analytics dashboard data
  getAnalyticsDashboard() {
    return {
      overview: this.getAdvancedMetrics(),
      cohortAnalysis: this.getCohortAnalysis(),
      customerSegmentation: this.getCustomerSegmentation(),
      churnPrediction: this.getChurnPrediction().slice(0, 20), // Top 20 at risk
      revenueAttribution: this.getRevenueAttribution(),
      revenueForecast: this.getRevenueForecast(6),
      trends: this.getTrendAnalysis()
    };
  }

  getTrendAnalysis() {
    const trends = {
      revenue: this.revenueData.map(entry => ({
        month: entry.monthName,
        value: entry.totalRevenue,
        growth: entry.metrics.revenueGrowthRate
      })),
      users: this.revenueData.map(entry => ({
        month: entry.monthName,
        value: entry.newCustomers
      })),
      transactions: this.revenueData.map(entry => ({
        month: entry.monthName,
        value: entry.totalTransactions || 0
      }))
    };
    
    return trends;
  }
}

// Export singleton instance
export const analyticsService = new AnalyticsService();
