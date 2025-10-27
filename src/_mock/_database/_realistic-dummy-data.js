import dayjs from 'dayjs';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';

// Extend dayjs with plugins
dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

// Generate realistic dummy data for analytics dashboard
// 6 months of data with 80-100 users per month

// Products and Plans Configuration
const PRODUCTS = [
  {
    id: '5e6624827e5eb40f41789173',
    name: 'Pabbly Email Marketing',
    description: 'Email marketing automation platform'
  },
  {
    id: '5e6624827e5eb40f41789174', 
    name: 'Pabbly Subscription Billing',
    description: 'Recurring billing and subscription management'
  },
  {
    id: '5e6624827e5eb40f41789175',
    name: 'Pabbly Form Builder', 
    description: 'Advanced form builder with integrations'
  },
  {
    id: '5e6624827e5eb40f41789176',
    name: 'Pabbly Connect',
    description: 'Workflow automation and integration platform'
  }
];

const PLANS = [
  {
    id: '673b2a92de8bd6206516d5c5',
    name: 'Basic',
    price: 29,
    features: ['Up to 1,000 contacts', 'Basic automation', 'Email support']
  },
  {
    id: '673b2a92de8bd6206516d5c6', 
    name: 'Pro',
    price: 79,
    features: ['Up to 10,000 contacts', 'Advanced automation', 'Priority support']
  },
  {
    id: '673b2a92de8bd6206516d5c7',
    name: 'Premium', 
    price: 199,
    features: ['Up to 50,000 contacts', 'Custom integrations', 'Dedicated support']
  },
  {
    id: '673b2a92de8bd6206516d5c8',
    name: 'Enterprise',
    price: 499, 
    features: ['Unlimited contacts', 'White-label', '24/7 support']
  }
];

// Realistic user data patterns
const USER_PATTERNS = {
  // Monthly user distribution (realistic SaaS patterns)
  monthlyUsers: [85, 92, 78, 105, 88, 95], // Last 6 months
  
  // Churn rates by plan (higher for lower tiers)
  churnRates: {
    '673b2a92de8bd6206516d5c5': 0.12, // Basic: 12%
    '673b2a92de8bd6206516d5c6': 0.08, // Pro: 8% 
    '673b2a92de8bd6206516d5c7': 0.05, // Premium: 5%
    '673b2a92de8bd6206516d5c8': 0.03  // Enterprise: 3%
  },
  
  // Plan distribution (more users on lower tiers)
  planDistribution: {
    '673b2a92de8bd6206516d5c5': 0.45, // Basic: 45%
    '673b2a92de8bd6206516d5c6': 0.35, // Pro: 35%
    '673b2a92de8bd6206516d5c7': 0.15, // Premium: 15%
    '673b2a92de8bd6206516d5c8': 0.05  // Enterprise: 5%
  },
  
  // Product distribution
  productDistribution: {
    '5e6624827e5eb40f41789173': 0.30, // Email Marketing: 30%
    '5e6624827e5eb40f41789174': 0.25, // Subscription Billing: 25%
    '5e6624827e5eb40f41789175': 0.20, // Form Builder: 20%
    '5e6624827e5eb40f41789176': 0.25  // Connect: 25%
  }
};

