/**
 * Validate API response data
 */
export const validateAnalyticsData = (data) => {
  if (!data || typeof data !== 'object') {
    throw new Error('Invalid data format: Expected object');
  }

  // Validate summary data
  if (data.summary) {
    const { summary } = data;
    const requiredFields = ['totalMRR', 'activeCustomers', 'revenueChurn'];
    
    requiredFields.forEach((field) => {
      if (typeof summary[field] !== 'number') {
        console.warn(`Missing or invalid ${field} in summary data`);
      }
    });
  }

  // Validate MRR data
  if (data.mrr && Array.isArray(data.mrr)) {
    data.mrr.forEach((item, index) => {
      if (!item.month || typeof item.mrr !== 'number') {
        console.warn(`Invalid MRR data at index ${index}:`, item);
      }
    });
  }

  // Validate customer data
  if (data.customers && Array.isArray(data.customers)) {
    data.customers.forEach((customer, index) => {
      if (!customer.id || !customer.email) {
        console.warn(`Invalid customer data at index ${index}:`, customer);
      }
    });
  }

  return true;
};

/**
 * Sanitize and validate user input
 */
export const sanitizeInput = (input) => {
  if (typeof input === 'string') {
    return input.trim().replace(/[<>]/g, '');
  }
  if (typeof input === 'number') {
    return Math.max(0, input);
  }
  return input;
};

/**
 * Validate date range
 */
export const validateDateRange = (startDate, endDate) => {
  const errors = [];
  
  if (startDate && endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (Number.isNaN(start.getTime())) {
      errors.push('Invalid start date format');
    }
    if (Number.isNaN(end.getTime())) {
      errors.push('Invalid end date format');
    }
    if (start > end) {
      errors.push('Start date must be before end date');
    }
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
};

/**
 * Validate API response structure
 */
export const validateApiResponse = (response) => {
  if (!response || typeof response !== 'object') {
    throw new Error('Invalid API response: Expected object');
  }

  if (!response.success && response.success !== false) {
    console.warn('API response missing success field');
  }

  if (response.error && !response.success) {
    throw new Error(response.error);
  }

  return true;
};
