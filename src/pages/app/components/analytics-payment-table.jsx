import { useState } from 'react';

import {
  Box,
  Card,
  Chip,
  Paper,
  Table,
  TableRow,
  useTheme,
  TableBody,
  TableCell,
  TableHead,
  Typography,
  TableContainer,
  TablePagination,
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
    paymentDate: '10/02/2025',
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
    paymentDate: '10/10/2025',
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
    paymentDate: '10/15/2025',
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
    paymentDate: '10/04/2025',
    product: 'Pabbly Connect',
    plan: 'Tier 1',
    paymentGateway: 'Stripe',
    previousMonthMRR: '$19',
    currentMonthMRR: '0',
    frequency: 'Monthly',
    advancePayment: '-',
    customerStatus: 'Active',
    subscriptionStatus: 'Cancelled'
  },
  {
    id: 2_3,
    name: 'Neeraj Agarwal',
    email: 'neeraj.agarwal@pabbly.com',
    paymentDate: '10/20/2025',
    product: 'Pabbly Connect',
    plan: 'Unlimited Plan',
    paymentGateway: 'RazorPay',
    previousMonthMRR: '$19',
    currentMonthMRR: '$19',
    frequency: 'Monthly',
    advancePayment: '-',
    customerStatus: 'Active',
    subscriptionStatus: 'Refunded'
  },
  {
    id: 3,
    name: 'Hardik Pradhan',
    email: 'hardik.pradhan@pabbly.com',
    paymentDate: '10/01/2025',
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
    paymentDate: '10/20/2025',
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
    paymentDate: '10/01/2025',
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
    paymentDate: '10/15/2025',
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
    paymentDate: '10/01/2025',
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
    paymentDate: '10/10/2025',
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
    paymentDate: '10/20/2025',
    product: 'Pabbly Workflow',
    plan: 'Pro Plan',
    paymentGateway: 'Stripe',
    previousMonthMRR: '$49',
    currentMonthMRR: '$49',
    frequency: 'Yearly',
    advancePayment: '$245', // 5 months remaining * $49
    customerStatus: 'Active',
    subscriptionStatus: 'Recurring'
  },
  {
    id: 11,
    name: 'Alice Cooper',
    email: 'alice.cooper@music.com',
    paymentDate: '10/05/2025',
    product: 'Pabbly Connect',
    plan: 'Tier 1',
    paymentGateway: 'PayPal',
    previousMonthMRR: '$0',
    currentMonthMRR: '$19',
    frequency: 'Monthly',
    advancePayment: '-',
    customerStatus: 'New Joined',
    subscriptionStatus: 'New Subscription'
  },
  {
    id: 12,
    name: 'Bob Dylan',
    email: 'bob.dylan@folk.com',
    paymentDate: '10/12/2025',
    product: 'Pabbly Email Marketing',
    plan: 'Basic Plan',
    paymentGateway: 'RazorPay',
    previousMonthMRR: '$29',
    currentMonthMRR: '$0',
    frequency: 'Monthly',
    advancePayment: '-',
    customerStatus: 'Churned',
    subscriptionStatus: 'Cancelled'
  },
  {
    id: 13,
    name: 'Carol King',
    email: 'carol.king@songwriter.com',
    paymentDate: '10/08/2025',
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
    id: 13_2,
    name: 'Carol King',
    email: 'carol.king@songwriter.com',
    paymentDate: '10/15/2025',
    product: 'Pabbly Workflow',
    plan: 'Basic Plan',
    paymentGateway: 'PayPal',
    previousMonthMRR: '$0',
    currentMonthMRR: '$29',
    frequency: 'Monthly',
    advancePayment: '-',
    customerStatus: 'Active',
    subscriptionStatus: 'New Subscription'
  },
  {
    id: 14,
    name: 'David Bowie',
    email: 'david.bowie@glam.com',
    paymentDate: '10/03/2025',
    product: 'Pabbly CRM',
    plan: 'Enterprise Plan',
    paymentGateway: 'RazorPay',
    previousMonthMRR: '$99',
    currentMonthMRR: '$99',
    frequency: 'Yearly',
    advancePayment: '$693', // 7 months remaining * $99
    customerStatus: 'Active',
    subscriptionStatus: 'Recurring'
  },
  {
    id: 15,
    name: 'Ella Fitzgerald',
    email: 'ella.fitzgerald@jazz.com',
    paymentDate: '10/18/2025',
    product: 'Pabbly Analytics',
    plan: 'Starter Plan',
    paymentGateway: 'Stripe',
    previousMonthMRR: '$15',
    currentMonthMRR: '$0',
    frequency: 'Monthly',
    advancePayment: '-',
    customerStatus: 'Churned',
    subscriptionStatus: 'Refunded'
  },
  {
    id: 16,
    name: 'Frank Sinatra',
    email: 'frank.sinatra@swing.com',
    paymentDate: '10/25/2025',
    product: 'Pabbly Connect',
    plan: 'Unlimited Plan',
    paymentGateway: 'PayPal',
    previousMonthMRR: '$79',
    currentMonthMRR: '$79',
    frequency: 'Yearly',
    advancePayment: '$395', // 5 months remaining * $79
    customerStatus: 'Active',
    subscriptionStatus: 'Recurring'
  },
  {
    id: 16_2,
    name: 'Frank Sinatra',
    email: 'frank.sinatra@swing.com',
    paymentDate: '10/28/2025',
    product: 'Pabbly Email Marketing',
    plan: 'Pro Plan',
    paymentGateway: 'RazorPay',
    previousMonthMRR: '$0',
    currentMonthMRR: '$49',
    frequency: 'Monthly',
    advancePayment: '-',
    customerStatus: 'Active',
    subscriptionStatus: 'New Subscription'
  }
];

