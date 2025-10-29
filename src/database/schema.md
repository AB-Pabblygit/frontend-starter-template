# Analytics Database Schema

## Overview
This document outlines the database schema required for the Analytics Dashboard. The schema is designed to support comprehensive MRR and churn analytics.

## Core Tables

### 1. customers
```sql
CREATE TABLE customers (
  id VARCHAR(36) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  status ENUM('active', 'cancelled', 'paused') DEFAULT 'active',
  signup_date DATE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### 2. products
```sql
CREATE TABLE products (
  id VARCHAR(36) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### 3. plans
```sql
CREATE TABLE plans (
  id VARCHAR(36) PRIMARY KEY,
  product_id VARCHAR(36) NOT NULL,
  name VARCHAR(255) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  billing_cycle ENUM('monthly', 'yearly') DEFAULT 'monthly',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (product_id) REFERENCES products(id)
);
```

### 4. subscriptions
```sql
CREATE TABLE subscriptions (
  id VARCHAR(36) PRIMARY KEY,
  customer_id VARCHAR(36) NOT NULL,
  product_id VARCHAR(36) NOT NULL,
  plan_id VARCHAR(36) NOT NULL,
  monthly_revenue DECIMAL(10,2) NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NULL,
  status ENUM('active', 'cancelled', 'paused') DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (customer_id) REFERENCES customers(id),
  FOREIGN KEY (product_id) REFERENCES products(id),
  FOREIGN KEY (plan_id) REFERENCES plans(id)
);
```

### 5. transactions
```sql
CREATE TABLE transactions (
  id VARCHAR(36) PRIMARY KEY,
  customer_id VARCHAR(36) NOT NULL,
  subscription_id VARCHAR(36) NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  transaction_date DATE NOT NULL,
  type ENUM('invoice', 'refund', 'credit') DEFAULT 'invoice',
  refunded BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (customer_id) REFERENCES customers(id),
  FOREIGN KEY (subscription_id) REFERENCES subscriptions(id)
);
```

### 6. invoices
```sql
CREATE TABLE invoices (
  id VARCHAR(36) PRIMARY KEY,
  customer_id VARCHAR(36) NOT NULL,
  subscription_id VARCHAR(36) NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  status ENUM('paid', 'refunded', 'failed') DEFAULT 'paid',
  invoice_date DATE NOT NULL,
  due_date DATE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (customer_id) REFERENCES customers(id),
  FOREIGN KEY (subscription_id) REFERENCES subscriptions(id)
);
```

## API Endpoints

### GET /api/analytics/summary
Returns MRR movement analysis data.

**Query Parameters:**
- `startDate` (required): Start date in YYYY-MM-DD format
- `endDate` (required): End date in YYYY-MM-DD format
- `productId` (optional): Filter by specific product
- `planId` (optional): Filter by specific plan

**Response:**
```json
{
  "success": true,
  "data": {
    "startMRR": 3494.00,
    "endMRR": 3048.00,
    "newMRR": 0.00,
    "upgradeMRR": 0.00,
    "downgradeMRR": 428.00,
    "churnedMRR": 18.00,
    "netNewMRR": -446.00,
    "totalCustomers": 91,
    "activeCustomers": 87,
    "newCustomers": 0,
    "churnedCustomers": 4,
    "refundedRevenue": 0.00,
    "overallCAC": 254.23,
    "cacPerCustomer": 254.23,
    "avgMonthsCustomerRemains": 0.0
  }
}
```

### GET /api/analytics/customers
Returns customer data with subscriptions and transactions.

**Query Parameters:**
- `startDate` (required): Start date in YYYY-MM-DD format
- `endDate` (required): End date in YYYY-MM-DD format
- `productId` (optional): Filter by specific product
- `planId` (optional): Filter by specific plan
- `status` (optional): Filter by customer status
- `limit` (optional): Number of records to return (default: 100)
- `offset` (optional): Number of records to skip (default: 0)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "customer-123",
      "name": "John Doe",
      "email": "john@example.com",
      "status": "active",
      "signupDate": "2024-01-15",
      "planId": "plan-456",
      "productId": "product-789",
      "monthlyRevenue": 49.00,
      "subscriptions": [
        {
          "id": "sub-123",
          "productId": "product-789",
          "planId": "plan-456",
          "monthly": 49.00,
          "start": "2024-01-15",
          "end": null,
          "active": true
        }
      ],
      "transactions": [
        {
          "date": "2024-01-15",
          "amount": 49.00,
          "type": "invoice",
          "refunded": false
        }
      ]
    }
  ]
}
```

### GET /api/analytics/plans
Returns plan performance metrics.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "planId": "plan-456",
      "planName": "Basic",
      "productId": "product-789",
      "productName": "Email Marketing",
      "totalCustomers": 45,
      "mrr": 2205.00,
      "churnRate": 2.1,
      "avgLifetime": 12.5
    }
  ]
}
```

## Database Indexes

```sql
-- Performance indexes
CREATE INDEX idx_customers_status ON customers(status);
CREATE INDEX idx_customers_signup_date ON customers(signup_date);
CREATE INDEX idx_subscriptions_customer_id ON subscriptions(customer_id);
CREATE INDEX idx_subscriptions_status ON subscriptions(status);
CREATE INDEX idx_subscriptions_dates ON subscriptions(start_date, end_date);
CREATE INDEX idx_transactions_customer_id ON transactions(customer_id);
CREATE INDEX idx_transactions_date ON transactions(transaction_date);
CREATE INDEX idx_invoices_customer_id ON invoices(customer_id);
CREATE INDEX idx_invoices_status ON invoices(status);
```

## Sample Data

### Products
```sql
INSERT INTO products (id, name) VALUES
('pem', 'Email Marketing'),
('psb', 'Subscription Billing'),
('pc', 'Connect'),
('pfb', 'Form Builder');
```

### Plans
```sql
INSERT INTO plans (id, product_id, name, price) VALUES
('pem-starter', 'pem', 'Starter', 29.00),
('pem-basic', 'pem', 'Basic', 49.00),
('pem-pro', 'pem', 'Pro', 149.00),
('pem-enterprise', 'pem', 'Enterprise', 499.00);
```

## Notes

1. **Currency**: All monetary values are stored as DECIMAL(10,2) for precision
2. **Dates**: All dates are stored in YYYY-MM-DD format
3. **IDs**: Use UUIDs or similar unique identifiers
4. **Soft Deletes**: Consider adding `deleted_at` columns for soft deletes
5. **Audit Trail**: Consider adding audit tables for tracking changes
6. **Partitioning**: For large datasets, consider partitioning by date
7. **Backup**: Implement regular backups and point-in-time recovery

