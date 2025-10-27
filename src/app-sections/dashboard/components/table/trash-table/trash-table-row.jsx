import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import { Tooltip, Checkbox, IconButton } from '@mui/material';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

export function TrashTableRow({
  row,
  selected,
  onSelectRow,
  onPopoverOpen,
  handleEvent,
  handleRequest,
}) {
  const timezone = '(UTC+05:30) Asia/Kolkata';

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'success';
      case 'inactive':
        return 'error';
      default:
        return 'default';
    }
  };
  const getStatusLabel = (status) => status.charAt(0).toUpperCase() + status.slice(1);

  const renderPrimary = (
    <TableRow
      hover
      selected={selected}
      //  sx={{ cursor: 'pointer' }}
    >
      <TableCell padding="checkbox">
        <Tooltip title="Select" arrow placement="top" disableInteractive>
          <Checkbox
            checked={selected}
            onChange={(event) => {
              event.stopPropagation(); // Keep this if you need to prevent row click events
              onSelectRow(); // This will now work properly
            }}
            inputProps={{ 'aria-labelledby': row.id }}
          />
        </Tooltip>
      </TableCell>
      <TableCell>
        <Stack spacing="5px" direction="column">
          <Box>
            <Tooltip
              arrow
              placement="top"
              disableInteractive
              title={`Connection Status: ${row.status === 'active' ? `Active` : `Inactive`}`}
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
          <Box
            component="span"
            sx={{
              color: 'text.disabled',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              maxWidth: '300px',
              display: 'inline-block',
            }}
          >
            <Tooltip
              arrow
              placement="top"
              disableInteractive
              title={`Connection Created: ${row.date}${timezone}.`}
            >
              <span>{row.date}</span>
            </Tooltip>
          </Box>
        </Stack>
      </TableCell>

      <TableCell>
        <Stack direction="column" spacing="5px">
          <Box
            component="span"
            sx={{
              color: 'primary.main',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              maxWidth: '400px',
              display: 'inline-block',
            }}
          >
            <Tooltip
              arrow
              placement="top"
              disableInteractive
              title={`Connection Name: ${row.connection_name}`}
            >
              <span>{row.connection_name}</span>
            </Tooltip>
          </Box>

          <Box
            component="span"
            sx={{
              color: 'text.disabled',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              maxWidth: '200px',
              display: 'inline-block',
            }}
          >
            <Tooltip
              arrow
              placement="top"
              disableInteractive
              title={`Folder Name: ${row.folder_name}`}
            >
              <span>{row.folder_name}</span>
            </Tooltip>
          </Box>
        </Stack>
      </TableCell>

      <TableCell align="right">
        <Stack direction="column" spacing="5px">
          <Box
            onClick={() => handleRequest(row)}
            component="span"
            sx={{
              color: 'primary.main',
              //  color: '#078DEE',
              cursor: 'pointer',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              maxWidth: '300px',
              display: 'inline-block',
            }}
          >
            <Tooltip
              arrow
              placement="top"
              disableInteractive
              // title={`Name of the user: ${row.no_of_requests}.`}
              title="Total number of webhook requests received by connection."
            >
              <span>{row.no_of_requests} Request</span>
            </Tooltip>
          </Box>

          <Box
            onClick={() => handleEvent(row)}
            component="span"
            sx={{
              color: 'success.main',
              //  color: '#078DEE',
              cursor: 'pointer',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              maxWidth: '300px',
              display: 'inline-block',
            }}
          >
            <Tooltip
              arrow
              placement="top"
              disableInteractive
              // title={`Name of the user: ${row.no_of_events}.`}
              title="Total number of events successfully processed from received webhook requests."
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
          <IconButton color="default" onClick={(e) => onPopoverOpen(e)}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </Tooltip>
      </TableCell>
    </TableRow>
  );

  return <>{renderPrimary}</>;
}
