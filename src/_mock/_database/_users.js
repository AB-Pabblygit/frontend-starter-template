import dayjs from 'dayjs';

// Helper function to generate random data
const getRandomElement = (array) => array[Math.floor(Math.random() * array.length)];
const getRandomNumber = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const getRandomFloat = (min, max, decimals = 2) => parseFloat((Math.random() * (max - min) + min).toFixed(decimals));

// Sample data arrays
const firstNames = [
  'John', 'Jane', 'Michael', 'Sarah', 'David', 'Emily', 'Robert', 'Jessica', 'William', 'Ashley',
  'James', 'Amanda', 'Christopher', 'Jennifer', 'Daniel', 'Lisa', 'Matthew', 'Nancy', 'Anthony', 'Karen',
  'Mark', 'Helen', 'Donald', 'Sandra', 'Steven', 'Donna', 'Paul', 'Carol', 'Andrew', 'Ruth',
  'Joshua', 'Sharon', 'Kenneth', 'Michelle', 'Kevin', 'Laura', 'Brian', 'Sarah', 'George', 'Kimberly',
  'Edward', 'Deborah', 'Ronald', 'Dorothy', 'Timothy', 'Lisa', 'Jason', 'Nancy', 'Jeffrey', 'Karen'
];

const lastNames = [
  'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez',
  'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin',
  'Lee', 'Perez', 'Thompson', 'White', 'Harris', 'Sanchez', 'Clark', 'Ramirez', 'Lewis', 'Robinson',
  'Walker', 'Young', 'Allen', 'King', 'Wright', 'Scott', 'Torres', 'Nguyen', 'Hill', 'Flores',
  'Green', 'Adams', 'Nelson', 'Baker', 'Hall', 'Rivera', 'Campbell', 'Mitchell', 'Carter', 'Roberts'
];

const companies = [
  'TechCorp Solutions', 'Digital Innovations', 'Cloud Systems Inc', 'DataFlow Technologies', 'NextGen Software',
  'CyberTech Labs', 'Innovation Hub', 'Smart Solutions', 'Future Systems', 'Advanced Computing',
  'TechVision Corp', 'Digital Dynamics', 'CloudBridge Inc', 'DataStream Technologies', 'NextWave Software',
  'CyberCore Labs', 'Innovation Station', 'SmartBridge Solutions', 'FutureTech Systems', 'Advanced Analytics',
  'TechFlow Corp', 'Digital Core', 'CloudStream Inc', 'DataVision Technologies', 'NextCloud Software',
  'CyberFlow Labs', 'Innovation Core', 'SmartStream Solutions', 'FutureFlow Systems', 'Advanced Stream'
];

const cities = [
  'New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 'Philadelphia', 'San Antonio', 'San Diego',
  'Dallas', 'San Jose', 'Austin', 'Jacksonville', 'Fort Worth', 'Columbus', 'Charlotte', 'San Francisco',
  'Indianapolis', 'Seattle', 'Denver', 'Washington', 'Boston', 'El Paso', 'Nashville', 'Detroit',
  'Oklahoma City', 'Portland', 'Las Vegas', 'Memphis', 'Louisville', 'Baltimore', 'Milwaukee', 'Albuquerque'
];

const states = [
  'NY', 'CA', 'IL', 'TX', 'AZ', 'PA', 'TX', 'CA', 'TX', 'CA', 'TX', 'FL', 'TX', 'OH', 'NC', 'CA',
  'IN', 'WA', 'CO', 'DC', 'MA', 'TX', 'TN', 'MI', 'OK', 'OR', 'NV', 'TN', 'KY', 'MD', 'WI', 'NM'
];

const countries = ['United States', 'Canada', 'United Kingdom', 'Australia', 'Germany', 'France', 'Japan', 'India'];

const userRoles = ['Admin', 'Manager', 'Developer', 'Analyst', 'Designer', 'Support', 'Sales', 'Marketing'];

const subscriptionPlans = ['Basic', 'Pro', 'Enterprise', 'Premium'];

