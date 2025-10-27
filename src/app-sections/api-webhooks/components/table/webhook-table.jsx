import { toast } from 'sonner';
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
} from '@mui/material';

import { useBoolean } from 'src/hooks/use-boolean';
import { useSetState } from 'src/hooks/use-set-state';

import { varAlpha } from 'src/theme/styles';
import { WEBHOOKS_STATUS_OPTIONS } from 'src/_mock/_table/_app/_webhooks';

import { Label } from 'src/components/label';
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
  TableSelectedAction,
  TablePaginationCustom,
} from 'src/components/table';

import { WebhookTableRow } from './webhook-table-row';
import { WebhookDialog } from '../dialogs/add-webhook';
import { WebhookTableToolbar } from './webhook-table-toolbar';
import { WebhookTableFiltersResult } from './webhook-table-filters-result';
// ----------------------------------------------------------------------

const STATUS_OPTIONS = [
  { value: 'all', label: 'All', tooltip: 'All uploaded lists.' },
  ...WEBHOOKS_STATUS_OPTIONS,
];
const TABLE_HEAD = [
  { id: 'sno', label: 'S.No', width: 'flex', whiteSpace: 'nowrap', tooltip: 'Serial Number' },
  {
    id: 'status_date',
    label: 'Status/Name/Event',
    width: 'flex',
    whiteSpace: 'nowrap',
    tooltip: 'Status, Webhook Name & Event.',
  },

  {
    id: 'webhook_url',
    label: 'Webhook URL',
    width: 'flex',
    whiteSpace: 'nowrap',
    tooltip: 'Webhook URL',
  },

  {
    id: 'action',
    label: 'Action',
    width: 'flex',
    whiteSpace: 'nowrap',
    align: 'right',
    tooltip: 'Current state of the Webhook.',
  },

  { id: '', width: 10 },
];

const dataOn = [
  {
    id: '1',
    webhookEvent: 'New Message Recieved',
    status: 'active',
    name: 'Webhook ssName',
    webhookUrl: 'http://54.186.67.24/workflow/sendwebhookdata/Ijsfsrgdtgmsg;msrgmsedm:ESAm:AEfm',
  },
  {
    id: '2',
    webhookEvent: 'New Message Recieved',
    status: 'inactive',
    name: 'Webhook Name',
    webhookUrl: 'https://chatflow.pabbly.com/65e80c31e88b/5b654444',
  },
  {
    id: '3',
    webhookEvent: 'New Message Recieved',
    status: 'inactive',
    name: 'Webhook Name',
    webhookUrl: 'https://chatflow.pabbly.com/65e80c31e88b/5b654444',
  },
  {
    id: '4',

    webhookEvent: 'New Message Recieved',
    status: 'inactive',
    name: 'Webhook Name',
    webhookUrl: 'https://chatflow.pabbly.com/65e80c31e88b/5b654444',
    wabaID: '117359445455733',
  },
  {
    id: '5',
    webhookEvent: 'New Message Recieved',
    status: 'inactive',
    name: 'Webhook Name',
    webhookUrl: 'https://chatflow.pabbly.com/65e80c31e88b/5b654444',
  },
];

// ----------------------------------------------------------------------

