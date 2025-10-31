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

  const toNumber = (value) => {
    const n = Number(String(value).replace(/[^0-9.-]/g, ''));
    return Number.isFinite(n) ? n : 0;
  };

  const formatMoney = (value) => {
    if (value === '-' || value === '' || value == null) return '-';
    const n = toNumber(value);
    return `$${n.toFixed(2)}`;
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

      // New Joined: all subscriptions are new and there is no prior MRR
      const isNewJoinedCustomer = group.items.every(i => i.subscriptionStatus === 'New Subscription') && sumSeptember === 0;

      // Determine customer status: Active if has any active subscription, Churned if all are cancelled/refunded
      let customerStatus = 'Churned'; // Default to churned
      if (isNewJoinedCustomer) {
        customerStatus = 'New Joined';
      } else if (hasActiveSubscription) {
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
      case 'Recurring':
        return 'success';
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
        <Card sx={{ p: 0, borderRadius: 4, boxShadow: '0 4px 15px rgba(0,0,0,0.08)', backgroundColor: theme.palette.background.paper }}>
      <Box sx={{ px: 3, pt: 3, pb: 2 }}>
        <Typography variant="h5" sx={{ fontSize: '20px', fontWeight: 600, color: 'text.primary', mb: 1 }}>
          Consolidated Data
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {rows.length} Customers
        </Typography>
      </Box>

      <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 0, backgroundColor: theme.palette.background.paper }}>
        <Table size="small" sx={{ minWidth: 1400, '& .MuiTableCell-body': { py: 1.25, px: 2 }, '& .MuiTableRow-root': { height: 'auto' } }}>
          <TableHead sx={{ '& th': { py: 2 }, '& .MuiTableRow-root': { height: 'auto' } }}>
            <TableRow sx={{ backgroundColor: theme.palette.grey[100] }}>
              <TableCell sx={{ fontWeight: 600, color: 'text.primary', borderBottom: `1px solid ${theme.palette.divider}`, minWidth: 140 }}>
                Payment On (A)
              </TableCell>
              <TableCell sx={{ fontWeight: 600, color: 'text.primary', borderBottom: `1px solid ${theme.palette.divider}`, minWidth: 200 }}>Email / Name (B)</TableCell>
              <TableCell sx={{ fontWeight: 600, color: 'text.primary', borderBottom: `1px solid ${theme.palette.divider}`, minWidth: 150 }}>Product / Plan (C)</TableCell>
              <TableCell sx={{ fontWeight: 600, color: 'text.primary', borderBottom: `1px solid ${theme.palette.divider}`, textAlign: 'center', minWidth: 120 }}>
                <Typography variant="subtitle2" sx={{ m: 0, p: 0, letterSpacing: 0 }}>{rows[0]?.prevPrevLabel || 'Previous Month'} MRR (D)</Typography>
              </TableCell>
              <TableCell sx={{ fontWeight: 600, color: 'text.primary', borderBottom: `1px solid ${theme.palette.divider}`, textAlign: 'center', minWidth: 120 }}>
                <Typography variant="subtitle2" sx={{ m: 0, p: 0, letterSpacing: 0 }}>{rows[0]?.prevLabel || 'Selected Month'} MRR (E)</Typography>
              </TableCell>
              <TableCell sx={{ fontWeight: 600, color: 'text.primary', borderBottom: `1px solid ${theme.palette.divider}`, textAlign: 'center', minWidth: 120 }}>Advance Payment (G)</TableCell>
              <TableCell sx={{ fontWeight: 600, color: 'text.primary', borderBottom: `1px solid ${theme.palette.divider}`, minWidth: 120, textAlign: 'center' }}>
                Customer Status (H)
              </TableCell>
              <TableCell sx={{ fontWeight: 600, color: 'text.primary', borderBottom: `1px solid ${theme.palette.divider}`, minWidth: 120, textAlign: 'right' }}>
                Payment Status (I)
              </TableCell>
              <TableCell sx={{ fontWeight: 600, color: 'text.primary', borderBottom: `1px solid ${theme.palette.divider}` }} />
            </TableRow>
          </TableHead>
          <TableBody sx={{ '& td': { py: 1.5 }, '& .MuiTableRow-root': { height: 'auto' } }}>
            {paginated.map((r) => (
              <>
                <TableRow key={r.email} hover>
                  <TableCell sx={{ minWidth: 140, py: 1, px: 2 }}>
                    <Typography variant="body2" color="text.primary" sx={{ fontWeight: 500 }}>{r.paymentMonths}</Typography>
                  </TableCell>
                  <TableCell sx={{ py: 1, px: 2 }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                      <Typography variant="body2" sx={{ color: 'primary.main', textDecoration: 'underline', fontWeight: 500 }}>{r.email}</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>{r.name}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell sx={{ py: 1, px: 2 }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                      <Typography variant="body2" color="text.primary" sx={{ fontWeight: 500 }}>{r.product}</Typography>
                      <Typography variant="body2" color="text.secondary">{r.plan}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell sx={{ textAlign: 'center', py: 1, px: 2 }}>
                    <Typography variant="body2" color="text.primary" sx={{ fontWeight: 600 }}>{formatMoney(r.prevPrevMRR)}</Typography>
                  </TableCell>
                  <TableCell sx={{ textAlign: 'center', py: 1, px: 2 }}>
                    <Typography variant="body2" color="text.primary" sx={{ fontWeight: 600 }}>{formatMoney(r.prevMRR)}</Typography>
                  </TableCell>
                  <TableCell sx={{ textAlign: 'center', py: 1.75, px: 2 }}>
                    <Typography variant="body2" color="primary.main" sx={{ fontWeight: 600 }}>{r.advancePayment || '-'}</Typography>
                  </TableCell>
                  <TableCell sx={{ textAlign: 'center', py: 1.75, px: 2 }}>
                    <Chip size="small" variant="soft" color={customerStatusColor(r.latestStatus)} label={r.latestStatus} sx={{ height: '22px', fontSize: '0.75rem' }} />
                  </TableCell>
                  <TableCell sx={{ textAlign: 'right', py: 1, px: 2 }}>
                    <Chip size="small" variant="soft" color={statusColor(r.consolidatedStatus)} label={r.consolidatedStatus} sx={{ height: '22px', fontSize: '0.75rem' }} />
                  </TableCell>
                  <TableCell width={48} align="right">
                    <IconButton size="small" onClick={() => setExpandedEmail(expandedEmail === r.email ? null : r.email)}>
                      <Iconify icon={expandedEmail === r.email ? 'solar:alt-arrow-up-bold' : 'solar:alt-arrow-down-bold'} width={18} />
                    </IconButton>
                  </TableCell>
                </TableRow>
                {expandedEmail === r.email && (
                <TableRow>
                  <TableCell colSpan={9} sx={{ py: 0, border: 0, height: 0 }}>
                    <Collapse in timeout="auto" unmountOnExit>
                      <Box sx={{ px: 2, py: 2 }}>
                        <Typography variant="subtitle2" sx={{ mb: 1 }}>Subscriptions</Typography>
                        <Table size="small" sx={{ '& .MuiTableCell-body': { py: 1.25, px: 2 }, '& .MuiTableRow-root': { height: 'auto' } }}>
                          <TableHead sx={{ '& .MuiTableRow-root': { height: 'auto' } }}>
                            <TableRow sx={{ backgroundColor: theme.palette.grey[50] }}>
                              <TableCell sx={{ fontWeight: 600, color: 'text.primary', borderBottom: `1px solid ${theme.palette.divider}`, minWidth: 140 }}>
                                Payment On (A)
                              </TableCell>
                              <TableCell sx={{ fontWeight: 600, color: 'text.primary', borderBottom: `1px solid ${theme.palette.divider}` }}>Email / Name (B)</TableCell>
                              <TableCell sx={{ fontWeight: 600, color: 'text.primary', borderBottom: `1px solid ${theme.palette.divider}` }}>Product / Plan (C)</TableCell>
                              <TableCell sx={{ fontWeight: 600, color: 'text.primary', borderBottom: `1px solid ${theme.palette.divider}`, textAlign: 'center' }}>
                                <Typography variant="subtitle2" sx={{ m: 0, p: 0, letterSpacing: 0 }}>{r.prevPrevLabel} MRR (D)</Typography>
                              </TableCell>
                              <TableCell sx={{ fontWeight: 600, color: 'text.primary', borderBottom: `1px solid ${theme.palette.divider}`, textAlign: 'center' }}>
                                <Typography variant="subtitle2" sx={{ m: 0, p: 0, letterSpacing: 0 }}>{r.prevLabel} MRR (E)</Typography>
                              </TableCell>
                              <TableCell sx={{ fontWeight: 600, color: 'text.primary', borderBottom: `1px solid ${theme.palette.divider}` }}>Billing Cycle (F)</TableCell>
                              <TableCell sx={{ fontWeight: 600, color: 'text.primary', borderBottom: `1px solid ${theme.palette.divider}`, textAlign: 'center' }}>Advance Payment (G)</TableCell>
                              <TableCell sx={{ fontWeight: 600, color: 'text.primary', borderBottom: `1px solid ${theme.palette.divider}`, minWidth: 120, textAlign: 'center' }}>
                                Customer Status (H)
                              </TableCell>
                              <TableCell sx={{ fontWeight: 600, color: 'text.primary', borderBottom: `1px solid ${theme.palette.divider}`, minWidth: 120, textAlign: 'right' }}>
                                Payment Status (I)
                              </TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody sx={{ '& .MuiTableRow-root': { height: 'auto' } }}>
                            {r.items.map((it, idx) => (
                              <TableRow key={idx}>
                                <TableCell sx={{ minWidth: 140 }}>
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
                                <TableCell align="center" sx={{ fontWeight: 600 }}>
                                  <Typography variant="body2" color="text.primary" sx={{ fontWeight: 600 }}>{formatMoney(it.previousMonthMRR)}</Typography>
                                </TableCell>
                                <TableCell align="center" sx={{ fontWeight: 600 }}>
                                  <Typography variant="body2" color="text.primary" sx={{ fontWeight: 600 }}>{formatMoney(it.currentMonthMRR)}</Typography>
                                </TableCell>
                                <TableCell>
                                  <Typography variant="body2" color="text.primary">{it.frequency}</Typography>
                                </TableCell>
                                <TableCell align="center" sx={{ fontWeight: 600, color: 'primary.main' }}>
                                  <Typography variant="body2" color="primary.main" sx={{ fontWeight: 600 }}>{formatMoney(it.advancePayment)}</Typography>
                                </TableCell>
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
                )}
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

    {/* Info Tables (Consolidated View) */}
    <Card sx={{ mt: 4, p: 0, borderRadius: 2, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
      <Box sx={{ px: 3, pt: 3, pb: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 600, color: 'text.primary' }}>Customer Status</Typography>
      </Box>
      <Table size="small">
        <TableHead>
          <TableRow sx={{ backgroundColor: theme.palette.grey[50] }}>
            <TableCell>Customer Status</TableCell>
            <TableCell>Meaning / Definition</TableCell>
            <TableCell>Condition / Logic</TableCell>
            <TableCell>Example Scenario</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow><TableCell>🟢 Active</TableCell><TableCell>Customer currently has one or more active paid subscriptions.</TableCell><TableCell>At least one subscription is Recurring.</TableCell><TableCell>Customer continues Tier 2 plan → Active.</TableCell></TableRow>
          <TableRow><TableCell>🔵 New Joined</TableCell><TableCell>Customer made their first-ever payment during the selected month.</TableCell><TableCell>All subscriptions are New Subscription and previous MRR = 0.</TableCell><TableCell>First payment in October → New Joined.</TableCell></TableRow>
          <TableRow><TableCell>🔴 Churned</TableCell><TableCell>Customer no longer has any active subscriptions.</TableCell><TableCell>All subscriptions are Cancelled or Refunded.</TableCell><TableCell>All plans cancelled or refunded → Churned.</TableCell></TableRow>
        </TableBody>
      </Table>
    </Card>

    <Card sx={{ mt: 3, p: 0, borderRadius: 2, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
      <Box sx={{ px: 3, pt: 3, pb: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 600, color: 'text.primary' }}>Subscription Status (Consolidated — Per Customer)</Typography>
      </Box>
      <Table size="small">
        <TableHead>
          <TableRow sx={{ backgroundColor: theme.palette.grey[50] }}>
            <TableCell>Subscription Status</TableCell>
            <TableCell>Meaning / Description</TableCell>
            <TableCell>Condition / Logic</TableCell>
            <TableCell>Example Scenario</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow><TableCell>🟢 Upgraded</TableCell><TableCell>Total MRR increased compared to the previous month.</TableCell><TableCell>Current MRR &gt; Previous MRR</TableCell><TableCell>Sept MRR = $58 → Oct MRR = $137 → Upgraded.</TableCell></TableRow>
          <TableRow><TableCell>🟡 Downgraded</TableCell><TableCell>Total MRR decreased compared to the previous month.</TableCell><TableCell>Current MRR &lt; Previous MRR</TableCell><TableCell>Sept MRR = $58 → Oct MRR = $39 → Downgraded.</TableCell></TableRow>
          <TableRow><TableCell>🟢 Recurring</TableCell><TableCell>Total MRR remained unchanged between months.</TableCell><TableCell>Current MRR = Previous MRR</TableCell><TableCell>Sept MRR = $99 → Oct MRR = $99 → Recurring.</TableCell></TableRow>
          <TableRow><TableCell>🟢 New Subscription</TableCell><TableCell>Customer started paying this month (first active MRR).</TableCell><TableCell>Previous MRR = 0, Current MRR &gt; 0</TableCell><TableCell>First-time customer → New Subscription.</TableCell></TableRow>
          <TableRow><TableCell>🔴 Cancelled / Refunded</TableCell><TableCell>No active subscriptions remaining for the customer.</TableCell><TableCell>All subscriptions Cancelled or Refunded</TableCell><TableCell>All plans stopped or refunded → Churned.</TableCell></TableRow>
        </TableBody>
      </Table>
    </Card>

    <Card sx={{ mt: 3, p: 0, borderRadius: 2, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
      <Box sx={{ px: 3, pt: 3, pb: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 600, color: 'text.primary' }}>General Column Descriptions</Typography>
      </Box>
      <Table size="small">
        <TableHead>
          <TableRow sx={{ backgroundColor: theme.palette.grey[50] }}>
            <TableCell>Column Name</TableCell>
            <TableCell>Description / Purpose</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow><TableCell>Payment Months</TableCell><TableCell>Comma-separated list of months in which payments occurred (e.g., Oct 2025).</TableCell></TableRow>
          <TableRow><TableCell>Payment Status</TableCell><TableCell>Consolidated subscription status across all customer subscriptions (e.g., Upgraded, Downgraded, Recurring, New Subscription, Cancelled / Refunded).</TableCell></TableRow>
          <TableRow><TableCell>Email / Name</TableCell><TableCell>Customer’s email (clickable) and full name, used as a unique identifier for customer consolidation.</TableCell></TableRow>
          <TableRow><TableCell>Product / Plan</TableCell><TableCell>Displays a single product/plan if all subscriptions are identical; otherwise shows “Multiple Products” or “Multiple Plans.”</TableCell></TableRow>
          <TableRow><TableCell>Customer Status</TableCell><TableCell>Derived at the customer level: Active if any plan is Recurring or New Subscription, Churned if all plans are Cancelled or Refunded.</TableCell></TableRow>
          <TableRow><TableCell>September MRR / October MRR</TableCell><TableCell>Displays total MRR across all subscriptions for: • Previous month (September) • Selected month (October) — calculated by summing all active subscription MRRs.</TableCell></TableRow>
          <TableRow><TableCell>Billing Cycle</TableCell><TableCell>Indicates overall customer billing frequency: • Monthly — all monthly plans • Yearly — all yearly plans • Mixed — combination of both.</TableCell></TableRow>
          <TableRow><TableCell>Advance Payment</TableCell><TableCell>Shows the total remaining prepaid amount for all yearly subscriptions. Displays “—” if there are no yearly plans or remaining balances.</TableCell></TableRow>
          <TableRow><TableCell>Subscription Status</TableCell><TableCell>Reflects the consolidated subscription trend based on MRR movement: Upgraded, Downgraded, Recurring, New Subscription, or Cancelled / Refunded.</TableCell></TableRow>
        </TableBody>
      </Table>
    </Card>

    <Card sx={{ mt: 3, p: 0, borderRadius: 2, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
      <Box sx={{ px: 3, pt: 3, pb: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 600, color: 'text.primary' }}>Status Logic Summary</Typography>
      </Box>
      <Table size="small">
        <TableHead>
          <TableRow sx={{ backgroundColor: theme.palette.grey[50] }}>
            <TableCell>Logic Rule</TableCell>
            <TableCell>Condition</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow><TableCell>If any subscription is Recurring or New Subscription</TableCell><TableCell>Customer = Active</TableCell></TableRow>
          <TableRow><TableCell>If all subscriptions are Cancelled or Refunded</TableCell><TableCell>Customer = Churned</TableCell></TableRow>
          <TableRow><TableCell>If Current MRR &gt; Previous MRR</TableCell><TableCell>Status = Upgraded</TableCell></TableRow>
          <TableRow><TableCell>If Current MRR &lt; Previous MRR</TableCell><TableCell>Status = Downgraded</TableCell></TableRow>
          <TableRow><TableCell>If Current MRR = Previous MRR</TableCell><TableCell>Status = Recurring</TableCell></TableRow>
          <TableRow><TableCell>If Previous MRR = 0 and Current MRR &gt; 0</TableCell><TableCell>Status = New Subscription</TableCell></TableRow>
          <TableRow><TableCell>If No active MRR (all cancelled/refunded)</TableCell><TableCell>Status = Cancelled / Refunded</TableCell></TableRow>
        </TableBody>
      </Table>
    </Card>
    </>
  );
}


