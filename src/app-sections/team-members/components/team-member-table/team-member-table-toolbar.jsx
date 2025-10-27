import { toast } from 'sonner';
import { useTheme } from '@emotion/react';
import React, { useState, useCallback } from 'react';

import {
  Box,
  Stack,
  Button,
  Tooltip,
  Popover,
  MenuList,
  MenuItem,
  TextField,
  Typography,
  FormControl,
  Autocomplete,
  useMediaQuery,
  InputAdornment,
} from '@mui/material';

import { Iconify } from 'src/components/iconify';
import { usePopover } from 'src/components/custom-popover';
import { ConfirmDialog } from 'src/components/confirm-dialog';

import { TeamMemberDialog } from '../../hooks/add-team-member';

export function TeamMemberTableToolbar({ filters, onResetPage, numSelected, nomemberAdded }) {
  const theme = useTheme();
  const [confirmDelete, setConfirmDelete] = useState(false);
  const popover = usePopover();
  const handleClosePopover = () => setAnchorEl(null);

  const handleOpenConfirmDelete = () => {
    setConfirmDelete(true);
    handleClosePopover();
  };
  const handleCloseConfirmDelete = () => setConfirmDelete(false);
  const [teamMemberDialogOpen, setTeamMemberDialogOpen] = useState(false); // State for TeamMemberDialog

  const isBelow600px = useMediaQuery(theme.breakpoints.down('sm'));
  const [filterAnchorEl, setFilterAnchorEl] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedPermissionType, setSelectedPermissionType] = useState(null);
  const [selectedFolder, setSelectedFolder] = useState(null);

  const handlePopoverOpen = (event) => setAnchorEl(event.currentTarget);
  const handlePopoverClose = () => setAnchorEl(null);

  const handleFilterEmail = (event) => {
    onResetPage(); // Reset the page to page 1 when filtering
    filters.setState({ email: event.target.value }); // Set the email filter based on the search input
  };

  // Dialog Handlers
  const handleTeamMemberDialogOpen = () => setTeamMemberDialogOpen(true);
  const handleTeamMemberDialogClose = () => setTeamMemberDialogOpen(false);
  const toolbarbuttonStyle = {
    fontSize: '15px',
    height: '48px',
    textTransform: 'none',
    padding: '0 16px',
  };
  const [isFilterApplied, setIsFilterApplied] = useState(false);

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
  const handleFilterName = useCallback(
    (event) => {
      onResetPage();
      filters.setState({ name: event.target.value });
    },
    [filters, onResetPage]
  );

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

  const permission_type = ['Write Access', 'Read Access'];
  const folder = ['Home', 'Main Folder', 'Pabbly Connect'];

  return (
    <>
      <Stack
        spacing={2}
        alignItems={{ xs: 'end', md: 'center' }}
        // direction={isBelow600px ? 'column' : 'row'}
        direction={{ xs: 'column', md: 'row' }}
        sx={{ p: 2.5, width: '100%' }}
      >
        <Box sx={{ width: '100%' }}>
          <TextField
            fullWidth
            value={filters.state.name}
            onChange={handleFilterName}
            placeholder="Search by email..."
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
                </InputAdornment>
              ),
            }}
          />
        </Box>

        <Box
          sx={{
            display: 'flex',
            gap: 2,
            flexDirection: { xs: 'column', sm: 'row' },
            // width: isBelow600px ? '100%' : 'auto',
            justifyContent: 'flex-end',
          }}
        >
          {numSelected > 0 && (
            <Button
              endIcon={<Iconify icon="eva:arrow-ios-downward-fill" />}
              onClick={handlePopoverOpen}
              // variant="outlined"
              color="primary"
              sx={{
                // ...buttonStyle,
                width: '200px',
              }}
            >
              Select Action
            </Button>
          )}
          <Tooltip title="Add a team member and share folder(s) with them." arrow placement="top">
            <Button
              sx={{
                // ...toolbarbuttonStyle,
                // width: isBelow600px ? '188px' : '188px',
                width: { xs: '200px', sm: '200px', lg: '188px' },
              }}
              size="large"
              color="primary"
              disabled={nomemberAdded} // Disabled When No Team Members Added
              onClick={handleTeamMemberDialogOpen} // Open TeamMemberDialog
              startIcon={
                <Iconify icon="heroicons:plus-circle-16-solid" style={{ width: 18, height: 18 }} />
              }
            >
              Add Team Member
            </Button>
          </Tooltip>
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
                  : 'Filter your team member activity logs.'
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
          </Box>

          <TeamMemberDialog open={teamMemberDialogOpen} onClose={handleTeamMemberDialogClose} />
        </Box>
      </Stack>
      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handlePopoverClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
      >
        <MenuList>
          <Tooltip title="Remove access to shared folder." arrow placement="left">
            <MenuItem sx={{ color: 'error.main' }} onClick={handleOpenConfirmDelete}>
              <Iconify icon="solar:trash-bin-trash-bold" sx={{ mr: 2 }} />
              Remove Access
            </MenuItem>
          </Tooltip>
        </MenuList>
      </Popover>
      <ConfirmDialog
        open={confirmDelete}
        onClose={handleCloseConfirmDelete}
        title=" Do you really want to remove folder(s) access?"
        content="You will no longer have access to the shared folder(s)."
        action={
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              handleCloseConfirmDelete();

              toast.success(`Access removed successfully.`, {
                style: {
                  marginTop: '15px',
                },
              });
            }}
          >
            Remove Access
          </Button>
        }
      />
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
            {/*  Permission Type */}
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
                  Permission Type
                </Typography>
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
                  options={permission_type}
                  value={selectedPermissionType}
                  onChange={(event, newValue) => setSelectedPermissionType(newValue)}
                  renderInput={(params) => <TextField {...params} label="Select" />}
                />
              </FormControl>
            </Box>

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
                  options={folder}
                  value={selectedFolder}
                  onChange={(event, newValue) => setSelectedFolder(newValue)}
                  renderInput={(params) => <TextField {...params} label="Select" />}
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
            {/* <Button variant="outlined" color="inherit" onClick={handleFilterClose}>
              Cancel
            </Button> */}
            <Tooltip
              title={
                isFilterApplied
                  ? "Click the 'X' to clear all applied filters."
                  : 'Filter your team member activity logs.'
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
    </>
  );
}
