import { Box, Card, Table, TableRow, TableBody, TableCell, TableHead, Typography } from '@mui/material';

// ----------------------------------------------------------------------

export function AnalyticsTables({ analyticsData }) {
  const getSummaryData = (data) => {
    if (!data || !data.summary) {
      return {
        active: [],
        newCustomers: [],
        refund: [],
        churn: [],
        allCustomers: []
      };
    }
   
    const { summary, plans = [], customers = [] } = data;
   
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

    return {
      active: [
        { metric: 'Active Customers (Current)', value: (summary.totalCustomers || summary.activeCustomers || 0).toString() },
        { metric: 'Total MRR (Monthly Recurring Revenue)', value: `$${(summary.totalMRR || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` },
        { metric: 'Average CAC per Customer', value: `$${(summary.cacPerCustomer || summary.cac || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` },
        { metric: 'Average Customer Lifetime (Months)', value: (summary.avgMonthsCustomerRemains || 0).toFixed(1) },
      ],
      newCustomers: [
        { metric: 'New Customers', value: (summary.newJoinedCustomers || summary.newCustomers || 0).toString() },
        { metric: 'New MRR (from New Customers)', value: `$${(summary.newCustomerMRR || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` },
        { metric: 'Total Customer Acquisition Cost (CAC)', value: `$${(summary.overallCAC || summary.cac || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` },
      ],
      refund: [
        { metric: 'Refunded Revenue', value: `$${(summary.totalRefunds || summary.refunds || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` },
      ],
      churn: [
        { metric: 'Churned Customers', value: (summary.customersLeft || summary.cancelledCustomers || 0).toString() },
        { metric: 'Plan with Highest Churn Rate', value: maxChurnPlan ? `${maxChurnPlan.planName || 'Unknown'} (${(maxChurnPlan.churnRate || 0).toFixed(1)}%)` : 'N/A' },
      ],
      allCustomers: [
        { metric: 'Total Customers (Current Month)', value: (summary.totalCustomersThisMonth || summary.totalCustomers || 0).toString() },
        { metric: 'Total Recognized Revenue', value: `$${(summary.totalMRR || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` },
        { metric: 'Total Plans Sold', value: totalPlansSold.toString() },
        { metric: 'Top-Selling Plan', value: mostSoldPlan ? `${mostSoldPlan.planName || 'Unknown'} (${mostSoldPlan.totalCustomers || 0} sold)` : 'N/A' },
        { metric: 'Lowest-Selling Plan', value: leastSoldPlan ? `${leastSoldPlan.planName || 'Unknown'} (${leastSoldPlan.totalCustomers || 0} sold)` : 'N/A' },
        { metric: 'Top 3 Best-Selling Plans', value: top3Plans || 'N/A' },
      ],
    };
  };

  const summaryData = getSummaryData(analyticsData);

  const renderTable = (title, data) => (
    <Card
      sx={{
        backgroundColor: '#ffffff',
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        borderRadius: '16px',
        padding: '24px',
        mb: 3,
      }}
    >
      {/* Section Heading */}
      <Typography
        sx={{
          fontSize: '18px',
          fontWeight: 600,
          color: '#1f2937',
          mb: 2,
        }}
      >
        {title}
      </Typography>

      {/* Table */}
      <Box sx={{ width: '100%', overflowX: 'auto' }}>
        <Table sx={{ width: '100%', minWidth: '100%' }}>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#f9fafb' }}>
              <TableCell 
                sx={{ 
                  color: '#6b7280',
                  fontSize: '14px',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  py: 1.5,
                  px: 1.5,
                  border: 'none',
                  textAlign: 'left',
                }}
              >
                Metric
              </TableCell>
              <TableCell 
                sx={{ 
                  color: '#6b7280',
                  fontSize: '14px',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  py: 1.5,
                  px: 1.5,
                  border: 'none',
                  textAlign: 'right',
                }}
              >
                Current Value
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.length === 0 ? (
              <TableRow>
                <TableCell 
                  colSpan={2} 
                  align="center" 
                  sx={{ 
                    py: 5,
                    color: '#9ca3af',
                    fontSize: '14px',
                    border: 'none',
                  }}
                >
                  No data available
                </TableCell>
              </TableRow>
            ) : (
              data.map((row, index) => (
                <TableRow
                  key={index}
                  sx={{
                    backgroundColor: index % 2 === 0 ? '#ffffff' : '#f9fafb',
                    transition: 'background-color 0.15s ease',
                    '&:hover': {
                      backgroundColor: '#f3f4f6',
                    },
                  }}
                >
                  <TableCell 
                    sx={{ 
                      color: '#374151',
                      fontSize: '14px',
                      py: 1.5,
                      px: 1.5,
                      border: 'none',
                      verticalAlign: 'middle',
                      textAlign: 'left',
                    }}
                  >
                    {row.metric}
                  </TableCell>
                  <TableCell 
                    sx={{ 
                      color: '#374151',
                      fontSize: '14px',
                      fontWeight: 500,
                      py: 1.5,
                      px: 1.5,
                      border: 'none',
                      verticalAlign: 'middle',
                      textAlign: 'right',
                    }}
                  >
                    {row.value}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Box>
    </Card>
  );

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      {renderTable('Active Customers', summaryData.active)}
      {renderTable('New Customers', summaryData.newCustomers)}
      {renderTable('Refund', summaryData.refund)}
      {renderTable('Churn', summaryData.churn)}
      {renderTable('All Customers', summaryData.allCustomers)}
    </Box>
  );
}

