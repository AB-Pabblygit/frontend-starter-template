import { useState } from 'react';

import {
  Box,
  Card,
  Table,
  Paper,
  TableRow,
  useTheme,
  TableBody,
  TableCell,
  TableHead,
  Typography,
  Chip,
  TableContainer,
} from '@mui/material';

// Sample data with unique email addresses and varied products/plans
export const PAYMENT_SOURCE = [
  {
    id: 1,
    name: 'Nimesh Sahu',
    email: 'nimesh.sahu@pabbly.com',
    paymentDate: '10/29/2025',
    product: 'Pabbly Connect',
    plan: 'Tier 1',
    paymentGateway: 'PayPal',
    previousMonthMRR: '$19',
    currentMonthMRR: '$19',
    frequency: 'Monthly',
    advancePayment: '-',
    customerStatus: 'Active',
    subscriptionStatus: 'Recurring'
  },
  {
    id: 1_2,
    name: 'Nimesh Sahu',
    email: 'nimesh.sahu@pabbly.com',
    paymentDate: '11/02/2025',
    product: 'Pabbly Connect',
    plan: 'Tier 2',
    paymentGateway: 'Stripe',
    previousMonthMRR: '$39',
    currentMonthMRR: '$39',
    frequency: 'Monthly',
    advancePayment: '-',
    customerStatus: 'Active',
    subscriptionStatus: 'Recurring'
  },
  {
    id: 1_3,
    name: 'Nimesh Sahu',
    email: 'nimesh.sahu@pabbly.com',
    paymentDate: '11/10/2025',
    product: 'Pabbly Connect',
    plan: 'Unlimited Plan',
    paymentGateway: 'PayPal',
    previousMonthMRR: '$0',
    currentMonthMRR: '$79',
    frequency: 'Monthly',
    advancePayment: '-',
    customerStatus: 'Active',
    subscriptionStatus: 'New Subscription'
  },
  {
    id: 2,
    name: 'Neeraj Agarwal',
    email: 'neeraj.agarwal@pabbly.com',
    paymentDate: '11/15/2025',
    product: 'Pabbly Connect',
    plan: 'Tier 2',
    paymentGateway: 'Stripe',
    previousMonthMRR: '$39',
    currentMonthMRR: '$39',
    frequency: 'Monthly',
    advancePayment: '-',
    customerStatus: 'Active',
    subscriptionStatus: 'Recurring'
  },
  {
    id: 2_2,
    name: 'Neeraj Agarwal',
    email: 'neeraj.agarwal@pabbly.com',
    paymentDate: '11/04/2025',
    product: 'Pabbly Connect',
    plan: 'Tier 1',
    paymentGateway: 'Stripe',
    previousMonthMRR: '$19',
    currentMonthMRR: '0',
    frequency: 'Monthly',
    advancePayment: '-',
    customerStatus: 'Churned',
    subscriptionStatus: 'Cancelled'
  },
  {
    id: 2_3,
    name: 'Neeraj Agarwal',
    email: 'neeraj.agarwal@pabbly.com',
    paymentDate: '11/20/2025',
    product: 'Pabbly Connect',
    plan: 'Unlimited Plan',
    paymentGateway: 'RazorPay',
    previousMonthMRR: '$19',
    currentMonthMRR: '$19',
    frequency: 'Monthly',
    advancePayment: '-',
    customerStatus: 'Churned',
    subscriptionStatus: 'Refunded'
  },
  {
    id: 3,
    name: 'Hardik Pradhan',
    email: 'hardik.pradhan@pabbly.com',
    paymentDate: '12/01/2025',
    product: 'Pabbly Connect',
    plan: 'Unlimited Plan',
    paymentGateway: 'PayPal',
    previousMonthMRR: '$0',
    currentMonthMRR: '$79',
    frequency: 'Monthly',
    advancePayment: '-',
    customerStatus: 'New Joined',
    subscriptionStatus: 'New Subscription'
  },
  {
    id: 4,
    name: 'Aakash Bhelkar',
    email: 'aakash.bhelkar@pabbly.com',
    paymentDate: '11/20/2025',
    product: 'Pabbly Connect',
    plan: 'Tier 1',
    paymentGateway: 'Stripe',
    previousMonthMRR: '$19',
    currentMonthMRR: '$0',
    frequency: 'Monthly',
    advancePayment: '-',
    customerStatus: 'Churned',
    subscriptionStatus: 'Cancelled'
  },
  {
    id: 5,
    name: 'Sarah Johnson',
    email: 'sarah.johnson@example.com',
    paymentDate: '10/15/2025',
    product: 'Pabbly Workflow',
    plan: 'Basic Plan',
    paymentGateway: 'RazorPay',
    previousMonthMRR: '$0',
    currentMonthMRR: '$29',
    frequency: 'Monthly',
    advancePayment: '-',
    customerStatus: 'New Joined',
    subscriptionStatus: 'New Subscription'
  },
  {
    id: 6,
    name: 'Mike Wilson',
    email: 'mike.wilson@company.com',
    paymentDate: '09/01/2025',
    product: 'Pabbly Email Marketing',
    plan: 'Pro Plan',
    paymentGateway: 'PayPal',
    previousMonthMRR: '$49',
    currentMonthMRR: '$0',
    frequency: 'Monthly',
    advancePayment: '-',
    customerStatus: 'Churned',
    subscriptionStatus: 'Refunded'
  },
  {
    id: 7,
    name: 'Lisa Brown',
    email: 'lisa.brown@startup.io',
    paymentDate: '08/15/2025',
    product: 'Pabbly CRM',
    plan: 'Enterprise Plan',
    paymentGateway: 'RazorPay',
    previousMonthMRR: '$99',
    currentMonthMRR: '$99',
    frequency: 'Yearly',
    advancePayment: '$990', // 10 months remaining * $99
    customerStatus: 'Active',
    subscriptionStatus: 'Recurring'
  },
  {
    id: 8,
    name: 'David Smith',
    email: 'david.smith@business.com',
    paymentDate: '07/01/2025',
    product: 'Pabbly Analytics',
    plan: 'Starter Plan',
    paymentGateway: 'Stripe',
    previousMonthMRR: '$15',
    currentMonthMRR: '$15',
    frequency: 'Yearly',
    advancePayment: '$165', // 11 months remaining * $15
    customerStatus: 'Active',
    subscriptionStatus: 'Recurring'
  },
  {
    id: 9,
    name: 'Emma Davis',
    email: 'emma.davis@tech.com',
    paymentDate: '06/10/2025',
    product: 'Pabbly Connect',
    plan: 'Unlimited Plan',
    paymentGateway: 'PayPal',
    previousMonthMRR: '$79',
    currentMonthMRR: '$79',
    frequency: 'Yearly',
    advancePayment: '$474', // 6 months remaining * $79
    customerStatus: 'Active',
    subscriptionStatus: 'Recurring'
  },
  {
    id: 10,
    name: 'John Miller',
    email: 'john.miller@corp.com',
    paymentDate: '05/20/2025',
    product: 'Pabbly Workflow',
    plan: 'Pro Plan',
    paymentGateway: 'Stripe',
    previousMonthMRR: '$49',
    currentMonthMRR: '$49',
    frequency: 'Yearly',
    advancePayment: '$245', // 5 months remaining * $49
    customerStatus: 'Active',
    subscriptionStatus: 'Recurring'
  }
];

