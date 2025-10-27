# 📊 Realistic Dummy Database Guide

This guide explains the comprehensive dummy database created for the analytics dashboard demo.

## 🎯 Overview

The dummy database contains **6 months of realistic SaaS data** with:
- **543 customers** across 4 products and 4 plans
- **1,296 transactions** with realistic payment patterns
- **1,296 invoices** with proper tax calculations
- **543 subscriptions** with lifecycle management
- **6 months of analytics** with growth trends

## 📈 Data Statistics

### Customer Distribution
- **Total Customers**: 543**
- **Active Customers**: 493 (90.8%)
- **Cancelled Customers**: 50 (9.2%)
- **Refunded Customers**: 27 (5.0%)

### Revenue Metrics
- **Total Revenue**: $131,803.92
- **Total Refunds**: $1,742.69
- **Net Revenue**: $130,061.23
- **Average MRR**: $21,967.32
- **ARPU**: $267.35
- **Churn Rate**: 9.21%

## 🏢 Products & Plans

### Products
1. **Pabbly Email Marketing** (30% of customers)
2. **Pabbly Subscription Billing** (25% of customers)
3. **Pabbly Form Builder** (20% of customers)
4. **Pabbly Connect** (25% of customers)

### Plans
1. **Basic** - $29/month (45% of customers)
2. **Pro** - $79/month (35% of customers)
3. **Premium** - $199/month (15% of customers)
4. **Enterprise** - $499/month (5% of customers)

## 📅 Time Period

**6 Months of Data** (May 2025 - October 2025):
- **May 2025**: $2,397.05 MRR
- **June 2025**: $10,684.52 MRR
- **July 2025**: $20,691.00 MRR
- **August 2025**: $28,379.02 MRR
- **September 2025**: $37,432.63 MRR
- **October 2025**: $32,219.70 MRR

## 🔧 Data Structure

### Customer Data
```javascript
{
  id: "customer_1",
  email: "john.smith1@gmail.com",
  firstName: "John",
  lastName: "Smith",
  product: "Pabbly Email Marketing",
  productId: "5e6624827e5eb40f41789173",
  plan: "Basic",
  planId: "673b2a92de8bd6206516d5c5",
  monthlyFee: 29,
  signupDate: "2025-05-15T10:30:00.000Z",
  status: "active", // active, cancelled
  cancelDate: null,
  renewals: 3,
  acquisitionCost: 12.50,
  refundAmount: 0
}
```

### Transaction Data
```javascript
{
  id: "txn_1",
  customerId: "customer_1",
  subscriptionId: "sub_customer_1_1",
  invoiceId: "inv_customer_1_1",
  planId: "673b2a92de8bd6206516d5c5",
  productId: "5e6624827e5eb40f41789173",
  type: "payment",
  status: "success",
  amount: 29.00,
  fees: 0.87,
  netAmount: 28.13,
  gateway: "Stripe",
  paymentMethod: "card",
  currency: "USD",
  transactionDate: "2025-05-15T10:30:00.000Z"
}
```

### Invoice Data
```javascript
{
  id: "inv_customer_1_1",
  customerId: "customer_1",
  subscriptionId: "sub_customer_1_1",
  planId: "673b2a92de8bd6206516d5c5",
  productId: "5e6624827e5eb40f41789173",
  status: "paid",
  amount: 29.00,
  taxAmount: 5.80,
  totalAmount: 34.80,
  currency: "USD",
  dueDate: "2025-06-15T10:30:00.000Z",
  paidDate: "2025-05-15T10:30:00.000Z"
}
```

### Subscription Data
```javascript
{
  id: "sub_customer_1",
  customerId: "customer_1",
  productId: "5e6624827e5eb40f41789173",
  planId: "673b2a92de8bd6206516d5c5",
  status: "active",
  amount: 29.00,
  quantity: 1,
  startsAt: "2025-05-15T10:30:00.000Z",
  activationDate: "2025-05-15T10:30:00.000Z",
  expiryDate: "2026-05-15T10:30:00.000Z",
  cancelDate: null,
  nextBillingDate: "2025-11-15T10:30:00.000Z",
  lastBillingDate: "2025-10-15T10:30:00.000Z"
}
```

## 🎲 Realistic Patterns

### Customer Acquisition
- **Monthly Growth**: 80-100 new customers per month
- **Seasonal Patterns**: Higher acquisition in Q3-Q4
- **Plan Distribution**: More users on lower-tier plans
- **Product Mix**: Balanced across all 4 products

### Churn Patterns
- **Basic Plan**: 12% churn rate
- **Pro Plan**: 8% churn rate
- **Premium Plan**: 5% churn rate
- **Enterprise Plan**: 3% churn rate

