import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import { Button, Tooltip, Checkbox, IconButton, Typography } from '@mui/material';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

export function WebhookTableRow({ row, selected, onSelectRow, onPopoverOpen }) {
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

  const token = row.numberToken;
  const truncateText = (text, maxLength) => {
    if (text.length > maxLength) {
      return `${text.substring(0, maxLength)}...`;
    }
    return text;
  };
  const renderPrimary = (
    <TableRow hover selected={selected} sx={{ cursor: 'pointer' }}>
      <TableCell padding="checkbox">
        <Tooltip title="Select" placement="top" arrow disableInteractive>
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
      <TableCell>
        <Stack direction="column">
          <Stack spacing="5px">
            <Box>
              <Tooltip
                arrow
                placement="top"
                disableInteractive
                title={`Status of user is: ${row.status === 'active' ? `Active` : `Inactive`}`}
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
            <Box>
              <Tooltip title="Webhook Name" arrow placement="top" disableInteractive>
                {row.name}
              </Tooltip>
            </Box>
          </Stack>
          <Box
            component="span"
            sx={{
              color: 'text.disabled',
              maxWidth: '300px',
            }}
          >
            <Tooltip arrow placement="top" disableInteractive title="New Workflow Error">
              {row.webhookEvent}
            </Tooltip>
          </Box>
        </Stack>
      </TableCell>
      <TableCell>
        <Stack direction="column" spacing="8px">
          <Tooltip
            arrow
            placement="top"
            disableInteractive
            title={`Name of the user: ${row.webhookUrl}.`}
          >
            <Box
              component="span"
              sx={{
                color: 'text.primary',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                maxWidth: '600px',
                display: 'inline-block',
              }}
            >
              {row.webhookUrl}
            </Box>
          </Tooltip>
        </Stack>
      </TableCell>

      <TableCell align="right">
        <Tooltip arrow placement="top" disableInteractive title="Test Webhook">
          <Button variant="outlined" color="primary" size="medium">
            Test Webhook
          </Button>
        </Tooltip>
      </TableCell>

      <TableCell align="right" sx={{ px: 1, whiteSpace: 'nowrap' }}>
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
