import Invoice from '../models/Invoice.js';
import Subscription from '../models/Subscription.js';
import Transaction from '../models/Transaction.js';

/**
 * Calculate Monthly Recurring Revenue (MRR) over time
 */
export const calculateMRR = async (filters) => {
  try {
    const matchStage = {
      status: 'paid',
      ...filters
    };

    const mrrData = await Invoice.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: {
            month: { $month: '$createdAt' },
            year: { $year: '$createdAt' }
          },
          totalMRR: { $sum: '$amount' },
          invoiceCount: { $sum: 1 },
          avgAmount: { $avg: '$amount' }
        }
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1 }
      }
    ]);

    return mrrData.map(item => ({
      month: `${item._id.month.toString().padStart(2, '0')}-${item._id.year}`,
      mrr: item.totalMRR,
      invoiceCount: item.invoiceCount,
      avgAmount: Math.round(item.avgAmount * 100) / 100
    }));
  } catch (error) {
    console.error('Error calculating MRR:', error);
    throw new Error('Failed to calculate MRR');
  }
};

/**
 * Calculate Active and Cancelled Customers
 */
export const calculateActiveAndCancelled = async (filters) => {
  try {
    const [active, cancelled, total] = await Promise.all([
      Subscription.countDocuments({ status: 'live', ...filters }),
      Subscription.countDocuments({ status: 'cancelled', ...filters }),
      Subscription.countDocuments(filters)
    ]);

    return {
      active,
      cancelled,
      total,
      churned: cancelled
    };
  } catch (error) {
    console.error('Error calculating active/cancelled customers:', error);
    throw new Error('Failed to calculate customer metrics');
  }
};

/**
 * Calculate Revenue Churn Percentage
 */
export const calculateRevenueChurn = (previousMRR, currentMRR) => {
  if (!previousMRR || previousMRR === 0) return 0;
  const churnAmount = Math.max(0, previousMRR - currentMRR);
  return (churnAmount / previousMRR) * 100;
};

/**
 * Calculate User Churn Percentage
 */
export const calculateUserChurn = (previousCustomers, currentCustomers) => {
  if (!previousCustomers || previousCustomers === 0) return 0;
  const churnedCustomers = Math.max(0, previousCustomers - currentCustomers);
  return (churnedCustomers / previousCustomers) * 100;
};

/**
 * Calculate Average Revenue Per User (ARPU)
 */
export const calculateARPU = (totalMRR, activeCustomers) => {
  if (!activeCustomers || activeCustomers === 0) return 0;
  return totalMRR / activeCustomers;
};

/**
 * Calculate Lifetime Value (LTV)
 */
export const calculateLTV = (arpu, churnRate) => {
  if (!churnRate || churnRate === 0) return arpu * 12; // Assume 12 months if no churn
  return arpu * (1 / (churnRate / 100));
};

/**
 * Calculate Customer Acquisition Cost (CAC)
 */
export const calculateCAC = async (filters) => {
  try {
    // This is a simplified calculation - in reality, you'd track marketing spend
    const totalMarketingSpend = 25000; // Replace with actual marketing cost tracking
    
    const newCustomers = await Subscription.countDocuments({
      status: 'live',
      ...filters,
      createdAt: {
        $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // Last 30 days
      }
    });

    return newCustomers > 0 ? totalMarketingSpend / newCustomers : 0;
  } catch (error) {
    console.error('Error calculating CAC:', error);
    return 0;
  }
};

/**
 * Calculate Total Refunds
 */
export const calculateRefunds = async (filters) => {
  try {
    const refundData = await Transaction.aggregate([
      {
        $match: {
          'refunded.amount': { $gt: 0 },
          ...filters
        }
      },
      {
        $group: {
          _id: null,
          totalRefunds: { $sum: '$refunded.amount' },
          refundCount: { $sum: 1 }
        }
      }
    ]);

    return {
      totalRefunds: refundData[0]?.totalRefunds || 0,
      refundCount: refundData[0]?.refundCount || 0
    };
  } catch (error) {
    console.error('Error calculating refunds:', error);
    return { totalRefunds: 0, refundCount: 0 };
  }
};

/**
 * Calculate New Customer MRR
 */
