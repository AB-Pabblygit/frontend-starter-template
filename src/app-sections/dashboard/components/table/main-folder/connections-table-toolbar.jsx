import { useTheme } from '@emotion/react';
import { useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Popover from '@mui/material/Popover';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import InputAdornment from '@mui/material/InputAdornment';
import {
  Button,
  Tooltip,
  MenuItem,
  Typography,
  useMediaQuery,
  CircularProgress,
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
  const [selectedColumn, setSelectedColumn] = useState('');
  const [operator, setOperator] = useState('contains');
  const [filterValue, setFilterValue] = useState('');
  const [moveToFolderPopoverOpen, setMoveToFolderPopoverOpen] = useState(false);
  const confirmDelete = useBoolean();
  const [selectedFolder, setSelectedFolder] = useState([]);
  const [selectedConnectionName, setConnectionName] = useState([]);
  const [isFilterApplied, setIsFilterApplied] = useState(false);
  const hasFilterSelected = Boolean(selectedFolder);
  const theme = useTheme();
  const isBelow600px = useMediaQuery(theme.breakpoints.down('sm'));

  const handleFilterName = useCallback(
    (event) => {
      onResetPage();
      filters.setState({ name: event.target.value }); // This updates the filters state with the search input
    },
    [filters, onResetPage]
  );

  const handleFilterClick = (event) => {
    setFilterAnchorEl(event.currentTarget);
  };

  const handleApplyFilter = () => {
    if (selectedFolder) {
      console.log('Applying filter:', { folder: selectedFolder });
      filters.setState({ folder: selectedFolder });
      onResetPage();
      handleFilterClose();
    }
  };

  const resetFilters = () => {
    setSelectedFolder(null);
    filters.setState({ folder: '' });
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
    },
  };

  const handleFilterIconClick = (e) => {
    e.stopPropagation();
    if (isFilterApplied) {
      handleFilterClose();
      resetFilters();
      setIsFilterApplied(false);
    }
  };

  const handleFilterClose = () => {
    setFilterAnchorEl(null);
    if (!isFilterApplied) {
      resetFilters();
    }
  };

  const folder = ['Home', 'Pabbly Connect', 'Main Folder'];
  const Status = ['Active', 'Inactive'];
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 5000); // Simulate 1 second loading time

    return () => clearTimeout(timer);
  }, []);
  return (
    <>
      <Stack
        // spacing={2}
        alignItems="center"
        direction={isBelow600px ? 'column' : 'row'}
        sx={{ p: 2.5, width: '100%' }}
      >
        {/* <Stack
          direction="row"
          alignItems="center"
          spacing={2}
          flexGrow={1}
          sx={{ pr: '0px', width: 1 }}
        > */}
        {/* Search field */}
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

          {/* Buttons container */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            width: isBelow600px ? '100%' : 'auto',
            justifyContent: 'flex-end',
          }}
        >

          {numSelected > 0 && (
            <Button
              endIcon={<Iconify icon="eva:arrow-ios-downward-fill" />}
              onClick={onSelectActionOpen}
              // variant="outlined"
              color="primary"
              sx={{
                ...buttonStyle,
                width: '200px',
                ml:2,mt:isBelow600px ? 2.5 : 'auto',
              }}
            >
              Select Action
            </Button>
          )}</Box>
          {/* <Box
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
                  : 'Filter your webhook connection logs.'
              }
              arrow
              placement="top"
            >
              <Button
                sx={{
                  ...buttonStyle,
                  width: isFilterApplied ? '156px' : '104.34px',
                  position: 'relative',
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
                onClick={handleFilterClick}
              >
                {isFilterApplied ? 'Filter Applied' : 'Filters'}
              </Button>
            </Tooltip>
          </Box> */}
        </Stack>
      {/* </Stack> */}

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
          {/* Filter Header */}
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
                Filter
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

          {/* Filter Options */}
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

            {/* Folder */}
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
                <Typography sx={{ fontSize: '14px', fontWeight: '600' }}>Folder</Typography>
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
                  label="In"
                  disabled
                  size="small"
                />
              </FormControl>

              <FormControl fullWidth sx={{ mb: { xs: 2, sm: 2, md: 0 } }}>
                <TextField
                  id="outlined-select-currency"
                  size="small"
                  select
                  fullWidth
                  value={selectedFolder}
                  onChange={(e) => setSelectedFolder(e.target.value)}
                  SelectProps={{
                    MenuProps: {
                      PaperProps: {
                        style: {
                          maxHeight: 250,
                          maxWidth: 50,
                        },
                      },
                    },
                  }}
                >
                  {isLoading ? (
                    <CircularProgress color="primary" size={24} />
                  ) : (
                    folder.map((option) => (
                      <MenuItem key={option} value={option}>
                        {option}
                      </MenuItem>
                    ))
                  )}
                </TextField>
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
            {/* <Button variant="outlined" color="inherit" onClick={handleFilterClose}>
              Cancel
            </Button> */}
            <Tooltip
              title={
                isFilterApplied
                  ? "Click the 'X' to clear all applied filters."
                  : 'Filter your webhook connection logs.'
              }
              arrow
              placement="top"
            >
              <Button
                variant="contained"
                color="primary"
                onClick={() => {
                  handleApplyFilter();
                  setIsFilterApplied(true);
                }}
                disabled={!selectedFolder}
              >
                Apply Filter
              </Button>
            </Tooltip>
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
