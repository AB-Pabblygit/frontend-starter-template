import { useState, useMemo } from 'react';

import {
  Card,
  Table,
  Checkbox,
  TableRow,
  TableBody,
  TableCell,
  TableHead,
  Typography,
  TableContainer,
  TablePagination,
  Chip,
  Box,
  Tooltip,
  IconButton,
} from '@mui/material';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

export function CustomerListsTable({ customers = [], tabType = 'all-customers', loading = false }) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

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

  const paginatedCustomers = useMemo(() => {
    return customers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  }, [customers, page, rowsPerPage]);

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
      <Card sx={{ p: 3 }}>
        <Typography>Loading customer data...</Typography>
      </Card>
    );
  }

  return (
    <Card>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 600 }}>Customer Name</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Email</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Plan</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Signup Date</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>MRR</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
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
                <TableRow key={customer.id} hover>
                  <TableCell>
                    <Typography variant="subtitle2">
                      {customer.name || customer.firstName} {customer.lastName}
                    </Typography>
                  </TableCell>
                  <TableCell>{customer.email}</TableCell>
                  <TableCell>{customer.plan}</TableCell>
                  <TableCell>
                    <Chip
                      label={customer.status}
                      color={getStatusColor(customer.status)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    {new Date(customer.signupDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell>${customer.monthlyFee?.toFixed(2) || '0.00'}</TableCell>
                  <TableCell>
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

      <TablePagination
        rowsPerPageOptions={[10, 25, 50]}
        component="div"
        count={customers.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Card>
  );
}
