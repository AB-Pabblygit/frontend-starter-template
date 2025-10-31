import { useMemo } from 'react';

import {
  Box,
  Card,
  Table,
  Paper,
  Tooltip,
  TableRow,
  TableBody,
  TableCell,
  TableHead,
  Typography,
  TableContainer,
} from '@mui/material';

import { Iconify } from 'src/components/iconify';
import { PAYMENT_SOURCE } from './analytics-payment-table';

function toNumber(value) {
  if (value === '-' || value === '' || value == null) return 0;
  const n = Number(String(value).replace(/[^0-9.-]/g, ''));
  return Number.isFinite(n) ? n : 0;
}

function formatMoney(value) {
  const n = toNumber(value);
  return `$${n.toFixed(2)}`;
}

function getMonthYear(dateStr) {
  if (!dateStr) return { month: -1, year: -1 };
  const [m, d, y] = String(dateStr).split('/').map((v) => parseInt(v, 10));
  return { month: m - 1, year: y };
}

function isActiveStatus(status) {
  return status === 'Recurring' || status === 'New Subscription';
}

export function AnalyticsSummary({ selectedMonth, selectedYear, selectedProduct = 'All', selectedPlan = 'All' }) {
  const filtered = useMemo(() => PAYMENT_SOURCE.filter(r => {
    const byProduct = selectedProduct === 'All' || r.product === selectedProduct;
    const byPlan = selectedPlan === 'All' || r.plan === selectedPlan;
    return byProduct && byPlan;
  }), [selectedProduct, selectedPlan]);

  const { currentRows, prevRows } = useMemo(() => {
    const current = [];
    const prev = [];
    filtered.forEach((r) => {
      const { month, year } = getMonthYear(r.paymentDate);
      if (year === selectedYear && month === selectedMonth) current.push(r);
      // naive previous month set using provided previousMonthMRR/currentMonthMRR values for comparison
      const prevMonth = (selectedMonth + 11) % 12;
      const prevYear = selectedMonth === 0 ? selectedYear - 1 : selectedYear;
      if (year === prevYear && month === prevMonth) prev.push(r);
    });
    return { currentRows: current, prevRows: prev };
  }, [filtered, selectedMonth, selectedYear]);

  const byCustomer = useMemo(() => {
    const group = new Map();
    currentRows.forEach((r) => {
      const g = group.get(r.email) || { email: r.email, name: r.name, items: [] };
      g.items.push(r);
      group.set(r.email, g);
    });
    return group;
  }, [currentRows]);

  const prevByCustomer = useMemo(() => {
    const group = new Map();
    prevRows.forEach((r) => {
      const g = group.get(r.email) || { email: r.email, name: r.name, items: [] };
      g.items.push(r);
      group.set(r.email, g);
    });
    return group;
  }, [prevRows]);

  // Top 8 metrics (A–H)
  const metrics = useMemo(() => {
    const totalCustomers = byCustomer.size;

    let activeCustomers = 0;
    let newCustomers = 0;
    let churnedCustomers = 0;
    let totalMRR = 0;
    let previousMonthMRR = 0;
    let churnedMRR = 0; // approximation: sum of prev MRR for items cancelled/refunded this month
    let refundsIssued = 0; // cash refunds sum

    // Build first-payment lookup
    const firstPaymentMonthByEmail = new Map();
    filtered.forEach((r) => {
      const cur = firstPaymentMonthByEmail.get(r.email);
      const { month, year } = getMonthYear(r.paymentDate);
      const key = year * 12 + month;
      if (cur == null || key < cur) firstPaymentMonthByEmail.set(r.email, key);
    });

    // Previous month MRR: sum of previousMonthMRR for rows that existed last month
    prevByCustomer.forEach((g) => {
      g.items.forEach((it) => {
        previousMonthMRR += toNumber(it.currentMonthMRR); // they paid last month → count that month MRR
      });
    });

    // Current month calculations
    byCustomer.forEach((g, email) => {
      const hasActive = g.items.some((it) => isActiveStatus(it.subscriptionStatus));
      if (hasActive) activeCustomers += 1;
      const firstKey = firstPaymentMonthByEmail.get(email);
      const selectedKey = selectedYear * 12 + selectedMonth;
      if (firstKey === selectedKey) newCustomers += 1;

      g.items.forEach((it) => {
        // Active MRR this month
        if (isActiveStatus(it.subscriptionStatus)) totalMRR += toNumber(it.currentMonthMRR);
        // Refunds (cash)
        if (it.subscriptionStatus === 'Refunded') {
          refundsIssued += toNumber(it.currentMonthMRR);
        }
        // Churned MRR approx: if cancelled/refunded this month, count previous MRR as churned
        if (it.subscriptionStatus === 'Cancelled' || it.subscriptionStatus === 'Refunded') {
          churnedMRR += toNumber(it.previousMonthMRR);
        }
      });
    });

    // Churned customers: were present previous month with active items, but no active now
    const emailsPrev = new Set(prevByCustomer.keys());
    emailsPrev.forEach((email) => {
      const prevActive = (prevByCustomer.get(email)?.items || []).some((it) => toNumber(it.currentMonthMRR) > 0);
      const nowActive = (byCustomer.get(email)?.items || []).some((it) => isActiveStatus(it.subscriptionStatus));
      if (prevActive && !nowActive) churnedCustomers += 1;
    });

    const revenueChurnPct = previousMonthMRR > 0 ? (churnedMRR / previousMonthMRR) * 100 : 0;

    // Net MRR Growth approximation: New (current of new subs) + Expansion (— TODO) – Contraction (— TODO) – Churned MRR
    const newMRR = Array.from(byCustomer.values()).flatMap(g => g.items).filter(it => it.subscriptionStatus === 'New Subscription').reduce((s, it) => s + toNumber(it.currentMonthMRR), 0);
    // TODO: derive expansion and contraction deltas at customer-level
    const expansion = 0; // TODO
    const contraction = 0; // TODO
    const netMrrGrowth = newMRR + expansion - contraction - churnedMRR;

    const items = [
      { key: 'A', title: 'Total Customers', value: totalCustomers, tooltip: 'Number of unique paying customers this month.', icon: 'solar:users-group-two-rounded-bold', color: 'primary.main' },
      { key: 'B', title: 'Active Customers', value: activeCustomers, tooltip: 'Customers with ≥1 active subscription (Recurring or New Subscription).', icon: 'solar:users-group-rounded-bold', color: 'success.main' },
      { key: 'C', title: 'New Customers', value: newCustomers, tooltip: 'Customers whose first payment occurred in this month.', icon: 'solar:user-plus-bold', color: 'info.main' },
      { key: 'D', title: 'Churned Customers', value: churnedCustomers, tooltip: 'Customers who had active plans before but now have none.', icon: 'solar:user-minus-bold', color: 'error.main' },
      { key: 'E', title: 'Total MRR', value: formatMoney(totalMRR), tooltip: 'Sum of all active subscription MRR for the current month.', icon: 'solar:dollar-minimalistic-bold', color: 'primary.main' },
      { key: 'F', title: 'Revenue Churn %', value: `${revenueChurnPct.toFixed(1)}%`, tooltip: 'Churned MRR / Previous Month MRR × 100.', icon: 'solar:chart-down-bold', color: 'error.main' },
      { key: 'G', title: 'Net MRR Growth', value: formatMoney(netMrrGrowth), tooltip: 'New + Expansion – Contraction – Churned MRR. TODO: expansion/contraction.', icon: netMrrGrowth >= 0 ? 'solar:chart-up-bold' : 'solar:chart-down-bold', color: netMrrGrowth >= 0 ? 'success.main' : 'error.main' },
      { key: 'H', title: 'Refunds Issued', value: formatMoney(refundsIssued), tooltip: 'Total cash amount refunded this month.', icon: 'solar:card-bold', color: 'warning.main' },
    ];
    return items;
  }, [byCustomer, prevByCustomer, filtered, selectedMonth, selectedYear]);

  const tableMetrics = useMemo(() => {
    const totalCustomers = byCustomer.size;
    // Previous Month Overall MRR (A)
    const prevOverallMRR = Array.from(prevByCustomer.values()).flatMap(g => g.items).reduce((s, it) => s + toNumber(it.currentMonthMRR), 0);
    // Active Customers MRR (B) — customers that existed both months; sum current MRR for their active items
    const continuingEmails = Array.from(prevByCustomer.keys()).filter(e => byCustomer.has(e));
    const activeCustomersMRR = continuingEmails.reduce((sum, email) => {
      const items = (byCustomer.get(email)?.items || []).filter(it => isActiveStatus(it.subscriptionStatus));
      return sum + items.reduce((s, it) => s + toNumber(it.currentMonthMRR), 0);
    }, 0);
    // Cancelled Customers MRR (C) — churnedMRR from above approximation
    const churnedMRR = Array.from(byCustomer.values()).flatMap(g => g.items).filter(it => it.subscriptionStatus === 'Cancelled' || it.subscriptionStatus === 'Refunded').reduce((s, it) => s + toNumber(it.previousMonthMRR), 0);
    // New Customer MRR (D)
    const firstPaymentKeyByEmail = new Map();
    filtered.forEach((r) => {
      const k = (getMonthYear(r.paymentDate).year * 12) + getMonthYear(r.paymentDate).month;
      const cur = firstPaymentKeyByEmail.get(r.email);
      if (cur == null || k < cur) firstPaymentKeyByEmail.set(r.email, k);
    });
    const selectedKey = selectedYear * 12 + selectedMonth;
    const newCustomerMRR = Array.from(byCustomer.entries()).reduce((sum, [email, g]) => {
      if (firstPaymentKeyByEmail.get(email) === selectedKey) {
        return sum + g.items.filter(it => isActiveStatus(it.subscriptionStatus)).reduce((s, it) => s + toNumber(it.currentMonthMRR), 0);
      }
      return sum;
    }, 0);
    // Overall MRR (E) = B + D
    const overallMRR = activeCustomersMRR + newCustomerMRR;
    // Total Revenue (F) — approximate with sum of all current payments
    const totalRevenue = Array.from(byCustomer.values()).flatMap(g => g.items).reduce((s, it) => s + toNumber(it.currentMonthMRR), 0);
    // Revenue Churn % (G)
    const revenueChurnPct = prevOverallMRR > 0 ? (churnedMRR / prevOverallMRR) * 100 : 0;
    // Overall LTV (H) = (E) / (G) × 100
    const overallLTV = revenueChurnPct > 0 ? (overallMRR / (revenueChurnPct / 100)) : 0;
    // LTV per Customer (I)
    const ltvPerCustomer = totalCustomers > 0 ? overallLTV / totalCustomers : 0;
    // CAC placeholders (J, K)
    const overallCAC = null; // TODO: Inject CAC data source
    const cacPerCustomer = overallCAC && totalCustomers > 0 ? overallCAC / totalCustomers : null;
    // Total Customers Last Month (L)
    const totalCustomersLastMonth = prevByCustomer.size;
    // Active Customers (M)
    const activeCustomersCount = Array.from(byCustomer.values()).filter(g => g.items.some(it => isActiveStatus(it.subscriptionStatus))).length;
    // Customers Left (N) = L - M
    const customersLeft = Math.max(0, totalCustomersLastMonth - activeCustomersCount);
    // New Joined Customers (O)
    const newJoinedCustomers = Array.from(byCustomer.keys()).filter(email => {
      const allRows = filtered.filter(r => r.email === email);
      const firstKey = Math.min(...allRows.map(r => getMonthYear(r.paymentDate)).map(({ month, year }) => year * 12 + month));
      return firstKey === selectedKey;
    }).length;
    // Total Customers (Current) (P) = M + O
    const totalCustomersCurrent = activeCustomersCount + newJoinedCustomers;
    // User Churn % (Q) = N / L × 100
    const userChurnPct = totalCustomersLastMonth > 0 ? (customersLeft / totalCustomersLastMonth) * 100 : 0;
    // Average Revenue (R) = E / P
    const avgRevenue = totalCustomersCurrent > 0 ? overallMRR / totalCustomersCurrent : 0;
    // Customer Lifetime (Months) (S) = 1 / (User Churn % / 100)
    const customerLifetimeMonths = userChurnPct > 0 ? 1 / (userChurnPct / 100) : 0;
    // Refund Count (T) and Amount Refunded (U)
    const refunds = Array.from(byCustomer.values()).flatMap(g => g.items).filter(it => it.subscriptionStatus === 'Refunded');
    const refundCount = refunds.length;
    const refundAmount = refunds.reduce((s, it) => s + toNumber(it.currentMonthMRR), 0);

    const v = (x, money = false) => (x == null ? '—' : (money ? formatMoney(x) : x));

    return [
      ['A', 'Previous Month Overall MRR', 'Total MRR in previous month (consolidated)', v(prevOverallMRR, true)],
      ['B', 'Active Customers MRR', 'MRR from customers present both months', v(activeCustomersMRR, true)],
      ['C', 'Cancelled Customers MRR', 'MRR lost from cancelled/refunded customers', v(churnedMRR, true)],
      ['D', 'New Customer MRR', 'MRR from first-time customers this month', v(newCustomerMRR, true)],
      ['E', 'Overall MRR', '(B) + (D)', v(overallMRR, true)],
      ['F', 'Total Revenue', 'Sum of current-month payments', v(totalRevenue, true)],
      ['G', 'Revenue Churn %', '((C) / (A)) × 100', `${(Number.isFinite(revenueChurnPct) ? revenueChurnPct : 0).toFixed(1)}%`],
      ['H', 'Overall LTV', '(E) / (G) × 100', v(overallLTV, true)],
      ['I', 'LTV per Customer', '(H) / (Total Customers)', v(ltvPerCustomer, true)],
      ['J', 'Overall CAC', 'Total acquisition spend', v(overallCAC, true)],
      ['K', 'CAC per Customer', '(J) / (Total Customers)', v(cacPerCustomer, true)],
      ['L', 'Total Customers Last Month', 'Unique customers in previous month', v(totalCustomersLastMonth)],
      ['M', 'Active Customers', 'Customers with ≥1 active subscription', v(activeCustomersCount)],
      ['N', 'Customers Left', '(L) - (M)', v(customersLeft)],
      ['O', 'New Joined Customers', 'First-time customers this month', v(newJoinedCustomers)],
      ['P', 'Total Customers (Current)', '(M) + (O)', v(totalCustomersCurrent)],
      ['Q', 'User Churn %', '((N)/(L)) × 100', `${(Number.isFinite(userChurnPct) ? userChurnPct : 0).toFixed(1)}%`],
      ['R', 'Average Revenue', '(E)/(P)', v(avgRevenue, true)],
      ['S', 'Customer Lifetime (Months)', '1 / (User Churn % / 100)', v(customerLifetimeMonths)],
      ['T', 'Refund Count', 'Number of refunded transactions', v(refundCount)],
      ['U', 'Amount Refunded', 'Sum of refunded amounts (cash)', v(refundAmount, true)],
    ];
  }, [byCustomer, prevByCustomer, filtered, selectedMonth, selectedYear]);

  return (
    <Box sx={{ mb: 4 }}>
      {/* 4x2 Stats Cards Grid */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: 'repeat(1, 1fr)',
            sm: 'repeat(2, 1fr)',
            md: 'repeat(4, 1fr)',
          },
          gap: 3,
          mb: 4,
        }}
      >
        {metrics.map((m) => (
          <Tooltip
            key={m.key}
            arrow
            placement="top"
            title={
              <Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>{m.title}</Typography>
                <Typography variant="body2">{m.tooltip}</Typography>
              </Box>
            }
          >
            <Card sx={{ p: 3, borderRadius: '24px', boxShadow: '0 4px 15px rgba(0,0,0,0.08)', position: 'relative', overflow: 'hidden' }}>
              {/* Accent circle: slightly larger than icon */}
              <Box sx={{ position: 'absolute', right: -10, top: -10, width: 90, height: 90, borderRadius: '50%', background: (theme) => theme.palette.action.hover, zIndex: 0 }} />
              {/* Icon (ensure always present for F & G) */}
              <Iconify 
                icon={
                  m.key === 'F'
                    ? 'solar:chart-down-bold' // Revenue Churn %
                    : m.key === 'G'
                      ? ((typeof m.value === 'string' && m.value.includes('-')) ? 'solar:chart-down-bold' : 'solar:chart-up-bold') // Net MRR Growth
                      : (m.icon || 'solar:chart-square-bold')
                }
                sx={{ 
                  width: 48, 
                  height: 48, 
                  color:
                    m.key === 'F'
                      ? 'error.main'
                      : m.key === 'G'
                        ? ((typeof m.value === 'string' && m.value.includes('-')) ? 'error.main' : 'success.main')
                        : (m.color || 'primary.main'),
                  position: 'absolute', 
                  right: 12, 
                  top: 12, 
                  opacity: 0.95,
                  zIndex: 1,
                }} 
              />
              <Typography variant="h4" sx={{ mb: 1 }}>{m.value}</Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>{m.title}</Typography>
            </Card>
          </Tooltip>
        ))}
      </Box>

      {/* Metrics Table A–U */}
      <Card sx={{ p: 0, borderRadius: 3 }}>
        <Box sx={{ px: 3, pt: 3, pb: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, color: 'text.primary' }}>Revenue Metrics</Typography>
        </Box>
        <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 0, overflowX: 'auto' }}>
          <Table size="small" sx={{ minWidth: 720, '& .MuiTableCell-body': { py: 1.25, px: 2 } }}>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 600 }}>Index</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Metric</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Formula</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Value</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tableMetrics.map(([idx, metric, formula, value]) => (
                <TableRow key={idx} hover>
                  <TableCell sx={{ width: 72 }}>{idx}</TableCell>
                  <TableCell>{metric}</TableCell>
                  <TableCell sx={{ color: 'text.secondary' }}>{formula}</TableCell>
                  <TableCell>{value}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
    </Box>
  );
}

// Converted to named export only to satisfy lint rules in imports