### Revenue Patterns
- **MRR Growth**: Consistent month-over-month growth
- **Refund Rate**: 1-8% depending on plan tier
- **Payment Success**: 95% success rate
- **Tax Variation**: 0-20% based on location

## 🔍 Analytics Capabilities

### Available Metrics
- **MRR (Monthly Recurring Revenue)**
- **ARPU (Average Revenue Per User)**
- **LTV (Lifetime Value)**
- **CAC (Customer Acquisition Cost)**
- **Churn Rate**
- **Revenue Churn**
- **LTV:CAC Ratio**

### Filtering Options
- **Date Range**: Filter by specific months
- **Product**: Filter by product type
- **Plan**: Filter by subscription plan
- **Customer**: Filter by specific customer
- **Status**: Filter by subscription status

### Trend Analysis
- **6-Month MRR Trends**
- **Monthly Churn Analysis**
- **Product Performance**
- **Plan Performance**
- **Customer Lifecycle**

## 🚀 Usage Examples

### Basic Analytics
```javascript
import { realisticAnalyticsService } from './src/_mock/_database/_realistic-analytics-service.js';

// Get all analytics
const analytics = realisticAnalyticsService.getAllAnalytics();

// Get summary metrics
const summary = realisticAnalyticsService.getAnalyticsSummary();

// Get MRR trend
const mrrTrend = realisticAnalyticsService.getMRRTrend();
```

### Filtered Analytics
```javascript
// Filter by date range
const monthAnalytics = realisticAnalyticsService.getAllAnalytics({
  startDate: '2025-10-01',
  endDate: '2025-10-31'
});

// Filter by product
const productAnalytics = realisticAnalyticsService.getAllAnalytics({
  productId: '5e6624827e5eb40f41789173'
});

// Filter by plan
const planAnalytics = realisticAnalyticsService.getAllAnalytics({
  planId: '673b2a92de8bd6206516d5c5'
});
```

### Customer Analysis
```javascript
import { 
  getTopCustomers,
  getCustomersByProduct,
  getActiveCustomers,
  getCancelledCustomers
} from './src/_mock/_database/_realistic-dummy-data.js';

// Get top customers by revenue
const topCustomers = getTopCustomers(10);

// Get customers by product
const emailMarketingCustomers = getCustomersByProduct('5e6624827e5eb40f41789173');

// Get active customers
const activeCustomers = getActiveCustomers();
```

## 📊 Dashboard Integration

### Stats Cards
- **Previous Month MRR**: $37,432.63
- **Active Customers MRR**: $32,219.70
- **Cancelled Customers MRR**: $5,212.93
- **Revenue Churn %**: 13.9%
- **Active Customers**: 493
- **User Churn %**: 9.21%
- **ARPU**: $267.35
- **Customer LTV**: $274.47

### Charts
- **MRR Growth Chart**: 6-month trend line
- **Customer Acquisition**: Monthly new customers
- **Product Distribution**: Pie chart by product
- **Plan Distribution**: Pie chart by plan

### Tables
- **Customer Details**: 543 customers with full details
- **Transaction History**: 1,296 transactions
- **Invoice Records**: 1,296 invoices
- **Subscription Management**: 543 subscriptions

## 🎯 Demo Scenarios

### Scenario 1: Monthly Overview
- View current month performance
- Compare with previous months
- Analyze growth trends
- Identify key metrics

### Scenario 2: Product Analysis
- Compare product performance
- Analyze customer distribution
- Review revenue by product
- Identify top-performing products

### Scenario 3: Plan Optimization
- Analyze plan performance
- Review churn by plan
- Optimize pricing strategy
- Identify upgrade opportunities

### Scenario 4: Customer Lifecycle
- Track customer journey
- Analyze acquisition costs
- Review retention rates
- Optimize onboarding

## 🔧 Data Export

The dummy data can be exported to JSON files:

```javascript
import { exportDataToFiles } from './src/_mock/_database/_export-dummy-data.js';

// Export all data to JSON files
exportDataToFiles();
```

This creates files in `public/dummy-data/`:
- `customers.json`
- `transactions.json`
- `invoices.json`
- `subscriptions.json`
- `monthly-analytics.json`
- `products.json`
- `plans.json`
- `summary.json`

## 🎉 Ready for Demo!

The realistic dummy database is now ready for your analytics dashboard demo with:
- ✅ **543 realistic customers**
- ✅ **6 months of data**
- ✅ **Realistic growth patterns**
- ✅ **Comprehensive analytics**
- ✅ **Multiple filtering options**
- ✅ **Professional data quality**

Start your demo and showcase the full power of your analytics dashboard! 🚀