// Generate realistic customer data
const generateCustomerData = () => {
  const customers = [];
  const domains = ['gmail.com', 'yahoo.com', 'outlook.com', 'company.com', 'business.org'];
  const firstNames = ['John', 'Sarah', 'Mike', 'Emily', 'David', 'Lisa', 'Chris', 'Anna', 'Tom', 'Kate'];
  const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Wilson', 'Moore'];
  
  let customerId = 1;
  
  for (let monthOffset = 5; monthOffset >= 0; monthOffset -= 1) {
    const monthDate = dayjs().subtract(monthOffset, 'month');
    const usersThisMonth = USER_PATTERNS.monthlyUsers[5 - monthOffset];
    
    for (let i = 0; i < usersThisMonth; i += 1) {
      const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
      const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
      const domain = domains[Math.floor(Math.random() * domains.length)];
      const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${Math.floor(Math.random() * 100)}@${domain}`;
      
      // Select product and plan based on distribution
      const product = selectByDistribution(PRODUCTS, USER_PATTERNS.productDistribution);
      const plan = selectByDistribution(PLANS, USER_PATTERNS.planDistribution);
      
      // Calculate realistic subscription dates
      const signupDate = monthDate.add(Math.floor(Math.random() * 28), 'day').toDate();
      const isActive = Math.random() > USER_PATTERNS.churnRates[plan.id];
      const cancelDate = isActive ? null : dayjs(signupDate).add(Math.floor(Math.random() * 90), 'day').toDate();
      
      // Calculate renewal dates
      const renewals = isActive ? Math.floor(Math.random() * 3) + 1 : 0;
      
      // Realistic acquisition cost (higher for enterprise)
      const acquisitionCost = plan.price * (0.3 + Math.random() * 0.4);
      
      // Refund probability (lower for higher tiers)
      const refundProbability = plan.id === '673b2a92de8bd6206516d5c8' ? 0.01 : 
                               plan.id === '673b2a92de8bd6206516d5c7' ? 0.02 :
                               plan.id === '673b2a92de8bd6206516d5c6' ? 0.05 : 0.08;
      
      const hasRefund = Math.random() < refundProbability;
      const refundAmount = hasRefund ? plan.price * (0.5 + Math.random() * 0.5) : 0;
      
      customers.push({
        id: `customer_${customerId}`,
        email,
        firstName,
        lastName,
        product: product.name,
        productId: product.id,
        plan: plan.name,
        planId: plan.id,
        monthlyFee: plan.price,
        signupDate: signupDate.toISOString(),
        status: isActive ? 'active' : 'cancelled',
        cancelDate: cancelDate ? cancelDate.toISOString() : null,
        renewals,
        acquisitionCost: Math.round(acquisitionCost * 100) / 100,
        refundAmount: Math.round(refundAmount * 100) / 100,
        createdAt: signupDate.toISOString(),
        updatedAt: new Date().toISOString()
      });
      
      customerId += 1;
    }
  }
  
  return customers;
};

// Helper function to select items based on distribution
const selectByDistribution = (items, distribution) => {
  const random = Math.random();
  let cumulative = 0;
  
  let result = items[0]; // Fallback
  Object.entries(distribution).forEach(([key, probability]) => {
    cumulative += probability;
    if (random <= cumulative) {
      result = items.find(item => item.id === key);
    }
  });
  return result;
};

// Generate realistic transaction data
const generateTransactionData = (customers) => {
  const transactions = [];
  const gateways = ['Stripe', 'PayPal', 'Razorpay', 'Square'];
  const paymentMethods = ['card', 'bank_transfer', 'upi', 'wallet'];
  
  let transactionId = 1;
  
  customers.forEach(customer => {
    // Generate transactions for each month the customer was active
    const signupDate = dayjs(customer.signupDate);
    const endDate = customer.cancelDate ? dayjs(customer.cancelDate) : dayjs();
    const monthsActive = endDate.diff(signupDate, 'month') + 1;
    
    Array.from({ length: monthsActive }, (_, month) => {
      const transactionDate = signupDate.add(month, 'month');
      
      // Skip if transaction date is in the future
      if (transactionDate.isAfter(dayjs())) return null;
      
      const gateway = gateways[Math.floor(Math.random() * gateways.length)];
      const paymentMethod = paymentMethods[Math.floor(Math.random() * paymentMethods.length)];
      
      // Calculate transaction amount (base price + some variation)
      const baseAmount = customer.monthlyFee;
      const variation = (Math.random() - 0.5) * 0.1; // ±5% variation
      const amount = Math.round(baseAmount * (1 + variation) * 100) / 100;
      
      // Transaction fees (2-3% of amount)
      const fees = Math.round(amount * (0.02 + Math.random() * 0.01) * 100) / 100;
      const netAmount = amount - fees;
      
      transactions.push({
        id: `txn_${transactionId}`,
        customerId: customer.id,
        subscriptionId: `sub_${customer.id}_${month + 1}`,
        invoiceId: `inv_${customer.id}_${month + 1}`,
        planId: customer.planId,
        productId: customer.productId,
        type: 'payment',
        status: 'success',
        amount,
        fees,
        netAmount,
        gateway,
        paymentMethod,
        currency: 'USD',
        transactionDate: transactionDate.toISOString(),
        createdAt: transactionDate.toISOString(),
        updatedAt: transactionDate.toISOString()
      });
      
      transactionId += 1;
      return null;
    });
  });
  
  return transactions;
};

// Generate realistic invoice data
const generateInvoiceData = (customers, transactions) => {
  const invoices = [];
  
  transactions.forEach(transaction => {
    const customer = customers.find(c => c.id === transaction.customerId);
    const invoiceDate = dayjs(transaction.transactionDate);
    
    // Tax calculation (0-20% based on location)
    const taxRate = Math.random() * 0.2;
    const taxAmount = Math.round(transaction.amount * taxRate * 100) / 100;
    const totalAmount = transaction.amount + taxAmount;
    
    invoices.push({
      id: transaction.invoiceId,
      customerId: customer.id,
      subscriptionId: transaction.subscriptionId,
      planId: transaction.planId,
      productId: transaction.productId,
      status: 'paid',
      amount: transaction.amount,
      taxAmount,
      totalAmount,
      currency: 'USD',
      dueDate: invoiceDate.add(30, 'day').toISOString(),
      paidDate: transaction.transactionDate,
      createdAt: invoiceDate.toISOString(),
      updatedAt: transaction.transactionDate
    });
  });
  
  return invoices;
};

// Generate subscription data
const generateSubscriptionData = (customers) => {
  const subscriptions = [];
  
  customers.forEach(customer => {
    const signupDate = dayjs(customer.signupDate);
    const endDate = customer.cancelDate ? dayjs(customer.cancelDate) : dayjs().add(1, 'year');
    
    subscriptions.push({
      id: `sub_${customer.id}`,
      customerId: customer.id,
      productId: customer.productId,
      planId: customer.planId,
      status: customer.status,
      amount: customer.monthlyFee,
      quantity: 1,
      startsAt: signupDate.toISOString(),
      activationDate: signupDate.toISOString(),
      expiryDate: endDate.toISOString(),
      cancelDate: customer.cancelDate,
      nextBillingDate: customer.status === 'active' ? 
        dayjs().add(1, 'month').toISOString() : null,
      lastBillingDate: customer.status === 'active' ? 
        dayjs().subtract(1, 'month').toISOString() : null,
      createdAt: signupDate.toISOString(),
      updatedAt: new Date().toISOString()
    });
  });
  
  return subscriptions;
};

// Generate monthly analytics data
const generateMonthlyAnalytics = (customers, transactions, invoices) => {
  const monthlyData = [];
  
  for (let monthOffset = 5; monthOffset >= 0; monthOffset -= 1) {
    const monthDate = dayjs().subtract(monthOffset, 'month');
    const monthStart = monthDate.startOf('month');
    const monthEnd = monthDate.endOf('month');
    
    // Filter data for this month
    const monthCustomers = customers.filter(c => {
      const signupDate = dayjs(c.signupDate);
      return signupDate.isSameOrAfter(monthStart) && signupDate.isSameOrBefore(monthEnd);
    });
    
    const monthTransactions = transactions.filter(t => {
      const transactionDate = dayjs(t.transactionDate);
      return transactionDate.isSameOrAfter(monthStart) && transactionDate.isSameOrBefore(monthEnd);
    });
    
    const monthInvoices = invoices.filter(i => {
      const invoiceDate = dayjs(i.createdAt);
      return invoiceDate.isSameOrAfter(monthStart) && invoiceDate.isSameOrBefore(monthEnd);
    });
    
    // Calculate metrics
    const totalMRR = monthTransactions.reduce((sum, t) => sum + t.amount, 0);
    const totalRevenue = monthInvoices.reduce((sum, i) => sum + i.totalAmount, 0);
    const activeCustomers = customers.filter(c => {
      const signupDate = dayjs(c.signupDate);
      const cancelDate = c.cancelDate ? dayjs(c.cancelDate) : null;
      return signupDate.isSameOrBefore(monthEnd) && 
             (!cancelDate || cancelDate.isAfter(monthEnd));
    }).length;
    
    const newCustomers = monthCustomers.length;
    const cancelledCustomers = customers.filter(c => {
      const cancelDate = c.cancelDate ? dayjs(c.cancelDate) : null;
      return cancelDate && cancelDate.isSameOrAfter(monthStart) && cancelDate.isSameOrBefore(monthEnd);
    }).length;
    
    const churnRate = activeCustomers > 0 ? (cancelledCustomers / activeCustomers) * 100 : 0;
    const arpu = activeCustomers > 0 ? totalMRR / activeCustomers : 0;
    
    monthlyData.push({
      month: monthDate.format('YYYY-MM'),
      monthName: monthDate.format('MMMM YYYY'),
      totalMRR: Math.round(totalMRR * 100) / 100,
      totalRevenue: Math.round(totalRevenue * 100) / 100,
      activeCustomers,
      newCustomers,
      cancelledCustomers,
      churnRate: Math.round(churnRate * 100) / 100,
      arpu: Math.round(arpu * 100) / 100,
      ltv: Math.round(arpu * (1 / (churnRate / 100)) * 100) / 100,
      cac: Math.round(monthCustomers.reduce((sum, c) => sum + c.acquisitionCost, 0) / newCustomers * 100) / 100
    });
  }
  
  return monthlyData;
};

// Generate all data
const generateAllData = () => {
  console.log('🔄 Generating realistic dummy data...');
  
  const customers = generateCustomerData();
  const transactions = generateTransactionData(customers);
  const invoices = generateInvoiceData(customers, transactions);
  const subscriptions = generateSubscriptionData(customers);
  const monthlyAnalytics = generateMonthlyAnalytics(customers, transactions, invoices);
  
  console.log('✅ Generated data:');
  console.log(`   📊 ${customers.length} customers`);
  console.log(`   💳 ${transactions.length} transactions`);
  console.log(`   📄 ${invoices.length} invoices`);
  console.log(`   📋 ${subscriptions.length} subscriptions`);
  console.log(`   📈 ${monthlyAnalytics.length} months of analytics`);
  
  return {
    customers,
    transactions,
    invoices,
    subscriptions,
    monthlyAnalytics,
    products: PRODUCTS,
    plans: PLANS,
    generatedAt: new Date().toISOString()
  };
};

// Export the generated data
export const REALISTIC_DUMMY_DATA = generateAllData();

// Export individual datasets
export const {
  customers: REALISTIC_CUSTOMERS,
  transactions: REALISTIC_TRANSACTIONS,
  invoices: REALISTIC_INVOICES,
  subscriptions: REALISTIC_SUBSCRIPTIONS,
  monthlyAnalytics: REALISTIC_MONTHLY_ANALYTICS,
  products: REALISTIC_PRODUCTS,
  plans: REALISTIC_PLANS
} = REALISTIC_DUMMY_DATA;

// Export utility functions
export const getCustomersByMonth = (month) => {
  const monthDate = dayjs(month);
  return REALISTIC_CUSTOMERS.filter(customer => {
    const signupDate = dayjs(customer.signupDate);
    return signupDate.isSame(monthDate, 'month');
  });
};

export const getTransactionsByMonth = (month) => {
  const monthDate = dayjs(month);
  return REALISTIC_TRANSACTIONS.filter(transaction => {
    const transactionDate = dayjs(transaction.transactionDate);
    return transactionDate.isSame(monthDate, 'month');
  });
};

export const getInvoicesByMonth = (month) => {
  const monthDate = dayjs(month);
  return REALISTIC_INVOICES.filter(invoice => {
    const invoiceDate = dayjs(invoice.createdAt);
    return invoiceDate.isSame(monthDate, 'month');
  });
};

export const getAnalyticsByMonth = (month) => REALISTIC_MONTHLY_ANALYTICS.find(analytics => analytics.month === month);

export const getTopCustomers = (limit = 10) => REALISTIC_CUSTOMERS
    .sort((a, b) => b.monthlyFee - a.monthlyFee)
    .slice(0, limit);

export const getCustomersByProduct = (productId) => REALISTIC_CUSTOMERS.filter(customer => customer.productId === productId);

export const getCustomersByPlan = (planId) => REALISTIC_CUSTOMERS.filter(customer => customer.planId === planId);

export const getActiveCustomers = () => REALISTIC_CUSTOMERS.filter(customer => customer.status === 'active');

export const getCancelledCustomers = () => REALISTIC_CUSTOMERS.filter(customer => customer.status === 'cancelled');

export const getRefundedCustomers = () => REALISTIC_CUSTOMERS.filter(customer => customer.refundAmount > 0);

// Export summary statistics
export const getSummaryStats = () => {
  const totalCustomers = REALISTIC_CUSTOMERS.length;
  const activeCustomers = getActiveCustomers().length;
  const cancelledCustomers = getCancelledCustomers().length;
  const totalRevenue = REALISTIC_TRANSACTIONS.reduce((sum, t) => sum + t.amount, 0);
  const totalRefunds = REALISTIC_CUSTOMERS.reduce((sum, c) => sum + c.refundAmount, 0);
  const avgMRR = REALISTIC_MONTHLY_ANALYTICS.reduce((sum, m) => sum + m.totalMRR, 0) / REALISTIC_MONTHLY_ANALYTICS.length;
  
  return {
    totalCustomers,
    activeCustomers,
    cancelledCustomers,
    totalRevenue: Math.round(totalRevenue * 100) / 100,
    totalRefunds: Math.round(totalRefunds * 100) / 100,
    avgMRR: Math.round(avgMRR * 100) / 100,
    churnRate: Math.round((cancelledCustomers / totalCustomers) * 100 * 100) / 100,
    arpu: Math.round((totalRevenue / activeCustomers) * 100) / 100
  };
};

export default REALISTIC_DUMMY_DATA;
