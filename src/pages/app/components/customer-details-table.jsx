import { useState } from 'react';

import { Box, Card, Chip, Paper, Table, Checkbox, TableRow, useTheme, TableBody, TableCell, TableHead, IconButton, Typography, TableContainer } from '@mui/material';

import { getTopCustomers, REALISTIC_CUSTOMERS } from 'src/_mock/_database';

// ----------------------------------------------------------------------

const getCustomerData = () => {
  const topCustomers = getTopCustomers(REALISTIC_CUSTOMERS, 10);
  
  return topCustomers.map((customer, index) => ({
    email: customer.userEmail,
    plan: getRandomPlan(), // Random plan assignment
    status: Math.random() < 0.85 ? 'Active' : 'Cancelled',
    amount: `$${customer.totalRevenue.toFixed(2)}`,
    id: customer.userId,
    gateway: getRandomGateway(),
    total: `$${customer.totalRevenue.toFixed(2)}`,
    fees: `$${(customer.totalRevenue * 0.03).toFixed(2)}`,
    net: `$${(customer.totalRevenue * 0.97).toFixed(2)}`,
    frequency: getRandomFrequency(),
    refund: Math.random() < 0.1 ? `$${(customer.totalRevenue * 0.1).toFixed(2)}` : '$0',
  }));
};

// Helper functions for realistic data
const getRandomPlan = () => {
  const plans = ['Basic', 'Pro', 'Enterprise', 'Premium', 'Starter', 'Standard'];
  return plans[Math.floor(Math.random() * plans.length)];
};

const getRandomGateway = () => {
  const gateways = ['Stripe', 'PayPal', 'Razorpay', 'Square', 'Authorize.net'];
  return gateways[Math.floor(Math.random() * gateways.length)];
};

const getRandomFrequency = () => {
  const frequencies = ['Monthly', 'Yearly', 'Quarterly'];
  return frequencies[Math.floor(Math.random() * frequencies.length)];
};

// Enhanced customer data using backend API data - matching Sale Details design
const getEnhancedCustomerData = (customers) => customers.slice(0, 6).map((customer, index) => ({
  id: customer.id,
  email: customer.email,
  name: customer.name || `${customer.email.split('@')[0]}`,
  status: customer.status === 'active' ? 'Success' : 'Cancelled',
  date: new Date(customer.joinDate || customer.lastPayment).toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  }),
  productName: customer.product,
  planName: `${customer.plan} Plan USD`,
  orderId: `ABC-ORD-2025-Oct-${index + 1}`,
  gateway: 'Gateway - Test Gateway',
  frequency: 'Recurring',
  invoiceId: `INVOICE-2025-10-${index + 1}`,
  amount: `$${(customer.monthlyFee || customer.mrr || 0).toFixed(2)}`,
  paymentNumber: `${index + 15}th Payment`,
  // Detailed information for slider
  totalAmount: `$${(customer.monthlyFee || customer.mrr || 0).toFixed(2)}`,
  transactionId: `${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`,
  customerId: `${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`,
  subscriptionId: `${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`,
  billingCycle: 'Per Month',
  requestedIP: '2401:4900:1ca2:a98c:d072:acd9:6d36:4a9b',
  subscriptionItems: [
    { name: `1 x ${customer.plan} Plan USD`, price: `$${(customer.monthlyFee || customer.mrr || 0).toFixed(2)}`, cycle: 'Per Month' },
    { name: '3 x 10 Custom Infographics', price: '$6000.00', cycle: 'Per Month' },
    { name: 'CGST @ 20% Tax', price: '$1205.00', cycle: 'Forever' },
    { name: 'SGST @ 10% Tax', price: '$602.50', cycle: 'Forever' }
  ],
  subscriptionAmount: `$${(customer.monthlyFee || customer.mrr || 0).toFixed(2)}`
}));

