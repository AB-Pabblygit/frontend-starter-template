# Frontend-Backend Integration Guide

This guide shows how to integrate the analytics backend with your existing frontend analytics dashboard.

## 🔗 API Integration

### 1. Update Frontend API Calls

Replace your current mock data imports with actual API calls:

```javascript
// src/services/analyticsApi.js
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api/analytics';

export const analyticsApi = {
  // Get comprehensive analytics summary
  getSummary: async (filters = {}) => {
    const params = new URLSearchParams(filters);
    const response = await fetch(`${API_BASE_URL}/summary?${params}`);
    return response.json();
  },

  // Get MRR trend
  getMRR: async (filters = {}) => {
    const params = new URLSearchParams(filters);
    const response = await fetch(`${API_BASE_URL}/mrr?${params}`);
    return response.json();
  },

  // Get churn analysis
  getChurn: async (filters = {}) => {
    const params = new URLSearchParams(filters);
    const response = await fetch(`${API_BASE_URL}/churn?${params}`);
    return response.json();
  },

  // Get plan breakdown
  getPlans: async (filters = {}) => {
    const params = new URLSearchParams(filters);
    const response = await fetch(`${API_BASE_URL}/plans?${params}`);
    return response.json();
  },

  // Get product breakdown
  getProducts: async (filters = {}) => {
    const params = new URLSearchParams(filters);
    const response = await fetch(`${API_BASE_URL}/products?${params}`);
    return response.json();
  },

  // Get customer metrics
  getCustomers: async (filters = {}) => {
    const params = new URLSearchParams(filters);
    const response = await fetch(`${API_BASE_URL}/customers?${params}`);
    return response.json();
  },

  // Generate dummy data (development only)
  generateDummyData: async (months = 6, usersPerPlan = 50) => {
    const response = await fetch(`${API_BASE_URL}/simulate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ months, usersPerPlan }),
    });
    return response.json();
  }
};
```

### 2. Update Analytics Page Component

```javascript
// src/pages/app/analytics.jsx
import { useState, useEffect } from 'react';
import { analyticsApi } from 'src/services/analyticsApi';

