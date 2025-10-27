import dayjs from 'dayjs';

// Enhanced user database with 4 products and 4 plans
const PRODUCTS = [
  'Pabbly Email Marketing',
  'Pabbly Subscription Billing', 
  'Pabbly Form Builder',
  'Pabbly Connect'
];

const PLANS = ['Basic', 'Pro', 'Premium', 'Enterprise'];

const PLAN_PRICING = {
  'Basic': { min: 29, max: 49 },
  'Pro': { min: 79, max: 149 },
  'Premium': { min: 199, max: 399 },
  'Enterprise': { min: 499, max: 999 }
};

const COUNTRIES = [
  'United States', 'United Kingdom', 'Canada', 'Australia', 
  'Germany', 'France', 'India', 'Netherlands', 'Singapore', 'Japan'
];

const FIRST_NAMES = [
  'John', 'Sarah', 'Michael', 'Emily', 'David', 'Jessica', 'Robert', 'Ashley',
  'James', 'Amanda', 'Christopher', 'Jennifer', 'Daniel', 'Lisa', 'Matthew',
  'Nancy', 'Anthony', 'Karen', 'Mark', 'Betty', 'Donald', 'Helen', 'Steven',
  'Sandra', 'Paul', 'Donna', 'Andrew', 'Carol', 'Joshua', 'Ruth', 'Kenneth',
  'Sharon', 'Kevin', 'Michelle', 'Brian', 'Laura', 'George', 'Sarah', 'Edward'
];

const LAST_NAMES = [
  'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis',
  'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson',
  'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin', 'Lee', 'Perez', 'Thompson',
  'White', 'Harris', 'Sanchez', 'Clark', 'Ramirez', 'Lewis', 'Robinson', 'Walker',
  'Young', 'Allen', 'King', 'Wright', 'Scott', 'Torres', 'Nguyen', 'Hill'
];

// Helper functions
const getRandomNumber = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const getRandomElement = (array) => array[Math.floor(Math.random() * array.length)];
const getRandomFloat = (min, max) => Math.random() * (max - min) + min;