const COLUMN_DESCRIPTIONS = {
  paymentDate: 'Date when the payment was processed (MM/DD/YYYY). Must fall within the selected month for the table view.',
  customerStatus: 'Customer-level status derived from all their subscriptions. Active: at least one subscription is Recurring or New Subscription. Churned: all subscriptions are Cancelled or Refunded. New Joined: first-time paying customer this month.',
  name: 'Customer full name for identification',
  email: 'Customer email address for communication',
  product: 'Name of the Pabbly product/service the customer is subscribed to',
  plan: 'Specific subscription plan tier or package name',
  paymentGateway: 'Payment processor used for the transaction (PayPal, Stripe, RazorPay)',
  previousMonthMRR: 'MRR from the previous month (e.g., September when October is selected). Shown per subscription.',
  currentMonthMRR: 'MRR in the selected month (e.g., October when October is selected). Shown per subscription.',
  frequency: 'Billing frequency - Monthly or Yearly subscription cycle',
  advancePayment: 'For yearly plans, remaining prepaid amount (remaining months × per‑month amount). "-" for monthly plans.',
  subscriptionStatus: 'Payment Status at subscription level. Recurring: ongoing billing this month; New Subscription: first paid month; Cancelled: stopped with no current MRR; Refunded: payment reversed, current MRR is $0.',
};

