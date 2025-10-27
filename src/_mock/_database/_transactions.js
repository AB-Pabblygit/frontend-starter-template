import dayjs from 'dayjs';

// Helper functions
const getRandomElement = (array) => array[Math.floor(Math.random() * array.length)];
const getRandomNumber = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const getRandomFloat = (min, max, decimals = 2) => parseFloat((Math.random() * (max - min) + min).toFixed(decimals));

// Transaction types and categories
const transactionTypes = ['subscription', 'one-time', 'upgrade', 'downgrade', 'refund', 'credit'];
const paymentMethods = ['credit_card', 'paypal', 'bank_transfer', 'stripe', 'apple_pay', 'google_pay'];
const currencies = ['USD', 'EUR', 'GBP', 'CAD', 'AUD'];
const statuses = ['completed', 'pending', 'failed', 'cancelled', 'refunded'];

// Product categories for transactions
const productCategories = [
  'Software License', 'API Access', 'Premium Features', 'Storage Upgrade', 'Support Package',
  'Integration Tools', 'Analytics Dashboard', 'Custom Development', 'Training Session', 'Consulting'
];

// Generate transactions for the last 6 months
const generateTransactions = (users) => {
  const transactions = [];
  const currentDate = dayjs();
  
  // Generate transactions for each of the last 6 months
  for (let monthOffset = 5; monthOffset >= 0; monthOffset -= 1) {
    const monthDate = currentDate.subtract(monthOffset, 'month');
    const daysInMonth = monthDate.daysInMonth();
    
    // Generate 200-500 transactions per month
    const transactionsInMonth = getRandomNumber(200, 500);
    
    for (let i = 0; i < transactionsInMonth; i += 1) {
      // Get a random user from the users array
      const user = getRandomElement(users);
      const transactionType = getRandomElement(transactionTypes);
      const paymentMethod = getRandomElement(paymentMethods);
      const currency = getRandomElement(currencies);
      const status = getRandomElement(statuses);
      const category = getRandomElement(productCategories);
      
      // Generate transaction date within the month
      const randomDay = getRandomNumber(1, daysInMonth);
      const randomHour = getRandomNumber(0, 23);
      const randomMinute = getRandomNumber(0, 59);
      const transactionDate = monthDate.date(randomDay).hour(randomHour).minute(randomMinute);
      
      // Generate transaction amount based on type
      let amount;
      switch (transactionType) {
        case 'subscription':
          amount = getRandomFloat(29.99, 299.99);
          break;
        case 'one-time':
          amount = getRandomFloat(9.99, 999.99);
          break;
        case 'upgrade':
          amount = getRandomFloat(50.00, 200.00);
          break;
        case 'downgrade':
          amount = getRandomFloat(-100.00, -20.00);
          break;
        case 'refund':
          amount = getRandomFloat(-500.00, -10.00);
          break;
        case 'credit':
          amount = getRandomFloat(10.00, 100.00);
          break;
        default:
          amount = getRandomFloat(10.00, 500.00);
      }
      
      // Generate transaction ID
      const transactionId = `txn_${transactionDate.format('YYYYMMDD')}_${String(i + 1).padStart(4, '0')}`;
      
      // Generate description based on transaction type
      const descriptions = {
        subscription: `Monthly ${user.subscription.plan} subscription`,
        'one-time': `One-time purchase: ${category}`,
        upgrade: `Upgrade to ${getRandomElement(['Pro', 'Enterprise', 'Premium'])} plan`,
        downgrade: `Downgrade to ${getRandomElement(['Basic', 'Standard'])} plan`,
        refund: `Refund for transaction #${getRandomNumber(1000, 9999)}`,
        credit: `Account credit applied`
      };
      
      const description = descriptions[transactionType] || `Transaction for ${category}`;
      
      // Generate invoice number
      const invoiceNumber = `INV-${transactionDate.format('YYYYMMDD')}-${String(i + 1).padStart(3, '0')}`;
      
      // Generate payment reference
      const paymentReference = `${paymentMethod.toUpperCase()}-${getRandomNumber(100000, 999999)}`;
      
      const transaction = {
        id: transactionId,
        userId: user.id,
        userEmail: user.email,
        userName: `${user.firstName} ${user.lastName}`,
        type: transactionType,
        category,
        amount,
        currency,
        status,
        paymentMethod,
        paymentReference,
        description,
        invoiceNumber,
        transactionDate: transactionDate.format('YYYY-MM-DD HH:mm:ss'),
        processedDate: status === 'completed' ? 
          transactionDate.add(getRandomNumber(0, 2), 'hour').format('YYYY-MM-DD HH:mm:ss') : null,
        fees: getRandomFloat(0.50, 15.00),
        tax: getRandomFloat(0.00, amount * 0.1),
        netAmount: amount - getRandomFloat(0.50, 15.00) - getRandomFloat(0.00, amount * 0.1),
        metadata: {
          userAgent: getRandomElement([
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
            'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36'
          ]),
          ipAddress: `${getRandomNumber(1, 255)}.${getRandomNumber(1, 255)}.${getRandomNumber(1, 255)}.${getRandomNumber(1, 255)}`,
          country: user.address.country,
          city: user.address.city
        }
      };
      
      transactions.push(transaction);
    }
  }
  
  return transactions.sort((a, b) => new Date(a.transactionDate) - new Date(b.transactionDate));
};

