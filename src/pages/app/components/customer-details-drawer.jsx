import { 
  Box,
  Chip, 
  Stack, 
  Avatar, 
  Drawer, 
  Divider, 
  useTheme,
  IconButton, 
  Typography
} from '@mui/material';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

export function CustomerDetailsDrawer({ open, onClose, customerData }) {
  const theme = useTheme();
  
  if (!customerData) return null;

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      sx={{
        '& .MuiDrawer-paper': {
          width: { xs: '100%', sm: 500 },
          boxShadow: theme.customShadows.z24,
          transition: 'right 0.4s ease',
        },
      }}
    >
      <Box sx={{ p: 3, height: '100%', overflow: 'auto', backgroundColor: theme.palette.background.paper }}>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
          <Typography
            variant="h5"
            sx={{
              fontSize: '20px',
              color: theme.palette.text.primary,
              fontWeight: 600,
            }}
          >
            Sales Details
          </Typography>
          <IconButton
            onClick={onClose}
            sx={{
              color: theme.palette.text.secondary,
              '&:hover': {
                backgroundColor: theme.palette.action.hover,
              },
            }}
          >
            <Iconify icon="eva:close-fill" width={20} height={20} />
          </IconButton>
        </Box>

        {/* Customer Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
          <Avatar sx={{ bgcolor: theme.palette.primary.main, width: 40, height: 40 }}>
            {customerData.name?.charAt(0) || customerData.email?.charAt(0)}
          </Avatar>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h6" sx={{ fontSize: '16px', fontWeight: 600 }}>
              {customerData.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {customerData.email}
            </Typography>
          </Box>
          <Chip
            label={customerData.status}
            color="success"
            size="small"
            variant="filled"
          />
          <Box sx={{ textAlign: 'right' }}>
            <Typography variant="h6" color="success.main" sx={{ fontSize: '16px', fontWeight: 600 }}>
              {customerData.totalAmount} Net Revenue
            </Typography>
          </Box>
          <IconButton size="small">
            <Iconify icon="eva:more-vertical-fill" width={16} height={16} />
          </IconButton>
        </Box>

        <Divider sx={{ mb: 3 }} />

        {/* Payment Success Details */}
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h6"
            sx={{
              fontSize: '16px',
              fontWeight: 600,
              color: theme.palette.text.primary,
              mb: 2,
            }}
          >
            Payment Success Details
          </Typography>
          <Stack spacing={2}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="body2" color="text.secondary">Total Amount</Typography>
              <Typography variant="body2" color="text.primary" sx={{ fontWeight: 500 }}>
                {customerData.totalAmount}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="body2" color="text.secondary">Transaction Date</Typography>
              <Typography variant="body2" color="text.primary" sx={{ fontWeight: 500 }}>
                {customerData.date}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="body2" color="text.secondary">Transaction ID</Typography>
              <Typography 
                variant="body2" 
                color="primary" 
                sx={{ 
                  fontWeight: 500, 
                  cursor: 'pointer',
                  textDecoration: 'underline',
                  '&:hover': { color: theme.palette.primary.dark }
                }}
              >
                {customerData.transactionId}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="body2" color="text.secondary">Customer ID</Typography>
              <Typography 
                variant="body2" 
                color="primary" 
                sx={{ 
                  fontWeight: 500, 
                  cursor: 'pointer',
                  textDecoration: 'underline',
                  '&:hover': { color: theme.palette.primary.dark }
                }}
              >
                {customerData.customerId}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="body2" color="text.secondary">Subscription ID</Typography>
              <Typography 
                variant="body2" 
                color="primary" 
                sx={{ 
                  fontWeight: 500, 
                  cursor: 'pointer',
                  textDecoration: 'underline',
                  '&:hover': { color: theme.palette.primary.dark }
                }}
              >
                {customerData.subscriptionId}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="body2" color="text.secondary">Gateway</Typography>
              <Typography variant="body2" color="text.primary" sx={{ fontWeight: 500 }}>
                {customerData.gateway}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="body2" color="text.secondary">Billing Cycle</Typography>
              <Typography variant="body2" color="text.primary" sx={{ fontWeight: 500 }}>
                {customerData.billingCycle}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="body2" color="text.secondary">Requested IP</Typography>
              <Typography variant="body2" color="text.primary" sx={{ fontWeight: 500 }}>
                {customerData.requestedIP}
              </Typography>
            </Box>
          </Stack>
        </Box>

        {/* Subscription Information */}
        <Box>
          <Typography
            variant="h6"
            sx={{
              fontSize: '16px',
              fontWeight: 600,
              color: theme.palette.text.primary,
              mb: 2,
            }}
          >
            Subscription Information
          </Typography>
          <Stack spacing={2}>
            {customerData.subscriptionItems?.map((item, index) => (
              <Box key={index} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="body2" color="text.secondary">{item.name}</Typography>
                <Box sx={{ textAlign: 'right' }}>
                  <Typography variant="body2" color="text.primary" sx={{ fontWeight: 500 }}>
                    {item.price}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ fontSize: '12px' }}>
                    {item.cycle}
                  </Typography>
                </Box>
              </Box>
            ))}
            <Divider />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="body2" color="text.primary" sx={{ fontWeight: 600 }}>
                Subscription Amount :
              </Typography>
              <Typography variant="body2" color="text.primary" sx={{ fontWeight: 600 }}>
                {customerData.subscriptionAmount}
              </Typography>
            </Box>
          </Stack>
        </Box>
      </Box>
    </Drawer>
  );
}