export default function AnalyticsPage() {
  const [selectedMonth, setSelectedMonth] = useState('2024-10');
  const [selectedProduct, setSelectedProduct] = useState('All Products');
  const [selectedPlan, setSelectedPlan] = useState('All Plans');
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Handle filter changes
  useEffect(() => {
    const fetchAnalytics = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const filters = {
          startDate: `${selectedMonth}-01`,
          endDate: `${selectedMonth}-31`,
          ...(selectedProduct !== 'All Products' && { productId: selectedProduct }),
          ...(selectedPlan !== 'All Plans' && { planId: selectedPlan }),
        };

        const [summary, mrr, churn, plans, products, customers] = await Promise.all([
          analyticsApi.getSummary(filters),
          analyticsApi.getMRR(filters),
          analyticsApi.getChurn(filters),
          analyticsApi.getPlans(filters),
          analyticsApi.getProducts(filters),
          analyticsApi.getCustomers(filters),
        ]);

        setAnalyticsData({
          summary: summary.data,
          mrr: mrr.data,
          churn: churn.data,
          plans: plans.data,
          products: products.data,
          customers: customers.data,
        });
      } catch (err) {
        setError(err.message);
        console.error('Analytics fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [selectedProduct, selectedPlan, selectedMonth]);

  // Rest of your component...
}
```

### 3. Update Stats Cards Component

```javascript
// src/pages/app/components/analytics-stats-cards.jsx
export function AnalyticsStatsCards({ analyticsData, loading }) {
  const theme = useTheme();

  if (loading) {
    return <LoadingScreen />;
  }

  if (!analyticsData?.summary) {
    return <EmptyContent />;
  }

  const { summary } = analyticsData;

  const statsData = [
    {
      title: 'Previous Month MRR',
      value: `$${summary.previousMRR?.toLocaleString('en-US', { 
        minimumFractionDigits: 2, 
        maximumFractionDigits: 2 
      }) || '0'}`,
      color: '#1d4ed8',
    },
    {
      title: 'Active Customers MRR',
      value: `$${summary.totalMRR?.toLocaleString('en-US', { 
        minimumFractionDigits: 2, 
        maximumFractionDigits: 2 
      }) || '0'}`,
      color: '#1d4ed8',
    },
    {
      title: 'Cancelled Customers MRR',
      value: `$${(summary.totalMRR - summary.previousMRR)?.toLocaleString('en-US', { 
        minimumFractionDigits: 2, 
        maximumFractionDigits: 2 
      }) || '0'}`,
      color: '#1d4ed8',
    },
    {
      title: 'Revenue Churn %',
      value: `${summary.revenueChurn?.toFixed(1) || '0'}%`,
      color: '#1d4ed8',
    },
    {
      title: 'Active Customers',
      value: summary.activeCustomers?.toString() || '0',
      color: '#1d4ed8',
    },
    {
      title: 'User Churn %',
      value: `${summary.userChurn?.toFixed(1) || '0'}%`,
      color: '#1d4ed8',
    },
    {
      title: 'ARPU',
      value: `$${summary.arpu?.toFixed(2) || '0'}`,
      color: '#1d4ed8',
    },
    {
      title: 'Customer LTV',
      value: `$${summary.ltv?.toFixed(2) || '0'}`,
      color: '#1d4ed8',
    },
  ];

  // Rest of your component...
}
```

### 4. Update Charts Component

```javascript
// src/pages/app/components/analytics-charts.jsx
export function AnalyticsCharts({ analyticsData, loading }) {
  if (loading) {
    return <LoadingScreen />;
  }

  if (!analyticsData) {
    return <EmptyContent />;
  }

  const { mrr, plans, products } = analyticsData;

  // MRR Growth Chart
  const mrrChartData = {
    labels: mrr.map(item => item.month),
    datasets: [{
      label: 'MRR',
      data: mrr.map(item => item.mrr),
      borderColor: 'rgb(59, 130, 246)',
      backgroundColor: 'rgba(59, 130, 246, 0.1)',
      tension: 0.4,
    }]
  };

  // Plan Distribution Chart
  const planChartData = {
    labels: plans.map(plan => plan.planId),
    datasets: [{
      data: plans.map(plan => plan.totalMRR),
      backgroundColor: [
        '#3B82F6',
        '#10B981',
        '#F59E0B',
        '#EF4444',
      ],
    }]
  };

  // Product Distribution Chart
  const productChartData = {
    labels: products.map(product => product.productId),
    datasets: [{
      data: products.map(product => product.totalMRR),
      backgroundColor: [
        '#8B5CF6',
        '#06B6D4',
        '#84CC16',
        '#F97316',
      ],
    }]
  };

  // Rest of your component...
}
```

## 🚀 Getting Started

### 1. Start the Backend Server

```bash
cd backend
npm install
npm run dev
```

### 2. Update Frontend Environment

Add to your frontend `.env` file:

```env
REACT_APP_API_URL=http://localhost:5000/api/analytics
```

### 3. Generate Test Data

```bash
curl -X POST "http://localhost:5000/api/analytics/simulate" \
  -H "Content-Type: application/json" \
  -d '{"months": 6, "usersPerPlan": 50}'
```

### 4. Test the Integration

Visit your analytics dashboard and verify that:
- Data loads from the backend API
- Filters work correctly
- Charts display real data
- All metrics are calculated properly

## 🔧 Configuration Options

### Backend Configuration

```javascript
// backend/server.js
const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
```

### Frontend Configuration

```javascript
// src/services/analyticsApi.js
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api/analytics';

// Add request interceptors for authentication if needed
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

// Add auth headers if needed
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

## 📊 Data Mapping

### Backend Response Format

```json
{
  "success": true,
  "data": {
    "totalMRR": 125000,
    "previousMRR": 120000,
    "activeCustomers": 1250,
    "revenueChurn": 5.2,
    "arpu": 100,
    "ltv": 1923,
    "cac": 150,
    "mrrTrend": [...],
    "calculatedAt": "2024-01-01T00:00:00.000Z"
  },
  "meta": {
    "filters": {...},
    "generatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### Frontend Data Usage

```javascript
// Use the data in your components
const { totalMRR, activeCustomers, revenueChurn } = analyticsData.summary;

// Display in cards
<Card>
  <Typography variant="h6">Total MRR</Typography>
  <Typography variant="h4">${totalMRR.toLocaleString()}</Typography>
</Card>
```

## 🐛 Troubleshooting

### Common Issues

1. **CORS Errors**
   - Ensure backend CORS is configured for your frontend URL
   - Check that the frontend URL matches the CORS origin

2. **API Connection Issues**
   - Verify backend server is running on correct port
   - Check API_BASE_URL in frontend environment

3. **Data Not Loading**
   - Check browser network tab for API calls
   - Verify backend logs for errors
   - Ensure MongoDB is running and connected

4. **Performance Issues**
   - Enable Redis caching for better performance
   - Check database indexes are properly set
   - Monitor API response times

### Debug Mode

Enable debug logging in development:

```javascript
// backend/server.js
if (process.env.NODE_ENV === 'development') {
  app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`, req.query);
    next();
  });
}
```

## 🚀 Production Deployment

### Environment Variables

```env
# Production
NODE_ENV=production
MONGODB_URI=mongodb://your-production-db
REDIS_HOST=your-redis-host
FRONTEND_URL=https://your-frontend-domain.com
```

### Security Considerations

1. **API Authentication**
   - Add JWT token validation
   - Implement rate limiting
   - Use HTTPS in production

2. **Database Security**
   - Use connection strings with authentication
   - Enable SSL for MongoDB connections
   - Set up proper database permissions

3. **Caching Security**
   - Secure Redis connections
   - Implement cache key validation
   - Monitor cache usage

This integration guide provides everything needed to connect your frontend analytics dashboard with the backend API for real-time SaaS metrics calculation!
