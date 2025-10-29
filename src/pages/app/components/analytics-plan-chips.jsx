import { Box, Chip, Typography } from '@mui/material';

// ----------------------------------------------------------------------

export function AnalyticsPlanChips({ analyticsData }) {
  if (!analyticsData || !analyticsData.plans || analyticsData.plans.length === 0) {
    return null;
  }

  const { plans } = analyticsData;

  // Find plan with most sales
  const mostSoldPlan = plans.reduce((max, plan) => 
    (plan.totalCustomers || 0) > (max.totalCustomers || 0) ? plan : max
  );

  // Find plan with least sales (excluding zero)
  const leastSoldPlan = plans.reduce((min, plan) => {
    if (min.totalCustomers === 0 && plan.totalCustomers > 0) return plan;
    if (plan.totalCustomers > 0 && (plan.totalCustomers || 0) < (min.totalCustomers || 0)) return plan;
    return min;
  }, plans[0] || {});

  // Get top 3 most purchased plans
  const sortedPlans = [...plans].sort((a, b) => (b.totalCustomers || 0) - (a.totalCustomers || 0));
  const top3Plans = sortedPlans.slice(0, 3);

  return (
    <Box
      sx={{
        backgroundColor: '#ffffff',
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        borderRadius: '16px',
        padding: '24px',
        mb: 4,
      }}
    >
      <Typography
        sx={{
          fontSize: '18px',
          fontWeight: 600,
          color: '#1f2937',
          mb: 3,
        }}
      >
        Plan Performance Summary
      </Typography>

      {/* Top-Selling Plan */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2, flexWrap: 'wrap' }}>
        <Typography
          sx={{
            fontSize: '14px',
            fontWeight: 500,
            color: '#374151',
            minWidth: '140px',
          }}
        >
          Top-Selling Plan:
        </Typography>
        <Chip
          label={`${mostSoldPlan.planName || 'Unknown'}`}
          sx={{
            backgroundColor: '#dbeafe',
            color: '#1e40af',
            fontWeight: 500,
            fontSize: '14px',
            height: '32px',
            borderRadius: '16px',
            '& .MuiChip-label': {
              px: 2,
            },
          }}
        />
        <Chip
          label={`${mostSoldPlan.totalCustomers || 0} sold`}
          sx={{
            backgroundColor: '#dbeafe',
            color: '#1e40af',
            fontWeight: 500,
            fontSize: '14px',
            height: '32px',
            borderRadius: '16px',
            '& .MuiChip-label': {
              px: 2,
            },
          }}
        />
      </Box>

      {/* Lowest-Selling Plan */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2, flexWrap: 'wrap' }}>
        <Typography
          sx={{
            fontSize: '14px',
            fontWeight: 500,
            color: '#374151',
            minWidth: '140px',
          }}
        >
          Lowest-Selling Plan:
        </Typography>
        <Chip
          label={`${leastSoldPlan.planName || 'Unknown'}`}
          sx={{
            backgroundColor: '#dbeafe',
            color: '#1e40af',
            fontWeight: 500,
            fontSize: '14px',
            height: '32px',
            borderRadius: '16px',
            '& .MuiChip-label': {
              px: 2,
            },
          }}
        />
        <Chip
          label={`${leastSoldPlan.totalCustomers || 0} sold`}
          sx={{
            backgroundColor: '#dbeafe',
            color: '#1e40af',
            fontWeight: 500,
            fontSize: '14px',
            height: '32px',
            borderRadius: '16px',
            '& .MuiChip-label': {
              px: 2,
            },
          }}
        />
      </Box>

      {/* Top 3 Best-Selling Plans */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
        <Typography
          sx={{
            fontSize: '14px',
            fontWeight: 500,
            color: '#374151',
            minWidth: '140px',
          }}
        >
          Top 3 Best-Selling:
        </Typography>
        {top3Plans.map((plan, index) => (
          <Chip
            key={index}
            label={`${index + 1}. ${plan.planName || 'Unknown'}`}
            sx={{
              backgroundColor: '#dbeafe',
              color: '#1e40af',
              fontWeight: 500,
              fontSize: '14px',
              height: '32px',
              borderRadius: '16px',
              '& .MuiChip-label': {
                px: 2,
              },
            }}
          />
        ))}
        {top3Plans.length > 2 && (
          <Chip
            label={`${top3Plans.reduce((sum, plan) => sum + (plan.totalCustomers || 0), 0)} Total Sold`}
            variant="outlined"
            sx={{
              backgroundColor: '#ffffff',
              borderColor: '#93c5fd',
              color: '#1e40af',
              fontWeight: 500,
              fontSize: '14px',
              height: '32px',
              borderRadius: '16px',
              '& .MuiChip-label': {
                px: 2,
              },
            }}
          />
        )}
      </Box>
    </Box>
  );
}

