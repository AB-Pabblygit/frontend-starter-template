# New Analytics Documentation

## Overview
The New Analytics section provides cohort-aligned, month-sensitive MRR and churn analytics with two synchronized views:
- Stats Cards (Top KPIs)
- Revenue Metrics Table (A–V)
- Expanded Data Table (subscription-level rows)
- Consolidated Data Table (customer-level rollups with collapsible details)

All calculations react to filters: month, year, product, and plan.

## Shared Concepts
- Month/Year: Selected via UI; all “selected month” metrics reflect that month.
- Previous Month: The calendar month immediately before the selected month.
- Active subscription: subscriptionStatus in {Recurring, New Subscription}.
- Currency format: `$X.XX`.
- Date format: `MMM DD, YYYY`.

## Customer Status (per customer)
- Active: At least one subscription is Active (Recurring or New Subscription) in the selected month.
- New Joined: First-ever purchase occurs in the selected month (even if refunded/cancelled within the same month).
- Churned: No active subscriptions in the selected month. Includes same-month churn after being New Joined.

## Subscription Status (per row in Expanded / per consolidated trend)
- Recurring: Ongoing billing for the month.
- New Subscription: First paid month.
- Cancelled: Subscription stopped; current month MRR is $0.
- Refunded: Payment reversed; current month MRR becomes $0.
- Upgraded/Downgraded (Consolidated): Based on total MRR increase/decrease from previous to selected month.

---

## Stats Cards (Top KPIs)
Implementation: `src/pages/app/components/analytics-summary.jsx`

- Total Customers in Selected Month
  - Definition: Active Recurring customers + New Joined customers in the selected month.
  - Logic: Recurring-only continue + first-ever purchasers this month.
- Active Customers
  - Definition: Customers with at least one Recurring subscription in the selected month.
  - Logic: Count customers where any subscriptionStatus === 'Recurring'.
- New Customers (New Joined)
  - Definition: First-ever purchase happened in the selected month (cohort acquisition).
  - Logic: first payment month/year equals selected month/year (regardless of refund/cancel within the month).
- Churned Customers
  - Definition: Were present previous month with active items, but no active subscription now.
- Total MRR
  - Definition: Sum of currentMonthMRR for active subscriptions (Recurring/New Subscription) in selected month.
- Revenue Churn %
  - Definition: (Churned MRR / Previous Month MRR) × 100.
  - Churned MRR approx: Sum of previousMonthMRR for rows Cancelled/Refunded this month.
- Net MRR Growth
  - Definition: New + Expansion – Contraction – Churned MRR.
  - Current implementation: Expansion/Contraction marked TODO; computed as New – Churned MRR for now.
- Refunds Issued
  - Definition: Total cash refunded in selected month.
- Same‑Month Churn
  - Definition: Count of New Joined customers who ended the month without any active subscription.
  - Icon: `lucide:user-x`.

---

## Revenue Metrics Table (A–V)
Implementation: `AnalyticsSummary.tableMetrics` in the same file.

- (A) Previous Month Overall MRR: Sum of active MRR in previous month.
- (B) Active Customers MRR: MRR from customers present both months; sum active current MRR.
- (C) Cancelled Customers MRR: Sum of previousMonthMRR for rows Cancelled/Refunded this month.
- (D) New Customer MRR: Sum of active current MRR for New Joined customers.
- (E) Overall MRR: (B) + (D).
- (F) Total Revenue: Sum of current-month payments (cash, includes non-MRR if present).
- (G) Revenue Churn %: ((C)/(A)) × 100.
- (H) Overall LTV: (E) / (G) × 100.
- (I) LTV Per Customer: (H) / (Total Customers).
- (J) Overall CAC: Placeholder (requires external data source).
- (K) CAC per Customer: (J) / (Total Customers).
- (L) Total Customers of Previous Month: Count of unique customers previous month.
- (M) Active Customers: Count of customers with ≥1 Recurring subscription this month.
- (N) Customers Left: (L) - (M).
- (O) New Joined Customers: Count of first-ever paying customers this month.
- (P) Total Customers (Current): (M) + (O).
- (Q) User Churn %: (N) / (L) × 100.
- (R) Average Revenue: (E) / (P).
- (S) Customer Lifetime (Months): 1 / (User Churn % / 100).
- (T) Refund Count: Count of refunded transactions.
- (U) Amount Refunded: Sum of refunded amounts (cash).
- (V) Same‑Month Churn (Count): New Joined who ended inactive in selected month.

