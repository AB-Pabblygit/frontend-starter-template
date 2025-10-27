import { toast } from 'sonner';
import React, { useState } from 'react';
import { useTheme } from '@emotion/react';

import {
  Box,
  Stack,
  Button,
  Popover,
  Tooltip,
  MenuItem,
  MenuList,
  TextField,
  Typography,
  FormControl,
  Autocomplete,
  useMediaQuery,
} from '@mui/material';

import { Iconify } from 'src/components/iconify';
import { CustomPopover } from 'src/components/custom-popover';
import { ConfirmDialog } from 'src/components/confirm-dialog';

export function ConnectionsTableToolbar({
  filters,
  onResetPage,
  publish,
  onChangePublish,
  numSelected,
}) {
  const theme = useTheme();
  const isBelow600px = useMediaQuery(theme.breakpoints.down('sm'));

  const [anchorEl, setAnchorEl] = useState(null);
  const [filterAnchorEl, setFilterAnchorEl] = useState(null);
  const [isFilterApplied, setFilterApplied] = useState(false);
  const [selectedApplicationName, setSelectedApplicationName] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState('');
  const [connectionId, setConnectionId] = useState('');
  const [selectedRow, setSelectedRow] = useState(null);

  const handlePopoverClose = () => setAnchorEl(null);

  const status = ['All', 'Active', 'Inactive','Blocked'];

  const handleFilterName = (event) => {
    onResetPage();
    filters.setState({ name: event.target.value });
  };

  const handleFilterIconClick = (e) => {
    e.stopPropagation();
    if (isFilterApplied) {
      handleFilterClose();
      resetFilters();
      setFilterApplied(false);
    }
  };

  const hasAnyFilterSelected =
    Boolean(selectedApplicationName) || Boolean(selectedStatus) || Boolean(connectionId);

  const resetFilters = () => {
    setSelectedApplicationName(null);
    setSelectedStatus('');
    setConnectionId('');
    filters.setState({
      apiType: '',
      status: '',
      connectionId: '',
    });
    setFilterApplied(false);
  };

  const handleFilterButtonClick = (e) => {
    if (!isFilterApplied || e.target.tagName !== 'svg') {
      setFilterAnchorEl(e.currentTarget);
    }
  };

  const handleFilterClose = () => {
    setFilterAnchorEl(null);
  };

  const handleStatusChange = (event) => {
    setSelectedStatus(event.target.value);
  };

  const handleConnectionIdChange = (event) => {
    setConnectionId(event.target.value);
  };

  const handleApplyFilter = () => {
    if (hasAnyFilterSelected) {
      filters.setState({
        apiType: selectedApplicationName,
        status: selectedStatus,
        connectionId,
      });
      setFilterApplied(true);
      handleFilterClose();
    }
  };

  const handleClosePopover = () => {
    setAnchorEl(null);
    setSelectedRow(null);
  };

  const [dialogState, setDialogState] = useState({
    open: false,
    type: null,
    title: '',
    content: '',
    actionText: '',
  });

  const handleBlockConnectionClick = () => {
    setDialogState({
      open: true,
      type: 'block',
      title: 'Do you really want to block this connection?',
      content: 'Note that it will block the connection permanently.',
      actionText: 'Block',
    });
    handleClosePopover();
  };

  const handleUnblockConnectionClick = () => {
    setDialogState({
      open: true,
      type: 'unblock',
      title: 'Do you really want to unblock this connection?',
      content: "This will restore the connection's access.",
      actionText: 'Unblock',
    });
    handleClosePopover();
  };

  const handleDeleteConnectionClick = () => {
    setDialogState({
      open: true,
      type: 'delete',
      title: 'Do you really want to delete this connection?',
      content: 'Note that when a connection is deleted, it is permanently removed.',
      actionText: 'Delete',
    });
    handleClosePopover();
  };

  const handleDialogClose = () => {
    setDialogState((prev) => ({ ...prev, open: false }));
  };

  const handleDialogConfirm = () => {
    if (dialogState.type === 'block') {
      toast.success('Connection blocked successfully.');
    } else if (dialogState.type === 'unblock') {
      toast.success('Connection unblocked successfully.');
    } else {
      toast.success('Connection deleted successfully.');
    }

    handleDialogClose();
  };

  const buttonStyle = {
    fontSize: '15px',
    height: '48px',
    textTransform: 'none',
    padding: '16px',
    position: 'relative',
    '& .MuiButton-startIcon': {
      pointerEvents: 'auto',
      marginRight: '8px',
      display: 'flex',
    },
  };

  return (
    <>
      <Stack
        sx={{
          // p: 2.5,
          // width: '100%',
          // gap: 1,
          flexDirection: {
            xs: 'column',
            sm: 'row',
          },
        }}
      >
        {/* <Box sx={{ width: '100%' }}>
          <TextField
            fullWidth
            value={filters.state.name}
            onChange={handleFilterName}
            placeholder="Search by customer email..."
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
                </InputAdornment>
              ),
            }}
          />
        </Box> */}

        <Box display="flex">
          <Box
            sx={{
              display: 'flex',
              gap: 2,
              flexDirection: 'row',
              width: isBelow600px ? '100%' : 'auto',
              justifyContent: 'flex-end',
            }}
          >
            {numSelected > 0 && (
              <Tooltip title="Available actions for selected item(s)" arrow placement="top">
                <Button
                  color="primary"
                  endIcon={<Iconify icon="eva:arrow-ios-downward-fill" />}
                  onClick={(e) => setAnchorEl(e.currentTarget)}
                  sx={{
                    ...buttonStyle,
                    whiteSpace: 'nowrap',
                  }}
                >
                  Select Actions
                </Button>
              </Tooltip>
            )}
          </Box>
          <Box
            sx={{
              display: 'flex',
              gap: 2,
              flexDirection: 'row',
              width: isBelow600px ? '100%' : 'auto',
              justifyContent: 'flex-end',
            }}
          >
            <Tooltip
              title={
                isFilterApplied
                  ? "Click the 'X' to clear all applied filters."
                  : 'Filter your connection logs.'
              }
              arrow
              placement="top"
            >
              <Button
                sx={{
                  ...buttonStyle,
                  whiteSpace: 'nowrap',
                  color: isFilterApplied ? 'common.white' : theme.palette.primary.main,
                  '&:hover': {
                    backgroundColor: isFilterApplied ? '' : '#ECF6FE',
                  },
                }}
                variant={isFilterApplied ? 'contained' : ''}
                color="primary"
                startIcon={!isFilterApplied && <Iconify icon="mdi:filter" />}
                endIcon={
                  isFilterApplied && (
                    <Box
                      component="span"
                      onClick={handleFilterIconClick}
                      sx={{
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Iconify
                        icon="uil:times"
                        style={{
                          width: 22,
                          height: 22,
                          cursor: 'pointer',
                        }}
                      />
                    </Box>
                  )
                }
                onClick={handleFilterButtonClick}
              >
                {isFilterApplied ? 'Filter Applied' : 'Filters'}
              </Button>
            </Tooltip>
          </Box>
          {/* <Box>
            <Tooltip title="Click here to refresh data." arrow placement="top">
              <Button
                sx={{
                  whiteSpace: 'nowrap',
                }}
                size="large"
                color="primary"
              >
                <Iconify
                  icon="tabler:refresh"
                  sx={{ width: '24px', height: '24px', color: 'primary' }}
                  cursor="pointer"
                />
              </Button>
            </Tooltip>
          </Box> */}
        </Box>
      </Stack>

      <CustomPopover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handlePopoverClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
      >
        <MenuList>
          <Tooltip title="Block selected connections." arrow placement="left">
            <MenuItem onClick={handleBlockConnectionClick}>
              <Iconify sx={{ width: '18px' }} icon="icomoon-free:blocked" />
              Block Connection(s)
            </MenuItem>
          </Tooltip>
          <Tooltip title="Unblock selected connections." arrow placement="left">
            <MenuItem onClick={handleUnblockConnectionClick}>
              <Iconify icon="material-symbols:circle-outline" />
              Unblock Connection(s)
            </MenuItem>
          </Tooltip>
          {/* <Divider sx={{ borderStyle: 'dashed' }} />
          <Tooltip title="Delete selected connections." arrow placement="left">
            <MenuItem onClick={handleDeleteConnectionClick} sx={{ color: 'error.main' }}>
              <Iconify icon="solar:trash-bin-trash-bold" />
              Delete
            </MenuItem>
          </Tooltip> */}
        </MenuList>
      </CustomPopover>

      <Popover
        open={Boolean(filterAnchorEl)}
        anchorEl={filterAnchorEl}
        onClose={handleFilterClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Box
          sx={{
            width: {
              xs: '100%',
              sm: '100%',
              md: 650,
            },
            flexDirection: {
              xs: 'column',
              sm: 'column',
              md: 'row',
            },
          }}
        >
          <Box
            sx={{
              borderBottom: '1px dashed #919eab33',
              p: 2,
              display: 'flex',
              height: '100%',
              width: '100%',
            }}
          >
            <Box sx={{ width: '100%' }}>
              <Typography variant="h6" sx={{ fontWeight: '600' }}>
                <Tooltip title="Filter your connection logs." arrow placement="top">
                  <span>Filter</span>
                </Tooltip>
              </Typography>
            </Box>
            <Iconify
              icon="uil:times"
              onClick={handleFilterClose}
              style={{
                width: 20,
                height: 20,
                cursor: 'pointer',
                color: '#637381',
              }}
            />
          </Box>

          <Box
            sx={{
              p: '16px 16px 0px 16px',
              gap: 2,
              flexDirection: {
                xs: 'column',
                sm: 'column',
                md: 'row',
              },
            }}
          >
            {/* Connection Name Filter */}
            <Box
              sx={{
                display: 'flex',
                flexDirection: {
                  xs: 'column',
                  sm: 'column',
                  md: 'row',
                },
                gap: 2,
                mb: 2,
              }}
            >
              <FormControl fullWidth sx={{ mb: { xs: 2, sm: 2, md: 0 }, justifyContent: 'center' }}>
                <Typography sx={{ fontSize: '14px', fontWeight: '600' }}>
                  <Tooltip
                    title="Filter the connection based on specific connection name."
                    arrow
                    placement="top"
                  >
                    <span>Connection Name</span>
                  </Tooltip>
                </Typography>
              </FormControl>

              <FormControl
                fullWidth
                sx={{
                  mb: { xs: 2, sm: 2, md: 0 },
                  width: { xs: '100%', sm: '100%', md: '390px' },
                }}
              >
                <TextField variant="outlined" fullWidth label="Equals to" disabled size="small" />
              </FormControl>

              <FormControl fullWidth sx={{ mb: { xs: 2, sm: 2, md: 0 } }}>
                <TextField
                  variant="outlined"
                  fullWidth
                  label="Search"
                  size="small"
                  value={selectedApplicationName || ''}
                  onChange={(e) => setSelectedApplicationName(e.target.value)}
                />
              </FormControl>
            </Box>

            {/* Status */}
            <Box
              sx={{
                display: 'flex',
                flexDirection: {
                  xs: 'column', // Stack vertically on mobile
                  sm: 'column', // Stack vertically on tablet
                  md: 'row', // Arrange in row on desktop
                },
                gap: 2,
                mb: 2,
              }}
            >
              <FormControl fullWidth sx={{ mb: { xs: 2, sm: 2, md: 0 }, justifyContent: 'center' }}>
                <Typography sx={{ fontSize: '14px', fontWeight: '600' }}>Status</Typography>
              </FormControl>

              <FormControl
                fullWidth
                sx={{
                  mb: { xs: 2, sm: 2, md: 0 },
                  width: { xs: '100%', sm: '100%', md: '390px' },
                }}
              >
                <TextField
                  id="select-currency-label-x"
                  variant="outlined"
                  fullWidth
                  label="Equal"
                  disabled
                  size="small"
                />
              </FormControl>

              <FormControl fullWidth sx={{ mb: { xs: 2, sm: 2, md: 0 } }}>
                <Autocomplete
                  sx={{
                    '& .MuiInputBase-input': {
                      fontSize: '14px',
                    },
                    '& .MuiInputLabel-root': {
                      fontSize: '14px',
                    },
                  }}
                  size="small"
                  options={status}
                  value={selectedStatus}
                  onChange={(event, newValue) => setSelectedStatus(newValue)}
                  renderInput={(params) => <TextField {...params} label="Select" />}
                />
              </FormControl>
            </Box>

            {/* Connection ID Filter */}
            <Box
              sx={{
                display: 'flex',
                flexDirection: {
                  xs: 'column',
                  sm: 'column',
                  md: 'row',
                },
                gap: 2,
                mb: 2,
              }}
            >
              <FormControl fullWidth sx={{ mb: { xs: 2, sm: 2, md: 0 }, justifyContent: 'center' }}>
                <Typography sx={{ fontSize: '14px', fontWeight: '600' }}>
                  <Tooltip title="Filter by connection ID" arrow placement="top">
                    <span>Connection ID</span>
                  </Tooltip>
                </Typography>
              </FormControl>

              <FormControl
                fullWidth
                sx={{
                  mb: { xs: 2, sm: 2, md: 0 },
                  width: { xs: '100%', sm: '100%', md: '390px' },
                }}
              >
                <TextField variant="outlined" fullWidth label="Equals to" disabled size="small" />
              </FormControl>

              <FormControl fullWidth sx={{ mb: { xs: 2, sm: 2, md: 0 } }}>
                <TextField
                  variant="outlined"
                  fullWidth
                  label="Search"
                  size="small"
                  value={connectionId}
                  onChange={handleConnectionIdChange}
                />
              </FormControl>
            </Box>
          </Box>

          {/* Filter Footer */}
          <Box
            sx={{
              p: 2,
              gap: 2,
              display: 'flex',
              justifyContent: 'flex-end',
              borderTop: '1px dashed #919eab33',
            }}
          >
            <Button
              variant="contained"
              color="primary"
              onClick={handleApplyFilter}
              disabled={!hasAnyFilterSelected}
            >
              Apply Filter
            </Button>
          </Box>
        </Box>
      </Popover>

      <ConfirmDialog
        open={dialogState.open}
        onClose={handleDialogClose}
        title={dialogState.title}
        content={dialogState.content}
        action={
          <Button variant="contained" color="error" onClick={handleDialogConfirm}>
            {dialogState.actionText}
          </Button>
        }
      />
    </>
  );
}
