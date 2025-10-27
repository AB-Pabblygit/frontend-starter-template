import Box from '@mui/material/Box';
import TablePagination from '@mui/material/TablePagination';
import { Switch, Tooltip, FormControlLabel } from '@mui/material';



// ----------------------------------------------------------------------

export function TablePaginationCustom({
  sx,
  dense,
  onChangeDense,
  rowsPerPageOptions = [ 10, 25, 50, 100],
  ...other
}) {
  return (
    <Box sx={{ position: 'relative', ...sx }}>
      <TablePagination
        rowsPerPageOptions={rowsPerPageOptions}
        component="div"
        {...other}
        sx={{ borderTopColor: 'transparent' }}
        labelRowsPerPage={
          <Tooltip title="Select the number of rows displayed per page." arrow placement="top">
            <span>Rows per page:</span>
          </Tooltip>
        }
        labelDisplayedRows={({ from, to, count }) => (
          <Tooltip
            title="Shows the current range of rows being displayed and the total number of rows."
            arrow
            placement="top"
          >
            <span>
              {from}–{to} of {count}
            </span>
          </Tooltip>
        )}
      />

      {onChangeDense && (
        <Tooltip disableInteractive title="Switch to reduce the table size." arrow placement="top">
          <FormControlLabel
            label="Dense"
            control={<Switch name="dense" checked={dense} onChange={onChangeDense} />}
            sx={{
              pl: 2,
              py: 1.5,
              top: 0,
              position: { sm: 'absolute' },
            }}
          />
        </Tooltip>
      )}
    </Box>
  );
}
