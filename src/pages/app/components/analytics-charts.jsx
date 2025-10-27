import { Bar, Line, Doughnut } from 'react-chartjs-2';
// Chart.js components
import {
  Title,
  Filler,
  Legend,
  Tooltip,
  ArcElement,
  BarElement,
  LinearScale,
  LineElement,
  PointElement,
  CategoryScale,
  Chart as ChartJS,
} from 'chart.js';

import { Box, Card, Grid, useTheme, Typography } from '@mui/material';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  Filler
);

// ----------------------------------------------------------------------

export function AnalyticsCharts({ monthlyTrends, productBreakdown, planBreakdown }) {
  const theme = useTheme();

  // Show loading state if no data
  if (!monthlyTrends || !productBreakdown || !planBreakdown) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <Typography>Loading charts...</Typography>
      </Box>
    );
  }

  // MRR Growth Line Chart
  const mrrGrowthData = {
    labels: monthlyTrends?.mrr?.map(item => item.month) || [],
    datasets: [
      {
        label: 'MRR Growth',
        data: monthlyTrends?.mrr?.map(item => item.value) || [],
        borderColor: theme.palette.primary.main,
        backgroundColor: `${theme.palette.primary.main  }20`,
        borderWidth: 3,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: theme.palette.primary.main,
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 6,
        pointHoverRadius: 8,
      },
    ],
  };

  const mrrGrowthOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: 'Monthly Recurring Revenue Growth',
        font: {
          size: 16,
          weight: 'bold',
        },
        color: theme.palette.text.primary,
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: theme.palette.text.secondary,
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          color: theme.palette.divider,
        },
        ticks: {
          color: theme.palette.text.secondary,
          callback(value) {
            return `$${  value.toLocaleString()}`;
          },
        },
      },
    },
    interaction: {
      intersect: false,
      mode: 'index',
    },
  };

  // Customer Count Bar Chart
  const customerCountData = {
    labels: monthlyTrends?.customers?.map(item => item.month) || [],
    datasets: [
      {
        label: 'New Customers',
        data: monthlyTrends?.customers?.map(item => item.value) || [],
        backgroundColor: `${theme.palette.primary.main  }80`,
        borderColor: theme.palette.primary.main,
        borderWidth: 1,
        borderRadius: 4,
      },
    ],
  };

  const customerCountOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: 'Customer Acquisition',
        font: {
          size: 16,
          weight: 'bold',
        },
        color: theme.palette.text.primary,
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: theme.palette.text.secondary,
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          color: theme.palette.divider,
        },
        ticks: {
          color: theme.palette.text.secondary,
        },
      },
    },
  };

  // Product Distribution Pie Chart
  const productDistributionData = {
    labels: Object.keys(productBreakdown || {}),
    datasets: [
      {
        data: Object.values(productBreakdown || {}).map(item => item.monthlyMRR),
        backgroundColor: [
          theme.palette.primary.main,
          theme.palette.secondary.main,
          theme.palette.success.main,
          theme.palette.warning.main,
          theme.palette.error.main,
        ],
        borderColor: theme.palette.background.paper,
        borderWidth: 2,
        hoverOffset: 4,
      },
    ],
  };

  const productDistributionOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 20,
          usePointStyle: true,
          color: theme.palette.text.primary,
        },
      },
      title: {
        display: true,
        text: 'MRR Distribution by Product',
        font: {
          size: 16,
          weight: 'bold',
        },
        color: theme.palette.text.primary,
      },
    },
  };

  // Plan Distribution Doughnut Chart
  const planDistributionData = {
    labels: Object.keys(planBreakdown || {}),
    datasets: [
      {
        data: Object.values(planBreakdown || {}).map(item => item.totalUsers),
        backgroundColor: [
          theme.palette.primary.light,
          theme.palette.primary.main,
          theme.palette.primary.dark,
          theme.palette.secondary.main,
        ],
        borderColor: theme.palette.background.paper,
        borderWidth: 2,
        hoverOffset: 4,
      },
    ],
  };

  const planDistributionOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 20,
          usePointStyle: true,
          color: theme.palette.text.primary,
        },
      },
      title: {
        display: true,
        text: 'Customer Distribution by Plan',
        font: {
          size: 16,
          weight: 'bold',
        },
        color: theme.palette.text.primary,
      },
    },
  };

  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold' }}>
        Analytics Overview
      </Typography>
      
      <Grid container spacing={3}>
        {/* MRR Growth Chart */}
        <Grid item xs={12} lg={8}>
          <Card sx={{ p: 3, height: 400 }}>
            <Box sx={{ height: 300 }}>
              <Line data={mrrGrowthData} options={mrrGrowthOptions} />
            </Box>
          </Card>
        </Grid>

        {/* Customer Count Chart */}
        <Grid item xs={12} lg={4}>
          <Card sx={{ p: 3, height: 400 }}>
            <Box sx={{ height: 300 }}>
              <Bar data={customerCountData} options={customerCountOptions} />
            </Box>
          </Card>
        </Grid>

        {/* Product Distribution */}
        <Grid item xs={12} md={6}>
          <Card sx={{ p: 3, height: 400 }}>
            <Box sx={{ height: 300 }}>
              <Doughnut data={productDistributionData} options={productDistributionOptions} />
            </Box>
          </Card>
        </Grid>

        {/* Plan Distribution */}
        <Grid item xs={12} md={6}>
          <Card sx={{ p: 3, height: 400 }}>
            <Box sx={{ height: 300 }}>
              <Doughnut data={planDistributionData} options={planDistributionOptions} />
            </Box>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
