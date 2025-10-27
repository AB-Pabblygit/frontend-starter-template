/**
 * Validate date range parameters
 */
export const validateDateRange = (startDate, endDate) => {
  const errors = [];
  
  // Check if dates are provided
  if (!startDate && !endDate) {
    return { valid: true }; // No date filtering
  }
  
  // Validate start date
  if (startDate) {
    const start = new Date(startDate);
    if (isNaN(start.getTime())) {
      errors.push('Invalid start date format');
    }
    // Allow future dates in development
    if (process.env.NODE_ENV === 'production' && start > new Date()) {
      errors.push('Start date cannot be in the future');
    }
  }
  
  // Validate end date
  if (endDate) {
    const end = new Date(endDate);
    if (isNaN(end.getTime())) {
      errors.push('Invalid end date format');
    }
    // Allow future dates in development
    if (process.env.NODE_ENV === 'production' && end > new Date()) {
      errors.push('End date cannot be in the future');
    }
  }
  
  // Check if start date is before end date
  if (startDate && endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (start > end) {
      errors.push('Start date must be before end date');
    }
  }
  
  return {
    valid: errors.length === 0,
    error: errors.join(', ')
  };
};

/**
 * Build MongoDB filters from query parameters
 */
export const buildFilters = ({ startDate, endDate, productId, planId, userId }) => {
  const filters = {};
  
  // Date range filter
  if (startDate || endDate) {
    filters.createdAt = {};
    if (startDate) {
      filters.createdAt.$gte = new Date(startDate);
    }
    if (endDate) {
      filters.createdAt.$lte = new Date(endDate);
    }
  }
  
  // Product filter
  if (productId) {
    filters.product_id = productId;
  }
  
  // Plan filter
  if (planId) {
    filters.plan_id = planId;
  }
  
  // User filter
  if (userId) {
    filters.user_id = userId;
  }
  
  return filters;
};

/**
 * Calculate percentage change between two values
 */
export const calculatePercentageChange = (oldValue, newValue) => {
  if (!oldValue || oldValue === 0) return 0;
  return ((newValue - oldValue) / oldValue) * 100;
};

/**
 * Calculate compound annual growth rate (CAGR)
 */
export const calculateCAGR = (beginningValue, endingValue, numberOfPeriods) => {
  if (!beginningValue || beginningValue === 0 || numberOfPeriods === 0) return 0;
  return (Math.pow(endingValue / beginningValue, 1 / numberOfPeriods) - 1) * 100;
};

/**
 * Calculate net revenue retention
 */
export const calculateNetRevenueRetention = (beginningMRR, expansionMRR, contractionMRR, churnMRR) => {
  if (!beginningMRR || beginningMRR === 0) return 0;
  const endingMRR = beginningMRR + expansionMRR - contractionMRR - churnMRR;
  return (endingMRR / beginningMRR) * 100;
};

/**
 * Calculate gross revenue retention
 */
export const calculateGrossRevenueRetention = (beginningMRR, churnMRR) => {
  if (!beginningMRR || beginningMRR === 0) return 0;
  return ((beginningMRR - churnMRR) / beginningMRR) * 100;
};

/**
 * Calculate payback period
 */
export const calculatePaybackPeriod = (cac, monthlyRevenue) => {
  if (!monthlyRevenue || monthlyRevenue === 0) return Infinity;
  return cac / monthlyRevenue;
};

/**
 * Calculate magic number (sales efficiency)
 */
export const calculateMagicNumber = (quarterlyNewARR, quarterlySalesMarketingSpend) => {
  if (!quarterlySalesMarketingSpend || quarterlySalesMarketingSpend === 0) return 0;
  return quarterlyNewARR / quarterlySalesMarketingSpend;
};

/**
 * Format currency values
 */
export const formatCurrency = (amount, currency = 'USD', locale = 'en-US') => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency
  }).format(amount);
};

/**
 * Format percentage values
 */
export const formatPercentage = (value, decimals = 2) => {
  return `${value.toFixed(decimals)}%`;
};

/**
 * Calculate cohort retention rate
 */
export const calculateCohortRetention = (cohortSize, retainedCustomers) => {
  if (!cohortSize || cohortSize === 0) return 0;
  return (retainedCustomers / cohortSize) * 100;
};

/**
 * Calculate average revenue per account (ARPA)
 */
export const calculateARPA = (totalRevenue, numberOfAccounts) => {
  if (!numberOfAccounts || numberOfAccounts === 0) return 0;
  return totalRevenue / numberOfAccounts;
};

/**
 * Calculate customer acquisition cost (CAC) payback period
 */
export const calculateCACPaybackPeriod = (cac, monthlyRevenue) => {
  if (!monthlyRevenue || monthlyRevenue === 0) return Infinity;
  return cac / monthlyRevenue;
};

/**
 * Calculate expansion revenue percentage
 */
export const calculateExpansionRevenuePercentage = (expansionRevenue, totalRevenue) => {
  if (!totalRevenue || totalRevenue === 0) return 0;
  return (expansionRevenue / totalRevenue) * 100;
};

/**
 * Calculate monthly churn rate from annual churn rate
 */
export const annualToMonthlyChurn = (annualChurnRate) => {
  return 1 - Math.pow(1 - (annualChurnRate / 100), 1 / 12);
};

/**
 * Calculate annual churn rate from monthly churn rate
 */
export const monthlyToAnnualChurn = (monthlyChurnRate) => {
  return 1 - Math.pow(1 - monthlyChurnRate, 12);
};

/**
 * Calculate rule of 40 score
 */
export const calculateRuleOf40 = (growthRate, profitMargin) => {
  return growthRate + profitMargin;
};

/**
 * Validate and sanitize input parameters
 */
export const sanitizeInput = (input) => {
  if (typeof input === 'string') {
    return input.trim();
  }
  if (typeof input === 'number') {
    return Math.max(0, input);
  }
  return input;
};

/**
 * Generate date range for the last N months
 */
export const getLastNMonths = (months = 6) => {
  const endDate = new Date();
  const startDate = new Date();
  startDate.setMonth(startDate.getMonth() - months);
  
  return {
    startDate: startDate.toISOString().split('T')[0],
    endDate: endDate.toISOString().split('T')[0]
  };
};

/**
 * Generate date range for a specific month
 */
export const getMonthRange = (year, month) => {
  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 0);
  
  return {
    startDate: startDate.toISOString().split('T')[0],
    endDate: endDate.toISOString().split('T')[0]
  };
};

/**
 * Calculate business days between two dates
 */
export const calculateBusinessDays = (startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  let count = 0;
  
  while (start <= end) {
    const dayOfWeek = start.getDay();
    if (dayOfWeek !== 0 && dayOfWeek !== 6) { // Not Sunday (0) or Saturday (6)
      count++;
    }
    start.setDate(start.getDate() + 1);
  }
  
  return count;
};

/**
 * Calculate time-weighted return
 */
export const calculateTimeWeightedReturn = (returns) => {
  if (!returns || returns.length === 0) return 0;
  
  let cumulativeReturn = 1;
  returns.forEach(returnValue => {
    cumulativeReturn *= (1 + returnValue / 100);
  });
  
  return (cumulativeReturn - 1) * 100;
};
