import { useMemo, useState } from 'react';

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
  paymentDate: 'The date when the payment was processed (MMM DD, YYYY). It must fall within the selected month for the current table view.',
  customerStatus: 'Customer-level status derived from all their active subscriptions. Active: At least one subscription is Recurring or New Subscription. Churned: All subscriptions are Cancelled or Refunded. New Joined: First-time paying customer in the current month.',
  name: 'Full name of the customer for identification.',
  email: 'Customer’s email address used for communication and account reference.',
  product: 'The name of the Pabbly product or service the customer is subscribed to.',
  plan: 'The specific subscription plan tier or package name under the product.',
  previousMonthMRR: 'Monthly Recurring Revenue (MRR) from the previous month — for example, September when October is selected. Shown per subscription.',
  currentMonthMRR: 'Monthly Recurring Revenue (MRR) for the selected month — for example, October when October is selected. Shown per subscription.',
  frequency: 'Billing frequency of the subscription — Monthly or Yearly.',
  advancePayment: 'For yearly plans, this shows the remaining prepaid amount (calculated as remaining months × per‑month amount). Shown as “—” for monthly plans.',
  subscriptionStatus: 'Represents the payment status at the subscription level: Recurring (ongoing billing for the month), New Subscription (first paid month), Cancelled (stopped with no current MRR), Refunded (payment reversed; current MRR becomes $0).',
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

  const toNumber = (value) => {
    const n = Number(String(value).replace(/[^0-9.-]/g, ''));
    return Number.isFinite(n) ? n : 0;
  };

  const formatMoney = (value) => {
    if (value === '-' || value === '' || value == null) return '-';
    const n = toNumber(value);
    return `$${n.toFixed(2)}`;
  };

  const newJoinedByEmail = useMemo(() => {
    const map = new Map();
    filteredData.forEach((row) => {
      const { email } = row;
      const prev = map.get(email) || { allNew: true, anyPrev: false };
      const isNewSub = row.subscriptionStatus === 'New Subscription';
      const hasPrev = toNumber(row.previousMonthMRR) > 0;
      prev.allNew = prev.allNew && isNewSub;
      prev.anyPrev = prev.anyPrev || hasPrev;
      map.set(email, prev);
    });
    const result = {};
    map.forEach((v, k) => { result[k] = v.allNew && !v.anyPrev; });
    return result;
  }, [filteredData]);

  return (
    <>
      <Card
        sx={{
          p: 0,
          borderRadius: 4,
          boxShadow: '0 4px 15px rgba(0,0,0,0.08)',
          backgroundColor: theme.palette.background.paper,
        }}
      >
      <Box sx={{ px: 3, pt: 3, pb: 2 }}>
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

      <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 0, backgroundColor: theme.palette.background.paper }}>
        <Table size="small" sx={{ minWidth: 1400, '& .MuiTableCell-body': { py: 1.25, px: 2 }, '& .MuiTableRow-root': { height: 'auto' } }}>
          <TableHead sx={{ '& th': { py: 2 }, '& .MuiTableRow-root': { height: 'auto' } }}>
            <TableRow sx={{ backgroundColor: theme.palette.grey[100] }}>
              <TableCell sx={{ fontWeight: 600, color: 'text.primary', borderBottom: `1px solid ${theme.palette.divider}`, minWidth: 140 }}>
                Payment On (A)
              </TableCell>
              <TableCell sx={{ fontWeight: 600, color: 'text.primary', borderBottom: `1px solid ${theme.palette.divider}`, minWidth: 200 }}>
                Email / Name (B)
              </TableCell>
              <TableCell sx={{ fontWeight: 600, color: 'text.primary', borderBottom: `1px solid ${theme.palette.divider}`, minWidth: 150 }}>
                Product / Plan (C)
              </TableCell>
              <TableCell sx={{ fontWeight: 600, color: 'text.primary', borderBottom: `1px solid ${theme.palette.divider}`, minWidth: 120, textAlign: 'center' }}>
                <Typography variant="subtitle2" sx={{ m: 0, p: 0, letterSpacing: 0 }}>{getMonthLabels(selectedMonth)[1]} MRR (D)</Typography>
              </TableCell>
              <TableCell sx={{ fontWeight: 600, color: 'text.primary', borderBottom: `1px solid ${theme.palette.divider}`, minWidth: 120, textAlign: 'center' }}>
                <Typography variant="subtitle2" sx={{ m: 0, p: 0, letterSpacing: 0 }}>{getMonthLabels(selectedMonth)[0]} MRR (E)</Typography>
              </TableCell>
              <TableCell sx={{ fontWeight: 600, color: 'text.primary', borderBottom: `1px solid ${theme.palette.divider}`, minWidth: 100 }}>
                Billing Cycle (F)
              </TableCell>
              <TableCell sx={{ fontWeight: 600, color: 'text.primary', borderBottom: `1px solid ${theme.palette.divider}`, minWidth: 120, textAlign: 'center' }}>
                Advance Payment (G)
              </TableCell>
              <TableCell sx={{ fontWeight: 600, color: 'text.primary', borderBottom: `1px solid ${theme.palette.divider}`, minWidth: 120, textAlign: 'center' }}>
                Customer Status (H)
              </TableCell>
              <TableCell sx={{ fontWeight: 600, color: 'text.primary', borderBottom: `1px solid ${theme.palette.divider}`, minWidth: 120, textAlign: 'right' }}>
                Payment Status (I)
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody sx={{ '& td': { py: 1.5 }, '& .MuiTableRow-root': { height: 'auto' } }}>
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
                <TableCell sx={{ borderBottom: `1px solid ${theme.palette.divider}`, py: 1.75, px: 2, minWidth: 140 }}>
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
                    {formatMoney(row.previousMonthMRR)}
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
                    {formatMoney(row.currentMonthMRR)}
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
                    {formatMoney(row.advancePayment)}
                  </Typography>
                </TableCell>

                {/* Customer Status (center aligned) */}
                <TableCell sx={{ borderBottom: `1px solid ${theme.palette.divider}`, py: 1.75, px: 2, textAlign: 'center' }}>
                  <Chip
                    label={newJoinedByEmail[row.email] ? 'New Joined' : row.customerStatus}
                    color={getStatusColor(newJoinedByEmail[row.email] ? 'New Joined' : row.customerStatus)}
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

    {/* Info Tables */}
    <Card sx={{ mt: 4, p: 0, borderRadius: 2, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
      <Box sx={{ px: 3, pt: 3, pb: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 600, color: 'text.primary' }}>Customer Status</Typography>
      </Box>
      <Table size="small" sx={{ '& .MuiTableCell-body': { py: 1.25, px: 2 } }}>
        <TableHead>
          <TableRow sx={{ backgroundColor: theme.palette.grey[50] }}>
            <TableCell>Customer Status</TableCell>
            <TableCell>Definition</TableCell>
            <TableCell>Condition / Logic</TableCell>
            <TableCell>Example Scenario</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow><TableCell>🟢 Active</TableCell><TableCell>The customer currently has at least one active paid subscription.</TableCell><TableCell>At least one subscription is Recurring</TableCell><TableCell>Customer continues Tier 2 plan this month → Active.</TableCell></TableRow>
          <TableRow><TableCell>🔵 New Joined</TableCell><TableCell>The customer made their first-ever payment during the selected month.</TableCell><TableCell>First-time paying customer; no prior billing history in previous months.</TableCell><TableCell>Customer subscribes for the first time in October → New Joined</TableCell></TableRow>
          <TableRow><TableCell>🔴 Churned</TableCell><TableCell>The customer has no active paid subscriptions remaining.</TableCell><TableCell>All subscriptions are Cancelled or Refunded.</TableCell><TableCell>Customer cancels or refunds all plans → Churned.</TableCell></TableRow>
        </TableBody>
      </Table>
    </Card>

    <Card sx={{ mt: 3, p: 0, borderRadius: 2, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
      <Box sx={{ px: 3, pt: 3, pb: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 600, color: 'text.primary' }}>Payment Status</Typography>
      </Box>
      <Table size="small" sx={{ '& .MuiTableCell-body': { py: 1.25, px: 2 } }}>
        <TableHead>
          <TableRow sx={{ backgroundColor: theme.palette.grey[50] }}>
            <TableCell>Payment Status</TableCell>
            <TableCell>Description</TableCell>
            <TableCell>Effect on Customer Status</TableCell>
            <TableCell>Example Scenario</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow><TableCell>🟢 Recurring</TableCell><TableCell>Payment processed for the ongoing billing cycle.</TableCell><TableCell>Customer remains Active.</TableCell><TableCell>Customer continues existing subscription.</TableCell></TableRow>
          <TableRow><TableCell>🟢 New Subscription</TableCell><TableCell>First successful payment for a new subscription.</TableCell><TableCell>Customer becomes Active.</TableCell><TableCell>Customer subscribes to Tier 1 plan for the first time.</TableCell></TableRow>
          <TableRow><TableCell>🔴 Cancelled</TableCell><TableCell>Subscription stopped; no current MRR.</TableCell><TableCell>Customer may still be Active if another plan is active or else the customer is churned.</TableCell><TableCell>One plan cancelled, another still Recurring.</TableCell></TableRow>
          <TableRow><TableCell>🔴 Refunded</TableCell><TableCell>Payment reversed; current MRR becomes $0.</TableCell><TableCell>Customer may still be Active if another plan is active or else the customer is churned.</TableCell><TableCell>If we refund for the only subscription customer has → Churned.</TableCell></TableRow>
          <TableRow><TableCell>🟠 Upgraded</TableCell><TableCell>Customer’s total MRR increased compared to previous month.</TableCell><TableCell>Customer remains Active.</TableCell><TableCell>Customer moves from $58 → $137 MRR.</TableCell></TableRow>
          <TableRow><TableCell>🟡 Downgraded</TableCell><TableCell>Customer’s total MRR decreased compared to previous month.</TableCell><TableCell>Customer remains Active.</TableCell><TableCell>Customer moves from $58 → $39 MRR.</TableCell></TableRow>
        </TableBody>
      </Table>
    </Card>

    <Card sx={{ mt: 3, p: 0, borderRadius: 2, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
      <Box sx={{ px: 3, pt: 3, pb: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 600, color: 'text.primary' }}>Column Name</Typography>
      </Box>
      <Table size="small" sx={{ '& .MuiTableCell-body': { py: 1.25, px: 2 } }}>
        <TableHead>
          <TableRow sx={{ backgroundColor: theme.palette.grey[50] }}>
            <TableCell>Column Name</TableCell>
            <TableCell>Description / Purpose</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow><TableCell>Payment Date</TableCell><TableCell>The date when the payment was processed (MMM DD, YYYY). Must fall within the selected month for the table view.</TableCell></TableRow>
          <TableRow><TableCell>Name</TableCell><TableCell>Full name of the customer for identification.</TableCell></TableRow>
          <TableRow><TableCell>Email</TableCell><TableCell>Customer’s email address used for communication and as a unique identifier for consolidation.</TableCell></TableRow>
          <TableRow><TableCell>Product</TableCell><TableCell>The name of the Pabbly product or service the customer is subscribed to.</TableCell></TableRow>
          <TableRow><TableCell>Plan</TableCell><TableCell>The specific subscription plan tier or package name under the product.</TableCell></TableRow>
          <TableRow><TableCell>Previous Month MRR</TableCell><TableCell>Monthly Recurring Revenue (MRR) from the previous month (e.g., September when October is selected). Shown per subscription.</TableCell></TableRow>
          <TableRow><TableCell>Current Month MRR</TableCell><TableCell>Monthly Recurring Revenue (MRR) for the selected month (e.g., October when October is selected). Shown per subscription.</TableCell></TableRow>
          <TableRow><TableCell>Frequency</TableCell><TableCell>Billing frequency of the subscription — Monthly or Yearly.</TableCell></TableRow>
          <TableRow><TableCell>Advance Payment</TableCell><TableCell>For yearly plans, shows the remaining prepaid amount (remaining months × per-month value). Displays “—” for monthly plans.</TableCell></TableRow>
          <TableRow><TableCell>Subscription Status</TableCell><TableCell>Status at the subscription level: Recurring, New Subscription, Cancelled, or Refunded.</TableCell></TableRow>
          <TableRow><TableCell>Customer Status</TableCell><TableCell>Status at the customer level, based on all active subscriptions: Active, Churned, or New Joined.</TableCell></TableRow>
        </TableBody>
      </Table>
    </Card>

    <Card sx={{ mt: 3, p: 0, borderRadius: 2, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
      <Box sx={{ px: 3, pt: 3, pb: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 600, color: 'text.primary' }}>Status Logic Summary</Typography>
      </Box>
      <Table size="small" sx={{ '& .MuiTableCell-body': { py: 1.25, px: 2 } }}>
        <TableHead>
          <TableRow sx={{ backgroundColor: theme.palette.grey[50] }}>
            <TableCell>Logic Rule</TableCell>
            <TableCell>Condition</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow><TableCell>If any subscription is Recurring or New Subscription</TableCell><TableCell>Customer = Active</TableCell></TableRow>
          <TableRow><TableCell>If all subscriptions are Cancelled or Refunded</TableCell><TableCell>Customer = Churned</TableCell></TableRow>
          <TableRow><TableCell>If first-ever payment made this month</TableCell><TableCell>Customer = New Joined</TableCell></TableRow>
          <TableRow><TableCell>If total MRR (Oct) &gt; previous month (Sept)</TableCell><TableCell>Status = Upgraded</TableCell></TableRow>
          <TableRow><TableCell>If total MRR (Oct) &lt; previous month (Sept)</TableCell><TableCell>Status = Downgraded</TableCell></TableRow>
          <TableRow><TableCell>If MRR unchanged</TableCell><TableCell>Status = Recurring</TableCell></TableRow>
        </TableBody>
      </Table>
    </Card>
    </>
  );
}