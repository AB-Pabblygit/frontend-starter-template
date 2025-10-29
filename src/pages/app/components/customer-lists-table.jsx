import { useMemo, useState } from 'react';

import {
  Box,
  Card,
  Chip,
  Table,
  Paper,
  Tooltip,
  TableRow,
  useTheme,
  TableBody,
  TableCell,
  TableHead,
  Typography,
  IconButton,
  TableContainer,
} from '@mui/material';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

export function CustomerListsTable({ customers = [], tabType = 'all-customers', loading = false }) {
  const theme = useTheme();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  
  // Get tab-specific title
  const getTabTitle = () => {
    switch (tabType) {
      case 'new-customers':
        return 'New Customers';
      case 'refunded-customers':
        return 'Refunded Customers';
      case 'churned-customers':
        return 'Churned/Lost Customers';
      case 'active-customers':
        return 'Active Customers';
      case 'all-customers':
        return 'All Customers';
      default:
        return 'Customer List';
    }
  };

  const TABLE_HEAD = [
    { id: 'name', label: 'Customer Name' },
    { id: 'email', label: 'Email' },
    { id: 'plan', label: 'Plan' },
    { id: 'status', label: 'Status' },
    { id: 'signupDate', label: 'Signup Date' },
    { id: 'mrr', label: 'MRR' },
    { id: 'actions', label: 'Actions' },
  ];

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const paginatedCustomers = useMemo(
    () => customers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [customers, page, rowsPerPage]
  );

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'success';
      case 'cancelled':
        return 'error';
      case 'pending':
        return 'warning';
      default:
        return 'default';
    }
  };

  if (loading) {
    return (
      <Card sx={{ p: 3, borderRadius: 4, boxShadow: '0 4px 15px rgba(0,0,0,0.08)' }}>
        <Typography>Loading customer data...</Typography>
      </Card>
    );
  }

  return (
    <Card
      sx={{
        p: 3,
        borderRadius: 4,
        boxShadow: '0 4px 15px rgba(0,0,0,0.08)',
        animation: 'fadeUp 0.8s ease',
        backgroundColor: theme.palette.background.paper,
        '@keyframes fadeUp': {
          from: { opacity: 0, transform: 'translateY(20px)' },
          to: { opacity: 1, transform: 'translateY(0)' },
        },
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography
            variant="h5"
            sx={{
              fontSize: '20px',
              fontWeight: 600,
              color: 'text.primary',
            }}
          >
            {getTabTitle()}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
            <Typography variant="body2" color="text.secondary">
              {customers.length} Records
            </Typography>
          </Box>
        </Box>
      </Box>

      <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 2, backgroundColor: theme.palette.background.paper }}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: theme.palette.grey[100] }}>
              <TableCell sx={{ fontWeight: 600, color: 'text.primary', borderBottom: `1px solid ${theme.palette.divider}` }}>
                Customer Name
              </TableCell>
              <TableCell sx={{ fontWeight: 600, color: 'text.primary', borderBottom: `1px solid ${theme.palette.divider}` }}>
                Email
              </TableCell>
              <TableCell sx={{ fontWeight: 600, color: 'text.primary', borderBottom: `1px solid ${theme.palette.divider}` }}>
                Plan
              </TableCell>
              <TableCell sx={{ fontWeight: 600, color: 'text.primary', borderBottom: `1px solid ${theme.palette.divider}` }}>
                Status
              </TableCell>
              <TableCell sx={{ fontWeight: 600, color: 'text.primary', borderBottom: `1px solid ${theme.palette.divider}` }}>
                Signup Date
              </TableCell>
              <TableCell sx={{ fontWeight: 600, color: 'text.primary', borderBottom: `1px solid ${theme.palette.divider}` }}>
                MRR
              </TableCell>
              <TableCell sx={{ fontWeight: 600, color: 'text.primary', borderBottom: `1px solid ${theme.palette.divider}` }}>
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedCustomers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ py: 5 }}>
                  <Typography variant="body2" color="text.secondary">
                    No customers found in this category
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              paginatedCustomers.map((customer) => (
                <TableRow 
                  key={customer.id} 
                  hover
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
                    <Typography variant="subtitle2">
                      {customer.name || customer.firstName} {customer.lastName}
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ borderBottom: `1px solid ${theme.palette.divider}`, py: 1.75, px: 2 }}>
                    {customer.email}
                  </TableCell>
                  <TableCell sx={{ borderBottom: `1px solid ${theme.palette.divider}`, py: 1.75, px: 2 }}>
                    {customer.plan}
                  </TableCell>
                  <TableCell sx={{ borderBottom: `1px solid ${theme.palette.divider}`, py: 1.75, px: 2 }}>
                    <Chip
                      label={customer.status}
                      color={getStatusColor(customer.status)}
                      size="small"
                      variant="filled"
                    />
                  </TableCell>
                  <TableCell sx={{ borderBottom: `1px solid ${theme.palette.divider}`, py: 1.75, px: 2 }}>
                    {new Date(customer.signupDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell sx={{ borderBottom: `1px solid ${theme.palette.divider}`, py: 1.75, px: 2 }}>
                    <Typography variant="body2" color="success.main" sx={{ fontWeight: 600 }}>
                      ${customer.monthlyFee?.toFixed(2) || '0.00'}
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ borderBottom: `1px solid ${theme.palette.divider}`, py: 1.75, px: 2 }}>
                    <Tooltip title="View Details">
                      <IconButton size="small">
                        <Iconify icon="solar:eye-bold" width={20} />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="body2" color="text.secondary">Rows per page:</Typography>
          <Typography variant="body2" color="text.primary">{rowsPerPage}</Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant="body2" color="text.secondary">
            Showing {(page * rowsPerPage) + 1} - {Math.min((page + 1) * rowsPerPage, customers.length)} of {customers.length} Records
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <IconButton 
              size="small" 
              disabled={page === 0}
              onClick={() => handleChangePage(null, page - 1)}
            >
              <Typography variant="body2">‹</Typography>
            </IconButton>
            <Typography variant="body2" color="primary" sx={{ fontWeight: 600 }}>
              {page + 1}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              of {Math.ceil(customers.length / rowsPerPage)}
            </Typography>
            <IconButton 
              size="small" 
              disabled={page >= Math.ceil(customers.length / rowsPerPage) - 1}
              onClick={() => handleChangePage(null, page + 1)}
            >
              <Typography variant="body2">›</Typography>
            </IconButton>
          </Box>
        </Box>
      </Box>
    </Card>
  );
}
