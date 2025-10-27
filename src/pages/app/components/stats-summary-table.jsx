import { Card, Paper, Table, TableRow, useTheme, TableBody, TableCell, TableHead, Typography, TableContainer } from '@mui/material';

import { getDashboardData, getMonthlyUserStats } from 'src/_mock/_database';

// ----------------------------------------------------------------------

const getSummaryData = (analyticsData) => {
  if (!analyticsData || !analyticsData.summary) {
    return [];
  }
  
  const summary = analyticsData.summary;
  
  return [
    { particular: 'New Customer MRR', value: `$${(summary.newCustomerMRR || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` },
    { particular: 'Refunds', value: `$${(summary.refunds || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` },
    { particular: 'Overall MRR', value: `$${(summary.totalMRR || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` },
    { particular: 'Total Revenue', value: `$${(summary.totalMRR || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` },
    { particular: 'Overall CAC', value: `$${(summary.overallCAC || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` },
    { particular: 'CAC Per Customer', value: `$${(summary.cacPerCustomer || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` },
    { particular: 'Customers Left', value: (summary.customersLeft || 0).toString() },
    { particular: 'New Joined Customers', value: (summary.newJoinedCustomers || 0).toString() },
    { particular: 'Total Customers This Month', value: (summary.totalCustomersThisMonth || 0).toString() },
    { particular: 'Avg Months a Customer Remains', value: (summary.avgMonthsCustomerRemains || 0).toFixed(1) }
  ];
};

// Enhanced summary data using backend API data - matching HTML design
const getEnhancedSummaryData = (summary) => [
  { particular: 'New Customer MRR', value: `$${summary.newCustomerMRR?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0'}` },
  { particular: 'Refunds', value: `$${summary.totalRefunds?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0'}` },
  { particular: 'Overall MRR', value: `$${summary.totalMRR?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0'}` },
  { particular: 'Total Revenue', value: `$${summary.totalMRR?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0'}` },
  { particular: 'Overall CAC', value: `$${summary.cac?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0'}` },
  { particular: 'CAC Per Customer', value: `$${summary.cac?.toFixed(2) || '0'}` },
  { particular: 'Customers Left', value: summary.cancelledCustomers?.toString() || '0' },
  { particular: 'New Joined Customers', value: summary.newCustomers?.toString() || '0' },
  { particular: 'Total Customers This Month', value: summary.totalCustomers?.toString() || '0' },
  { particular: 'Avg Months a Customer Remains', value: `${(summary.ltv / summary.arpu)?.toFixed(1) || '0'}` },
];

export function StatsSummaryTable({ analyticsData }) {
  const theme = useTheme();
  
  // Use analytics data if available, otherwise show loading state
  if (!analyticsData) {
    return (
      <Card sx={{ p: 3, textAlign: 'center' }}>
        <Typography>Loading summary data...</Typography>
      </Card>
    );
  }

  const summaryData = getSummaryData(analyticsData);
  
  return (
    <Card
      sx={{
        p: 3,
        borderRadius: 4, // Significantly rounded corners like in the images
        boxShadow: '0 4px 15px rgba(0,0,0,0.08)', // Soft shadow like in the images
        animation: 'fadeUp 0.8s ease',
        backgroundColor: theme.palette.background.paper,
        '@keyframes fadeUp': {
          from: { opacity: 0, transform: 'translateY(20px)' },
          to: { opacity: 1, transform: 'translateY(0)' },
        },
      }}
    >
      <Typography
        variant="h5"
        sx={{
          fontSize: '20px',
          fontWeight: 600,
          mb: 2.5,
          color: 'text.primary',
        }}
      >
        Stats Summary
      </Typography>

      <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 2, backgroundColor: theme.palette.background.paper }}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: theme.palette.grey[100] }}>
              <TableCell
                sx={{
                  fontWeight: 600,
                  color: 'text.primary',
                  borderBottom: `1px solid ${theme.palette.divider}`,
                }}
              >
                Particulars
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: 600,
                  color: 'text.primary',
                  borderBottom: `1px solid ${theme.palette.divider}`,
                }}
              >
                Values
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
                <TableCell
                  sx={{
                    borderBottom: `1px solid ${theme.palette.divider}`,
                    py: 1.75,
                    px: 2,
                  }}
                >
                  {row.particular}
                </TableCell>
                <TableCell
                  sx={{
                    borderBottom: `1px solid ${theme.palette.divider}`,
                    py: 1.75,
                    px: 2,
                    fontWeight: 500,
                  }}
                >
                  {row.value}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Card>
  );
}