// Generate transactions (this will be called after users are generated)
export const generateTransactionsData = (users) => generateTransactions(users);

// Transaction statistics
export const getTransactionStats = (transactions) => {
  const totalTransactions = transactions.length;
  const completedTransactions = transactions.filter(t => t.status === 'completed');
  const totalRevenue = completedTransactions.reduce((sum, t) => sum + t.amount, 0);
  const averageTransactionValue = totalRevenue / completedTransactions.length;
  
  const revenueByType = transactions.reduce((acc, t) => {
    if (t.status === 'completed') {
      acc[t.type] = (acc[t.type] || 0) + t.amount;
    }
    return acc;
  }, {});
  
  const revenueByPaymentMethod = transactions.reduce((acc, t) => {
    if (t.status === 'completed') {
      acc[t.paymentMethod] = (acc[t.paymentMethod] || 0) + t.amount;
    }
    return acc;
  }, {});
  
  const transactionsByStatus = transactions.reduce((acc, t) => {
    acc[t.status] = (acc[t.status] || 0) + 1;
    return acc;
  }, {});
  
  return {
    totalTransactions,
    completedTransactions: completedTransactions.length,
    totalRevenue,
    averageTransactionValue,
    revenueByType,
    revenueByPaymentMethod,
    transactionsByStatus
  };
};

// Get monthly transaction statistics
export const getMonthlyTransactionStats = (transactions) => {
  const monthlyStats = {};
  const currentDate = dayjs();
  
  for (let monthOffset = 5; monthOffset >= 0; monthOffset -= 1) {
    const monthDate = currentDate.subtract(monthOffset, 'month');
    const monthKey = monthDate.format('YYYY-MM');
    
    const monthTransactions = transactions.filter(transaction => {
      const transactionDate = dayjs(transaction.transactionDate);
      return transactionDate.format('YYYY-MM') === monthKey;
    });
    
    const completedTransactions = monthTransactions.filter(t => t.status === 'completed');
    const totalRevenue = completedTransactions.reduce((sum, t) => sum + t.amount, 0);
    
    monthlyStats[monthKey] = {
      month: monthDate.format('MMMM YYYY'),
      totalTransactions: monthTransactions.length,
      completedTransactions: completedTransactions.length,
      totalRevenue,
      averageTransactionValue: completedTransactions.length > 0 ? 
        totalRevenue / completedTransactions.length : 0,
      revenueByType: monthTransactions.reduce((acc, t) => {
        if (t.status === 'completed') {
          acc[t.type] = (acc[t.type] || 0) + t.amount;
        }
        return acc;
      }, {})
    };
  }
  
  return monthlyStats;
};

// Get transactions by date range
export const getTransactionsByDateRange = (transactions, startDate, endDate) => transactions.filter(transaction => {
    const transactionDate = dayjs(transaction.transactionDate);
    return transactionDate.isAfter(startDate) && transactionDate.isBefore(endDate);
  });

// Get transactions by user
export const getTransactionsByUser = (transactions, userId) => transactions.filter(transaction => transaction.userId === userId);

// Get top customers by revenue
export const getTopCustomers = (transactions, limit = 10) => {
  const customerRevenue = transactions.reduce((acc, transaction) => {
    if (transaction.status === 'completed') {
      acc[transaction.userId] = {
        userId: transaction.userId,
        userName: transaction.userName,
        userEmail: transaction.userEmail,
        totalRevenue: (acc[transaction.userId]?.totalRevenue || 0) + transaction.amount,
        transactionCount: (acc[transaction.userId]?.transactionCount || 0) + 1
      };
    }
    return acc;
  }, {});
  
  return Object.values(customerRevenue)
    .sort((a, b) => b.totalRevenue - a.totalRevenue)
    .slice(0, limit);
};
