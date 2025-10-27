import React, { useState } from 'react';

import {
  Box,
  Stack,
  Drawer,
  Tooltip,
  TableRow,
  Checkbox,
  TableCell,
  IconButton,
  Typography,
} from '@mui/material';

import { useBoolean } from 'src/hooks/use-boolean';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { usePopover } from 'src/components/custom-popover';

export function ConnectionsTableRow({
  row,
  selected,
  onSelectRow,
  onOpenPopover,
  onEmailClick,
  onDownloadClick,

}) {
  const popover = usePopover();
  const collapse = useBoolean();
  const timezone = ', (UTC+05:30) Asia/Kolkata';
  const [dialog, setDialog] = useState({
    open: false,
    mode: '',
  });

  // Drawer functions
  const showAlert = (type, title, message) => {
    console.log(`Alert Type: ${type}, Title: ${title}, Message: ${message}`);
  };

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'success';
      case 'inactive':
        return 'warning';
      case 'blocked':
        return 'error';
      default:
        return 'default';
    }
  };

  const getStatusLabel = (status) => status.charAt(0).toUpperCase() + status.slice(1);

  const getStatusTooltip = (status) => {
    switch (status) {
      case 'active':
        return 'Connection Status: Active.';
      case 'inactive':
        return 'Connection Status: Inactive.';
      case 'blocked':
        return 'Connection Status: Blocked.';
      default:
        return '';
    }
  };

  const handleDrawerOpen = () => setIsDrawerOpen(true);
  const handleDrawerClose = () => setIsDrawerOpen(false);

  const renderPrimary = (
    <>
      <TableRow hover selected={selected} >
        <TableCell padding="checkbox">
          <Checkbox
            checked={selected}
            onChange={(event) => {
              event.stopPropagation();
              onSelectRow();
            }}
            inputProps={{ 'aria-labelledby': row.id }}
          />
        </TableCell>
        <TableCell>
          <Stack>
            <Box mb="5px">
              <Tooltip
                arrow
                placement="top"
                disableInteractive
                title={getStatusTooltip(row.status)}
              >
                <Label
                  variant="soft"
                  color={getStatusColor(row.status)}
                  sx={{ textTransform: 'capitalize' }}
                >
                  {getStatusLabel(row.status)}
                </Label>
              </Tooltip>
            </Box>
            <Tooltip
              arrow
              placement="top"
              disableInteractive
              title={`Connection Created At: ${row.Date}${timezone}.`}
            >
              <Box
                component="span"
                sx={{
                  color: 'text.disabled',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  maxWidth: '180px',
                  display: 'inline-block',
                }}
              >
                {row.Date}
              </Box>
            </Tooltip>
          </Stack>
        </TableCell>
        <TableCell>
          <Box display="flex" flexDirection="column" gap={1}>
            <Box display="flex" alignItems="center">
              <Tooltip
                arrow
                placement="top"
                disableInteractive
                title={`Connection name: ${row.connectionName}.`}
              >
                <Box
                  component="span"
                  sx={{
                    color: 'text.primary',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    maxWidth: '200px',
                    display: 'inline-block',
                  }}
                >
                  {row.connectionName}
                </Box>
              </Tooltip>
            </Box>
            <Box
              component="span"
              sx={{
                color: 'text.disabled',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                display: 'inline-block',
              }}
            >
              <Tooltip
                arrow
                placement="top"
                disableInteractive
                title={`Connection ID: ${row.id}.`}
              >
                <span>{row.id}</span>
              </Tooltip>
            </Box>
          </Box>
        </TableCell>
        <TableCell>
          <Tooltip
            arrow
            placement="top"
            disableInteractive
            title={`Email address of the Pabbly customer: ${row.accountEmail}.`}
          >
            <Box
              component="span"
              onClick={(e) => {
                e.stopPropagation();
                onEmailClick(row);
              }}
              sx={{
                color: 'primary.main',
                cursor: 'pointer',
                '&:hover': {
                  textDecoration: 'underline',
                },
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                maxWidth: '300px',
                display: 'inline-block',
              }}
            >
              {row.accountEmail}
            </Box>
          </Tooltip>
        </TableCell>

        <TableCell align="right">
          <Stack direction="column" spacing="8px">
            <Box component="span">
              <Tooltip
                arrow
                placement="top"
                disableInteractive
                title={`Total number of webhook requests received by connection: ${row.no_of_requests}.`}
              >
                <span>{row.no_of_requests} Request</span>
              </Tooltip>
            </Box>

            <Box component="span">
              <Tooltip
                arrow
                placement="top"
                disableInteractive
                title={`Total number of events successfully processed from received webhook requests: ${row.no_of_events}.`}
              >
                <span>{row.no_of_events} Event</span>
              </Tooltip>
            </Box>
          </Stack>
        </TableCell>

        <TableCell
          align="right"
          sx={{ px: 1, whiteSpace: 'nowrap' }}
          onClick={(e) => e.stopPropagation()}
        >
          <Tooltip title="Click to see options." arrow placement="top">
            <IconButton
              color={popover.open ? 'inherit' : 'default'}
              onClick={(event) => onOpenPopover(event)}
            >
              <Iconify icon="eva:more-vertical-fill" />
            </IconButton>
          </Tooltip>
        </TableCell>
      </TableRow>
      <Drawer
        anchor="right"
        open={isDrawerOpen}
        onClose={handleDrawerClose}
        PaperProps={{
          sx: { width: { xs: '100%', md: 600 }, p: 3 },
        }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 3,
          }}
        >
          <Box>
            <Typography variant="h6">Verification Report</Typography>
            <Typography variant="body2">Check the full details of email verification here.</Typography>
          </Box>
          <IconButton onClick={handleDrawerClose}>
            <Iconify icon="mingcute:close-line" />
          </IconButton>
        </Box>
      </Drawer>
    </>
  );

  return <>{renderPrimary}</>;
}
