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

const dataOn = [
  {
    id: '1',
    date: 'Oct 23, 2024 17:45:32',
    status: 'active',
    connection_name: 'Pabbly Connect Connection',
    folder_name: 'Home',
    no_of_requests: '2',
    no_of_events: '2',
  },
  {
    id: '2',
    date: 'Oct 24, 2024 17:45:32',
    status: 'inactive',
    connection_name: 'Google form to google sheet connection',
    folder_name: 'Home',
    no_of_requests: '1',
    no_of_events: '2',
  },
  {
    id: '3',
    date: 'Oct 25, 2024 10:15:00',
    status: 'active',
    connection_name: 'Slack to Notion Sync',
    folder_name: 'Company B',
    no_of_requests: '5',
    no_of_events: '3',
  },
  {
    id: '4',
    date: 'Oct 26, 2024 09:30:12',
    status: 'inactive',
    connection_name: 'Airtable Backup',
    folder_name: 'WhatsApp Database',
    no_of_requests: '0',
    no_of_events: '0',
  },
  {
    id: '5',
    date: 'Oct 27, 2024 14:22:45',
    status: 'active',
    connection_name: 'Shopify Order Sync',
    folder_name: 'Company B',
    no_of_requests: '8',
    no_of_events: '7',
  },
  {
    id: '6',
    date: 'Oct 28, 2024 11:05:33',
    status: 'inactive',
    connection_name: 'Mailchimp Campaign Trigger',
    folder_name: 'Home',
    no_of_requests: '2',
    no_of_events: '1',
  },
  {
    id: '7',
    date: 'Oct 29, 2024 16:40:10',
    status: 'active',
    connection_name: 'Trello Card Automation',
    folder_name: 'Company B',
    no_of_requests: '4',
    no_of_events: '4',
  },
  {
    id: '8',
    date: 'Oct 30, 2024 13:55:21',
    status: 'inactive',
    connection_name: 'Jira Issue Reporter',
    folder_name: 'WhatsApp Database',
    no_of_requests: '1',
    no_of_events: '0',
  },
  {
    id: '9',
    date: 'Oct 31, 2024 08:12:00',
    status: 'active',
    connection_name: 'Zendesk Ticket Sync',
    folder_name: 'Home',
    no_of_requests: '3',
    no_of_events: '2',
  },
  {
    id: '10',
    date: 'Nov 01, 2024 12:00:00',
    status: 'inactive',
    connection_name: 'Google Calendar Events',
    folder_name: 'Company B',
    no_of_requests: '0',
    no_of_events: '0',
  },
  {
    id: '11',
    date: 'Nov 02, 2024 15:30:00',
    status: 'active',
    connection_name: 'HubSpot Lead Capture',
    folder_name: 'WhatsApp Database',
    no_of_requests: '6',
    no_of_events: '5',
  },
  {
    id: '12',
    date: 'Nov 03, 2024 17:45:00',
    status: 'inactive',
    connection_name: 'Asana Task Creator',
    folder_name: 'Home',
    no_of_requests: '2',
    no_of_events: '2',
  },
  {
    id: '13',
    date: 'Nov 04, 2024 09:10:00',
    status: 'active',
    connection_name: 'Dropbox File Uploader',
    folder_name: 'Company B',
    no_of_requests: '7',
    no_of_events: '6',
  },
  {
    id: '14',
    date: 'Nov 05, 2024 11:20:00',
    status: 'inactive',
    connection_name: 'OneDrive Sync',
    folder_name: 'WhatsApp Database',
    no_of_requests: '1',
    no_of_events: '1',
  },
  {
    id: '15',
    date: 'Nov 06, 2024 13:35:00',
    status: 'active',
    connection_name: 'QuickBooks Invoice',
    folder_name: 'Home',
    no_of_requests: '3',
    no_of_events: '3',
  },
  {
    id: '16',
    date: 'Nov 07, 2024 10:00:00',
    status: 'inactive',
    connection_name: 'Stripe Payment Sync',
    folder_name: 'Company B',
    no_of_requests: '0',
    no_of_events: '0',
  },
  {
    id: '17',
    date: 'Nov 08, 2024 14:45:00',
    status: 'active',
    connection_name: 'Twilio SMS Forwarder',
    folder_name: 'WhatsApp Database',
    no_of_requests: '5',
    no_of_events: '4',
  },
  {
    id: '18',
    date: 'Nov 09, 2024 16:30:00',
    status: 'inactive',
    connection_name: 'Intercom Chat Sync',
    folder_name: 'Home',
    no_of_requests: '2',
    no_of_events: '1',
  },
  {
    id: '19',
    date: 'Nov 10, 2024 09:50:00',
    status: 'active',
    connection_name: 'Freshdesk Ticket Import',
    folder_name: 'Company B',
    no_of_requests: '4',
    no_of_events: '4',
  },
  {
    id: '20',
    date: 'Nov 11, 2024 12:15:00',
    status: 'inactive',
    connection_name: 'Basecamp Project Sync',
    folder_name: 'WhatsApp Database',
    no_of_requests: '1',
    no_of_events: '0',
  },
  {
    id: '21',
    date: 'Nov 12, 2024 15:00:00',
    status: 'active',
    connection_name: 'Monday.com Board Sync',
    folder_name: 'Home',
    no_of_requests: '6',
    no_of_events: '5',
  },
  {
    id: '22',
    date: 'Nov 13, 2024 17:30:00',
    status: 'inactive',
    connection_name: 'Salesforce Lead Import',
    folder_name: 'Company B',
    no_of_requests: '0',
    no_of_events: '0',
  },
  {
    id: '23',
    date: 'Nov 14, 2024 10:10:00',
    status: 'active',
    connection_name: 'Zoho CRM Sync',
    folder_name: 'WhatsApp Database',
    no_of_requests: '3',
    no_of_events: '2',
  },
  {
    id: '24',
    date: 'Nov 15, 2024 13:20:00',
    status: 'inactive',
    connection_name: 'Typeform Response Collector',
    folder_name: 'Home',
    no_of_requests: '2',
    no_of_events: '2',
  },
  {
    id: '25',
    date: 'Nov 16, 2024 11:40:00',
    status: 'active',
    connection_name: 'SurveyMonkey Sync',
    folder_name: 'Company B',
    no_of_requests: '7',
    no_of_events: '6',
  },
  {
    id: '26',
    date: 'Nov 17, 2024 14:55:00',
    status: 'inactive',
    connection_name: 'Calendly Event Import',
    folder_name: 'WhatsApp Database',
    no_of_requests: '1',
    no_of_events: '1',
  },
  {
    id: '27',
    date: 'Nov 18, 2024 09:25:00',
    status: 'active',
    connection_name: 'Eventbrite Attendee Sync',
    folder_name: 'Home',
    no_of_requests: '4',
    no_of_events: '4',
  },
  {
    id: '28',
    date: 'Nov 19, 2024 12:35:00',
    status: 'inactive',
    connection_name: 'Google Contacts Import',
    folder_name: 'Company B',
    no_of_requests: '0',
    no_of_events: '0',
  },
  {
    id: '29',
    date: 'Nov 20, 2024 15:50:00',
    status: 'active',
    connection_name: 'Facebook Lead Ads Sync',
    folder_name: 'WhatsApp Database',
    no_of_requests: '5',
    no_of_events: '5',
  },
  {
    id: '30',
    date: 'Nov 21, 2024 17:10:00',
    status: 'inactive',
    connection_name: 'Instagram DM Collector',
    folder_name: 'Home',
    no_of_requests: '2',
    no_of_events: '1',
  },
  {
    id: '31',
    date: 'Nov 22, 2024 10:05:00',
    status: 'active',
    connection_name: 'LinkedIn Lead Sync',
    folder_name: 'Company B',
    no_of_requests: '6',
    no_of_events: '6',
  },
  {
    id: '32',
    date: 'Nov 23, 2024 13:15:00',
    status: 'inactive',
    connection_name: 'Pinterest Pin Import',
    folder_name: 'WhatsApp Database',
    no_of_requests: '1',
    no_of_events: '0',
  },
  
  {
    id: '33',
    date: 'Nov 24, 2024 09:30:00',
    status: 'active',
    connection_name: 'Slack Notification Bot',
    folder_name: 'Company B',
    no_of_requests: '3',
    no_of_events: '3',
  },
  {
    id: '34',
    date: 'Nov 25, 2024 11:45:00',
    status: 'inactive',
    connection_name: 'Trello Card Sync',
    folder_name: 'Home',
    no_of_requests: '0',
    no_of_events: '0',
  },
];

// ----------------------------------------------------------------------

export function ConnectionsTable() {
  const navigate = useNavigate();
  const table = useTable({
    defaultRowsPerPage: 10,
    defaultOrderBy: 'orderNumber',
    defaultSelected: [],
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


  // const onOpenUpdateConnection = () => {
  //   navigate('/app/update-connection', {
  //     state: {
  //       connectionName: formData.connectionName,
  //       folderName: getFolderName(formData.folderList),
  //     },
  //   });
  // };
  const onOpenUpdateConnection = (row) => {
    navigate('/app/update-connection', {
      state: {
        // connectionNames: [],
        currentConnection: row.connection_name, // Also send the selected connection
        folderName: row.folder_name,
      },
    });
  };
  // const onOpenUpdateConnection = (row) => {
  //   const path = row.connection_name === 'test 2' 
  //     ? '/app/update-connection-copy' 
  //     : '/app/update-connection';
  
  //   navigate(path, {
  //     state: {
  //       connectionName: row.connection_name,
  //       folderName: row.folder_name,
  //     },
  //   });
  // };

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
      <MenuList sx={{width:180}}>
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
              <Typography variant="h6">Home</Typography>
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