// Generate users for the last 6 months
const generateUsers = () => {
  const users = [];
  const currentDate = dayjs();
  
  // Generate users for each of the last 6 months
  for (let monthOffset = 5; monthOffset >= 0; monthOffset -= 1) {
    const monthDate = currentDate.subtract(monthOffset, 'month');
    const usersInMonth = getRandomNumber(50, 100);
    
    for (let i = 0; i < usersInMonth; i += 1) {
      const firstName = getRandomElement(firstNames);
      const lastName = getRandomElement(lastNames);
      const company = getRandomElement(companies);
      const city = getRandomElement(cities);
      const state = getRandomElement(states);
      const country = getRandomElement(countries);
      const role = getRandomElement(userRoles);
      const plan = getRandomElement(subscriptionPlans);
      
      // Generate registration date within the month
      const daysInMonth = monthDate.daysInMonth();
      const randomDay = getRandomNumber(1, daysInMonth);
      const registrationDate = monthDate.date(randomDay);
      
      // Generate user ID
      const userId = `user_${monthDate.format('YYYYMM')}_${String(i + 1).padStart(3, '0')}`;
      
      // Generate email
      const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}@${company.toLowerCase().replace(/\s+/g, '')}.com`;
      
      // Generate phone number
      const phone = `+1-${getRandomNumber(200, 999)}-${getRandomNumber(100, 999)}-${getRandomNumber(1000, 9999)}`;
      
      // Generate address
      const streetNumber = getRandomNumber(100, 9999);
      const streetName = getRandomElement(['Main St', 'Oak Ave', 'Pine Rd', 'Elm St', 'Maple Dr', 'Cedar Ln', 'Birch Way', 'Spruce St']);
      const address = `${streetNumber} ${streetName}`;
      
      // Generate user status (90% active, 10% inactive)
      const status = Math.random() < 0.9 ? 'active' : 'inactive';
      
      // Generate subscription details
      const monthlyRevenue = getRandomFloat(29.99, 299.99);
      const totalTransactions = getRandomNumber(1, 50);
      const totalRevenue = monthlyRevenue * getRandomNumber(1, 6); // 1-6 months of revenue
      
      const user = {
        id: userId,
        firstName,
        lastName,
        email,
        phone,
        company,
        role,
        address: {
          street: address,
          city,
          state,
          country,
          zipCode: getRandomNumber(10000, 99999).toString()
        },
        subscription: {
          plan,
          status,
          monthlyRevenue,
          totalRevenue,
          totalTransactions,
          startDate: registrationDate.format('YYYY-MM-DD'),
          lastPaymentDate: registrationDate.add(getRandomNumber(0, 30), 'day').format('YYYY-MM-DD')
        },
        registrationDate: registrationDate.format('YYYY-MM-DD'),
        lastLoginDate: registrationDate.add(getRandomNumber(0, 30), 'day').format('YYYY-MM-DD'),
        status,
        avatar: `https://ui-avatars.com/api/?name=${firstName}+${lastName}&background=random`,
        preferences: {
          notifications: Math.random() < 0.8,
          newsletter: Math.random() < 0.6,
          theme: getRandomElement(['light', 'dark', 'auto'])
        }
      };
      
      users.push(user);
    }
  }
  
  return users.sort((a, b) => new Date(a.registrationDate) - new Date(b.registrationDate));
};

export const USERS = generateUsers();

// Export user statistics
export const USER_STATS = {
  totalUsers: USERS.length,
  activeUsers: USERS.filter(user => user.status === 'active').length,
  inactiveUsers: USERS.filter(user => user.status === 'inactive').length,
  totalRevenue: USERS.reduce((sum, user) => sum + user.subscription.totalRevenue, 0),
  averageRevenue: USERS.reduce((sum, user) => sum + user.subscription.monthlyRevenue, 0) / USERS.length,
  usersByPlan: USERS.reduce((acc, user) => {
    acc[user.subscription.plan] = (acc[user.subscription.plan] || 0) + 1;
    return acc;
  }, {}),
  usersByCountry: USERS.reduce((acc, user) => {
    acc[user.address.country] = (acc[user.address.country] || 0) + 1;
    return acc;
  }, {})
};

// Date validation helper
export const validateDateRange = (startDate, endDate) => {
  const today = dayjs();
  const start = dayjs(startDate);
  const end = dayjs(endDate);
  
  if (start.isAfter(today) || end.isAfter(today)) {
    throw new Error('Cannot select future dates');
  }
  
  if (start.isAfter(end)) {
    throw new Error('Start date cannot be after end date');
  }
  
  return true;
};

// Get users by date range
export const getUsersByDateRange = (startDate, endDate) => {
  validateDateRange(startDate, endDate);
  
  return USERS.filter(user => {
    const userDate = dayjs(user.registrationDate);
    return userDate.isAfter(startDate) && userDate.isBefore(endDate);
  });
};

// Get monthly user statistics
export const getMonthlyUserStats = () => {
  const monthlyStats = {};
  const currentDate = dayjs();
  
  for (let monthOffset = 5; monthOffset >= 0; monthOffset -= 1) {
    const monthDate = currentDate.subtract(monthOffset, 'month');
    const monthKey = monthDate.format('YYYY-MM');
    
    const monthUsers = USERS.filter(user => {
      const userDate = dayjs(user.registrationDate);
      return userDate.format('YYYY-MM') === monthKey;
    });
    
    monthlyStats[monthKey] = {
      month: monthDate.format('MMMM YYYY'),
      totalUsers: monthUsers.length,
      activeUsers: monthUsers.filter(user => user.status === 'active').length,
      totalRevenue: monthUsers.reduce((sum, user) => sum + user.subscription.totalRevenue, 0),
      averageRevenue: monthUsers.length > 0 ? 
        monthUsers.reduce((sum, user) => sum + user.subscription.monthlyRevenue, 0) / monthUsers.length : 0
    };
  }
  
  return monthlyStats;
};
