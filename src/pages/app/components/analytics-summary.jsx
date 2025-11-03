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

import { PAYMENT_SOURCE } from './analytics-payment-table';

// Metric tooltips for cards (A–H) and table (A–U)
export const metricTooltips = {
  A: {
    title: 'Previous Month Total MRR',
    description:
      'Total Monthly Recurring Revenue (MRR) collected in the previous month, derived from all active subscriptions in that period.',
    formula: 'Sum of all active MRR in previous month (Consolidated Data).',
  },
  B: {
    title: 'Active Customers MRR',
    description:
      'MRR from customers who continued from the previous month and still have active subscriptions this month.',
    formula: 'Sum of MRR for customers active in both months.',
  },
  C: {
    title: 'Churned Customers MRR',
    description:
      'Total MRR lost due to customers who churned (cancelled or refunded all their subscriptions this month).',
    formula: 'Sum of MRR from customers who churned (Cancelled + Refunded).',
  },
  D: {
    title: 'New Joined Customer MRR',
    description:
      'Monthly Recurring Revenue generated from first-time customers (New Joined) acquired this month.',
    formula: 'Sum of MRR from New Joined customers joining this month.',
  },
  E: {
    title: 'Total MRR',
    description:
      'Combined Monthly Recurring Revenue for the current month, including both new and continuing customers.',
    formula: 'Total MRR = (B) + (D)',
  },
  F: {
    title: 'Total MRR Churn %',
    description:
      'Percentage of Monthly Recurring Revenue (MRR) lost during the period due to cancellations or downgrades.',
    formula: '((C) / (A)) × 100',
  },
  G: {
    title: 'Total Lifetime Value (LTV)',
    description:
      'Estimated total revenue expected from all customers over their lifetime, based on churn rate.',
    formula: '(E) / (F) × 100',
  },
  H: {
    title: 'LTV Per Customer',
    description:
      'Average revenue expected per customer throughout their lifetime.',
    formula: '(G) / (Total Customers)',
  },
  I: {
    title: 'Total Customers of Previous Month',
    description:
      'Total paying customers who had at least one active subscription in the previous month.',
    formula: 'New Joined Customers + Active Customers in Previous Month.',
  },
  J: {
    title: 'Active Customers',
    description:
      'Total customers who currently have one or more active subscriptions (Recurring or New Subscription).',
    formula: 'Count of customers with active subscriptions this month.',
  },
  K: {
    title: 'Customers Left',
    description:
      'Number of customers lost compared to the previous month — those who no longer have active subscriptions.',
    formula: '(I) - (J)',
  },
  L: {
    title: 'New Joined Customers',
    description:
      'Number of first-time customers who joined during the selected month.',
    formula: 'Count of first-time paying customers this month.',
  },
  M: {
    title: 'Total Customers in Selected Month',
    description:
      'Total number of customers in the current month, including active and new customers.',
    formula: '(J) + (L)',
  },
  N: {
    title: 'User Churn %',
    description:
      'Percentage of customers lost compared to the previous month.',
    formula: '((K) / (I)) × 100',
  },
  O: {
    title: 'Average MRR per Customer',
    description:
      'Average Monthly Recurring Revenue per active customer in the current month.',
    formula: '(E) / (M)',
  },
  P: {
    title: 'Customer Lifetime (Months)',
    description:
      'Average number of months a customer is expected to stay subscribed before churning.',
    formula: '1 / (User Churn % / 100)',
  },
  Q: {
    title: 'Refund Count',
    description:
      'Total number of refund transactions processed during the current month.',
    formula: 'Count of refunded payments this month.',
  },
  R: {
    title: 'Total MRR of Selected Month',
    description:
      'Total Monthly Recurring Revenue (MRR) from all active subscriptions in the selected month.',
    formula: 'Sum of all active subscription MRR for the selected month.',
  },
  S: {
    title: 'Same‑Month Churn (Count)',
    description:
      'Count of customers who first purchased this month and ended the month without any active subscription.',
    formula: 'New Joined AND ended inactive in selected month.',
  },
};

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