export function WebhookTable() {
  const table = useTable({
    defaultOrderBy: 'orderNumber',
    defaultSelected: [], // Add this to initialize selected state
  });

  const [webhookToEdit, setWebhookToEdit] = useState(null);
  const [tableData, setTableData] = useState(dataOn);

  const filters = useSetState({
    name: '',
    status: 'all',
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
  const [selectedRowId, setSelectedRowId] = useState(null);

  const handlePopoverOpen = (event, rowId) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
    setSelectedRowId(rowId);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
    setSelectedRowId(null);
  };
  const [setSelectActionAnchorEl] = useState(null);
  const [moveToFolderPopoverOpen, setMoveToFolderPopoverOpen] = useState(false);

  const handleSelectActionClose = () => {
    setSelectActionAnchorEl(null);
  };

  const handleMoveToFolder = () => {
    setMoveToFolderPopoverOpen(true);
    handleSelectActionClose();
  };

  const handleDeleteSelected = () => {
    confirmDelete.onTrue();
    handleSelectActionClose();
  };

  const dialog = useBoolean();

  const handleEditWebhook = useCallback((row) => {
    setWebhookToEdit(row);
    dialog.onTrue();
  }, [dialog]);

  const [confirmDelete, setConfirmDelete] = useState(false);
  const confirmStatus = useBoolean();
  const selectedRow = tableData.find((row) => row.id === selectedRowId);
  const [confirmStatusDialog, setConfirmStatusDialog] = useState({
    open: false,
    title: '',
    content: '',
    action: '',
    status: '',
  });

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
        title: `Deactivate WhatsApp Number${isMultiple ? 's' : ''}`,
        content: `Are you sure you want to set ${isMultiple ? 'these' : 'this'} WhatsApp number${isMultiple ? 's' : ''} as Inactive?`,
        action: 'Deactivate',
        status: 'inactive',
        isMultiple,
      });
    } else {
      setConfirmStatusDialog({
        open: true,
        title: `Activate WhatsApp Number${isMultiple ? 's' : ''}`,
        content: `Are you sure you want to set ${isMultiple ? 'these' : 'this'} WhatsApp number${isMultiple ? 's' : ''} as Active?`,
        action: 'Activate',
        status: 'active',
        isMultiple,
      });
    }
  };
  const handleCloseConfirmDelete = () => {
    setConfirmDelete(false);
  };
  const handleOpenConfirmDelete = () => {
    setConfirmDelete(true);
    handlePopoverClose();
  };

  const handleStatusChange = () => {
    if (confirmStatusDialog.isMultiple) {
      // Handle bulk status change
      setTableData((prevData) =>
        prevData.map((row) =>
          table.selected.includes(row.id) ? { ...row, status: confirmStatusDialog.status } : row
        )
      );
      // Clear selection after bulk update
      table.onSelectAllRows(false);
    } else if (selectedRowId) {
      // Handle single status change
      setTableData((prevData) =>
        prevData.map((row) =>
          row.id === selectedRowId ? { ...row, status: confirmStatusDialog.status } : row
        )
      );
    }
    handleConfirmStatusClose();
    handleSelectActionClose();
  };

  const renderPopoverContent = () => {
    // This check is to prevent errors when no row is selected
    if (!selectedRow) {
      return null;
    }
    const isInactive = selectedRow.status === 'inactive';
    const isActive = selectedRow.status === 'active';

    return (
      <MenuList>
        <Tooltip
          title={`Click to ${isActive ? 'inactivate' : 'activate'} this Webhook`}
          arrow
          placement="left"
        >
          <MenuItem
            onClick={() => {
              handleConfirmStatusOpen(isActive ? 'active' : 'inactive');
              handlePopoverClose();
            }}
          >
            <Iconify icon={isActive ? 'ph:toggle-right-fill' : 'ph:toggle-left-fill'} />
            {isActive ? 'Deactivate' : 'Activate'}
          </MenuItem>
        </Tooltip>

        <Tooltip title="Edit this Webhook." arrow placement="left">
          <MenuItem
            onClick={() => {
              handleEditWebhook(selectedRow);
              handlePopoverClose();
            }}
          >
            <Iconify icon="solar:pen-bold" />
            Edit Webhook
          </MenuItem>
        </Tooltip>

        <Divider style={{ borderStyle: 'dashed' }} />

        <Tooltip title="Delete this Webhook" arrow placement="left">
          <MenuItem sx={{ color: 'error.main' }} onClick={handleOpenConfirmDelete}>
            <Iconify icon="solar:trash-bin-trash-bold" />
            Delete
          </MenuItem>
        </Tooltip>
      </MenuList>
    );
  };
  return (
    <Card sx={{mt:3}}>
      <CardHeader
        title={
          <Box display="inline-block">
            <Tooltip
              arrow
              placement="top"
              disableInteractive
              title="View and manage all the users here."
            >
              <Typography variant="h6">Webhooks</Typography>
            </Tooltip>
          </Box>
        }
        
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
      <WebhookTableToolbar
        filters={filters}
        onResetPage={table.onResetPage}
        numSelected={table.selected.length}
        onSelectActionOpen={handlePopoverOpen} // Updated to use handlePopoverOpen
      />

      {canReset && (
        <WebhookTableFiltersResult
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
                  <WebhookTableRow
                    key={index}
                    row={row}
                    sno={index + 1}
                    selected={table.selected.includes(row.id)}
                    onSelectRow={() => table.onSelectRow(row.id)}
                    onEditRow={() => handleEditWebhook(row)}
                    onDeleteRow={handleOpenConfirmDelete}
                    onStatusChange={() => handleConfirmStatusOpen(row.status)}
                    onPopoverOpen={(event) => handlePopoverOpen(event, row.id)}
                  />
                ))}

              <TableEmptyRows
                height={table.dense ? 56 : 56 + 20}
                emptyRows={emptyRows(table.page, table.rowsPerPage, dataOn.length)}
              />
              {tableData.length === 0 ? (
                <TableNoData
                  title="Not Data Found"
                  description="No data found in the table"
                  notFound={notFound}
                />
              ) : (
                <TableNoData
                  title="Not Search Found"
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
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handlePopoverClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        {renderPopoverContent()}
      </CustomPopover>

      <ConfirmDialog
        open={confirmStatusDialog.open}
        onClose={handleConfirmStatusClose}
        title={confirmStatusDialog.title}
        content={confirmStatusDialog.content}
        action={
          <Tooltip
            title={`Click here to ${confirmStatusDialog.action.toLowerCase()} the WhatsApp number${confirmStatusDialog.isMultiple ? 's' : ''}`}
            arrow
            placement="top"
          >
            <Button variant="contained" color="primary" onClick={handleStatusChange}>
              {confirmStatusDialog.action}
            </Button>
          </Tooltip>
        }
      />
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
      <ConfirmDialog
        open={confirmStatus.value}
        onClose={confirmStatus.onFalse}
        title="Delete Status"
        content="Are you sure you want to delete this WhatsApp number?"
        action={
          <Tooltip title="Click here to delete the whatsapp number" arrow placement="top">
            <Button variant="contained" color="error">
              Delete
            </Button>
          </Tooltip>
        }
      />
      {/* <MoveToFolderPopover
        open={moveToFolderPopoverOpen}
        onClose={() => setMoveToFolderPopoverOpen(false)}
      /> */}
      <WebhookDialog
        open={dialog.value}
        onClose={() => {
          dialog.onFalse();
          setWebhookToEdit(null);
        }}
        webhookToEdit={webhookToEdit}
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
        order.name && order.name.toLowerCase().includes(name.toLowerCase())
    );
  }

  // Filter by status
  if (status !== 'all') {
    filteredData = filteredData.filter((order) => order.status === status);
  }

  // Filter by date range

  return filteredData;
}
