# Analytics Backend API

A comprehensive backend analytics layer for SaaS metrics calculation using MongoDB aggregation pipelines.

## 🚀 Features

- **SaaS Metrics Calculation**: MRR, ARPU, LTV, CAC, Churn Rate, etc.
- **MongoDB Aggregation**: Optimized queries for large datasets
- **Redis Caching**: High-performance caching for analytics data
- **RESTful API**: Clean, documented endpoints
- **Dummy Data Generation**: For testing and development
- **Error Handling**: Comprehensive error management
- **Performance Optimized**: Indexed queries and efficient algorithms

## 📁 Project Structure

```
backend/
├── models/           # Mongoose models
│   ├── Invoice.js
│   ├── Subscription.js
│   └── Transaction.js
├── controllers/     # Route controllers
│   └── analyticsController.js
├── services/        # Business logic
│   └── analyticsService.js
├── routes/          # API routes
│   └── analyticsRoutes.js
├── utils/           # Utility functions
│   ├── calcUtils.js
│   └── cacheUtils.js
├── server.js        # Main server file
└── package.json     # Dependencies
```

## 🛠 Installation

1. **Install Dependencies**
   ```bash
   cd backend
   npm install
   ```

2. **Environment Setup**
   ```bash
   cp env.example .env
   # Edit .env with your configuration
   ```

3. **Database Setup**
   - Ensure MongoDB is running
   - Update `MONGODB_URI` in `.env`

4. **Redis Setup (Optional)**
   - Install Redis for caching
   - Update Redis configuration in `.env`

## 🚀 Running the Server

### Development
```bash
npm run dev
```

### Production
```bash
npm start
```

## 📊 API Endpoints

### Base URL: `/api/analytics`

| Endpoint | Method | Description | Query Parameters |
|----------|--------|-------------|------------------|
| `/summary` | GET | Comprehensive analytics summary | `startDate`, `endDate`, `productId`, `planId`, `userId` |
| `/mrr` | GET | MRR trend over time | `startDate`, `endDate`, `productId`, `planId`, `userId` |
| `/churn` | GET | Churn analysis and trends | `startDate`, `endDate`, `productId`, `planId`, `userId` |
| `/plans` | GET | Metrics breakdown by plan | `startDate`, `endDate`, `productId`, `planId`, `userId` |
| `/products` | GET | Metrics breakdown by product | `startDate`, `endDate`, `productId`, `planId`, `userId` |
| `/customers` | GET | Customer-level metrics | `startDate`, `endDate`, `productId`, `planId`, `userId`, `limit` |
| `/simulate` | POST | Generate dummy data (Dev only) | Body: `{ months, usersPerPlan }` |
| `/health` | GET | Health check | None |

## 📈 SaaS Metrics Calculated

### Core Metrics
- **MRR (Monthly Recurring Revenue)**: Total recurring revenue per month
- **ARPU (Average Revenue Per User)**: Revenue per active customer
- **LTV (Lifetime Value)**: Customer lifetime value
- **CAC (Customer Acquisition Cost)**: Cost to acquire new customers
- **Churn Rate**: Customer and revenue churn percentages

### Advanced Metrics
- **Expansion MRR**: Revenue from existing customer upgrades
- **Contraction MRR**: Revenue lost from downgrades
- **Net Revenue Retention**: Overall revenue retention rate
- **Gross Revenue Retention**: Revenue retention excluding expansion
- **Payback Period**: Time to recover CAC
- **Magic Number**: Sales efficiency metric

## 🔧 Configuration

### Environment Variables

```env
# Server
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/analytics_db

# Redis (Optional)
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

# Frontend
FRONTEND_URL=http://localhost:3000
```

## 📝 Usage Examples

### Get Analytics Summary
```bash
curl "http://localhost:5000/api/analytics/summary?startDate=2024-01-01&endDate=2024-12-31"
```

### Get MRR Trend
```bash
curl "http://localhost:5000/api/analytics/mrr?productId=5e6624827e5eb40f41789173"
```

### Generate Dummy Data
```bash
curl -X POST "http://localhost:5000/api/analytics/simulate" \
  -H "Content-Type: application/json" \
  -d '{"months": 6, "usersPerPlan": 50}'
```

## 🗄 Database Models

### Invoice Model
- Tracks all invoice transactions
- Indexed by: `createdAt`, `product_id`, `plan_id`, `status`
- Fields: `amount`, `status`, `customer_id`, `product_id`, `plan_id`

### Subscription Model
- Tracks customer subscriptions
- Indexed by: `createdAt`, `status`, `product_id`, `plan_id`
- Fields: `status`, `amount`, `customer_id`, `product_id`, `plan_id`

### Transaction Model
- Tracks payment transactions
- Indexed by: `createdAt`, `status`, `type`
- Fields: `amount`, `status`, `type`, `refunded`

## ⚡ Performance Features

### Caching
- Redis-based caching for analytics queries
- Configurable TTL for different endpoints
- Cache invalidation strategies

### Database Optimization
- Strategic indexes for fast queries
- Aggregation pipelines for complex calculations
- Connection pooling

### Error Handling
- Comprehensive error logging
- Graceful error responses
- Development vs production error details

## 🧪 Testing

### Generate Test Data
```bash
# Generate 6 months of data with 50 users per plan
curl -X POST "http://localhost:5000/api/analytics/simulate" \
  -H "Content-Type: application/json" \
  -d '{"months": 6, "usersPerPlan": 50}'
```

### Health Check
```bash
curl "http://localhost:5000/health"
```

## 🔍 Monitoring

### Health Endpoint
- Server status and uptime
- Database connection status
- Environment information

### Logging
- Request/response logging
- Error tracking
- Performance monitoring

## 🚀 Deployment

### Production Checklist
1. Set `NODE_ENV=production`
2. Configure production MongoDB
3. Set up Redis for caching
4. Configure CORS for frontend
5. Set up monitoring and logging

### Docker Support
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
```

## 📚 API Documentation

### Response Format
```json
{
  "success": true,
  "data": { ... },
  "meta": {
    "filters": { ... },
    "generatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### Error Format
```json
{
  "success": false,
  "error": "Error message",
  "details": "Additional error details (development only)"
}
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details.