function getMonthLabel(monthIndex, year) {
  const shortMonth = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${shortMonth[monthIndex]} ${year}`;
}

/**
 * Returns the effective MRR for a subscription item.
 * If the subscription is Refunded or Cancelled, returns 0; otherwise returns the currentMonthMRR.
 */
function getEffectiveMRR(item) {
  if (item.subscriptionStatus === 'Refunded' || item.subscriptionStatus === 'Cancelled') {
    return 0;
  }
  return toNumber(item.currentMonthMRR);
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

  // Calculate all metrics for the table (previously split between stats cards and table)
  const tableMetrics = useMemo(() => {

    let activeCustomers = 0; // includes Recurring and New Subscription
    let activeRecurringCustomers = 0; // Recurring only
    let newCustomers = 0; // New Joined per consolidated logic
    let activeCustomersCountForTotal = 0; // Active customers (excluding New Joined) for Total calculation
    let churnedCustomers = 0;
    let sameMonthChurnCustomers = 0; // new joined who ended the month inactive
    let totalMRR = 0;
    let previousMonthMRR = 0;
    let churnedMRR = 0; // approximation: sum of prev MRR for items cancelled/refunded this month
    let refundsIssued = 0; // cash refunds sum

    // Build first-payment lookup (kept for future use)
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
      const hasRecurring = g.items.some((it) => it.subscriptionStatus === 'Recurring');
      
      // Calculate previous month MRR for this customer (to match consolidated table logic)
      const sumPreviousMonthMRR = g.items.reduce((acc, it) => acc + toNumber(it.previousMonthMRR), 0);
      
      // New Joined logic (matches consolidated table): all subscriptions are "New Subscription" AND previous month MRR = 0
      const allNewSubscription = g.items.every((it) => it.subscriptionStatus === 'New Subscription');
      const isNewJoinedCustomer = allNewSubscription && sumPreviousMonthMRR === 0;
      
      // Active customer logic (matches consolidated table): has active subscription AND is NOT New Joined
      const hasActiveSubscription = g.items.some((it) => 
        it.subscriptionStatus === 'New Subscription' || it.subscriptionStatus === 'Recurring'
      );
      const isActiveCustomer = hasActiveSubscription && !isNewJoinedCustomer;

      if (hasActive) activeCustomers += 1;
      if (hasRecurring) activeRecurringCustomers += 1;
      if (isNewJoinedCustomer) newCustomers += 1;
      if (isActiveCustomer) activeCustomersCountForTotal += 1; // Count Active (excluding New Joined)

      g.items.forEach((it) => {
        // Active MRR this month
        if (isActiveStatus(it.subscriptionStatus)) totalMRR += toNumber(it.currentMonthMRR);
        // Refunds (cash) - use previousMonthMRR since that's what was actually refunded
        if (it.subscriptionStatus === 'Refunded') {
          refundsIssued += toNumber(it.previousMonthMRR);
        }
        // Churned MRR approx: if cancelled/refunded this month, count previous MRR as churned
        if (it.subscriptionStatus === 'Cancelled' || it.subscriptionStatus === 'Refunded') {
          churnedMRR += toNumber(it.previousMonthMRR);
        }
      });

      // same-month churn: first-time purchaser this month who ends the month without any active subscription
      const endedInactive = !g.items.some((it) => isActiveStatus(it.subscriptionStatus));
      if (isNewJoinedCustomer && endedInactive) sameMonthChurnCustomers += 1;
    });

    // Churned customers: had active subscriptions in previous month, but no active subscriptions now
    // Need to check both:
    // 1. Customers who appear in both months (might have churned)
    // 2. Customers who only appear in previous month (complete churn with no current month activity)
    
    // First, check customers who appear in current month
    byCustomer.forEach((g, email) => {
      // Check if customer was active in previous month
      let wasActiveInPrevMonth = false;
      
      if (prevByCustomer.has(email)) {
        const prevItems = prevByCustomer.get(email)?.items || [];
        // Had active subscription status OR positive MRR in previous month
        wasActiveInPrevMonth = prevItems.some((it) => 
          isActiveStatus(it.subscriptionStatus) || toNumber(it.currentMonthMRR) > 0
        );
      } else {
        // Customer doesn't appear in prevByCustomer but appears in current month
        // Check if they had previous month MRR > 0 (they had subscriptions before)
        const sumPrevMRR = g.items.reduce((acc, it) => acc + toNumber(it.previousMonthMRR), 0);
        wasActiveInPrevMonth = sumPrevMRR > 0;
      }
      
      // Check if customer has active subscriptions in current month
      const hasActiveSubscription = g.items.some((it) => isActiveStatus(it.subscriptionStatus));
      
      // Calculate if customer is New Joined (to exclude from churned count)
      const sumPreviousMonthMRR = g.items.reduce((acc, it) => acc + toNumber(it.previousMonthMRR), 0);
      const allNewSubscription = g.items.every((it) => it.subscriptionStatus === 'New Subscription');
      const isNewJoinedCustomer = allNewSubscription && sumPreviousMonthMRR === 0;
      
      // Churned = was active in previous month AND is not Active or New Joined in current month
      if (wasActiveInPrevMonth && !hasActiveSubscription && !isNewJoinedCustomer) {
        churnedCustomers += 1;
      }
    });
    
    // Second, check customers who were in previous month but have NO activity in current month (complete churn)
    prevByCustomer.forEach((g, email) => {
      // Skip if already counted above (customer appears in current month)
      if (byCustomer.has(email)) return;
      
      // Check if they had active subscriptions in previous month
      const hadActiveInPrevMonth = g.items.some((it) => 
        isActiveStatus(it.subscriptionStatus) || toNumber(it.currentMonthMRR) > 0
      );
      
      // If they were active in previous month but have no activity in current month, they churned
      if (hadActiveInPrevMonth) {
        churnedCustomers += 1;
      }
    });

    const revenueChurnPct = previousMonthMRR > 0 ? (churnedMRR / previousMonthMRR) * 100 : 0;

    // Net MRR Growth approximation: New Joined + Expansion (— TODO) – Contraction (— TODO) – Churned MRR
    // Only include MRR from New Joined customers (matching consolidated table logic)
    const newMRR = Array.from(byCustomer.values()).reduce((sum, g) => {
      const sumPreviousMonthMRR = g.items.reduce((acc, it) => acc + toNumber(it.previousMonthMRR), 0);
      const allNewSubscription = g.items.every((it) => it.subscriptionStatus === 'New Subscription');
      const isNewJoinedCustomer = allNewSubscription && sumPreviousMonthMRR === 0;
      if (isNewJoinedCustomer) {
        return sum + g.items.filter(it => isActiveStatus(it.subscriptionStatus)).reduce((s, it) => s + toNumber(it.currentMonthMRR), 0);
      }
      return sum;
    }, 0);
    
    // TODO: derive expansion and contraction deltas at customer-level
    const expansion = 0; // TODO
    const contraction = 0; // TODO
    const netMrrGrowth = newMRR + expansion - contraction - churnedMRR;
    
    // Calculate month labels
    const prevMonthIndex = (selectedMonth + 11) % 12;
    const prevYear = selectedMonth === 0 ? selectedYear - 1 : selectedYear;
    const currentMonthLabel = getMonthLabel(selectedMonth, selectedYear);
    const prevMonthLabel = getMonthLabel(prevMonthIndex, prevYear);
    
    // Previous Month Overall MRR
    const prevOverallMRR = Array.from(prevByCustomer.values()).flatMap(g => g.items).reduce((s, it) => s + toNumber(it.currentMonthMRR), 0);
    // Active Customers MRR — customers that existed both months; sum current MRR for their active items
    const continuingEmails = Array.from(prevByCustomer.keys()).filter(e => byCustomer.has(e));
    const activeCustomersMRR = continuingEmails.reduce((sum, email) => {
      const items = (byCustomer.get(email)?.items || []).filter(it => isActiveStatus(it.subscriptionStatus));
      return sum + items.reduce((s, it) => s + toNumber(it.currentMonthMRR), 0);
    }, 0);
    // New Customer MRR — matches consolidated table: New Joined customers only
    const newCustomerMRR = Array.from(byCustomer.values()).reduce((sum, g) => {
      const sumPreviousMonthMRR = g.items.reduce((acc, it) => acc + toNumber(it.previousMonthMRR), 0);
      const allNewSubscription = g.items.every((it) => it.subscriptionStatus === 'New Subscription');
      const isNewJoinedCustomer = allNewSubscription && sumPreviousMonthMRR === 0;
      if (isNewJoinedCustomer) {
        return sum + g.items.filter(it => isActiveStatus(it.subscriptionStatus)).reduce((s, it) => s + toNumber(it.currentMonthMRR), 0);
      }
      return sum;
    }, 0);
    // Total MRR Value = Active Customers MRR + New Customer MRR
    const totalMRRValue = activeCustomersMRR + newCustomerMRR;
    // Total MRR Churn % - use previousMonthMRR and churnedMRR already calculated above
    const revenueChurnPctTable = prevOverallMRR > 0 ? (churnedMRR / prevOverallMRR) * 100 : 0;
    // Total LTV
    const totalLTV = revenueChurnPctTable > 0 ? (totalMRRValue / (revenueChurnPctTable / 100)) : 0;
    // LTV per Customer
    const totalCustomersForLTV = byCustomer.size;
    const ltvPerCustomer = totalCustomersForLTV > 0 ? totalLTV / totalCustomersForLTV : 0;
    // Calculate metrics that were in stats cards (must be before other calculations)
    const totalCustomersSelectedMonth = activeCustomersCountForTotal + newCustomers;
    
    // Total Customers Last Month
    const totalCustomersLastMonth = prevByCustomer.size;
    // Active Customers — matches consolidated table: has active subscription AND is NOT New Joined
    // (use activeCustomersCountForTotal already calculated above)
    // Customers Left
    const customersLeft = Math.max(0, totalCustomersLastMonth - activeCustomersCountForTotal);
    // User Churn %
    const userChurnPct = totalCustomersLastMonth > 0 ? (customersLeft / totalCustomersLastMonth) * 100 : 0;
    // Average MRR
    const avgRevenue = totalCustomersSelectedMonth > 0 ? totalMRR / totalCustomersSelectedMonth : 0;
    // Customer Lifetime (Months)
    const customerLifetimeMonths = userChurnPct > 0 ? 1 / (userChurnPct / 100) : 0;
    // Refund Count
    const refundCount = Array.from(byCustomer.values()).flatMap(g => g.items).filter(it => it.subscriptionStatus === 'Refunded').length;
    // Total MRR for metric R (sum of all active subscription MRR)
    const totalRevenue = Array.from(byCustomer.values()).flatMap(g => g.items).reduce((s, it) => s + getEffectiveMRR(it), 0);

    const v = (x, money = false) => (x == null ? '—' : (money ? formatMoney(x) : x));
    
    // Note: totalMRR already calculated above in the byCustomer.forEach loop
    // Note: sameMonthChurnCustomers already calculated above in the byCustomer.forEach loop
    
    return [
      // Customer Metrics (from stats cards)
      ['A', `Total Customers in Selected Month (${currentMonthLabel})`, 'Active Customers + New Joined Customers', v(totalCustomersSelectedMonth)],
      ['B', `Active Customers (${currentMonthLabel})`, 'Customers with ≥1 active subscription (excluding New Joined)', v(activeCustomersCountForTotal)],
      ['C', `New Joined Customers (${currentMonthLabel})`, 'First-time customers this month', v(newCustomers)],
      ['D', `Churned Customers (${currentMonthLabel})`, 'Customers who had active plans before but now have none', v(churnedCustomers)],
      ['E', `Total MRR (${currentMonthLabel})`, 'Sum of all active subscription MRR for the current month', v(formatMoney(totalMRR), true)],
      ['F', `Total MRR Churn % (${prevMonthLabel} → ${currentMonthLabel})`, 'Churned MRR / Previous Month MRR × 100', `${(Number.isFinite(revenueChurnPctTable) ? revenueChurnPctTable : 0).toFixed(1)}%`],
      ['G', `Net MRR Growth (${currentMonthLabel})`, 'New Joined MRR - Churned MRR (expansion/contraction not yet implemented)', v(formatMoney(netMrrGrowth), true)],
      ['H', `Refunds Issued (${currentMonthLabel})`, 'Total cash amount refunded this month', v(formatMoney(refundsIssued), true)],
      ['I', `Same‑Month Churn (Count) (${currentMonthLabel})`, 'New Joined customers who ended inactive in selected month', v(sameMonthChurnCustomers)],
      
      // MRR Metrics (from table)
      ['J', `Previous Month Total MRR (${prevMonthLabel})`, `Total MRR in previous month (${prevMonthLabel}, consolidated)`, v(prevOverallMRR, true)],
      ['K', `Active Customers MRR (Both ${prevMonthLabel} & ${currentMonthLabel})`, `MRR from customers present both months (${prevMonthLabel} & ${currentMonthLabel})`, v(activeCustomersMRR, true)],
      ['L', `Churned Customers MRR (${currentMonthLabel})`, `MRR lost from churned customers (${currentMonthLabel})`, v(churnedMRR, true)],
      ['M', `New Joined Customer MRR (${currentMonthLabel})`, `MRR from New Joined customers (${currentMonthLabel})`, v(newCustomerMRR, true)],
      ['N', `Total Customers of Previous Month (${prevMonthLabel})`, `New Joined Customers + Active Customers in ${prevMonthLabel}`, v(totalCustomersLastMonth)],
      ['O', `Customers Left (${prevMonthLabel} → ${currentMonthLabel})`, '(N) - (B)', v(customersLeft)],
      ['P', `User Churn % (${prevMonthLabel} → ${currentMonthLabel})`, '((O)/(N)) × 100', `${(Number.isFinite(userChurnPct) ? userChurnPct : 0).toFixed(1)}%`],
      ['Q', `Average MRR per Customer (${currentMonthLabel})`, '(E)/(A)', v(avgRevenue, true)],
      ['R', `Total MRR of Selected Month (${currentMonthLabel})`, `Sum of all active subscription MRR for ${currentMonthLabel}`, v(totalRevenue, true)],
      
      // Financial Metrics
      ['S', `Total LTV (${currentMonthLabel})`, '(E) / (F) × 100', v(totalLTV, true)],
      ['T', `LTV Per Customer (${currentMonthLabel})`, '(S) / (Total Customers)', v(ltvPerCustomer, true)],
      ['U', `Customer Lifetime (Months) (${currentMonthLabel})`, '1 / (User Churn % / 100)', v(customerLifetimeMonths)],
      
      // Refund Metrics
      ['V', `Refund Count (${currentMonthLabel})`, 'Number of refunded transactions', v(refundCount)],
    ];
  }, [byCustomer, prevByCustomer, filtered, selectedMonth, selectedYear]);

  return (
    <Box sx={{ mb: 4 }}>
      {/* MRR Metrics Table */}
      <Card sx={{ p: 0, borderRadius: '16px' }}>
        <Box sx={{ px: 3, pt: 2, pb: 1.5 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, color: 'text.primary' }}>MRR Metrics</Typography>
        </Box>
        <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 0, overflowX: 'auto' }}>
          <Table size="small" sx={{ minWidth: 720, '& .MuiTableCell-body': { py: 1.25, px: 2 } }}>
            <TableHead sx={{ '& th': { py: 2 } }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 600 }}>Index</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Metric</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Formula</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Value</TableCell>
              </TableRow>
            </TableHead>
            <TableBody sx={{ '& td': { py: 1.25 } }}>
              {tableMetrics.map(([idx, metric, formula, value]) => (
                <TableRow key={idx} hover>
                  <TableCell sx={{ width: 72 }}>{idx}</TableCell>
                  <TableCell>
                    <Tooltip
                      arrow
                      placement="top"
                      disableInteractive
                      title={
                        <Box>
                          <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>{metricTooltips[idx]?.title || metric}</Typography>
                          <Typography variant="body2">{metricTooltips[idx]?.description || formula}</Typography>   
                        </Box>
                      }
                    >
                      <span>{metric}</span>
                    </Tooltip>
                  </TableCell>
                  <TableCell sx={{ color: 'text.secondary' }}>
                    <span>{formula}</span>
                  </TableCell>
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