---

## Expanded Data Table (Subscription-level)
Implementation: `src/pages/app/components/analytics-payment-table.jsx`

Columns and key logic:
- Payment On (A): Date in `MMM DD, YYYY`; must be within selected month for current view.
- Email / Name (B): Customer identifiers.
- Product / Plan (C): Product/service and plan.
- Previous Month MRR (D): MRR for previous month (per subscription).
- Current Month MRR (E): MRR for selected month (per subscription).
- Billing Cycle (F): Monthly or Yearly.
- Advance Payment (G): For yearly plans: remaining prepaid balance (months × per‑month amount); “—” for monthly.
- Customer Status (H): Derived per customer across subscriptions (Active, New Joined, Churned).
- Payment Status (I): Subscription-level status (Recurring, New Subscription, Cancelled, Refunded).

Helpers:
- Active status = New Subscription or Recurring.
- toNumber/formatMoney sanitize and format currency values.
- Filtering respects product/plan; month/year mainly drive headers and the summary sections.

---

## Consolidated Data Table (Customer-level)
Implementation: `src/pages/app/components/analytics-consolidated-table.jsx`

Row aggregation by `email` with rollups:
- Payment Months (A): Comma-separated `Mon, YYYY` months seen for the customer.
- Email / Name (B)
- Product / Plan (C): Single value if uniform; otherwise “Multiple Products/Plans”.
- Previous Month MRR (D): Sum of previousMonthMRR across subscriptions.
- Selected Month MRR (E): Sum of currentMonthMRR across subscriptions.
- Advance Payment (G): Sum of yearly plan advance balances; “—” if none.
- Customer Status (H): Active, New Joined, or Churned (see rules above).
- Payment Status (I): Consolidated trend based on MRR movement and statuses (Upgraded, Downgraded, Recurring, New Subscription, Cancelled, Refunded).

Consolidated rules:
- Active if any subscription is Active (Recurring or New Subscription).
- New Joined if all subscriptions are New Subscription and previous-month total MRR = 0.
- Churned if no Active subscriptions.
- Consolidated status trend:
  - New Subscription: previous total MRR = 0, current > 0.
  - Upgraded: current total MRR > previous total MRR.
  - Downgraded: current total MRR < previous total MRR.
  - Recurring: current total MRR = previous total MRR and active exists.
  - Cancelled/Refunded: no active subscriptions; most recent status indicates variant.

Collapsible subscription details include per-subscription columns matching Expanded view, with aligned letter indices.

---

## Same‑Month Churn Handling
- Counted as New Joined for acquisition truth in the selected month.
- Also counted as Same‑Month Churn if they end the month inactive.
- They do not appear in next month unless reactivated.
- Revenue impact: net to zero in MRR if fully refunded/cancelled.

---

## Edge Cases
- Partial refunds: Customer may remain Active; refunds reduce cash totals but not active counts.
- Multiple subscriptions: Customer can be Active even if one subscription is Cancelled, as long as another is Active.
- Mixed billing cycles: Consolidated frequency displays Mixed.
- Missing/invalid dates or amounts: Safely coerced to defaults; invalid dates shown as 'Invalid Date' in consolidated details.

---

## Implementation Notes
- Locations: `analytics-summary.jsx`, `analytics-payment-table.jsx`, `analytics-consolidated-table.jsx`.
- Tooltips: Defined via `metricTooltips` and rendered on hover.
- Icons: Iconify; special cases for Revenue Churn %, Net MRR Growth, Same‑Month Churn.
- Styling: Consistent card radii, dotted table separators, and padding.
- TODOs: Expansion/Contraction deltas for Net MRR Growth; CAC data source.