export const calculateNewCustomerMRR = async (filters) => {
  try {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    
    const newCustomerMRR = await Invoice.aggregate([
      {
        $match: {
          status: 'paid',
          createdAt: { $gte: thirtyDaysAgo },
          ...filters
        }
      },
      {
        $group: {
          _id: null,
          totalNewMRR: { $sum: '$amount' },
          newCustomerCount: { $sum: 1 }
        }
      }
    ]);

    return {
      newCustomerMRR: newCustomerMRR[0]?.totalNewMRR || 0,
      newCustomerCount: newCustomerMRR[0]?.newCustomerCount || 0
    };
  } catch (error) {
    console.error('Error calculating new customer MRR:', error);
    return { newCustomerMRR: 0, newCustomerCount: 0 };
  }
};

/**
 * Calculate Expansion and Contraction MRR
 */
export const calculateExpansionContraction = async (filters) => {
  try {
    const currentMonth = new Date();
    const previousMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1);
    const endOfPreviousMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 0);

    // Get current month MRR
    const currentMRR = await Invoice.aggregate([
      {
        $match: {
          status: 'paid',
          createdAt: {
            $gte: new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1),
            $lt: currentMonth
          },
          ...filters
        }
      },
      {
        $group: {
          _id: null,
          totalMRR: { $sum: '$amount' }
        }
      }
    ]);

    // Get previous month MRR
    const previousMRR = await Invoice.aggregate([
      {
        $match: {
          status: 'paid',
          createdAt: {
            $gte: previousMonth,
            $lte: endOfPreviousMonth
          },
          ...filters
        }
      },
      {
        $group: {
          _id: null,
          totalMRR: { $sum: '$amount' }
        }
      }
    ]);

    const current = currentMRR[0]?.totalMRR || 0;
    const previous = previousMRR[0]?.totalMRR || 0;
    const expansion = Math.max(0, current - previous);
    const contraction = Math.max(0, previous - current);

    return {
      expansionMRR: expansion,
      contractionMRR: contraction,
      netExpansion: expansion - contraction
    };
  } catch (error) {
    console.error('Error calculating expansion/contraction:', error);
    return { expansionMRR: 0, contractionMRR: 0, netExpansion: 0 };
  }
};

/**
 * Get comprehensive analytics summary
 */
export const getAnalyticsSummary = async (filters) => {
  try {
    // Get MRR data
    const mrrData = await calculateMRR(filters);
    const currentMRR = mrrData.length > 0 ? mrrData[mrrData.length - 1].mrr : 0;
    const previousMRR = mrrData.length > 1 ? mrrData[mrrData.length - 2].mrr : 0;

    // Get customer metrics
    const customerMetrics = await calculateActiveAndCancelled(filters);
    
    // Get additional metrics
    const [refunds, newCustomerData, expansionData, cac] = await Promise.all([
      calculateRefunds(filters),
      calculateNewCustomerMRR(filters),
      calculateExpansionContraction(filters),
      calculateCAC(filters)
    ]);

    // Calculate derived metrics
    const revenueChurn = calculateRevenueChurn(previousMRR, currentMRR);
    const userChurn = calculateUserChurn(previousMRR, currentMRR);
    const arpu = calculateARPU(currentMRR, customerMetrics.active);
    const ltv = calculateLTV(arpu, revenueChurn);
    const ltvCacRatio = cac > 0 ? ltv / cac : 0;

    // Calculate growth rate
    const mrrGrowthRate = previousMRR > 0 ? ((currentMRR - previousMRR) / previousMRR) * 100 : 0;

    return {
      // Core MRR Metrics
      totalMRR: currentMRR,
      previousMRR,
      mrrGrowthRate: Math.round(mrrGrowthRate * 100) / 100,
      newCustomerMRR: newCustomerData.newCustomerMRR,
      
      // Customer Metrics
      activeCustomers: customerMetrics.active,
      cancelledCustomers: customerMetrics.cancelled,
      totalCustomers: customerMetrics.total,
      newCustomers: newCustomerData.newCustomerCount,
      
      // Churn Metrics
      revenueChurn: Math.round(revenueChurn * 100) / 100,
      userChurn: Math.round(userChurn * 100) / 100,
      
      // Financial Metrics
      arpu: Math.round(arpu * 100) / 100,
      ltv: Math.round(ltv * 100) / 100,
      cac: Math.round(cac * 100) / 100,
      ltvCacRatio: Math.round(ltvCacRatio * 100) / 100,
      
      // Additional Metrics
      totalRefunds: refunds.totalRefunds,
      refundCount: refunds.refundCount,
      expansionMRR: expansionData.expansionMRR,
      contractionMRR: expansionData.contractionMRR,
      netExpansion: expansionData.netExpansion,
      
      // MRR Trend
      mrrTrend: mrrData,
      
      // Timestamps
      calculatedAt: new Date(),
      period: {
        startDate: filters.createdAt?.$gte || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        endDate: filters.createdAt?.$lte || new Date()
      }
    };
  } catch (error) {
    console.error('Error getting analytics summary:', error);
    throw new Error('Failed to calculate analytics summary');
  }
};

