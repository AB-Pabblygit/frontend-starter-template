import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import { Tooltip, Checkbox, IconButton, Typography } from '@mui/material';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

export function TeamMemberTableRow({ row, selected, onSelectRow, onPopoverOpen }) {
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
      // sx={{ cursor: 'pointer' }}
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

      {/* Serial Number */}
      <TableCell width={88}>
        <Stack spacing={2} direction="row" alignItems="center">
          <Box component="span">
            <Typography sx={{ typography: 'body2', flex: '1 1 auto', alignItems: 'flex-start' }}>
              <Tooltip disableInteractive title={`Serial Number: ${row.id}`} placement="top" arrow>
                <span>{row.id}</span>
              </Tooltip>
            </Typography>
          </Box>
        </Stack>
      </TableCell>

      {/* Shared On */}
      <TableCell>
        <Stack spacing="5px" direction="column">
         
          <Box
            component="span"
            sx={{
              color: 'text.primary',
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
              title={`Connection Created: ${row.shared_date}${timezone}.`}
            >
              <span>{row.shared_date}</span>
            </Tooltip>
          </Box>
        </Stack>
      </TableCell>

    {/* Team Member Email */}
          <TableCell width={250}>
            <Stack direction="column" spacing="5px">
              <Box
                component="span"
                sx={{
                  color: 'text.primary',
                  
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
                  title={`Team Member Email: ${row.email}`}
                >
                  <span>{row.email}</span>
                </Tooltip>
              </Box>

            
            </Stack>
          </TableCell>

          {/* Business Shared */} 
          <TableCell width={650}>
            <Stack direction="column" spacing="5px">
              <Box
                component="span"
                sx={{
                  color: 'text.primary',
                  
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
                  title={`Business Shared: ${row.business_shared}`}
                >
                  <span>{row.business_shared}</span>
                </Tooltip>
              </Box>

            
            </Stack>
          </TableCell>

      {/* Permission Type */}
      <TableCell align="right">
        <Stack direction="column" spacing="5px">
          <Box
            component="span"
            sx={{
              color: 'text.primary',
           
        
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
              <span>{row.permission_type}</span>
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
