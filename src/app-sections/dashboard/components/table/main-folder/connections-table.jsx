import { toast } from 'sonner';
import { useNavigate } from 'react-router';
import { useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import {
  Tab,
  Tabs,
  Button,
  Divider,
  Tooltip,
  MenuList,
  MenuItem,
  CardHeader,
  Typography,
  CircularProgress,
} from '@mui/material';

import { useSetState } from 'src/hooks/use-set-state';

import { varAlpha } from 'src/theme/styles';
import { CONNECTION_STATUS_OPTIONS } from 'src/_mock/_table/_app/_connection';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { CustomPopover } from 'src/components/custom-popover';
import { ConfirmDialog } from 'src/components/confirm-dialog';
import { RenameDialog } from 'src/components/rename-dialog/rename-dialog';
import {
  useTable,
  rowInPage,
  emptyRows,
  TableNoData,
  getComparator,
  TableEmptyRows,
  TableHeadCustom,
  TableSelectedAction,
  TablePaginationCustom,
} from 'src/components/table';

import { ConnectionsTableRow } from './connections-table-row';
import { ConnectionsTableToolbar } from './connections-table-toolbar';
import { MoveToFolderPopover } from '../../dialogs/move-folder-dailog';
import { ConnectionsTableFiltersResult } from './connections-table-filters-result';

// ----------------------------------------------------------------------

const STATUS_OPTIONS = [
  { value: 'all', label: 'All', tooltip: 'View all connections including active and inactive.' },
  ...CONNECTION_STATUS_OPTIONS,
];

const TABLE_HEAD = [
  {
    id: 'status_date',
    label: 'Status/Date',
    width: '200px',
    whiteSpace: 'nowrap',
    tooltip: 'View connections status and date of creation.',
  },
  {
    id: 'connection_folder',
    label: 'Connection/Folder Name',
    width: '600px',
    whiteSpace: 'nowrap',
    tooltip: 'Name of connections and folder where it is located.',
  },
  {
    id: 'request_events',
    label: 'Request/Events',
    width: 'flex',
    whiteSpace: 'nowrap',
    align: 'right',
    tooltip:
      'View the number of incoming webhook requests and processed events for each connection.',
  },
  { id: '', width: 10 },
];

const dataOn = [];

// ----------------------------------------------------------------------

export function MainFolderTable() {
  const navigate = useNavigate();
  const table = useTable({
    defaultOrderBy: 'orderNumber',
    defaultSelected: [],
    defaultRowsPerPage: 10,
  });

  const FolderOptions = [
    { value: '1', label: 'None' },
    { value: '2', label: 'Company B' },
    { value: '3', label: 'WhatsApp Database' },
  ];

  const [tableData, setTableData] = useState(dataOn);
  const [isLoading, setIsLoading] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [checkboxAnchorEl, setCheckboxAnchorEl] = useState(null);
  const [selectedRowId, setSelectedRowId] = useState(null);
  const [moveToFolderPopoverOpen, setMoveToFolderPopoverOpen] = useState(false);
  const [renameFolderPopoverOpen, setRenameFolderPopoverOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [formData, setFormData] = useState({
    connectionName: '',
    folderList: '',
  });

  const filters = useSetState({
    name: '',
    status: 'all',
  });

  // Status Dialog State
  const [confirmStatusDialog, setConfirmStatusDialog] = useState({
    open: false,
    title: '',
    content: '',
    action: '',
    status: '',
  });

  // Handlers for checkbox selection popover
  const handleCheckboxPopoverOpen = (event) => {
    event.stopPropagation();
    setCheckboxAnchorEl(event.currentTarget);
  };

  const handleCheckboxPopoverClose = () => {
    setCheckboxAnchorEl(null);
  };

  // Handlers for ellipsis menu
  const handlePopoverOpen = (event, rowId) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
    setSelectedRowId(rowId);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
    setSelectedRowId(null);
  };

  // Navigation handlers


  const onOpenUpdateConnection = () => {
    navigate('/app/update-connection', {
      state: {
        connectionName: formData.connectionName,
        folderName: getFolderName(formData.folderList),
      },
    });
  };

  const handleEvent = () => {
    navigate('/app/events', {
      state: {
        connectionName: formData.connectionName,
        folderName: getFolderName(formData.folderList),
      },
    });
  };

  const handleRequest = () => {
    navigate('/app/requests', {
      state: {
        connectionName: formData.connectionName,
        folderName: getFolderName(formData.folderList),
      },
    });
  };

  // Folder handlers
  const getFolderName = (value) => {
    const selectedFolder = FolderOptions.find((option) => option.value === value);
    return selectedFolder ? selectedFolder.label : '';
  };

  const handleMoveToFolder = () => {
    setMoveToFolderPopoverOpen(true);
    handlePopoverClose();
    handleCheckboxPopoverClose();
  };

  const handleRenameFolder = () => {
    setRenameFolderPopoverOpen(true);
    handlePopoverClose();
    handleCheckboxPopoverClose();
  };

  // Delete handlers
  const handleDeleteSelected = () => {
    setConfirmDelete(true);
    handlePopoverClose();
    handleCheckboxPopoverClose();
  };

  const handleConfirmDelete = () => {
    if (table.selected.length > 0) {
      setTableData((prevData) => prevData.filter((row) => !table.selected.includes(row.id)));
      table.onSelectAllRows(false);
    } else if (selectedRowId) {
      setTableData((prevData) => prevData.filter((row) => row.id !== selectedRowId));
    }
    setConfirmDelete(false);
    toast.success('Connection(s) deleted successfully.');
  };

  const handleCloseConfirmDelete = () => {
    setConfirmDelete(false);
  };

  // Status handlers
  const handleConfirmStatusClose = () => {
    setConfirmStatusDialog({
      open: false,
      title: '',
      content: '',
      action: '',
      status: '',
    });
  };

  const handleConfirmStatusOpen = (status, isMultiple = false) => {
    if (status === 'active') {
      setConfirmStatusDialog({
        open: true,
        title: `Disable connection${isMultiple ? 's' : ''}`,
        content: `Are you sure you want to set ${isMultiple ? 'these' : 'this'} connection${isMultiple ? 's' : ''} as Inactive?`,
        action: 'Disable',
        status: 'inactive',
        isMultiple,
      });
    } else {
      setConfirmStatusDialog({
        open: true,
        title: `Enable connection${isMultiple ? 's' : ''}`,
        content: `Are you sure you want to set ${isMultiple ? 'these' : 'this'} connection${isMultiple ? 's' : ''} as Active?`,
        action: 'Enable',
        status: 'active',
        isMultiple,
      });
    }
  };

  const handleStatusChange = () => {
    if (confirmStatusDialog.isMultiple) {
      setTableData((prevData) =>
        prevData.map((row) =>
          table.selected.includes(row.id) ? { ...row, status: confirmStatusDialog.status } : row
        )
      );
      table.onSelectAllRows(false);
    } else if (selectedRowId) {
      setTableData((prevData) =>
        prevData.map((row) =>
          row.id === selectedRowId ? { ...row, status: confirmStatusDialog.status } : row
        )
      );
    }

    toast.success(
      `Connection ${confirmStatusDialog.status === 'active' ? 'enabled' : 'disabled'} successfully.`,
      {
        style: {
          marginTop: '15px',
        },
      }
    );

    handleConfirmStatusClose();
  };

  // Filter handlers
  const handleFilterStatus = useCallback(
    (event, newValue) => {
      table.onResetPage();
      filters.setState({ status: newValue });
    },
    [filters, table]
  );
  const handleToolbarSelectAction = (event) => {
    event.stopPropagation();
    setCheckboxAnchorEl(event.currentTarget);
  };
  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(table.order, table.orderBy),
    filters: filters.state,
  });

  const dataInPage = rowInPage(dataFiltered, table.page, table.rowsPerPage);
  const selectedRow = tableData.find((row) => row.id === selectedRowId);

  const canReset =
    !!filters.state.name ||
    filters.state.status !== 'all' ||
    (!!filters.state.startDate && !!filters.state.endDate);

  const notFound = (!dataFiltered.length && canReset) || !dataFiltered.length;

  // Render checkbox selection popover content
  const renderCheckboxPopoverContent = () => {
    const selectedItems = tableData.filter((row) => table.selected.includes(row.id));
    if (selectedItems.length === 0) return null;

    const isActive = selectedItems.every((item) => item.status === 'active');

    return (
      <MenuList>
        <Tooltip
          title={`Click to ${isActive ? 'disable' : 'enable'} selected connections.`}
          arrow
          placement="left"
        >
          <MenuItem
            onClick={() => {
              handleConfirmStatusOpen(isActive ? 'active' : 'inactive', true);
              handleCheckboxPopoverClose();
            }}
          >
            <Iconify icon="ph:toggle-right-fill" />
            Disable
          </MenuItem>
        </Tooltip>
        <Tooltip
          title={`Click to ${isActive ? 'disable' : 'enable'} selected connections.`}
          arrow
          placement="left"
        >
          <MenuItem
            onClick={() => {
              handleConfirmStatusOpen(isActive ? 'active' : 'inactive', true);
              handleCheckboxPopoverClose();
            }}
          >
            <Iconify icon="ph:toggle-left-fill" />
            Enable
          </MenuItem>
        </Tooltip>

        <Tooltip title="Move selected connections to an existing folder." arrow placement="left">
          <MenuItem onClick={handleMoveToFolder}>
            <Iconify icon="fluent:folder-move-16-filled" />
            Move to Folder
          </MenuItem>
        </Tooltip>

        <Divider style={{ borderStyle: 'dashed' }} />

        <Tooltip title="Delete selected connections." arrow placement="left">
          <MenuItem sx={{ color: 'error.main' }} onClick={handleDeleteSelected}>
            <Iconify icon="solar:trash-bin-trash-bold" />
            Delete
          </MenuItem>
        </Tooltip>
      </MenuList>
    );
  };

  // Render ellipsis menu content
  const renderEllipsisPopoverContent = () => {
    if (!selectedRow) return null;

    const isActive = selectedRow.status === 'active';

    return (
      <MenuList>
        <Tooltip
          title={`Click to ${isActive ? 'disable' : 'enable'} this connection.`}
          arrow
          placement="left"
        >
          <MenuItem
            onClick={() => {
              handleConfirmStatusOpen(isActive ? 'active' : 'inactive', false);
              handlePopoverClose();
            }}
          >
            <Iconify icon={isActive ? 'ph:toggle-right-fill' : 'ph:toggle-left-fill'} />
            {isActive ? 'Disable' : 'Enable'}
          </MenuItem>
        </Tooltip>

        <Tooltip title="Click here to update connection." arrow placement="left">
          <MenuItem onClick={onOpenUpdateConnection}>
            <Iconify icon="fluent:edit-48-filled" />
            Update Connection
          </MenuItem>
        </Tooltip>

   

        <Tooltip title="Change the connection name." placement="left" arrow>
          <MenuItem onClick={handleRenameFolder}>
            <Iconify icon="fluent:rename-16-filled" />
            Rename
          </MenuItem>
        </Tooltip>

        <Tooltip title="Move this connection to an existing folder." arrow placement="left">
          <MenuItem onClick={handleMoveToFolder}>
            <Iconify icon="fluent:folder-move-16-filled" />
            Move to Folder
          </MenuItem>
        </Tooltip>

        <Divider style={{ borderStyle: 'dashed' }} />

        <Tooltip title="Delete connection." arrow placement="left">
          <MenuItem sx={{ color: 'error.main' }} onClick={handleDeleteSelected}>
            <Iconify icon="solar:trash-bin-trash-bold" />
            Delete
          </MenuItem>
        </Tooltip>
      </MenuList>
    );
  };
  return (
    <Card>
      <CardHeader
        title={
          <Box display="inline-block">
            <Tooltip arrow placement="top" disableInteractive title="Folder Name: Home">
              <Typography variant="h6">Main Folder</Typography>
            </Tooltip>
          </Box>
        }
        subheader="Manage and view all connections stored within the folder."
        sx={{ pb: 3 }}
      />
      <Divider />
      <Tabs
        value={filters.state.status}
        onChange={handleFilterStatus}
        sx={{
          px: 2.5,
          boxShadow: (theme) =>
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
                  (tab.value === 'inactive' && 'error') ||
                  'default'
                }
              >
                {['active', 'inactive'].includes(tab.value)
                  ? tableData.filter((user) => user.status === tab.value).length
                  : tableData.length}
              </Label>
            }
          />
        ))}
      </Tabs>
      <ConnectionsTableToolbar
        filters={filters}
        onResetPage={table.onResetPage}
        numSelected={table.selected.length}
        onSelectActionOpen={handleToolbarSelectAction} // Pass the handler for the select action button
      />

      {canReset && (
        <ConnectionsTableFiltersResult
          filters={filters}
          totalResults={dataFiltered.length}
          onResetPage={table.onResetPage}
          sx={{ p: 2.5, pt: 0 }}
        />
      )}

      <Box sx={{ position: 'relative' }}>
        <TableSelectedAction
          dense={table.dense}
          numSelected={table.selected.length}
          rowCount={dataFiltered.length}
          onSelectAllRows={(checked) =>
            table.onSelectAllRows(
              checked,
              dataFiltered.map((row) => row.id)
            )
          }
        />
        <Scrollbar
        //  sx={{ minHeight: 444 }}
        >
          <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 960 }}>
            <TableHeadCustom
              showCheckbox
              order={table.order}
              orderBy={table.orderBy}
              headLabel={TABLE_HEAD}
              rowCount={dataFiltered.length}
              numSelected={table.selected.length}
              // onSort={table.onSort}
              onSelectAllRows={(checked) =>
                table.onSelectAllRows(
                  checked,
                  dataFiltered.map((row) => row.id)
                )
              }
            />

            <TableBody>
              {dataFiltered
                .slice(
                  table.page * table.rowsPerPage,
                  table.page * table.rowsPerPage + table.rowsPerPage
                )
                .map((row, index) => (
                  <ConnectionsTableRow
                    key={index}
                    row={row}
                    selected={table.selected.includes(row.id)}
                    onSelectRow={() => table.onSelectRow(row.id)}
                    onPopoverOpen={(e) => handlePopoverOpen(e, row.id)}
                    onOpenUpdateConnection={() => onOpenUpdateConnection(row)}
                    handleRequest={() => handleRequest(row)}
                    handleEvent={() => handleEvent(row)}
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

      <TablePaginationCustom
        page={table.page}
        count={dataFiltered.length}
        rowsPerPage={table.rowsPerPage}
        onPageChange={table.onChangePage}
        onChangeDense={table.onChangeDense}
        onRowsPerPageChange={table.onChangeRowsPerPage}
      />
      <CustomPopover
        open={Boolean(checkboxAnchorEl)}
        anchorEl={checkboxAnchorEl}
        onClose={handleCheckboxPopoverClose}
        slotProps={{ arrow: { placement: 'right-top' } }}
      >
        {renderCheckboxPopoverContent()}
      </CustomPopover>

      {/* Ellipsis Menu Popover */}
      <CustomPopover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handlePopoverClose}
        slotProps={{ arrow: { placement: 'right-top' } }}
      >
        {renderEllipsisPopoverContent()}
      </CustomPopover>

      <ConfirmDialog
        open={confirmDelete}
        onClose={handleCloseConfirmDelete}
        title="Do you really want to delete the connection?"
        content={
          table.selected.length > 0
            ? `Connection, once deleted, will be moved to the trash folder. ${table.selected.length} selected connection(s).`
            : 'Connection, once deleted, will be moved to the trash folder.'
        }
        action={
          <Tooltip title="Click here to delete the connection." arrow placement="top">
            <Button
              variant="contained"
              color="error"
              disabled={isLoading}
              onClick={handleConfirmDelete}
            >
              {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Delete'}
            </Button>
          </Tooltip>
        }
      />
      <ConfirmDialog
        open={confirmStatusDialog.open}
        onClose={handleConfirmStatusClose}
        title={confirmStatusDialog.title}
        content={confirmStatusDialog.content}
        action={
          <Tooltip
            title={`Click here to ${confirmStatusDialog.action.toLowerCase()} the connection${
              confirmStatusDialog.isMultiple ? 's.' : ''
            }`}
            arrow
            placement="top"
          >
            <Button variant="contained" color="primary" onClick={handleStatusChange}>
              {confirmStatusDialog.action}
            </Button>
          </Tooltip>
        }
      />
      <MoveToFolderPopover
        open={moveToFolderPopoverOpen}
        onClose={() => setMoveToFolderPopoverOpen(false)}
      />
      <RenameDialog
        open={renameFolderPopoverOpen}
        onClose={() => setRenameFolderPopoverOpen(false)}
      />
    </Card>
  );
}

function applyFilter({ inputData, comparator, filters, dateError }) {
  const { status, name } = filters;

  let filteredData = inputData;

  // Filter by message (name)
  if (name) {
    filteredData = filteredData.filter(
      (order) =>
        (order.connection_name &&
          order.connection_name.toLowerCase().includes(name.toLowerCase())) ||
        (order.folder_name && order.folder_name.toLowerCase().includes(name.toLowerCase()))
    );
  }

  // Filter by status functionality
  if (status !== 'all') {
    filteredData = filteredData.filter((order) => order.status === status);
  }

  // Filter by date range

  return filteredData;
}