/**
 * Get MRR trend over time
 */
export const getMRRTrend = async (filters) => {
  try {
    return await calculateMRR(filters);
  } catch (error) {
    console.error('Error getting MRR trend:', error);
    throw new Error('Failed to get MRR trend');
  }
};

/**
 * Get churn analysis
 */
export const getChurnAnalysis = async (filters) => {
  try {
    const mrrData = await calculateMRR(filters);
    const customerMetrics = await calculateActiveAndCancelled(filters);
    
    const churnAnalysis = mrrData.map((month, index) => {
      const previousMonth = index > 0 ? mrrData[index - 1] : null;
      const revenueChurn = previousMonth ? calculateRevenueChurn(previousMonth.mrr, month.mrr) : 0;
      
      return {
        ...month,
        revenueChurn: Math.round(revenueChurn * 100) / 100
      };
    });

    return {
      churnTrend: churnAnalysis,
      currentRevenueChurn: churnAnalysis[churnAnalysis.length - 1]?.revenueChurn || 0,
      averageRevenueChurn: churnAnalysis.length > 0 
        ? Math.round((churnAnalysis.reduce((sum, item) => sum + item.revenueChurn, 0) / churnAnalysis.length) * 100) / 100 
        : 0,
      customerMetrics
    };
  } catch (error) {
    console.error('Error getting churn analysis:', error);
    throw new Error('Failed to get churn analysis');
  }
};

/**
 * Get metrics breakdown by plan
 */
export const getPlanBreakdown = async (filters) => {
  try {
    const planBreakdown = await Invoice.aggregate([
      { $match: { status: 'paid', ...filters } },
      { $unwind: '$plan_id' },
      {
        $group: {
          _id: '$plan_id',
          totalMRR: { $sum: '$amount' },
          customerCount: { $addToSet: '$customer_id' },
          invoiceCount: { $sum: 1 },
          avgAmount: { $avg: '$amount' }
        }
      },
      {
        $project: {
          planId: '$_id',
          totalMRR: 1,
          customerCount: { $size: '$customerCount' },
          invoiceCount: 1,
          avgAmount: { $round: ['$avgAmount', 2] }
        }
      },
      { $sort: { totalMRR: -1 } }
    ]);

    return planBreakdown;
  } catch (error) {
    console.error('Error getting plan breakdown:', error);
    throw new Error('Failed to get plan breakdown');
  }
};

/**
 * Get metrics breakdown by product
 */
export const getProductBreakdown = async (filters) => {
  try {
    const productBreakdown = await Invoice.aggregate([
      { $match: { status: 'paid', ...filters } },
      {
        $group: {
          _id: '$product_id',
          totalMRR: { $sum: '$amount' },
          customerCount: { $addToSet: '$customer_id' },
          invoiceCount: { $sum: 1 },
          avgAmount: { $avg: '$amount' }
        }
      },
      {
        $project: {
          productId: '$_id',
          totalMRR: 1,
          customerCount: { $size: '$customerCount' },
          invoiceCount: 1,
          avgAmount: { $round: ['$avgAmount', 2] }
        }
      },
      { $sort: { totalMRR: -1 } }
    ]);

    return productBreakdown;
  } catch (error) {
    console.error('Error getting product breakdown:', error);
    throw new Error('Failed to get product breakdown');
  }
};

/**
 * Get customer-level metrics
 */