const COLUMN_DESCRIPTIONS = {
  paymentDate: 'Date when the payment was processed or transaction occurred',
  customerStatus: 'Current status of the customer (Active, Churned, New Joined)',
  name: 'Customer full name for identification',
  email: 'Customer email address for communication',
  product: 'Name of the Pabbly product/service the customer is subscribed to',
  plan: 'Specific subscription plan tier or package name',
  paymentGateway: 'Payment processor used for the transaction (PayPal, Stripe, RazorPay)',
  previousMonthMRR: 'Monthly Recurring Revenue amount for the previous month',
  currentMonthMRR: 'Monthly Recurring Revenue amount for the current month',
  frequency: 'Billing frequency - Monthly or Yearly subscription cycle',
  advancePayment: 'Remaining advance payment amount for yearly subscriptions (calculated as remaining months × monthly amount)',
  subscriptionStatus: 'Status of the subscription (Recurring, New Subscription, Cancelled, Refunded)'
};

export function AnalyticsPaymentTable({ selectedMonth, selectedYear, selectedProduct = 'All', selectedPlan = 'All' }) {
  const theme = useTheme();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Helpers
  const monthNames = ['January','February','March','April','May','June','July','August','September','October','November','December'];

  const getPrevMonthLabels = (monthIndex) => {
    const prev1 = (monthIndex + 11) % 12;
    const prev2 = (monthIndex + 10) % 12;
    return [monthNames[prev1], monthNames[prev2]];
  };

  // Filtering: Month/Year only adjust headers; Product/Plan filter rows
  const filteredData = PAYMENT_SOURCE.filter(r => {
    const matchProduct = selectedProduct === 'All' || r.product === selectedProduct;
    const matchPlan = selectedPlan === 'All' || r.plan === selectedPlan;
    return matchProduct && matchPlan;
  });

  const paginatedData = filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active':
        return 'success';
      case 'Churned':
        return 'error';
      case 'New Joined':
        return 'info';
      default:
        return 'default';
    }
  };

  const getSubscriptionColor = (status) => {
    switch (status) {
      case 'Recurring':
        return 'success';
      case 'New Subscription':
        return 'info';
      case 'Cancelled':
        return 'error';
      case 'Refunded':
        return 'warning';
      default:
        return 'default';
    }
  };

  return (
    <Card
      sx={{
        p: 3,
        borderRadius: 4,
        boxShadow: '0 4px 15px rgba(0,0,0,0.08)',
        backgroundColor: theme.palette.background.paper,
      }}
    >
      <Box sx={{ mb: 3 }}>
        <Typography
          variant="h5"
          sx={{
            fontSize: '20px',
            fontWeight: 600,
            color: 'text.primary',
            mb: 1
          }}
        >
          Expanded Data
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {filteredData.length} Records
        </Typography>
      </Box>

      {/* Controls moved to parent page */}

      <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 2, backgroundColor: theme.palette.background.paper }}>
        <Table sx={{ minWidth: 1400 }}>
          <TableHead>
            <TableRow sx={{ backgroundColor: theme.palette.grey[100] }}>
              <TableCell sx={{ fontWeight: 600, color: 'text.primary', borderBottom: `1px solid ${theme.palette.divider}`, minWidth: 180 }}>
                Payment Date / Customer Status
              </TableCell>
              <TableCell sx={{ fontWeight: 600, color: 'text.primary', borderBottom: `1px solid ${theme.palette.divider}`, minWidth: 200 }}>
                Name / Email
              </TableCell>
              <TableCell sx={{ fontWeight: 600, color: 'text.primary', borderBottom: `1px solid ${theme.palette.divider}`, minWidth: 150 }}>
                Product
              </TableCell>
              <TableCell sx={{ fontWeight: 600, color: 'text.primary', borderBottom: `1px solid ${theme.palette.divider}`, minWidth: 120 }}>
                Plan
              </TableCell>
              <TableCell sx={{ fontWeight: 600, color: 'text.primary', borderBottom: `1px solid ${theme.palette.divider}`, minWidth: 120 }}>
                Payment Gateway
              </TableCell>
              <TableCell sx={{ fontWeight: 600, color: 'text.primary', borderBottom: `1px solid ${theme.palette.divider}`, minWidth: 140 }}>
                {getPrevMonthLabels(selectedMonth)[0]} MRR
              </TableCell>
              <TableCell sx={{ fontWeight: 600, color: 'text.primary', borderBottom: `1px solid ${theme.palette.divider}`, minWidth: 160 }}>
                {getPrevMonthLabels(selectedMonth)[1]} MRR
              </TableCell>
              <TableCell sx={{ fontWeight: 600, color: 'text.primary', borderBottom: `1px solid ${theme.palette.divider}`, minWidth: 100 }}>
                Billing Cycle
              </TableCell>
              <TableCell sx={{ fontWeight: 600, color: 'text.primary', borderBottom: `1px solid ${theme.palette.divider}`, minWidth: 120 }}>
                Advance Payment
              </TableCell>
              <TableCell sx={{ fontWeight: 600, color: 'text.primary', borderBottom: `1px solid ${theme.palette.divider}`, minWidth: 140 }}>
                Subscription Status
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedData.map((row) => (
              <TableRow 
                key={row.id} 
                hover
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
                {/* Payment Date / Customer Status */}
                <TableCell sx={{ borderBottom: `1px solid ${theme.palette.divider}`, py: 1.75, px: 2 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Chip
                      label={row.customerStatus}
                      color={getStatusColor(row.customerStatus)}
                      size="small"
                      variant="soft"
                    />
                    <Typography variant="body2" color="text.secondary">
                      {row.paymentDate || 'Invalid Date'}
                    </Typography>
                  </Box>
                </TableCell>

                {/* Name / Email */}
                <TableCell sx={{ borderBottom: `1px solid ${theme.palette.divider}`, py: 1.75, px: 2 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        color: 'primary.main', 
                        textDecoration: 'underline',
                        cursor: 'pointer',
                        fontWeight: 500
                      }}
                    >
                      {row.email}
                    </Typography>
                    <Typography variant="body2" color="text.primary" sx={{ fontWeight: 500 }}>
                      {row.name}
                    </Typography>
                  </Box>
                </TableCell>

                {/* Product */}
                <TableCell sx={{ borderBottom: `1px solid ${theme.palette.divider}`, py: 1.75, px: 2 }}>
                  <Chip
                    label={row.product}
                    size="small"
                    variant="soft"
                    color="info"
                  />
                </TableCell>

                {/* Plan */}
                <TableCell sx={{ borderBottom: `1px solid ${theme.palette.divider}`, py: 1.75, px: 2 }}>
                  <Chip
                    label={row.plan}
                    size="small"
                    variant="soft"
                    color="info"
                  />
                </TableCell>

                {/* Payment Gateway */}
                <TableCell sx={{ borderBottom: `1px solid ${theme.palette.divider}`, py: 1.75, px: 2 }}>
                  <Typography variant="body2" color="text.primary">
                    {row.paymentGateway}
                  </Typography>
                </TableCell>

                {/* Previous Month MRR (black text) */}
                <TableCell sx={{ borderBottom: `1px solid ${theme.palette.divider}`, py: 1.75, px: 2 }}>
                  <Typography 
                    variant="body2" 
                    color="text.primary" 
                    sx={{ 
                      fontWeight: 600,
                      textAlign: 'right'
                    }}
                  >
                    {row.previousMonthMRR}
                  </Typography>
                </TableCell>

                {/* Month before previous MRR (black text) */}
                <TableCell sx={{ borderBottom: `1px solid ${theme.palette.divider}`, py: 1.75, px: 2 }}>
                  <Typography 
                    variant="body2" 
                    color="text.primary" 
                    sx={{ 
                      fontWeight: 600,
                      textAlign: 'right'
                    }}
                  >
                    {row.currentMonthMRR}
                  </Typography>
                </TableCell>

                {/* Billing Cycle */}
                <TableCell sx={{ borderBottom: `1px solid ${theme.palette.divider}`, py: 1.75, px: 2 }}>
                  <Typography variant="body2" color="text.primary">
                    {row.frequency}
                  </Typography>
                </TableCell>

                {/* Advance Payment */}
                <TableCell sx={{ borderBottom: `1px solid ${theme.palette.divider}`, py: 1.75, px: 2 }}>
                  <Typography 
                    variant="body2" 
                    color="primary.main" 
                    sx={{ 
                      fontWeight: 600,
                      textAlign: 'right'
                    }}
                  >
                    {row.advancePayment}
                  </Typography>
                </TableCell>

                {/* Subscription Status */}
                <TableCell sx={{ borderBottom: `1px solid ${theme.palette.divider}`, py: 1.75, px: 2 }}>
                  <Chip
                    label={row.subscriptionStatus}
                    color={getSubscriptionColor(row.subscriptionStatus)}
                    size="small"
                    variant="soft"
                  />
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
          <Typography variant="body2" color="text.primary">{rowsPerPage}</Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant="body2" color="text.secondary">
            Showing {(page * rowsPerPage) + 1} - {Math.min((page + 1) * rowsPerPage, filteredData.length)} of {filteredData.length} Records
          </Typography>
        </Box>
      </Box>

      {/* Column Descriptions */}
      <Box sx={{ mt: 4, p: 3, backgroundColor: theme.palette.grey[50], borderRadius: 2 }}>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: 'text.primary' }}>
          Column Descriptions
        </Typography>
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 2 }}>
          {Object.entries(COLUMN_DESCRIPTIONS).map(([key, description]) => (
            <Box key={key} sx={{ mb: 1 }}>
              <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.primary', mb: 0.5 }}>
                {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}:
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {description}
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>
    </Card>
  );
}