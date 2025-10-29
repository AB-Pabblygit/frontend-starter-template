import { useMemo, useState } from 'react';

import {
  Box,
  Card,
  Chip,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  useTheme,
  Collapse,
  IconButton,
} from '@mui/material';

import { PAYMENT_SOURCE } from './analytics-payment-table';
import { Iconify } from 'src/components/iconify';

function parseAmount(value) {
  if (!value || value === '-' ) return 0;
  const n = Number(String(value).replace(/[^0-9.-]/g, ''));
  return Number.isFinite(n) ? n : 0;
}

export function AnalyticsConsolidatedTable({ selectedMonth, selectedYear, selectedProduct = 'All', selectedPlan = 'All' }) {
  const theme = useTheme();
  const [page, setPage] = useState(0);
  const [rowsPerPage] = useState(10);
  const [expandedEmail, setExpandedEmail] = useState(null);

  const monthNames = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  const shortMonth = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

  const getPrevMonthLabels = (monthIndex) => {
    const prev1 = (monthIndex + 11) % 12;
    const prev2 = (monthIndex + 10) % 12;
    return [monthNames[prev1], monthNames[prev2]];
  };

  const filtered = useMemo(() => {
    return PAYMENT_SOURCE.filter(r => {
      const byProduct = selectedProduct === 'All' || r.product === selectedProduct;
      const byPlan = selectedPlan === 'All' || r.plan === selectedPlan;
      return byProduct && byPlan;
    });
  }, [selectedProduct, selectedPlan]);

  const rows = useMemo(() => {
    const map = new Map();
    for (const row of filtered) {
      const key = row.email;
      const group = map.get(key) || { email: row.email, name: row.name, items: [] };
      group.items.push(row);
      map.set(key, group);
    }

    const [prevLabel, prevPrevLabel] = getPrevMonthLabels(selectedMonth);

    const consolidated = Array.from(map.values()).map(group => {
      const products = Array.from(new Set(group.items.map(i => i.product)));
      const plans = Array.from(new Set(group.items.map(i => i.plan)));

      const monthsSet = new Set(
        group.items
          .map(i => i.paymentDate)
          .filter(Boolean)
          .map(d => {
            const dt = new Date(d);
            return `${shortMonth[dt.getMonth()]} ${dt.getFullYear()}`;
          })
      );

      const sumPrev = group.items.reduce((acc, i) => acc + parseAmount(i.previousMonthMRR), 0);
      const sumPrevPrev = group.items.reduce((acc, i) => acc + parseAmount(i.currentMonthMRR), 0);

      const activeNow = group.items.some(i => i.customerStatus === 'Active' || i.customerStatus === 'New Joined');

      let consolidatedStatus = 'Recurring';
      if (!activeNow && sumPrev === 0) consolidatedStatus = 'Cancelled';
      else if (sumPrevPrev === 0 && sumPrev > 0) consolidatedStatus = 'New Subscription';
      else if (sumPrev > sumPrevPrev) consolidatedStatus = 'Upgraded';
      else if (sumPrev < sumPrevPrev) consolidatedStatus = 'Downgraded';

      const frequencySet = new Set(group.items.map(i => i.frequency));
      const frequency = frequencySet.size === 1 ? Array.from(frequencySet)[0] : 'Mixed';

      // Show latest status with a date (from most recent paymentDate)
      const withDate = group.items.filter(i => i.paymentDate);
      withDate.sort((a,b) => new Date(b.paymentDate) - new Date(a.paymentDate));
      const latest = withDate[0];
      const latestStatus = latest ? latest.customerStatus : (group.items[0]?.customerStatus || '-');

      return {
        email: group.email,
        name: group.name,
        paymentMonths: monthsSet.size ? Array.from(monthsSet).join(', ') : '-',
        latestStatus,
        product: products.length === 1 ? products[0] : 'Multiple Products',
        plan: plans.length === 1 ? plans[0] : 'Multiple Plans',
        prevMRR: `$${sumPrev.toFixed(2)}`,
        prevPrevMRR: `$${sumPrevPrev.toFixed(2)}`,
        frequency,
        consolidatedStatus,
        prevLabel,
        prevPrevLabel,
        items: group.items,
      };
    });

    // simple pagination here
    return consolidated;
  }, [filtered, selectedMonth]);

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
      case 'New Subscription':
        return 'info';
      default:
        return 'default';
    }
  };

  return (
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
              <TableCell sx={{ fontWeight: 600 }}>Payment Months / Status</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Name / Email</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Product</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Plan</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>{rows[0]?.prevLabel || 'Prev Month'} MRR</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>{rows[0]?.prevPrevLabel || 'Before Prev'} MRR</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Billing Cycle</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Subscription Status</TableCell>
              <TableCell sx={{ fontWeight: 600 }} />
            </TableRow>
          </TableHead>
          <TableBody>
            {paginated.map((r) => (
              <>
                <TableRow key={r.email} hover>
                  <TableCell>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                      <Chip size="small" variant="soft" color={customerStatusColor(r.latestStatus)} label={r.latestStatus} />
                      <Typography variant="body2" color="text.secondary">{r.paymentMonths}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                      <Typography variant="body2" sx={{ color: 'primary.main', textDecoration: 'underline', fontWeight: 500 }}>{r.email}</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>{r.name}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip size="small" color="info" variant="soft" label={r.product} />
                  </TableCell>
                  <TableCell>
                    <Chip size="small" color="info" variant="soft" label={r.plan} />
                  </TableCell>
                  <TableCell sx={{ textAlign: 'right', fontWeight: 600 }}>{r.prevMRR}</TableCell>
                  <TableCell sx={{ textAlign: 'right', fontWeight: 600 }}>{r.prevPrevMRR}</TableCell>
                  <TableCell>{r.frequency}</TableCell>
                  <TableCell>
                    <Chip size="small" color={statusColor(r.consolidatedStatus)} variant="soft" label={r.consolidatedStatus} />
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
                            <TableRow>
                              <TableCell>Payment Date</TableCell>
                              <TableCell>Product</TableCell>
                              <TableCell>Plan</TableCell>
                              <TableCell>Gateway</TableCell>
                              <TableCell align="right">{r.prevLabel} MRR</TableCell>
                              <TableCell align="right">{r.prevPrevLabel} MRR</TableCell>
                              <TableCell>Frequency</TableCell>
                              <TableCell>Status</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {r.items.map((it, idx) => (
                              <TableRow key={idx}>
                                <TableCell>{it.paymentDate || '-'}</TableCell>
                                <TableCell>{it.product}</TableCell>
                                <TableCell>{it.plan}</TableCell>
                                <TableCell>{it.paymentGateway}</TableCell>
                                <TableCell align="right">{it.previousMonthMRR}</TableCell>
                                <TableCell align="right">{it.currentMonthMRR}</TableCell>
                                <TableCell>{it.frequency}</TableCell>
                                <TableCell>
                                  <Chip size="small" variant="soft" color={customerStatusColor(it.customerStatus)} label={it.customerStatus} />
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

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
        <Typography variant="body2" color="text.secondary">
          Showing {(page * rowsPerPage) + 1} - {Math.min((page + 1) * rowsPerPage, rows.length)} of {rows.length} Customers
        </Typography>
      </Box>

      {/* Column and Status Descriptions */}
      <Box sx={{ mt: 4, p: 3, backgroundColor: theme.palette.grey[50], borderRadius: 2 }}>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: 'text.primary' }}>
          Column Descriptions
        </Typography>
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 2 }}>
          <Box>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>Payment Months / Status</Typography>
            <Typography variant="body2" color="text.secondary">Latest customer status chip with all months in which payments occurred for the customer.</Typography>
          </Box>
          <Box>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>Name / Email</Typography>
            <Typography variant="body2" color="text.secondary">Customer identification. Email is clickable; name is shown beneath.</Typography>
          </Box>
          <Box>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>Product</Typography>
            <Typography variant="body2" color="text.secondary">If customer has only one product it shows the product name, otherwise “Multiple Products”.</Typography>
          </Box>
          <Box>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>Plan</Typography>
            <Typography variant="body2" color="text.secondary">If customer has only one plan it shows the plan name, otherwise “Multiple Plans”.</Typography>
          </Box>
          <Box>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>{rows[0]?.prevLabel || 'Prev Month'} MRR</Typography>
            <Typography variant="body2" color="text.secondary">Sum of MRR amounts for the previous month across all subscriptions of the customer.</Typography>
          </Box>
          <Box>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>{rows[0]?.prevPrevLabel || 'Before Prev'} MRR</Typography>
            <Typography variant="body2" color="text.secondary">Sum of MRR amounts for the month before previous across all subscriptions of the customer.</Typography>
          </Box>
          <Box>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>Billing Cycle</Typography>
            <Typography variant="body2" color="text.secondary">Monthly, Yearly, or Mixed (when customer has both Monthly and Yearly subscriptions).</Typography>
          </Box>
          <Box>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>Subscription Status</Typography>
            <Typography variant="body2" color="text.secondary">Consolidated status derived from MRR deltas across subscriptions.</Typography>
          </Box>
        </Box>

        <Typography variant="h6" sx={{ mt: 3, mb: 1, fontWeight: 600, color: 'text.primary' }}>
          Status Definitions
        </Typography>
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 2 }}>
          <Box>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>Customer Status (chip color)</Typography>
            <Typography variant="body2" color="text.secondary">Active (green): currently active customer. New Joined (blue): first subscription. Churned (red): no longer active.</Typography>
          </Box>
          <Box>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>Subscription Status (consolidated)</Typography>
            <Typography variant="body2" color="text.secondary">Upgraded: total previous-month MRR increased vs month before. Downgraded: decreased. Recurring: unchanged. Cancelled: no active plan. New Subscription: new customer with first subscription.</Typography>
          </Box>
        </Box>
      </Box>
    </Card>
  );
}