export const getCustomerMetrics = async (filters, limit = 50) => {
  try {
    const customerMetrics = await Invoice.aggregate([
      { $match: { status: 'paid', ...filters } },
      {
        $group: {
          _id: '$customer_id',
          totalSpent: { $sum: '$amount' },
          invoiceCount: { $sum: 1 },
          avgAmount: { $avg: '$amount' },
          firstPurchase: { $min: '$createdAt' },
          lastPurchase: { $max: '$createdAt' }
        }
      },
      {
        $project: {
          customerId: '$_id',
          totalSpent: 1,
          invoiceCount: 1,
          avgAmount: { $round: ['$avgAmount', 2] },
          firstPurchase: 1,
          lastPurchase: 1,
          customerLifetime: {
            $divide: [
              { $subtract: ['$lastPurchase', '$firstPurchase'] },
              1000 * 60 * 60 * 24 // Convert to days
            ]
          }
        }
      },
      { $sort: { totalSpent: -1 } },
      { $limit: limit }
    ]);

    return customerMetrics;
  } catch (error) {
    console.error('Error getting customer metrics:', error);
    throw new Error('Failed to get customer metrics');
  }
};

/**
 * Generate dummy data for testing
 */
export const generateDummyData = async (months = 6, usersPerPlan = 50) => {
  try {
    const products = [
      '5e6624827e5eb40f41789173', // Email Marketing
      '5e6624827e5eb40f41789174', // Subscription Billing
      '5e6624827e5eb40f41789175', // Form Builder
      '5e6624827e5eb40f41789176'  // Connect
    ];
    
    const plans = [
      '673b2a92de8bd6206516d5c5', // Basic
      '673b2a92de8bd6206516d5c6', // Pro
      '673b2a92de8bd6206516d5c7', // Premium
      '673b2a92de8bd6206516d5c8'  // Enterprise
    ];
    
    const planPrices = {
      '673b2a92de8bd6206516d5c5': 29,    // Basic
      '673b2a92de8bd6206516d5c6': 79,    // Pro
      '673b2a92de8bd6206516d5c7': 199,   // Premium
      '673b2a92de8bd6206516d5c8': 499    // Enterprise
    };
    
    const generatedData = {
      invoices: [],
      subscriptions: [],
      transactions: []
    };
    
    // Generate data for each month
    for (let monthOffset = months - 1; monthOffset >= 0; monthOffset--) {
      const monthDate = new Date();
      monthDate.setMonth(monthDate.getMonth() - monthOffset);
      
      for (const productId of products) {
        for (const planId of plans) {
          const userCount = Math.floor(Math.random() * (usersPerPlan * 0.5)) + (usersPerPlan * 0.5);
          
          for (let i = 0; i < userCount; i++) {
            const customerId = `customer_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
            const subscriptionId = `sub_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
            const invoiceId = `inv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
            const transactionId = `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
            
            const basePrice = planPrices[planId];
            const amount = basePrice + Math.floor(Math.random() * basePrice * 0.5);
            const status = Math.random() < 0.85 ? 'paid' : 'pending';
            const subscriptionStatus = Math.random() < 0.9 ? 'live' : 'cancelled';
            
            // Create invoice
            const invoice = {
              _id: invoiceId,
              customer_id: customerId,
              user_id: '5bebb8afef788b4507f7ce75',
              status: status,
              quantity: 1,
              due_amount: status === 'paid' ? 0 : amount,
              plan_id: [planId],
              payment_term: '',
              subscription_id: subscriptionId,
              product_id: productId,
              setup_fee: 0,
              currency_symbol: '$',
              currency_code: 'USD',
              pcustomer_id: customerId,
              amount: amount,
              invoice_id: `INV-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
              order_number: `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
              expiry_date: new Date(monthDate.getTime() + 30 * 24 * 60 * 60 * 1000),
              createdAt: monthDate,
              updatedAt: monthDate,
              cron_process: 'done',
              current_tracking_id: '',
              paid_date: status === 'paid' ? monthDate : null,
              retry: false,
              retry_count: 0
            };
            
            // Create subscription
            const subscription = {
              _id: subscriptionId,
              customer_id: customerId,
              email_id: `user${i}@example.com`,
              product_id: productId,
              plan_id: planId,
              user_id: '5bebb8afef788b4507f7ce75',
              status: subscriptionStatus,
              quantity: 1,
              amount: amount,
              starts_at: monthDate,
              activation_date: monthDate,
              expiry_date: new Date(monthDate.getTime() + 365 * 24 * 60 * 60 * 1000),
              trial_days: 0,
              trial_expiry_date: '',
              next_billing_date: new Date(monthDate.getTime() + 30 * 24 * 60 * 60 * 1000),
              last_billing_date: monthDate,
              canceled_date: subscriptionStatus === 'cancelled' ? new Date(monthDate.getTime() + 15 * 24 * 60 * 60 * 1000) : '',
              setup_fee: 0,
              currency_code: 'USD',
              currency_symbol: '$',
              pcustomer_id: customerId,
              payment_method: 'card',
              taxable: true,
              taxrule_id: '63c285ae4db07e29219b4e66',
              gateway_type: 'stripe',
              payment_terms: '',
              gateway_id: 'stripe_gateway',
              gateway_name: 'Stripe',
              custom_gateway_type: 'stripe',
              custom_fields: [],
              custom: { auth: 'success' },
              funnel: [],
              requested_ip: '192.168.1.1',
              createdAt: monthDate,
              updatedAt: monthDate,
              cron_process: 'done',
              customer: {
                billing_address: {
                  street1: '123 Main St',
                  city: 'New York',
                  state: 'NY',
                  state_code: 'NY',
                  zip_code: '10001',
                  country: 'US'
                },
                shipping_address: {
                  street1: '',
                  city: '',
                  state: '',
                  state_code: '',
                  zip_code: '',
                  country: ''
                },
                other_detail: {},
                role: '',
                credit: { remaining: 0 },
                api: '',
                portal_status: true,
                set_password: {
                  invite: 'sent',
                  forget_password_key: ''
                },
                pcustomer_id: customerId,
                phone: '+1234567890',
                tax_id: '',
                createdAt: monthDate,
                updatedAt: monthDate,
                id: customerId,
                user_id: '5bebb8afef788b4507f7ce75',
                first_name: `User${i}`,
                last_name: 'Test',
                user_name: `user${i}@example.com`,
                email_id: `user${i}@example.com`
              },
              plan: {
                plan_type: 'recurring',
                min_quantity: 1,
                max_quantity: 1000000,
                plan_active: 'true',
                redirect_url: 'https://example.com/thank-you',
                specific_keep_live: false,
                meta_data: { features: 'basic' },
                currency_code: 'USD',
                currency_symbol: '$',
                gateways_array: ['stripe_gateway'],
                payment_gateway: 'selected',
                failed_payment_gateway_array: ['stripe_gateway'],
                failed_payment_gateway: 'selected',
                trial_type: 'day',
                trial_amount: 0,
                funnel_count: '',
                funnel: [],
                custom_payment_term: 0,
                is_metered: false,
                setup_fee_type: '',
                createdAt: monthDate,
                updatedAt: monthDate,
                id: planId,
                product_id: productId,
                user_id: '5bebb8afef788b4507f7ce75',
                plan_name: `Plan ${planId.slice(-4)}`,
                plan_code: `plan-${planId.slice(-4)}`,
                price: amount,
                billing_period: 'm',
                billing_period_num: '1',
                billing_cycle: 'monthly',
                billing_cycle_num: '1',
                trial_period: 0,
                setup_fee: 0,
                plan_description: 'Test plan description'
              }
            };
            
            // Create transaction if invoice is paid
            if (status === 'paid') {
              const transaction = {
                _id: transactionId,
                user_id: '5bebb8afef788b4507f7ce75',
                customer_id: customerId,
                subscription_id: subscriptionId,
                invoice_id: invoiceId,
                plan_id: planId,
                product_id: productId,
                type: 'payment',
                type_formated: 'Payment',
                status: 'success',
                status_formatted: 'Success',
                amount: amount,
                payment_note: 'Payment received by Stripe gateway',
                payment_mode: 'stripe',
                reference_id: `ref_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
                description: 'Payment success',
                pcustomer_id: customerId,
                transaction: {
                  account_id: 'acc_test',
                  contains: ['payment', 'order'],
                  created_at: Math.floor(monthDate.getTime() / 1000),
                  entity: 'event',
                  event: 'order.paid',
                  payload: {
                    order: {
                      entity: {
                        amount: amount * 100,
                        amount_due: 0,
                        amount_paid: amount * 100,
                        attempts: 1,
                        created_at: Math.floor(monthDate.getTime() / 1000),
                        currency: 'USD',
                        entity: 'order',
                        id: `order_${Date.now()}`,
                        status: 'paid'
                      }
                    }
                  }
                },
                gateway_type: 'stripe',
                gateway_id: 'stripe_gateway',
                currency_symbol: '$',
                currency_code: 'USD',
                refunded: {
                  amount: 0,
                  currency: 'USD'
                },
                createdAt: monthDate,
                updatedAt: monthDate,
                failed_data: '',
                invoice: {
                  quantity: 1,
                  product_id: productId,
                  setup_fee: 0,
                  currency_symbol: '$',
                  currency_code: 'USD',
                  pcustomer_id: customerId,
                  credit_note: {
                    total_tax: '0',
                    status: 'success',
                    new_plan_total: amount,
                    total_credit_amount: 0,
                    charge_amount: amount,
                    credit_applied: []
                  },
                  tax_apply: {
                    id: '63c285ae4db07e29219b4e66',
                    country: 'US',
                    taxes: { tax: 0 },
                    record_tax_id: false,
                    state: 'all',
                    validate_tax_in: false,
                    tax_id: '',
                    exempt_tax: [],
                    total_amount: amount,
                    total_amount_before_tax: amount,
                    total_tax: 0
                  },
                  order_number: `ORD-${Date.now()}`,
                  expiry_date: new Date(monthDate.getTime() + 30 * 24 * 60 * 60 * 1000),
                  cron_process: 'done',
                  current_tracking_id: '',
                  paid_date: monthDate,
                  retry: false,
                  retry_count: 0,
                  createdAt: monthDate,
                  updatedAt: monthDate,
                  id: invoiceId,
                  customer_id: customerId,
                  user_id: '5bebb8afef788b4507f7ce75',
                  subscription_id: subscriptionId,
                  status: 'paid',
                  invoice_id: `INV-${Date.now()}`,
                  payment_term: '',
                  amount: amount,
                  due_amount: 0,
                  due_date: monthDate,
                  plan_id: [planId],
                  subscription: subscription,
                  product: {
                    createdAt: monthDate,
                    updatedAt: monthDate,
                    id: productId,
                    product_name: `Product ${productId.slice(-4)}`
                  },
                  invoice_link: `https://example.com/invoice/${invoiceId}`
                },
                subscription: subscription,
                user: {
                  project: [],
                  currency: 'USD',
                  process: 'done',
                  lockout_count: 0,
                  status: 'active',
                  address: '',
                  phone_code: '+1',
                  website_url: '',
                  createdAt: monthDate,
                  updatedAt: monthDate,
                  id: '5bebb8afef788b4507f7ce75',
                  parent: '5a1cfb08e5866110121ebbf5',
                  first_name: 'Test',
                  last_name: 'User',
                  email: 'admin@example.com',
                  address_line1: '',
                  address_line2: '',
                  city: 'New York',
                  state: 'NY',
                  country: 'United States',
                  zip_code: '10001',
                  phone: '+1234567890',
                  mobile: '',
                  facebook_url: '',
                  twitter_url: '',
                  time_zone: 'America/New_York',
                  date_format: 'MMM DD, YYYY hh:mm A',
                  ip_address: '192.168.1.1',
                  currency_symbol: '$'
                }
              };
              
              generatedData.transactions.push(transaction);
            }
            
            generatedData.invoices.push(invoice);
            generatedData.subscriptions.push(subscription);
          }
        }
      }
    }
    
    // Insert data into database
    const results = {
      invoices: 0,
      subscriptions: 0,
      transactions: 0
    };
    
    if (generatedData.invoices.length > 0) {
      await Invoice.insertMany(generatedData.invoices);
      results.invoices = generatedData.invoices.length;
    }
    
    if (generatedData.subscriptions.length > 0) {
      await Subscription.insertMany(generatedData.subscriptions);
      results.subscriptions = generatedData.subscriptions.length;
    }
    
    if (generatedData.transactions.length > 0) {
      await Transaction.insertMany(generatedData.transactions);
      results.transactions = generatedData.transactions.length;
    }
    
    return {
      message: 'Dummy data generated successfully',
      totalRecords: results.invoices + results.subscriptions + results.transactions,
      breakdown: results,
      generatedAt: new Date()
    };
  } catch (error) {
    console.error('Error generating dummy data:', error);
    throw new Error('Failed to generate dummy data');
  }
};
