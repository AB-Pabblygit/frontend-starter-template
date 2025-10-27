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
  useMediaQuery,
  InputAdornment,
} from '@mui/material';

import { useBoolean } from 'src/hooks/use-boolean';

import { Iconify } from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/confirm-dialog';

import { WebhookDialog } from '../dialogs/add-webhook';

export function WebhookTableToolbar({
  filters,
  onResetPage,
  numSelected,
  nomemberAdded,
}) {
  const theme = useTheme();
  const [confirmDelete, setConfirmDelete] = useState(false);

  const handleOpenConfirmDelete = () => {
    setConfirmDelete(true);
    handleClosePopover();
  };
  const handleCloseConfirmDelete = () => setConfirmDelete(false);

  const isBelow600px = useMediaQuery(theme.breakpoints.down('sm'));
  const [anchorEl, setAnchorEl] = useState(null);

  const handlePopoverOpen = (event) => setAnchorEl(event.currentTarget);
  const handleClosePopover = () => setAnchorEl(null);

  const handleFilterName = useCallback(
    (event) => {
      onResetPage();
      filters.setState({ name: event.target.value });
    },
    [filters, onResetPage]
  );

  const dialog = useBoolean();

  return (
    <>
      <Stack
        spacing={2}
        alignItems={{ xs: 'end', md: 'center' }}
        direction={{ xs: 'column', md: 'row' }}
        sx={{ p: 2.5, width: '100%' }}
      >
        <Box sx={{ width: '100%' }}>
          <TextField
            fullWidth
            value={filters.state.name}
            onChange={handleFilterName}
            placeholder="Search by webhook name..."
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
            justifyContent: 'flex-end',
          }}
        >
          {numSelected > 0 && (
            <Button
              endIcon={<Iconify icon="eva:arrow-ios-downward-fill" />}
              onClick={handlePopoverOpen}
              color="primary"
              sx={{
                width: '200px',
              }}
            >
              Select Action
            </Button>
          )}
          <Tooltip title="Add a team member and share folder(s) with them." arrow placement="top">
            <Button
              sx={{
                width: { xs: '200px', sm: '200px', lg: '188px' },
              }}
              size="large"
              color="primary"
              disabled={nomemberAdded}
              onClick={dialog.onTrue}
              startIcon={
                <Iconify icon="heroicons:plus-circle-16-solid" style={{ width: 18, height: 18 }} />
              }
            >
              Add Webhook
            </Button>
          </Tooltip>

          <WebhookDialog open={dialog.value} onClose={dialog.onFalse} />
        </Box>
      </Stack>
      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleClosePopover}
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
    </>
  );
}
