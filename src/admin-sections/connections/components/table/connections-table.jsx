import { toast } from 'sonner';
import { useTheme } from '@emotion/react';
import { useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import {
  Button,
  Tooltip,
  MenuList,
  MenuItem,
  CardHeader,
  Typography,
} from '@mui/material';

import { useSetState } from 'src/hooks/use-set-state';

import { fIsBetween } from 'src/utils/format-time';

import { CONNECTIONS_STATUS_OPTIONS } from 'src/_mock/_table/_admin/_connections';
import { DeleteDialog } from 'src/admin-sections/dialog-boxes/confirm-delete-dialog';

import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { CustomPopover } from 'src/components/custom-popover';
import { ConfirmDialog } from 'src/components/confirm-dialog';
import {
  useTable,
  rowInPage,
  emptyRows,
  TableNoData,
  getComparator,
  TableEmptyRows,
  TableHeadCustom,
  TablePaginationCustom,
} from 'src/components/table';

import { ConnectionsTableRow } from './connections-table-row';
import { CustomerDetailsDrawer } from '../drawers/customer-drawer';
import { ConnectionsTableToolbar } from './connections-table-toolbar';
import { ConnectionsTableFiltersResult } from './connections-table-filters-result';

// ----------------------------------------------------------------------

const STATUS_OPTIONS = [
  { value: 'all', label: 'All', tooltip: 'View all created connections.' },
  ...CONNECTIONS_STATUS_OPTIONS,
];
const TABLE_HEAD = [
  {
    id: 'status_date',
    label: 'Connection Status/Date',
    width: 'flex',
    whiteSpace: 'nowrap',
    tooltip: 'View the connection status and creation date.',
  },

  {
    id: 'connection_name/id',
    label: 'Connection Name/ID',
    width: 'flex',
    whiteSpace: 'nowrap',
    tooltip: 'Name and ID of connection created by the Pabbly customer.',
  },

  {
    id: 'accountEmailName',
    label: 'Customer Email',
    width: 'flex',
    whiteSpace: 'nowrap',

    tooltip: 'Email address of the Pabbly customer.',
  },
  {
    id: 'connectedIntegration',
    label: 'Request/Event',
    width: 'flex',
    align: 'right',
    // whiteSpace: 'nowrap',
    tooltip: `Number of webhook requests and webhook events recorded.`,
  },

  // {
  //   id: 'result',
  //   label: 'Report',
  //   align: 'right',
  //   tooltip: 'Report of the email lists uploaded by the Pabbly cutomer for verification.',
  //   width: 'flex',
  // },
  { id: '', width: 10 },
];

const dataOn = [
  {
    id: 'conn_4sdgf54sd5fg456fd',
    connectionName: 'Connection 1',
    accountEmail: 'gerry@briodigital.com',
    accountName: 'Bouncify 1',
    Date: 'Oct 23, 2024 17:45:32',
    status: 'active',

    no_of_requests: '2',
    no_of_events: '2',
  },
  {
    id: 'conn_4434f54sd5fg456fd',
    connectionName: 'Connection 2',
    accountEmail: 'gerry@briodigital.com',
    accountName: 'Bouncify 1',
    Date: 'Oct 23, 2024 17:45:32',
    status: 'inactive',

    no_of_requests: '2',
    no_of_events: '2',
  },
  {
    id: 'conn_4sdgf5dfg4sd5fg456fd',
    connectionName: 'Connection 3',
    accountEmail: 'gerry@briodigital.com',
    accountName: 'Bouncify 1',
    Date: 'Oct 23, 2024 17:45:32',
    status: 'blocked',

    no_of_requests: '2',
    no_of_events: '2',
  },
];

// ----------------------------------------------------------------------

export function ConnectionsTable() {
  // const navigate = useNavigate();
  const table = useTable({
    defaultRowsPerPage: 10,
    defaultOrderBy: 'orderNumber',
    defaultSelected: [], // Add this to initialize selected state
  });
  const theme = useTheme();
  const [tableData, setTableData] = useState(dataOn);

  const filters = useSetState({
    name: '',
    status: 'all',
    apiType: '', // Add this
  });

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(table.order, table.orderBy),
    filters: filters.state,
  });

  const dataInPage = rowInPage(dataFiltered, table.page, table.rowsPerPage);

  const canReset =
    !!filters.state.name ||
    filters.state.status !== 'all' ||
    (!!filters.state.startDate && !!filters.state.endDate);

  const notFound = (!dataFiltered.length && canReset) || !dataFiltered.length;

  const handleFilterStatus = useCallback(
    (event, newValue) => {
      table.onResetPage();
      filters.setState({ status: newValue });
    },
    [filters, table]
  );
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);

  const handleOpenPopover = (event, row) => {
    setAnchorEl(event.currentTarget);
    setSelectedRow(row);
  };
  const handleDelete = () => {
    setDeleteOpen(true);
  };
  const handleConfirmDelete = () => {
    setDeleteOpen(false);
    toast.success('Connection deleted successfully.');
  };
  const handleClosePopover = () => {
    setAnchorEl(null);
    setSelectedRow(null);
  };
  const handleViewCustomerClick = (row) => {
    setSelectedUserEmail(row.accountEmail);
    setSelectedUserName(row.accountName);
    setSelectedUserId(row.id);
    setDrawerOpen(true);
    handleClosePopover();
  };

  const renderMenuItems = (status) => {
    const items = [];

    // Delete is shown for all statuses
    const deleteItem = (
      <>
        {/* Show Block Connection only for active/inactive status */}
        {(status === 'active' || status === 'inactive') && (
          <Tooltip title="Block Connection of Pabbly customer." arrow placement="left">
            <MenuItem onClick={handleBlockConnectionClick}>
              <Iconify icon="icomoon-free:blocked" />
              Block Connection
            </MenuItem>
          </Tooltip>
        )}

        {/* Show Unblock Connection only for blocked status */}
        {status === 'blocked' && (
          <Tooltip title="Unblock Connection of Pabbly customer." arrow placement="left">
            <MenuItem onClick={handleUnblockConnectionClick}>
              <Iconify icon="material-symbols:circle-outline" />
              Unblock Connection
            </MenuItem>
          </Tooltip>
        )}

        <Tooltip title="Update events of Pabbly customer." arrow placement="left">
          <MenuItem onClick={() => handleViewCustomerClick(selectedRow)}>
            <Iconify icon="tabler:credit-card-filled" />
            Update Events Credits
          </MenuItem>
        </Tooltip>

        {/* <Divider sx={{ borderStyle: 'dashed' }} />

        <Tooltip
          title={
            status === 'processing' ? 'Cancel the email verification process.' : 'Delete connection'
          }
          arrow
          placement="left"
        >
          <MenuItem key="delete" sx={{ color: 'error.main' }} onClick={() => handleDelete()}>
            {status === 'processing' ? (
              <Iconify icon="material-symbols:cancel-rounded" />
            ) : (
              <Iconify icon="solar:trash-bin-trash-bold" />
            )}
            {status === 'processing' ? 'Cancel' : 'Delete'}
          </MenuItem>
        </Tooltip> */}
      </>
    );

    items.push(deleteItem);

    return items;
  };
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedUserEmail, setSelectedUserEmail] = useState(null);
  const [selectedUserName, setSelectedUserName] = useState(null);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [selectedUserStatus, setSelectedUserStatus] = useState('active');
  const handleUserEmailClick = (account) => {
    setSelectedUserEmail(account.accountEmail);
    setSelectedUserName(account.accountName);
    setSelectedUserId(account.id);
    setDrawerOpen(true);
  };
  const [downloadDialogOpen, setDownloadDialogOpen] = useState(false);
  const [selectedDownloadRow, setSelectedDownloadRow] = useState(null);

  const handleCreditUpdateDialog = (row) => {
    setSelectedDownloadRow(row);
    setDownloadDialogOpen(true);
  };

  const [deleteOpen, setDeleteOpen] = useState(false);


  const handleDeleteClose = () => {
    setDeleteOpen(false);
  };
  const [dialogState, setDialogState] = useState({
    open: false,
    type: null, // 'block' or 'unblock'
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

  const handleDialogClose = () => {
    setDialogState((prev) => ({ ...prev, open: false }));
  };

  const handleDialogConfirm = () => {
    if (dialogState.type === 'block') {
      // Handle block action
      toast.success('Connection blocked successfully.');
    } else {
      // Handle unblock action
      toast.success('Connection unblocked successfully.');
    }
    handleDialogClose();
  };

  return (
    <Card>
      <CardHeader
        title={
          <Box display="flex" justifyContent="space-between" flexDirection={{xs:'column',md:'row'}} alignItems={{xs:'flex-end',md:'center'}}>
            <Box display="inline-block" mb={{xs:2,md:0}}>
              <Typography variant="h6">
                <Tooltip
                  arrow
                  placement="top"
                  disableInteractive
                  title="View all connections created by Pabbly customers for Pabbly Hook."
                >
                  <span>Connections</span>
                </Tooltip>
              </Typography>
              <Typography sx={{ mt: '4px' }} variant="body2" color="grey.600">
                View and manage customer connections, track statuses, and monitor linked requests
                and events.
              </Typography>
            </Box>
            <Box display="inline-block">
              <ConnectionsTableToolbar
                filters={filters}
                onResetPage={table.onResetPage}
                numSelected={table.selected.length} // Add this line
              />
            </Box>
          </Box>
        }
        sx={{ pb: 3 }}
      />
      {/* <Divider /> */}
      {/* <Tabs
        value={filters.state.status}
        onChange={handleFilterStatus}
        sx={{
          px: 2.5,
          boxShadow: () =>
            `inset 0 -2px 0 0 ${varAlpha(theme.vars.palette.grey['500Channel'], 0.08)}`,
        }}
      >
        {STATUS_OPTIONS.map((tab) => (
          <Tab
            key={tab.value}
            iconPosition="end"
            value={tab.value}
            label={
              <Tooltip disableInteractive placement="top" arrow title={tab.tooltip}>
                <span>{tab.label}</span>
              </Tooltip>
            }
            icon={
              <Label
                variant={
                  ((tab.value === 'all' || tab.value === filters.state.status) && 'filled') ||
                  'soft'
                }
                color={
                  (tab.value === 'active' && 'success') ||
                  (tab.value === 'inactive' && 'warning') ||
                  (tab.value === 'blocked' && 'error') ||
                  'default'
                }
              >
                {['active', 'inactive', 'blocked'].includes(tab.value)
                  ? tableData.filter((user) => user.status === tab.value).length
                  : tableData.length}
              </Label>
            }
          />
        ))}
      </Tabs> */}
      {/* <ConnectionsTableToolbar
        filters={filters}
        onResetPage={table.onResetPage}
        numSelected={table.selected.length} // Add this line
      /> */}

      {canReset && (
        <ConnectionsTableFiltersResult
          filters={filters}
          totalResults={dataFiltered.length}
          onResetPage={table.onResetPage}
          sx={{ p: 2.5, pt: 0 }}
        />
      )}

      <Box sx={{ position: 'relative' }}>
        <Scrollbar>
          <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 960 }}>
            <TableHeadCustom
              showCheckbox
              order={table.order}
              orderBy={table.orderBy}
              headLabel={TABLE_HEAD}
              rowCount={dataFiltered.length}
              numSelected={table.selected.length}
              onSort={table.onSort}
              onSelectAllRows={(checked) =>
                table.onSelectAllRows(
                  checked,
                  dataFiltered.map((row) => row.id)
                )
              }
            />

            <TableBody>
              {dataInPage
                .slice(
                  table.page * table.rowsPerPage,
                  table.page * table.rowsPerPage + table.rowsPerPage
                )
                .map((row, index) => (
                  <ConnectionsTableRow
                    key={index}
                    row={row}
                    onOpenPopover={(event) => handleOpenPopover(event, row)}
                    selected={table.selected.includes(row.id)}
                    onSelectRow={() => {
                      table.onSelectRow(row.id);
                    }}
                    onEmailClick={handleUserEmailClick}
                    onDownloadClick={() => handleCreditUpdateDialog(row)}
                    // Add this prop
                  />
                ))}

              <TableEmptyRows
                height={table.dense ? 56 : 56 + 20}
                emptyRows={emptyRows(table.page, table.rowsPerPage, dataOn.length)}
              />
              {tableData.length === 0 ? (
                <TableNoData
                  title="No Data Found."
                  description="No data found in the table."
                  notFound={notFound}
                />
              ) : (
                <TableNoData
                  title="Search Not Found!"
                  description={`No search found with keyword "${filters.state.name}"`}
                  notFound={notFound}
                />
              )}
            </TableBody>
          </Table>
        </Scrollbar>
      </Box>
      <CustomPopover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleClosePopover}
        slotProps={{ arrow: { placement: 'right-top' } }}
      >
        <MenuList>{selectedRow && renderMenuItems(selectedRow.status)}</MenuList>
      </CustomPopover>
     
      {/* <UpdateCreditsDialog
        open={downloadDialogOpen}
        onClose={() => setDownloadDialogOpen(false)}
        rowData={selectedDownloadRow} // Add this prop
      /> */}
      <CustomerDetailsDrawer
        open={drawerOpen}
        onClose={() => {
          setDrawerOpen(false);
          setSelectedUserId(null);
        }}
        userId={selectedUserId}
        userName={selectedUserName}
        userEmail={selectedUserEmail}
        userStatus={selectedUserStatus}
      />
      <TablePaginationCustom
        page={table.page}
        count={dataFiltered.length}
        rowsPerPage={table.rowsPerPage}
        onPageChange={table.onChangePage}
        onChangeDense={table.onChangeDense}
        onRowsPerPageChange={table.onChangeRowsPerPage}
      />
      <DeleteDialog
        title="Do you really want to delete the connection?"
        content="Note that when a connection is deleted, it is permanently removed."
        open={deleteOpen}
        onClose={handleDeleteClose}
        action={
          <Button variant="contained" color="error" onClick={handleConfirmDelete}>
            Delete
          </Button>
        }
      />
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
    </Card>
  );
}

function applyFilter({ inputData, comparator, filters, dateError }) {
  const { status, name, startDate, endDate, apiType } = filters;

  let filteredData = inputData;

  // Filter by message (name)
  if (name) {
    filteredData = filteredData.filter(
      (order) =>
        (order.emailListName && order.emailListName.toLowerCase().includes(name.toLowerCase())) ||
        (order.accountEmail && order.accountEmail.toLowerCase().includes(name.toLowerCase()))
    );
  }

  // Filter by status
  if (status !== 'all') {
    filteredData = filteredData.filter((order) => order.status === status);
  }

  // Filter by API type
  if (apiType) {
    filteredData = filteredData.filter(
      (order) => order.apiType.toLowerCase() === apiType.toLowerCase()
    );
  }

  // Filter by date range
  if (!dateError) {
    if (startDate && endDate) {
      filteredData = filteredData.filter((order) =>
        fIsBetween(new Date(order.dateCreatedOn), startDate, endDate)
      );
    }
  }

  return filteredData;
}
