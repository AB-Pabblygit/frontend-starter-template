import { useMemo, useState, useCallback } from 'react';

import {
  Box,
  Card,
  Chip,
  Paper,
  Table,
  Collapse,
  TableRow,
  useTheme,
  TableBody,
  TableCell,
  TableHead,
  IconButton,
  Typography,
  TableContainer,
  TablePagination,
} from '@mui/material';

import { Iconify } from 'src/components/iconify';

import { PAYMENT_SOURCE } from './analytics-payment-table';

function parseAmount(value) {
  if (!value || value === '-' ) return 0;
  const n = Number(String(value).replace(/[^0-9.-]/g, ''));
  return Number.isFinite(n) ? n : 0;
}

export function AnalyticsConsolidatedTable({ selectedMonth, selectedYear, selectedProduct = 'All', selectedPlan = 'All' }) {
  const theme = useTheme();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [expandedEmail, setExpandedEmail] = useState(null);

  const formatDate = (mdy) => {
    if (!mdy) return 'Invalid Date';
    const [month, day, year] = mdy.split('/').map((v) => parseInt(v, 10));
    if (!year || !month || !day) return 'Invalid Date';
    const dt = new Date(year, month - 1, day);
    const shortMonth = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    return `${shortMonth[dt.getMonth()]} ${day}, ${year}`;
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const getMonthLabels = useCallback((monthIndex) => {
    const shortMonth = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    const currentYear = selectedYear;
    const prevIndex = (monthIndex + 11) % 12;
    const prevYear = monthIndex === 0 ? currentYear - 1 : currentYear;
    return [
      `${shortMonth[monthIndex]} ${currentYear}`,
      `${shortMonth[prevIndex]} ${prevYear}`
    ];
  }, [selectedYear]);

  const filtered = useMemo(() => PAYMENT_SOURCE.filter(r => {
    const byProduct = selectedProduct === 'All' || r.product === selectedProduct;
    const byPlan = selectedPlan === 'All' || r.plan === selectedPlan;
    return byProduct && byPlan;
  }), [selectedProduct, selectedPlan]);

  const rows = useMemo(() => {
    const map = new Map();
    filtered.forEach((row) => {
      const key = row.email;
      const group = map.get(key) || { email: row.email, name: row.name, items: [] };
      group.items.push(row);
      map.set(key, group);
    });

    const [prevLabel, prevPrevLabel] = getMonthLabels(selectedMonth);

    const consolidated = Array.from(map.values()).map(group => {
      const products = Array.from(new Set(group.items.map(i => i.product)));
      const plans = Array.from(new Set(group.items.map(i => i.plan)));

              const shortMonth = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
              const monthsSet = new Set(
                group.items
                  .map(i => i.paymentDate)
                  .filter(Boolean)
                  .map(d => {
                    // Parse MM/DD/YYYY format correctly
                    const [month, day, year] = d.split('/');
                    const dt = new Date(parseInt(year, 10), parseInt(month, 10) - 1, parseInt(day, 10));
                    return `${shortMonth[dt.getMonth()]}, ${dt.getFullYear()}`;
                  })
              );

      const sumSeptember = group.items.reduce((acc, i) => acc + parseAmount(i.previousMonthMRR), 0);
      const sumOctober = group.items.reduce((acc, i) => acc + parseAmount(i.currentMonthMRR), 0);

      // Check if customer has at least one active subscription (New Subscription or Recurring)
      const hasActiveSubscription = group.items.some(i => 
        i.subscriptionStatus === 'New Subscription' || i.subscriptionStatus === 'Recurring'
      );

      // Determine customer status: Active if has any active subscription, Churned if all are cancelled/refunded
      let customerStatus = 'Churned'; // Default to churned
      if (hasActiveSubscription) {
        customerStatus = 'Active';
      }

      // Determine consolidated status based on subscription statuses and MRR
      let consolidatedStatus = 'Recurring';
      
      if (!hasActiveSubscription) {
        // If no active subscriptions, check the most recent subscription status
        const subscriptionStatuses = group.items.map(i => i.subscriptionStatus);
        if (subscriptionStatuses.includes('Refunded')) {
          consolidatedStatus = 'Refunded';
        } else if (subscriptionStatuses.includes('Cancelled')) {
          consolidatedStatus = 'Cancelled';
        } else {
          consolidatedStatus = 'Cancelled'; // Default for no active subscriptions
        }
      } else if (sumSeptember === 0 && sumOctober > 0) {
        consolidatedStatus = 'New Subscription';
      } else if (sumOctober > sumSeptember) {
        consolidatedStatus = 'Upgraded';
      } else if (sumOctober < sumSeptember) {
        consolidatedStatus = 'Downgraded';
      }

      const frequencySet = new Set(group.items.map(i => i.frequency));
      const frequency = frequencySet.size === 1 ? Array.from(frequencySet)[0] : 'Mixed';

      // Show latest status with a date (from most recent paymentDate)
      const withDate = group.items.filter(i => i.paymentDate);
      withDate.sort((a,b) => new Date(b.paymentDate) - new Date(a.paymentDate));
      const latest = withDate[0];
      // Calculate advance payment for consolidated view
      const totalAdvancePayment = group.items.reduce((acc, item) => {
        if (item.frequency === 'Yearly' && item.advancePayment && item.advancePayment !== '-') {
          return acc + parseAmount(item.advancePayment);
        }
        return acc;
      }, 0);

      return {
        email: group.email,
        name: group.name,
        paymentMonths: monthsSet.size ? Array.from(monthsSet).join(', ') : '-',
        latestStatus: customerStatus, // Use calculated customer status
        product: products.length === 1 ? products[0] : 'Multiple Products',
        plan: plans.length === 1 ? plans[0] : 'Multiple Plans',
        prevPrevMRR: `$${sumSeptember.toFixed(2)}`,
        prevMRR: `$${sumOctober.toFixed(2)}`,
        frequency,
        consolidatedStatus,
        prevLabel,
        prevPrevLabel,
        advancePayment: totalAdvancePayment > 0 ? `$${totalAdvancePayment.toFixed(2)}` : '-',
        items: group.items,
      };
    });

    // simple pagination here
    return consolidated;
  }, [filtered, selectedMonth, getMonthLabels]);

  const paginated = rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  // Match expanded table colors
  const customerStatusColor = (status) => {
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

  const statusColor = (status) => {
    switch (status) {
      case 'Upgraded':
        return 'success';
      case 'Downgraded':
        return 'warning';
      case 'Cancelled':
        return 'error';
      case 'Refunded':
        return 'warning';
      case 'New Subscription':
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
    <>
      <Card sx={{ p: 3, borderRadius: 4, boxShadow: '0 4px 15px rgba(0,0,0,0.08)', backgroundColor: theme.palette.background.paper }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" sx={{ fontSize: '20px', fontWeight: 600, color: 'text.primary', mb: 1 }}>
          Consolidated Data
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {rows.length} Customers
        </Typography>
      </Box>

      <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 2, backgroundColor: theme.palette.background.paper }}>
        <Table sx={{ minWidth: 1400 }}>
          <TableHead>
            <TableRow sx={{ backgroundColor: theme.palette.grey[100] }}>
              <TableCell sx={{ fontWeight: 600, color: 'text.primary', borderBottom: `1px solid ${theme.palette.divider}`, minWidth: 120 }}>
                Payment Months
              </TableCell>
              <TableCell sx={{ fontWeight: 600, color: 'text.primary', borderBottom: `1px solid ${theme.palette.divider}` }}>Email / Name</TableCell>
              <TableCell sx={{ fontWeight: 600, color: 'text.primary', borderBottom: `1px solid ${theme.palette.divider}` }}>Product / Plan</TableCell>
              <TableCell sx={{ fontWeight: 600, color: 'text.primary', borderBottom: `1px solid ${theme.palette.divider}`, textAlign: 'center' }}>{rows[0]?.prevPrevLabel || 'Previous Month'} MRR</TableCell>
              <TableCell sx={{ fontWeight: 600, color: 'text.primary', borderBottom: `1px solid ${theme.palette.divider}`, textAlign: 'center' }}>{rows[0]?.prevLabel || 'Selected Month'} MRR</TableCell>
              <TableCell sx={{ fontWeight: 600, color: 'text.primary', borderBottom: `1px solid ${theme.palette.divider}`, textAlign: 'center' }}>Advance Payment</TableCell>
              <TableCell sx={{ fontWeight: 600, color: 'text.primary', borderBottom: `1px solid ${theme.palette.divider}`, minWidth: 120, textAlign: 'center' }}>
                Customer Status
              </TableCell>
              <TableCell sx={{ fontWeight: 600, color: 'text.primary', borderBottom: `1px solid ${theme.palette.divider}`, minWidth: 120, textAlign: 'right' }}>
                Payment Status
              </TableCell>
              <TableCell sx={{ fontWeight: 600, color: 'text.primary', borderBottom: `1px solid ${theme.palette.divider}` }} />
            </TableRow>
          </TableHead>
          <TableBody>
            {paginated.map((r) => (
              <>
                <TableRow key={r.email} hover>
                  <TableCell>
                    <Typography variant="body2" color="text.primary" sx={{ fontWeight: 500 }}>{r.paymentMonths}</Typography>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                      <Typography variant="body2" sx={{ color: 'primary.main', textDecoration: 'underline', fontWeight: 500 }}>{r.email}</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>{r.name}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                      <Typography variant="body2" color="text.primary" sx={{ fontWeight: 500 }}>{r.product}</Typography>
                      <Typography variant="body2" color="text.secondary">{r.plan}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell sx={{ textAlign: 'center', fontWeight: 600 }}>{r.prevPrevMRR}</TableCell>
                  <TableCell sx={{ textAlign: 'center', fontWeight: 600 }}>{r.prevMRR}</TableCell>
                  <TableCell sx={{ textAlign: 'center', fontWeight: 600, color: 'primary.main' }}>
                    {r.advancePayment || '-'}
                  </TableCell>
                  <TableCell sx={{ textAlign: 'center' }}>
                    <Chip size="small" variant="soft" color={customerStatusColor(r.latestStatus)} label={r.latestStatus} sx={{ height: '22px', fontSize: '0.75rem' }} />
                  </TableCell>
                  <TableCell sx={{ textAlign: 'right' }}>
                    <Chip size="small" variant="soft" color={statusColor(r.consolidatedStatus)} label={r.consolidatedStatus} sx={{ height: '22px', fontSize: '0.75rem' }} />
                  </TableCell>
                  <TableCell width={48} align="right">
                    <IconButton size="small" onClick={() => setExpandedEmail(expandedEmail === r.email ? null : r.email)}>
                      <Iconify icon={expandedEmail === r.email ? 'solar:alt-arrow-up-bold' : 'solar:alt-arrow-down-bold'} width={18} />
                    </IconButton>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell colSpan={9} sx={{ py: 0, border: 0 }}>
                    <Collapse in={expandedEmail === r.email} timeout="auto" unmountOnExit>
                      <Box sx={{ px: 2, py: 2 }}>
                        <Typography variant="subtitle2" sx={{ mb: 1 }}>Subscriptions</Typography>
                        <Table size="small">
                          <TableHead>
                            <TableRow sx={{ backgroundColor: theme.palette.grey[50] }}>
                              <TableCell sx={{ fontWeight: 600, color: 'text.primary', borderBottom: `1px solid ${theme.palette.divider}`, minWidth: 120 }}>
                                Payment Date
                              </TableCell>
                              <TableCell sx={{ fontWeight: 600, color: 'text.primary', borderBottom: `1px solid ${theme.palette.divider}` }}>Email / Name</TableCell>
                              <TableCell sx={{ fontWeight: 600, color: 'text.primary', borderBottom: `1px solid ${theme.palette.divider}` }}>Product / Plan</TableCell>
                              <TableCell sx={{ fontWeight: 600, color: 'text.primary', borderBottom: `1px solid ${theme.palette.divider}`, textAlign: 'center' }}>{r.prevPrevLabel} MRR</TableCell>
                              <TableCell sx={{ fontWeight: 600, color: 'text.primary', borderBottom: `1px solid ${theme.palette.divider}`, textAlign: 'center' }}>{r.prevLabel} MRR</TableCell>
                              <TableCell sx={{ fontWeight: 600, color: 'text.primary', borderBottom: `1px solid ${theme.palette.divider}` }}>Billing Cycle</TableCell>
                              <TableCell sx={{ fontWeight: 600, color: 'text.primary', borderBottom: `1px solid ${theme.palette.divider}`, textAlign: 'center' }}>Advance Payment</TableCell>
                              <TableCell sx={{ fontWeight: 600, color: 'text.primary', borderBottom: `1px solid ${theme.palette.divider}`, minWidth: 120, textAlign: 'center' }}>
                                Customer Status
                              </TableCell>
                              <TableCell sx={{ fontWeight: 600, color: 'text.primary', borderBottom: `1px solid ${theme.palette.divider}`, minWidth: 120, textAlign: 'right' }}>
                                Payment Status
                              </TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {r.items.map((it, idx) => (
                              <TableRow key={idx}>
                                <TableCell>
                                  <Typography variant="body2" color="text.primary" sx={{ fontWeight: 500 }}>
                                    {formatDate(it.paymentDate)}
                                  </Typography>
                                </TableCell>
                                <TableCell>
                                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                                    <Typography variant="body2" sx={{ color: 'primary.main', textDecoration: 'underline', fontWeight: 500 }}>{it.email}</Typography>
                                    <Typography variant="body2" sx={{ fontWeight: 500 }}>{it.name}</Typography>
                                  </Box>
                                </TableCell>
                                <TableCell>
                                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                                    <Typography variant="body2" color="text.primary" sx={{ fontWeight: 500 }}>{it.product}</Typography>
                                    <Typography variant="body2" color="text.secondary">{it.plan}</Typography>
                                  </Box>
                                </TableCell>
                                <TableCell align="center" sx={{ fontWeight: 600 }}>{it.previousMonthMRR}</TableCell>
                                <TableCell align="center" sx={{ fontWeight: 600 }}>{it.currentMonthMRR}</TableCell>
                                <TableCell>
                                  <Typography variant="body2" color="text.primary">{it.frequency}</Typography>
                                </TableCell>
                                <TableCell align="center" sx={{ fontWeight: 600, color: 'primary.main' }}>{it.advancePayment}</TableCell>
                                <TableCell sx={{ textAlign: 'center' }}>
                                  <Chip size="small" variant="soft" color={customerStatusColor(it.customerStatus)} label={it.customerStatus} sx={{ height: '22px', fontSize: '0.75rem' }} />
                                </TableCell>
                                <TableCell sx={{ textAlign: 'right' }}>
                                  <Chip size="small" variant="soft" color={getSubscriptionColor(it.subscriptionStatus)} label={it.subscriptionStatus} sx={{ height: '22px', fontSize: '0.75rem' }} />
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </Box>
                    </Collapse>
                  </TableCell>
                </TableRow>
              </>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        component="div"
        count={rows.length}
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
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 2 }}>
          <Box>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'text.primary', mb: 0.5 }}>Payment Months / Payment Status</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              Payment Months: Comma-separated list of months when payments occurred (e.g., &quot;Oct 2025&quot;). Payment Status: Consolidated status across all subscriptions for this customer.
            </Typography>
          </Box>
          <Box>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'text.primary', mb: 0.5 }}>Email / Name</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              Customer email (clickable) and full name. Used as the unique key for consolidation.
            </Typography>
          </Box>
          <Box>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'text.primary', mb: 0.5 }}>Product / Plan</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              Shows single product/plan if all subscriptions are the same, otherwise &quot;Multiple Products&quot; / &quot;Multiple Plans&quot;.
            </Typography>
          </Box>
          <Box>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'text.primary', mb: 0.5 }}>Customer Status</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              Active: Customer has at least one subscription with status &quot;Recurring&quot; or &quot;New Subscription&quot;. Churned: All subscriptions are &quot;Cancelled&quot; or &quot;Refunded&quot;.
            </Typography>
          </Box>
          <Box>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'text.primary', mb: 0.5 }}>September MRR / October MRR</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              Total MRR across all subscriptions for the previous month (September) and selected month (October). Calculated by summing individual subscription MRRs.
            </Typography>
          </Box>
          <Box>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'text.primary', mb: 0.5 }}>Billing Cycle</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              Shows &quot;Monthly&quot;, &quot;Yearly&quot;, or &quot;Mixed&quot; if customer has subscriptions with different billing frequencies.
            </Typography>
          </Box>
          <Box>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'text.primary', mb: 0.5 }}>Advance Payment</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              Sum of remaining prepaid amounts for all yearly subscriptions. Shows &quot;-&quot; if no yearly plans or no remaining advance.
            </Typography>
          </Box>
          <Box>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'text.primary', mb: 0.5 }}>Subscription Status</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              Consolidated status: Upgraded (Oct MRR &gt; Sept MRR), Downgraded (Oct MRR &lt; Sept MRR), Recurring (same MRR), New Subscription (Sept MRR = 0, Oct MRR &gt; 0), Cancelled/Refunded (no active subscriptions).
            </Typography>
          </Box>
        </Box>
    </Card>

    {/* Status Definitions Section */}
    <Card sx={{ mt: 3, p: 3, borderRadius: 2, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: 'text.primary' }}>
          Status Definitions
        </Typography>
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: 3 }}>
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, color: 'text.primary', mb: 1.5 }}>
              Customer Status (Per Customer)
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Chip size="small" variant="soft" color="success" label="Active" />
                <Typography variant="body2" color="text.secondary">
                  Customer has at least one subscription with status &quot;Recurring&quot; or &quot;New Subscription&quot;
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Chip size="small" variant="soft" color="error" label="Churned" />
                <Typography variant="body2" color="text.secondary">
                  All subscriptions are &quot;Cancelled&quot; or &quot;Refunded&quot;
                </Typography>
              </Box>
            </Box>
          </Box>
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, color: 'text.primary', mb: 1.5 }}>
              Subscription Status (Per Customer)
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Chip size="small" variant="soft" color="success" label="Upgraded" />
                <Typography variant="body2" color="text.secondary">
                  Total MRR increased from previous month
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Chip size="small" variant="soft" color="warning" label="Downgraded" />
                <Typography variant="body2" color="text.secondary">
                  Total MRR decreased from previous month
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Chip size="small" variant="soft" color="default" label="Recurring" />
                <Typography variant="body2" color="text.secondary">
                  Total MRR remained the same
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Chip size="small" variant="soft" color="info" label="New Subscription" />
                <Typography variant="body2" color="text.secondary">
                  Previous month MRR was $0, current month MRR &gt; $0
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Chip size="small" variant="soft" color="error" label="Cancelled" />
                <Typography variant="body2" color="text.secondary">
                  No active subscriptions, all cancelled
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Chip size="small" variant="soft" color="warning" label="Refunded" />
                <Typography variant="body2" color="text.secondary">
                  No active subscriptions, at least one refunded
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>
    </Card>

    {/* Example Cases Section */}
    <Card sx={{ mt: 3, p: 3, borderRadius: 2, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: 'text.primary' }}>
          Example Cases (Consolidated View)
        </Typography>
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: 2 }}>
          <Box sx={{ p: 2, border: `1px solid ${theme.palette.divider}`, borderRadius: 1, backgroundColor: theme.palette.background.paper }}>
            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>Case 1: Upgraded Customer</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              <strong>Scenario:</strong> Nimesh has 3 subscriptions: Tier 1 ($19), Tier 2 ($39), and adds Unlimited Plan ($79) in October.
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              <strong>Consolidated View:</strong> Sept MRR: $58, Oct MRR: $137. Status: Upgraded. Customer Status: Active.
            </Typography>
            <Typography variant="body2" color="text.secondary">
              <strong>Logic:</strong> Oct MRR ($137) &gt; Sept MRR ($58), so status is &quot;Upgraded&quot;. Customer has active subscriptions, so &quot;Active&quot;.
            </Typography>
          </Box>
          <Box sx={{ p: 2, border: `1px solid ${theme.palette.divider}`, borderRadius: 1, backgroundColor: theme.palette.background.paper }}>
            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>Case 2: Mixed Status Customer</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              <strong>Scenario:</strong> Neeraj has Tier 2 (Recurring $39) and Tier 1 (Cancelled $0) and Unlimited (Refunded $19).
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              <strong>Consolidated View:</strong> Sept MRR: $58, Oct MRR: $39. Status: Downgraded. Customer Status: Active.
            </Typography>
            <Typography variant="body2" color="text.secondary">
              <strong>Logic:</strong> Oct MRR ($39) &lt; Sept MRR ($58), so &quot;Downgraded&quot;. Has active subscription (Tier 2), so &quot;Active&quot;.
            </Typography>
          </Box>
          <Box sx={{ p: 2, border: `1px solid ${theme.palette.divider}`, borderRadius: 1, backgroundColor: theme.palette.background.paper }}>
            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>Case 3: Churned Customer</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              <strong>Scenario:</strong> Mike has Pro Plan that gets refunded in October.
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              <strong>Consolidated View:</strong> Sept MRR: $49, Oct MRR: $0. Status: Refunded. Customer Status: Churned.
            </Typography>
            <Typography variant="body2" color="text.secondary">
              <strong>Logic:</strong> All subscriptions are &quot;Refunded&quot;, so status is &quot;Refunded&quot;. No active subscriptions, so &quot;Churned&quot;.
            </Typography>
          </Box>
          <Box sx={{ p: 2, border: `1px solid ${theme.palette.divider}`, borderRadius: 1, backgroundColor: theme.palette.background.paper }}>
            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>Case 4: New Customer</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              <strong>Scenario:</strong> Hardik signs up for Unlimited Plan in October.
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              <strong>Consolidated View:</strong> Sept MRR: $0, Oct MRR: $79. Status: New Subscription. Customer Status: Active.
            </Typography>
            <Typography variant="body2" color="text.secondary">
              <strong>Logic:</strong> Sept MRR = $0 and Oct MRR &gt; $0, so &quot;New Subscription&quot;. Has active subscription, so &quot;Active&quot;.
            </Typography>
          </Box>
          <Box sx={{ p: 2, border: `1px solid ${theme.palette.divider}`, borderRadius: 1, backgroundColor: theme.palette.background.paper }}>
            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>Case 5: Yearly Plan Customer</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              <strong>Scenario:</strong> Lisa has Enterprise Plan ($99/month) paid yearly with 10 months remaining.
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              <strong>Consolidated View:</strong> Sept MRR: $99, Oct MRR: $99. Status: Recurring. Advance Payment: $990.
            </Typography>
            <Typography variant="body2" color="text.secondary">
              <strong>Logic:</strong> MRR unchanged, so &quot;Recurring&quot;. Advance Payment = 10 months × $99 = $990.
            </Typography>
          </Box>
          <Box sx={{ p: 2, border: `1px solid ${theme.palette.divider}`, borderRadius: 1, backgroundColor: theme.palette.background.paper }}>
            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>Case 6: Multiple Products</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              <strong>Scenario:</strong> Customer has both Pabbly Connect and Pabbly Workflow subscriptions.
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              <strong>Consolidated View:</strong> Product: &quot;Multiple Products&quot;, Plan: &quot;Multiple Plans&quot;.
            </Typography>
            <Typography variant="body2" color="text.secondary">
              <strong>Logic:</strong> When customer has different products/plans, shows &quot;Multiple&quot; instead of specific names.
            </Typography>
          </Box>
        </Box>
        <Box sx={{ mt: 2, p: 2, backgroundColor: theme.palette.primary.lighter, borderRadius: 1 }}>
          <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600, color: 'primary.darker' }}>
            Key Rules Summary
          </Typography>
          <Typography variant="body2" color="text.secondary">
            • Customer Status = &quot;Active&quot; if ANY subscription is &quot;Recurring&quot; or &quot;New Subscription&quot;<br/>
            • Customer Status = &quot;Churned&quot; only if ALL subscriptions are &quot;Cancelled&quot; or &quot;Refunded&quot;<br/>
            • Subscription Status is based on MRR comparison: Upgraded (↑), Downgraded (↓), Recurring (=), New Subscription (0→+), Cancelled/Refunded (no active)
          </Typography>
        </Box>
    </Card>
    </>
  );
}


