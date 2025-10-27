# Frontend-Backend Integration Setup Guide

This guide will help you integrate and connect your frontend analytics dashboard with the backend API.

## 🚀 Quick Start

### 1. Start the Backend Server

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Start the development server
npm run dev
```

The backend will be available at `http://localhost:5000`

### 2. Generate Test Data

```bash
# Generate 6 months of dummy data with 50 users per plan
curl -X POST "http://localhost:5000/api/analytics/simulate" \
  -H "Content-Type: application/json" \
  -d '{"months": 6, "usersPerPlan": 50}'
```

### 3. Start the Frontend

```bash
# In the root directory (frontend-starter-template)
npm start
```

The frontend will be available at `http://localhost:3000`

## 🔧 Configuration

### Environment Variables

Create a `.env.local` file in your frontend root directory:

```env
# Frontend Environment Variables (Vite format)
VITE_API_URL=http://localhost:5000/api/analytics
VITE_BACKEND_URL=http://localhost:5000
```

### Backend Configuration

Create a `.env` file in your backend directory:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/analytics_db

# Redis Configuration (Optional - for caching)
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

# Frontend Configuration
FRONTEND_URL=http://localhost:3000
```

## 📊 API Integration

### Frontend API Service

The frontend now uses `src/services/analyticsApi.js` to communicate with the backend:

```javascript
// Example usage in components
import analyticsApi from 'src/services/analyticsApi';

// Get analytics summary
const response = await analyticsApi.getSummary({
  startDate: '2024-01-01',
  endDate: '2024-12-31',
  productId: '5e6624827e5eb40f41789173'
});
```

### Available API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/analytics/summary` | GET | Complete analytics summary |
| `/api/analytics/mrr` | GET | MRR trend over time |
| `/api/analytics/churn` | GET | Churn analysis |
| `/api/analytics/plans` | GET | Metrics by plan |
| `/api/analytics/products` | GET | Metrics by product |
| `/api/analytics/customers` | GET | Customer-level metrics |
| `/api/analytics/simulate` | POST | Generate dummy data |
| `/api/analytics/health` | GET | Health check |

## 🎯 Updated Components

### Analytics Page (`src/pages/app/analytics.jsx`)

- ✅ Integrated with backend API
- ✅ Loading and error states
- ✅ Real-time data fetching
- ✅ Filter functionality

### Stats Cards (`src/pages/app/components/analytics-stats-cards.jsx`)

- ✅ Uses backend summary data
- ✅ Displays MRR, ARPU, LTV, CAC metrics
- ✅ Real-time updates

### Charts (`src/pages/app/components/analytics-charts.jsx`)

- ✅ MRR growth trends
- ✅ Product/plan breakdowns
- ✅ Interactive visualizations

### Customer Table (`src/pages/app/components/customer-details-table.jsx`)

- ✅ Real customer data from backend
- ✅ Interactive sales details
- ✅ Right-side slider functionality

## 🧪 Testing the Integration

### 1. Health Check

```bash
curl "http://localhost:5000/health"
```

### 2. Test Analytics Summary

```bash
curl "http://localhost:5000/api/analytics/summary"
```

### 3. Test with Filters

```bash
curl "http://localhost:5000/api/analytics/summary?startDate=2024-01-01&endDate=2024-12-31"
```

### 4. Frontend Testing

1. Open `http://localhost:3000`
2. Navigate to the analytics page
3. Verify data loads from backend
4. Test filter functionality
5. Check charts and tables

## 🔍 Troubleshooting

### Common Issues

#### 1. CORS Errors
**Problem**: Frontend can't connect to backend
**Solution**: Ensure backend CORS is configured for your frontend URL

```javascript
// backend/server.js
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
```

#### 2. API Connection Issues
**Problem**: Frontend shows loading or error states
**Solution**: 
- Check if backend is running on port 5000
- Verify API_BASE_URL in frontend environment
- Check browser network tab for failed requests

#### 3. No Data Displayed
**Problem**: Analytics page shows empty or no data
**Solution**:
- Generate test data using the simulate endpoint
- Check MongoDB connection
- Verify database has data

#### 4. Performance Issues
**Problem**: Slow loading or timeouts
**Solution**:
- Enable Redis caching
- Check database indexes
- Monitor API response times

### Debug Mode

Enable debug logging:

```javascript
// In browser console
localStorage.setItem('debug', 'analytics:*');

// In backend
NODE_ENV=development npm run dev
```

## 📈 Data Flow

### 1. User Interaction
- User selects filters (month, product, plan)
- Frontend updates state

### 2. API Request
- Frontend calls `analyticsApi.getAllAnalytics(filters)`
- API service builds query parameters
- HTTP request sent to backend

### 3. Backend Processing
- Backend receives request
- MongoDB aggregation queries executed
- Metrics calculated using business logic
- Response sent back to frontend

### 4. Frontend Update
- Frontend receives response
- Components re-render with new data
- Charts and tables update

## 🚀 Production Deployment

### Backend Deployment

1. **Environment Variables**:
   ```env
   NODE_ENV=production
   MONGODB_URI=mongodb://your-production-db
   FRONTEND_URL=https://your-frontend-domain.com
   ```

2. **Database Setup**:
   - Ensure MongoDB is running
   - Set up proper indexes
   - Configure connection pooling

3. **Caching**:
   - Set up Redis for production
   - Configure cache TTL
   - Monitor cache performance

### Frontend Deployment

1. **Environment Variables**:
   ```env
   VITE_API_URL=https://your-backend-domain.com/api/analytics
   ```

2. **Build and Deploy**:
   ```bash
   npm run build
   # Deploy build folder to your hosting service
   ```

## 📊 Expected Results

After successful integration, you should see:

- ✅ **Real-time Data**: Analytics dashboard shows live data from backend
- ✅ **Fast Performance**: Cached responses and optimized queries
- ✅ **Interactive Filters**: Month, product, and plan filters work correctly
- ✅ **Accurate Metrics**: All SaaS metrics calculated correctly
- ✅ **Responsive UI**: Loading states and error handling
- ✅ **Professional Charts**: Interactive visualizations with real data

## 🎉 Success Indicators

- Backend server running on port 5000
- Frontend connecting to backend API
- Analytics dashboard displaying real data
- Filters working correctly
- Charts showing trends
- Customer table with real data
- No console errors
- Fast page load times

Your analytics dashboard is now fully integrated with the backend API and ready for production use!