// Generate realistic user data
const generateUsers = () => {
  const users = [];
  const currentDate = dayjs();
  
  // Generate users for each of the last 6 months
  for (let monthOffset = 5; monthOffset >= 0; monthOffset -= 1) {
    const monthDate = currentDate.subtract(monthOffset, 'month');
    const usersInMonth = getRandomNumber(50, 100);
    
    for (let i = 0; i < usersInMonth; i += 1) {
      const product = getRandomElement(PRODUCTS);
      const plan = getRandomElement(PLANS);
      const pricing = PLAN_PRICING[plan];
      const monthlyFee = getRandomFloat(pricing.min, pricing.max);
      
      // Generate realistic signup date within the month
      const daysInMonth = monthDate.daysInMonth();
      const signupDay = getRandomNumber(1, daysInMonth);
      const signupDate = monthDate.date(signupDay);
      
      // Generate status with realistic distribution
      const statusRand = Math.random();
      let status = 'active';
      let cancelDate = null;
      let refundAmount = 0;
      
      if (statusRand < 0.05) {
        status = 'trial';
      } else if (statusRand < 0.08) {
        status = 'cancelled';
        const cancelDay = getRandomNumber(signupDay + 1, daysInMonth);
        cancelDate = monthDate.date(cancelDay);
      } else if (statusRand < 0.10) {
        status = 'refunded';
        refundAmount = monthlyFee * getRandomFloat(0.5, 1.0);
      }
      
      // Calculate renewals (months active)
      const renewals = status === 'active' ? getRandomNumber(1, 6) : 
                      status === 'cancelled' ? getRandomNumber(1, 3) : 0;
      
      // Generate acquisition cost based on plan
      const baseCAC = monthlyFee * getRandomFloat(0.8, 2.5);
      const acquisitionCost = Math.round(baseCAC);
      
      // Generate user details
      const firstName = getRandomElement(FIRST_NAMES);
      const lastName = getRandomElement(LAST_NAMES);
      const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${getRandomNumber(1, 999)}@example.com`;
      
      const user = {
        id: `user_${monthDate.format('YYYYMM')}_${i + 1}`,
        firstName,
        lastName,
        email,
        phone: `+1-${getRandomNumber(200, 999)}-${getRandomNumber(100, 999)}-${getRandomNumber(1000, 9999)}`,
        product,
        plan,
        monthlyFee: Math.round(monthlyFee),
        signupDate: signupDate.format('YYYY-MM-DD'),
        status,
        cancelDate: cancelDate ? cancelDate.format('YYYY-MM-DD') : null,
        renewals,
        acquisitionCost,
        refundAmount: Math.round(refundAmount),
        address: {
          street: `${getRandomNumber(100, 9999)} ${getRandomElement(['Main', 'Oak', 'Pine', 'Cedar', 'Elm'])} St`,
          city: getRandomElement(['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 'Philadelphia', 'San Antonio', 'San Diego', 'Dallas', 'San Jose']),
          state: getRandomElement(['CA', 'NY', 'TX', 'FL', 'IL', 'PA', 'OH', 'GA', 'NC', 'MI']),
          country: getRandomElement(COUNTRIES),
          zipCode: getRandomNumber(10000, 99999).toString()
        },
        lastLoginDate: status === 'active' ? 
          dayjs().subtract(getRandomNumber(0, 7), 'day').format('YYYY-MM-DD') :
          dayjs().subtract(getRandomNumber(8, 30), 'day').format('YYYY-MM-DD'),
        registrationDate: signupDate.format('YYYY-MM-DD'),
        subscription: {
          plan,
          monthlyRevenue: Math.round(monthlyFee),
          totalRevenue: Math.round(monthlyFee * renewals),
          status: status === 'active' ? 'active' : 'inactive'
        }
      };
      
      users.push(user);
    }
  }
  
  return users;
};

// Generate monthly statistics
const generateMonthlyStats = (users) => {
  const stats = {};
  const currentDate = dayjs();
  
  for (let monthOffset = 5; monthOffset >= 0; monthOffset -= 1) {
    const monthDate = currentDate.subtract(monthOffset, 'month');
    const monthKey = monthDate.format('YYYY-MM');
    const monthName = monthDate.format('MMMM YYYY');
    
    const monthUsers = users.filter(user => 
      dayjs(user.signupDate).format('YYYY-MM') === monthKey
    );
    
    const activeUsers = monthUsers.filter(user => user.status === 'active');
    const cancelledUsers = monthUsers.filter(user => user.status === 'cancelled');
    const trialUsers = monthUsers.filter(user => user.status === 'trial');
    const refundedUsers = monthUsers.filter(user => user.status === 'refunded');
    
    const totalRevenue = monthUsers.reduce((sum, user) => sum + user.subscription.totalRevenue, 0);
    const monthlyMRR = activeUsers.reduce((sum, user) => sum + user.monthlyFee, 0);
    const totalRefunds = refundedUsers.reduce((sum, user) => sum + user.refundAmount, 0);
    const totalAcquisitionCost = monthUsers.reduce((sum, user) => sum + user.acquisitionCost, 0);
    
    // Calculate churn rate
    const previousMonth = monthDate.subtract(1, 'month').format('YYYY-MM');
    const previousMonthUsers = users.filter(user => 
      dayjs(user.signupDate).format('YYYY-MM') === previousMonth && user.status === 'active'
    );
    const churnRate = previousMonthUsers.length > 0 ? 
      (cancelledUsers.length / previousMonthUsers.length) * 100 : 0;
    
    stats[monthKey] = {
      month: monthKey,
      monthName,
      totalUsers: monthUsers.length,
      activeUsers: activeUsers.length,
      cancelledUsers: cancelledUsers.length,
      trialUsers: trialUsers.length,
      refundedUsers: refundedUsers.length,
      totalRevenue,
      monthlyMRR,
      totalRefunds,
      totalAcquisitionCost,
      churnRate,
      averageRevenuePerUser: activeUsers.length > 0 ? monthlyMRR / activeUsers.length : 0,
      averageAcquisitionCost: monthUsers.length > 0 ? totalAcquisitionCost / monthUsers.length : 0
    };
  }
  
  return stats;
};

// Generate the enhanced dataset
export const ENHANCED_USERS = generateUsers();
export const ENHANCED_MONTHLY_STATS = generateMonthlyStats(ENHANCED_USERS);

// Export helper functions
export const getUsersByProduct = (product) => 
  ENHANCED_USERS.filter(user => user.product === product);

export const getUsersByPlan = (plan) => 
  ENHANCED_USERS.filter(user => user.plan === plan);

export const getUsersByDateRange = (startDate, endDate) => 
  ENHANCED_USERS.filter(user => {
    const userDate = dayjs(user.signupDate);
    return userDate.isAfter(startDate) && userDate.isBefore(endDate);
  });

export const getUsersByProductAndPlan = (product, plan) => 
  ENHANCED_USERS.filter(user => user.product === product && user.plan === plan);

export const getActiveUsers = () => 
  ENHANCED_USERS.filter(user => user.status === 'active');

export const getCancelledUsers = () => 
  ENHANCED_USERS.filter(user => user.status === 'cancelled');

export const getTrialUsers = () => 
  ENHANCED_USERS.filter(user => user.status === 'trial');

export const getRefundedUsers = () => 
  ENHANCED_USERS.filter(user => user.status === 'refunded');