export function CustomerDetailsTable({ onViewCustomer, analyticsData }) {
  const theme = useTheme();
  const [selectedRows, setSelectedRows] = useState([]);
  
  // Use analytics data if available, otherwise show loading state
  if (!analyticsData) {
    return (
      <Card sx={{ p: 3, textAlign: 'center' }}>
        <Typography>Loading customer data...</Typography>
      </Card>
    );
  }

  const customerData = getEnhancedCustomerData(analyticsData.customers || []);

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      setSelectedRows(customerData.map((_, index) => index));
    } else {
      setSelectedRows([]);
    }
  };

  const handleSelectRow = (index) => {
    setSelectedRows(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  const handleEmailClick = (customer) => {
    onViewCustomer(customer);
  };

  const handleOrderClick = (customer) => {
    onViewCustomer(customer);
  };

  const handleInvoiceClick = (customer) => {
    onViewCustomer(customer);
  };

  return (
    <Card
      sx={{
        p: 3,
        borderRadius: 4,
        boxShadow: '0 4px 15px rgba(0,0,0,0.08)',
        animation: 'fadeUp 0.8s ease',
        backgroundColor: theme.palette.background.paper,
        '@keyframes fadeUp': {
          from: { opacity: 0, transform: 'translateY(20px)' },
          to: { opacity: 1, transform: 'translateY(0)' },
        },
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography
            variant="h5"
            sx={{
              fontSize: '20px',
              fontWeight: 600,
              color: 'text.primary',
            }}
          >
            Sale Details
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
            <Typography variant="body2" color="text.secondary">
              {selectedRows.length} Selected
            </Typography>
            <IconButton size="small">
              <Typography variant="body2">📹</Typography>
            </IconButton>
          </Box>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <IconButton size="small">
            <Typography variant="body2">🎥</Typography>
          </IconButton>
          <IconButton size="small">
            <Typography variant="body2">🔍</Typography>
          </IconButton>
          <Typography variant="body2" color="primary" sx={{ cursor: 'pointer' }}>
            Filter
          </Typography>
        </Box>
      </Box>

      <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 2, backgroundColor: theme.palette.background.paper }}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: theme.palette.grey[100] }}>
              <TableCell sx={{ fontWeight: 600, color: 'text.primary', borderBottom: `1px solid ${theme.palette.divider}`, width: 50 }}>
                <Checkbox
                  checked={selectedRows.length === customerData.length}
                  indeterminate={selectedRows.length > 0 && selectedRows.length < customerData.length}
                  onChange={handleSelectAll}
                  size="small"
                />
              </TableCell>
              <TableCell sx={{ fontWeight: 600, color: 'text.primary', borderBottom: `1px solid ${theme.palette.divider}` }}>
                DATE / STATUS
              </TableCell>
              <TableCell sx={{ fontWeight: 600, color: 'text.primary', borderBottom: `1px solid ${theme.palette.divider}` }}>
                EMAIL / NAME
              </TableCell>
              <TableCell sx={{ fontWeight: 600, color: 'text.primary', borderBottom: `1px solid ${theme.palette.divider}` }}>
                PRODUCT NAME / PLAN NAME
              </TableCell>
              <TableCell sx={{ fontWeight: 600, color: 'text.primary', borderBottom: `1px solid ${theme.palette.divider}` }}>
                ORDER / GATEWAY
              </TableCell>
              <TableCell sx={{ fontWeight: 600, color: 'text.primary', borderBottom: `1px solid ${theme.palette.divider}` }}>
                INVOICE
              </TableCell>
              <TableCell sx={{ fontWeight: 600, color: 'text.primary', borderBottom: `1px solid ${theme.palette.divider}` }}>
                AMOUNT
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {customerData.map((customer, index) => (
              <TableRow
                key={index}
                sx={{
                  '&:hover': {
                    backgroundColor: theme.palette.action.hover,
                    transition: '0.3s',
                  },
                  '&:last-child td': {
                    borderBottom: 0,
                  },
                }}
              >
                <TableCell sx={{ borderBottom: `1px solid ${theme.palette.divider}`, py: 1.75, px: 2 }}>
                  <Checkbox
                    checked={selectedRows.includes(index)}
                    onChange={() => handleSelectRow(index)}
                    size="small"
                  />
                </TableCell>
                <TableCell sx={{ borderBottom: `1px solid ${theme.palette.divider}`, py: 1.75, px: 2 }}>
                  <Box>
                    <Chip
                      label={customer.status}
                      color="success"
                      size="small"
                      variant="filled"
                      sx={{ mb: 0.5 }}
                    />
                    <Typography variant="body2" color="text.secondary">
                      {customer.date}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell sx={{ borderBottom: `1px solid ${theme.palette.divider}`, py: 1.75, px: 2 }}>
                  <Box>
                    <Typography 
                      variant="body2" 
                      color="primary" 
                      sx={{ 
                        fontWeight: 500, 
                        cursor: 'pointer',
                        textDecoration: 'underline',
                        '&:hover': { color: theme.palette.primary.dark }
                      }}
                      onClick={() => handleEmailClick(customer)}
                    >
                      {customer.email}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {customer.name}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell sx={{ borderBottom: `1px solid ${theme.palette.divider}`, py: 1.75, px: 2 }}>
                  <Box>
                    <Typography variant="body2" color="text.primary">
                      {customer.productName}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {customer.planName}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell sx={{ borderBottom: `1px solid ${theme.palette.divider}`, py: 1.75, px: 2 }}>
                  <Box>
                    <Typography 
                      variant="body2" 
                      color="primary" 
                      sx={{ 
                        fontWeight: 500, 
                        cursor: 'pointer',
                        textDecoration: 'underline',
                        '&:hover': { color: theme.palette.primary.dark }
                      }}
                      onClick={() => handleOrderClick(customer)}
                    >
                      {customer.orderId}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {customer.gateway}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {customer.frequency}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell sx={{ borderBottom: `1px solid ${theme.palette.divider}`, py: 1.75, px: 2 }}>
                  <Typography 
                    variant="body2" 
                    color="primary" 
                    sx={{ 
                      fontWeight: 500, 
                      cursor: 'pointer',
                      textDecoration: 'underline',
                      '&:hover': { color: theme.palette.primary.dark }
                    }}
                    onClick={() => handleInvoiceClick(customer)}
                  >
                    {customer.invoiceId}
                  </Typography>
                </TableCell>
                <TableCell sx={{ borderBottom: `1px solid ${theme.palette.divider}`, py: 1.75, px: 2 }}>
                  <Box>
                    <Typography variant="body2" color="success.main" sx={{ fontWeight: 600 }}>
                      {customer.amount}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {customer.paymentNumber}
                    </Typography>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="body2" color="text.secondary">Rows per page:</Typography>
          <Typography variant="body2" color="text.primary">15</Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant="body2" color="text.secondary">
            Showing 0 - {customerData.length} of {customerData.length} Records
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <IconButton size="small" disabled>
              <Typography variant="body2">‹</Typography>
            </IconButton>
            <Typography variant="body2" color="primary" sx={{ fontWeight: 600 }}>
              1
            </Typography>
            <Typography variant="body2" color="text.secondary">
              1 of 1
            </Typography>
            <IconButton size="small" disabled>
              <Typography variant="body2">›</Typography>
            </IconButton>
          </Box>
        </Box>
      </Box>
    </Card>
  );
}
