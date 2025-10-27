import { Card, Paper, Table, TableRow, useTheme, TableBody, TableCell, TableHead, Typography, TableContainer } from '@mui/material';

// ----------------------------------------------------------------------

export function StatsSummaryTable({ analyticsData }) {
  const theme = useTheme();

  const getSummaryData = (data) => {
    if (!data || !data.summary) {
      return [];
    }
   
    const { summary, plans = [], customers = [] } = data;
   
    // Calculate plan-specific metrics
    const planMetrics = plans.reduce((acc, plan) => {
      acc[plan.planName] = {
        totalSold: plan.totalCustomers || 0,
        active: plan.activeCustomers || 0,
        churned: (plan.totalCustomers || 0) - (plan.activeCustomers || 0),
        churnRate: plan.churnRate || 0
      };
      return acc;
    }, {});

    // Find plan with most sales
    const mostSoldPlan = plans.length > 0
      ? plans.reduce((max, plan) => (plan.totalCustomers || 0) > (max.totalCustomers || 0) ? plan : max)
      : null;

    // Find plan with least sales (excluding zero)
    const leastSoldPlan = plans.length > 0
      ? plans.reduce((min, plan) => {
          if (min.totalCustomers === 0 && plan.totalCustomers > 0) return plan;
          if (plan.totalCustomers > 0 && (plan.totalCustomers || 0) < (min.totalCustomers || 0)) return plan;
          return min;
        }, plans[0] || {})
      : null;

    // Find plan with maximum churn
    const maxChurnPlan = plans.length > 0
      ? plans.reduce((max, plan) => (plan.churnRate || 0) > (max.churnRate || 0) ? plan : max)
      : null;

    // Get top 3 most purchased plans
    const sortedPlans = [...plans].sort((a, b) => (b.totalCustomers || 0) - (a.totalCustomers || 0));
    const top3Plans = sortedPlans.slice(0, 3).map((plan, index) =>
      `${index + 1}. ${plan.planName || 'Unknown'}`
    ).join(', ');

    // Calculate total plan sales across all plans
    const totalPlansSold = plans.reduce((sum, plan) => sum + (plan.totalCustomers || 0), 0);

    return [
      // Core MRR Metrics
      { particular: 'New Customer MRR', value: `$${(summary.newCustomerMRR || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` },
      { particular: 'Refunds', value: `$${(summary.totalRefunds || summary.refunds || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` },
      { particular: 'Overall MRR', value: `$${(summary.totalMRR || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` },
      { particular: 'Total Revenue', value: `$${(summary.totalMRR || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` },

      // CAC Metrics
      { particular: 'Overall CAC', value: `$${(summary.overallCAC || summary.cac || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` },
      { particular: 'CAC Per Customer', value: `$${(summary.cacPerCustomer || summary.cac || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` },

      // Customer Metrics
      { particular: 'Total number of active customers', value: (summary.totalCustomers || summary.activeCustomers || 0).toString() },
      { particular: 'Number of customers who have left', value: (summary.customersLeft || summary.cancelledCustomers || 0).toString() },
      { particular: 'Number of new customers acquired', value: (summary.newJoinedCustomers || summary.newCustomers || 0).toString() },
      { particular: 'Total Customers This Month', value: (summary.totalCustomersThisMonth || summary.totalCustomers || 0).toString() },
      { particular: 'Avg Months a Customer Remains', value: (summary.avgMonthsCustomerRemains || 0).toFixed(1) },

      // Plan Sales Metrics
      { particular: 'Total plan sold of a product', value: totalPlansSold.toString() },
      { particular: 'Which plan was sold the most', value: mostSoldPlan ? `${mostSoldPlan.planName || 'Unknown'} (${mostSoldPlan.totalCustomers || 0} sold)` : 'N/A' },
      { particular: 'Which plan was sold the least', value: leastSoldPlan ? `${leastSoldPlan.planName || 'Unknown'} (${leastSoldPlan.totalCustomers || 0} sold)` : 'N/A' },
      { particular: 'Plan name with the maximum number of churn', value: maxChurnPlan ? `${maxChurnPlan.planName || 'Unknown'} (${(maxChurnPlan.churnRate || 0).toFixed(1)}%)` : 'N/A' },
      { particular: 'Top 3 plans that were purchased most frequently', value: top3Plans || 'N/A' },
    ];
  };

  const summaryData = getSummaryData(analyticsData);

  return (
    <Card
      sx={{
        p: 3,
        borderRadius: 4,
        boxShadow: '0 4px 15px rgba(0,0,0,0.08)',
        backgroundColor: theme.palette.background.paper,
      }}
    >
      <Typography
        variant="h5"
        sx={{
          fontSize: '20px',
          fontWeight: 600,
          color: 'text.primary',
          mb: 3,
        }}
      >
        Analytics Summary
      </Typography>

      <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 2 }}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: theme.palette.grey[100] }}>
              <TableCell sx={{ fontWeight: 600, color: 'text.primary', borderBottom: `1px solid ${theme.palette.divider}` }}>
                Particular
              </TableCell>
              <TableCell sx={{ fontWeight: 600, color: 'text.primary', borderBottom: `1px solid ${theme.palette.divider}` }}>
                Value
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {summaryData.map((row, index) => (
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
                  <Typography variant="body2" color="text.primary">
                    {row.particular}
                  </Typography>
                </TableCell>
                <TableCell sx={{ borderBottom: `1px solid ${theme.palette.divider}`, py: 1.75, px: 2 }}>
                  <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                    {row.value}
                  </Typography>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Card>
  );
}