export function AnalyticsPaymentTable({ selectedMonth, selectedYear, selectedProduct = 'All', selectedPlan = 'All' }) {
  const theme = useTheme();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Helpers
  const getMonthLabels = (monthIndex) => {
    const shortMonth = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    const currentYear = selectedYear;
    const prevIndex = (monthIndex + 11) % 12;
    const prevYear = monthIndex === 0 ? currentYear - 1 : currentYear;
    return [`${shortMonth[monthIndex]} ${currentYear}`, `${shortMonth[prevIndex]} ${prevYear}`];
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

  const formatDate = (mdy) => {
    if (!mdy) return 'Invalid Date';
    const [month, day, year] = mdy.split('/').map((v) => parseInt(v, 10));
    if (!year || !month || !day) return 'Invalid Date';
    const dt = new Date(year, month - 1, day);
    const shortMonth = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    return `${shortMonth[dt.getMonth()]} ${day}, ${year}`;
  };

  return (
    <>
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
              <TableCell sx={{ fontWeight: 600, color: 'text.primary', borderBottom: `1px solid ${theme.palette.divider}`, minWidth: 120 }}>
                Payment Date
              </TableCell>
              <TableCell sx={{ fontWeight: 600, color: 'text.primary', borderBottom: `1px solid ${theme.palette.divider}`, minWidth: 200 }}>
                Email / Name
              </TableCell>
              <TableCell sx={{ fontWeight: 600, color: 'text.primary', borderBottom: `1px solid ${theme.palette.divider}`, minWidth: 150 }}>
                Product / Plan
              </TableCell>
              <TableCell sx={{ fontWeight: 600, color: 'text.primary', borderBottom: `1px solid ${theme.palette.divider}`, minWidth: 120, textAlign: 'center' }}>
                {getMonthLabels(selectedMonth)[1]} MRR
              </TableCell>
              <TableCell sx={{ fontWeight: 600, color: 'text.primary', borderBottom: `1px solid ${theme.palette.divider}`, minWidth: 120, textAlign: 'center' }}>
                {getMonthLabels(selectedMonth)[0]} MRR
              </TableCell>
              <TableCell sx={{ fontWeight: 600, color: 'text.primary', borderBottom: `1px solid ${theme.palette.divider}`, minWidth: 100 }}>
                Billing Cycle
              </TableCell>
              <TableCell sx={{ fontWeight: 600, color: 'text.primary', borderBottom: `1px solid ${theme.palette.divider}`, minWidth: 120, textAlign: 'center' }}>
                Advance Payment
              </TableCell>
              <TableCell sx={{ fontWeight: 600, color: 'text.primary', borderBottom: `1px solid ${theme.palette.divider}`, minWidth: 120, textAlign: 'center' }}>
                Customer Status
              </TableCell>
              <TableCell sx={{ fontWeight: 600, color: 'text.primary', borderBottom: `1px solid ${theme.palette.divider}`, minWidth: 120, textAlign: 'right' }}>
                Payment Status
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
                {/* Payment Date */}
                <TableCell sx={{ borderBottom: `1px solid ${theme.palette.divider}`, py: 1.75, px: 2 }}>
                  <Typography variant="body2" color="text.primary" sx={{ fontWeight: 500 }}>
                    {formatDate(row.paymentDate)}
                  </Typography>
                </TableCell>

                {/* Email / Name */}
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

                {/* Product / Plan */}
                <TableCell sx={{ borderBottom: `1px solid ${theme.palette.divider}`, py: 1.75, px: 2 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography variant="body2" color="text.primary" sx={{ fontWeight: 500 }}>
                      {row.product}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {row.plan}
                    </Typography>
                  </Box>
                </TableCell>

                {/* Previous Month MRR (black text, center aligned) */}
                <TableCell sx={{ borderBottom: `1px solid ${theme.palette.divider}`, py: 1.75, px: 2, textAlign: 'center' }}>
                  <Typography 
                    variant="body2" 
                    color="text.primary" 
                    sx={{ 
                      fontWeight: 600
                    }}
                  >
                    {row.previousMonthMRR}
                  </Typography>
                </TableCell>

                {/* Selected Month MRR (black text, center aligned) */}
                <TableCell sx={{ borderBottom: `1px solid ${theme.palette.divider}`, py: 1.75, px: 2, textAlign: 'center' }}>
                  <Typography 
                    variant="body2" 
                    color="text.primary" 
                    sx={{ 
                      fontWeight: 600
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

                {/* Advance Payment (center aligned) */
                }
                <TableCell sx={{ borderBottom: `1px solid ${theme.palette.divider}`, py: 1.75, px: 2, textAlign: 'center' }}>
                  <Typography 
                    variant="body2" 
                    color="primary.main" 
                    sx={{ 
                      fontWeight: 600
                    }}
                  >
                    {row.advancePayment}
                  </Typography>
                </TableCell>

                {/* Customer Status (center aligned) */}
                <TableCell sx={{ borderBottom: `1px solid ${theme.palette.divider}`, py: 1.75, px: 2, textAlign: 'center' }}>
                  <Chip
                    label={row.customerStatus}
                    color={getStatusColor(row.customerStatus)}
                    size="small"
                    variant="soft"
                    sx={{ height: '22px', fontSize: '0.75rem' }}
                  />
                </TableCell>

                {/* Payment Status (right aligned) */}
                <TableCell sx={{ borderBottom: `1px solid ${theme.palette.divider}`, py: 1.75, px: 2, textAlign: 'right' }}>
                  <Chip
                    label={row.subscriptionStatus}
                    color={getSubscriptionColor(row.subscriptionStatus)}
                    size="small"
                    variant="soft"
                    sx={{ height: '22px', fontSize: '0.75rem' }}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      <TablePagination
        component="div"
        count={filteredData.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        rowsPerPageOptions={[25, 50, 100]}
      />
    </Card>

    {/* Column Descriptions Section */}
    <Card sx={{ mt: 4, p: 3, borderRadius: 2, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
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
    </Card>

    {/* Example Cases Section */}
    <Card sx={{ mt: 3, p: 3, borderRadius: 2, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: 'text.primary' }}>
          Example Cases (Payment Status vs Customer Status)
        </Typography>
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: 2 }}>
          <Box sx={{ p: 2, border: `1px solid ${theme.palette.divider}`, borderRadius: 1, backgroundColor: theme.palette.background.paper }}>
            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>A) New Subscription → Customer Active</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              <strong>Example:</strong> Alice Cooper buys Pabbly Connect on 10/05. Payment Status: New Subscription; Sept MRR: $0, Oct MRR: $19.
            </Typography>
            <Typography variant="body2" color="text.secondary">
              <strong>Customer Status:</strong> Active (has at least one active subscription).
            </Typography>
          </Box>
          <Box sx={{ p: 2, border: `1px solid ${theme.palette.divider}`, borderRadius: 1, backgroundColor: theme.palette.background.paper }}>
            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>B) Recurring → Customer Active</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              <strong>Example:</strong> Carol King continues Tier 2 on 10/08. Payment Status: Recurring; Sept MRR: $39, Oct MRR: $39.
            </Typography>
            <Typography variant="body2" color="text.secondary">
              <strong>Customer Status:</strong> Active.
            </Typography>
          </Box>
          <Box sx={{ p: 2, border: `1px solid ${theme.palette.divider}`, borderRadius: 1, backgroundColor: theme.palette.background.paper }}>
            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>C) Cancelled → Customer Active (other plan is active)</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              <strong>Example:</strong> Neeraj cancels Tier 1 (Oct MRR: $0) but still has Tier 2 Recurring. Payment Status: Cancelled for Tier 1.
            </Typography>
            <Typography variant="body2" color="text.secondary">
              <strong>Customer Status:</strong> Active (because another subscription is active).
            </Typography>
          </Box>
          <Box sx={{ p: 2, border: `1px solid ${theme.palette.divider}`, borderRadius: 1, backgroundColor: theme.palette.background.paper }}>
            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>D) Refunded → Customer Churned</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              <strong>Example:</strong> Ella Fitzgerald gets refund on 10/18 for Starter Plan. Payment Status: Refunded; Oct MRR: $0.
            </Typography>
            <Typography variant="body2" color="text.secondary">
              <strong>Customer Status:</strong> Churned (all subscriptions are Cancelled/Refunded).
            </Typography>
          </Box>
          <Box sx={{ p: 2, border: `1px solid ${theme.palette.divider}`, borderRadius: 1, backgroundColor: theme.palette.background.paper }}>
            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>E) Upgraded (MRR increased)</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              <strong>Example:</strong> Nimesh adds Unlimited Plan (New Subscription $79). Sept total MRR: $58; Oct total MRR: $137.
            </Typography>
            <Typography variant="body2" color="text.secondary">
              <strong>Consolidated:</strong> Upgraded. Individual row shows New Subscription.
            </Typography>
          </Box>
          <Box sx={{ p: 2, border: `1px solid ${theme.palette.divider}`, borderRadius: 1, backgroundColor: theme.palette.background.paper }}>
            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>F) Downgraded (MRR decreased)</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              <strong>Example:</strong> Neeraj moves from $58 to $39 total MRR. Sept MRR: $58; Oct MRR: $39.
            </Typography>
            <Typography variant="body2" color="text.secondary">
              <strong>Consolidated:</strong> Downgraded; latest active subscription rows remain Recurring.
            </Typography>
          </Box>
          <Box sx={{ p: 2, border: `1px solid ${theme.palette.divider}`, borderRadius: 1, backgroundColor: theme.palette.background.paper }}>
            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>G) Yearly plan with Advance Payment</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              <strong>Example:</strong> David Bowie pays yearly for Enterprise Plan ($99/mo). Oct MRR: $99 and Advance Payment shows remaining prepaid.
            </Typography>
            <Typography variant="body2" color="text.secondary">
              <strong>Status:</strong> Payment Status: Recurring; Customer Status: Active.
            </Typography>
          </Box>
          <Box sx={{ p: 2, border: `1px solid ${theme.palette.divider}`, borderRadius: 1, backgroundColor: theme.palette.background.paper }}>
            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>H) Multiple Products/Plans</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              <strong>Example:</strong> Frank Sinatra has both Pabbly Connect (Unlimited $79) and Pabbly Email Marketing (Pro $49).
            </Typography>
            <Typography variant="body2" color="text.secondary">
              <strong>Consolidated:</strong> Shows &quot;Multiple Products&quot; / &quot;Multiple Plans&quot; in consolidated view.
            </Typography>
          </Box>
        </Box>
        <Box sx={{ mt: 2, p: 2, backgroundColor: theme.palette.primary.lighter, borderRadius: 1 }}>
          <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600, color: 'primary.darker' }}>
            Status Rules Summary
          </Typography>
          <Typography variant="body2" color="text.secondary">
            • Payment Status is per subscription: Recurring, New Subscription, Cancelled, Refunded<br/>
            • Customer Status is per customer: Active if any subscription is Recurring/New Subscription; Churned only if all are Cancelled/Refunded<br/>
            • New Joined: First-time paying customer this month
          </Typography>
        </Box>
    </Card>
    </>
  );
}