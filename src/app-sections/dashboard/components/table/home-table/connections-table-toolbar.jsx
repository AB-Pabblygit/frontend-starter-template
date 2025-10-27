import { useTheme } from '@emotion/react';
import { useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Popover from '@mui/material/Popover';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import InputAdornment from '@mui/material/InputAdornment';
import {
  Button,
  Tooltip,
  Typography,
  Autocomplete,
  useMediaQuery,
} from '@mui/material';

import { useBoolean } from 'src/hooks/use-boolean';

import { Iconify } from 'src/components/iconify';
import { usePopover } from 'src/components/custom-popover';
import { ConfirmDialog } from 'src/components/confirm-dialog';

import { MoveToFolderPopover } from '../../dialogs/move-folder-dailog';

// ----------------------------------------------------------------------

export function ConnectionsTableToolbar({
  filters,
  onResetPage,
  numSelected,
  publish,
  onDeleteRow,
  onSelectActionOpen,
}) {
  const popover = usePopover();
  const [filterAnchorEl, setFilterAnchorEl] = useState(null);
  const [moveToFolderPopoverOpen, setMoveToFolderPopoverOpen] = useState(false);
  const confirmDelete = useBoolean();
  const [isFilterApplied, setIsFilterApplied] = useState(false);
  const theme = useTheme();
  const isBelow600px = useMediaQuery(theme.breakpoints.down('sm'));

  // Combined filter states
  const [filterState, setFilterState] = useState({
    user: {
      condition: null,
      search: '',
    },
    eventSource: {
      condition: null,
      type: null,
    },
    eventData: {
      condition: null,
      search: '',
    },
  });


  const [error, setError] = useState('');

  const filterfirstfield = ['Equals', 'Not Equals to', 'Contains', 'Does not contains'];
  const filtersecondfield = ['All', 'API', 'User'];

  // Check if any filter field is filled
  const hasAnyFilterSelected = Object.values(filterState).some((section) =>
    Object.values(section).some((value) => value !== null && value !== '')
  );

  const handleFilterName = useCallback(
    (event) => {
      onResetPage();
      filters.setState({ name: event.target.value });
    },
    [filters, onResetPage]
  );

  const handleFilterChange = (section, field, value) => {
    setFilterState((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  const resetFilters = () => {
    setFilterState({
      user: { condition: null, search: '' },
      eventSource: { condition: null, type: null },
      eventData: { condition: null, search: '' },
    });

    setIsFilterApplied(false);
  };

  const handleFilterIconClick = (e) => {
    e.stopPropagation();
    if (isFilterApplied) {
      handleFilterClose();
      resetFilters();
    }
  };

  const handleFilterButtonClick = (e) => {
    if (!isFilterApplied || e.target.tagName !== 'svg') {
      setFilterAnchorEl(e.currentTarget);
    }
  };

  const handleFilterClose = () => {
    setFilterAnchorEl(null);
  };

  const handleApplyFilter = () => {
    if (hasAnyFilterSelected) {
      setIsFilterApplied(true);
      handleFilterClose();
    }
  };

  const datePickerStyle = {
    height: '30px',
    '& .MuiInputBase-input': {
      height: 'auto',
      padding: '8px 14px',
    },
  };


  const textFieldProps = {
    fullWidth: true,
    sx: {
      '& .MuiOutlinedInput-input': {
        height: 'auto',
        padding: '8px 14px',
        fontSize: '14px',
      },
      '& .MuiInputLabel-root': {
        fontSize: '14px',
      },
    },
  };

  const buttonStyle = {
    color: isFilterApplied ? '#fff' : theme.palette.primary.main,
    fontSize: '15px',
    height: '48px',
    textTransform: 'none',
    padding: '16px',
    width: isFilterApplied ? '156px' : '104.34px',
    position: 'relative',
    '& .MuiButton-startIcon': {
      pointerEvents: 'auto',
      marginRight: '8px',
      display: 'flex',
    },
    '&:hover': {
      backgroundColor: isFilterApplied ? theme.palette.primary.main : '#ECF6FE',
      '[data-mui-color-scheme="light"] &': { backgroundColor: isFilterApplied ? theme.palette.primary.main : '#ECF6FE', },
      '[data-mui-color-scheme="dark"] &': {
        backgroundColor: isFilterApplied ? theme.palette.primary.main : '#078dee14',
      },
    },
    
    
 
  };

  return (
    <>
      <Stack
        spacing={2}
        alignItems="center"
        direction={isBelow600px ? 'column' : 'row'}
        sx={{ p: 2.5, width: '100%', gap: 1 }}
      >
        <Box sx={{ width: '100%' }}>
          <Tooltip title="Search by connection name." arrow placement="top">
            <TextField
              fullWidth
              value={filters.state.name}
              onChange={handleFilterName}
              placeholder="Search by connection name..."
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
                  </InputAdornment>
                ),
              }}
            />
          </Tooltip>
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
          {numSelected > 0 && (
            <Button
              endIcon={<Iconify icon="eva:arrow-ios-downward-fill" />}
              onClick={onSelectActionOpen}
              color="primary"
              sx={{
                ...buttonStyle,
                // width: '200px',
                ml: 2,
                mt: isBelow600px ? 2.5 : 'auto',
                
                p: '16px',
                width: '155px',
                color: theme.palette.mode === 'dark' ? '#078dee' : '#0c68e9', // Ensures border color matches background

                borderColor: theme.palette.mode === 'dark' ? '#078dee' : '#0c68e9', // Ensures border color matches background
                '&:hover': {
                  borderColor: theme.palette.mode === 'dark' ? 'var(--palette-primary-dark)' : 'var(--palette-primary-dark)', // Slightly darker shade on hover
                },
              }}
            >
              Select Action
            </Button>
          )}

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
              sx={buttonStyle}
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
      </Stack>

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
           

            {/* Event Source Filter Section */}
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
                    title="Filter logs by selecting section source to view only the logs within it."
                    arrow
                    placement="top"
                  >
                    <span>Source</span>
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
                <Autocomplete
                  size="small"
                  options={filterfirstfield}
                  value={filterState.eventSource.condition}
                  onChange={(_, newValue) =>
                    handleFilterChange('eventSource', 'condition', newValue)
                  }
                  renderInput={(params) => <TextField {...params} label="Equals" />}
                />
              </FormControl>

              <FormControl fullWidth sx={{ mb: { xs: 2, sm: 2, md: 0 } }}>
                <Autocomplete
                  size="small"
                  options={filtersecondfield}
                  value={filterState.eventSource.type}
                  onChange={(_, newValue) => handleFilterChange('eventSource', 'type', newValue)}
                  renderInput={(params) => <TextField {...params} label="All" />}
                />
              </FormControl>
            </Box>

            {/* Event Data Filter Section */}
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
                    title="Filter logs by selecting a folder to view only the logs within it."
                    arrow
                    placement="top"
                  >
                    <span>Activity Data</span>
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
                  options={filterfirstfield}
                  value={filterState.eventData.condition}
                  onChange={(_, newValue) => handleFilterChange('eventData', 'condition', newValue)}
                  renderInput={(params) => <TextField {...params} label="Equals" />}
                />
              </FormControl>

              <FormControl fullWidth sx={{ mb: { xs: 2, sm: 2, md: 0 } }}>
                <TextField
                  variant="outlined"
                  fullWidth
                  label="Search"
                  size="small"
                  value={filterState.eventData.search}
                  onChange={(e) => handleFilterChange('eventData', 'search', e.target.value)}
                />
              </FormControl>
            </Box>
          </Box>

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

      <MoveToFolderPopover
        open={moveToFolderPopoverOpen}
        onClose={() => setMoveToFolderPopoverOpen(false)}
      />
      <ConfirmDialog
        open={confirmDelete.value}
        onClose={confirmDelete.onFalse}
        title="Delete"
        content="Are you sure you want to delete WhatsApp numbers?"
        action={
          <Button variant="contained" color="error" onClick={onDeleteRow}>
            Delete
          </Button>
        }
      />
    </>
  );
}
