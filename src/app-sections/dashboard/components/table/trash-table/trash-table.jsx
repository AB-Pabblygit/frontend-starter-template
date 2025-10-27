import { toast } from 'sonner';
import { useState } from 'react';
import { useNavigate } from 'react-router';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import {
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

import { CONNECTION_STATUS_OPTIONS } from 'src/_mock/_table/_app/_connection';

import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { CustomPopover } from 'src/components/custom-popover';
import { ConfirmDialog } from 'src/components/confirm-dialog';
import { TablePaginationCustom } from 'src/components/table/table-pagination-custom';
import {
  useTable,
  rowInPage,
  emptyRows,
  TableNoData,
  getComparator,
  TableEmptyRows,
  TableHeadCustom,
  TableSelectedAction,

} from 'src/components/table';

import { TrashTableRow } from './trash-table-row';
import { TrashTableToolbar } from './trash-table-toolbar';
import { MoveToFolderPopover } from '../../dialogs/move-folder-dailog';

// ----------------------------------------------------------------------

const STATUS_OPTIONS = [
  { value: 'all', label: 'All', tooltip: 'View connections inactive.' },
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
    tooltip: 'View the number of incoming requests and processed events for each connection.',
  },

  { id: '', width: 10 },
];

const initialData = [
  {
    id: '1',
    date: 'Oct 23, 2024 17:45:32',
    status: 'inactive',
    connection_name: 'Test Connection',
    folder_name: 'Home',
    no_of_requests: '2',
    no_of_events: '2',
  },
];

export function TrashTable() {
  const table = useTable({ defaultOrderBy: 'orderNumber', defaultSelected: [], defaultRowsPerPage: 10 });
  const [tableData, setTableData] = useState(initialData);
  const filters = useSetState({ name: '', status: 'all' });
  const navigate = useNavigate();

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(table.order, table.orderBy),
    filters: filters.state,
  });

  const dataInPage = rowInPage(dataFiltered, table.page, table.rowsPerPage);
  const notFound = !dataFiltered.length;

  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedRowId, setSelectedRowId] = useState(null);

  const confirmDelete = useBoolean();
  const [moveToFolderPopoverOpen, setMoveToFolderPopoverOpen] = useState(false);
  const FolderOptions = [
    { value: '1', label: 'None' },
    { value: '2', label: 'Company B' },
    { value: '3', label: 'WhatsApp Database' },
  ];
  const [formData, setFormData] = useState({
    connectionName: '',
    folderList: '',
  });
  const getFolderName = (value) => {
    const selectedFolder = FolderOptions.find((option) => option.value === value);
    return selectedFolder ? selectedFolder.label : '';
  };
  const handleEvent = () => {
    // toast.success('Connection Created successfully.');
    navigate('/app/events', {
      state: {
        connectionName: formData.connectionName,
        folderName: getFolderName(formData.folderList),
      },
    });
    // Close dialog and reset form

    // setFormData({ connectionName: '', folderList: '' });
    // setFormErrors({ connectionName: false, folderList: false });
  };
  const handleRequest = () => {
    // toast.success('Connection Created successfully.');
    navigate('/app/requests', {
      state: {
        connectionName: formData.connectionName,
        folderName: getFolderName(formData.folderList),
      },
    });
    // Close dialog and reset form

    // setFormData({ connectionName: '', folderList: '' });
    // setFormErrors({ connectionName: false, folderList: false });
  };
  const handlePopoverOpen = (event, rowId) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
    setSelectedRowId(rowId);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
    setSelectedRowId(null);
  };

  const handleMoveToFolder = () => {
    setMoveToFolderPopoverOpen(true);
    handlePopoverClose();
  };

  const handleDeleteSelected = () => {
    confirmDelete.onTrue(); // Open confirmation dialog
  };

  const handleConfirmDelete = () => {
    setTableData((prevData) =>
      prevData.filter((row) =>
        selectedRowId ? row.id !== selectedRowId : !table.selected.includes(row.id)
      )
    );

    table.onSelectAllRows(false); // Clear selection
    confirmDelete.onFalse(); // Close confirmation dialog
    handlePopoverClose(); // Close menu
    toast.success('Connection(s) permanently deleted successfully.');
  };

  const renderPopoverContent = () => {
    if (!selectedRowId && table.selected.length === 0) return null;

    return (
      <MenuList>
        <Tooltip title="Move selected connections to folder" arrow placement="left">
          <MenuItem onClick={handleMoveToFolder}>
            <Iconify icon="fluent:folder-move-16-filled" />
            Move to Folder
          </MenuItem>
        </Tooltip>

        <Divider style={{ borderStyle: 'dashed' }} />

        <Tooltip title="Delete Connection" arrow placement="left">
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
          <Tooltip title="Folder Name: Trash" placement="top" arrow disableInteractive>
            <Typography variant="h6">Trash</Typography>
          </Tooltip>
          </Box>
        }
        subheader="Deleted connections can be restored or permanently deleted from the trash folder."
        sx={{ pb: 3 }}
      />
      <Divider />

      <TrashTableToolbar
        filters={filters}
        onResetPage={table.onResetPage}
        numSelected={table.selected.length}
        onSelectActionOpen={handlePopoverOpen}
      />

      {notFound && <TableNoData title="No Data Found" />}

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
        <Scrollbar>
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
              {dataInPage.map((row) => (
                <TrashTableRow
                  key={row.id}
                  row={row}
                  selected={table.selected.includes(row.id)}
                  onSelectRow={() => table.onSelectRow(row.id)}
                  onPopoverOpen={(e) => handlePopoverOpen(e, row.id)}
                  handleRequest={() => handleRequest(row)}
                  handleEvent={() => handleEvent(row)}
                />
              ))}

              <TableEmptyRows
                height={56}
                emptyRows={emptyRows(table.page, table.rowsPerPage, dataFiltered.length)}
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

      <CustomPopover open={Boolean(anchorEl)} anchorEl={anchorEl} onClose={handlePopoverClose}>
        {renderPopoverContent()}
      </CustomPopover>

      <ConfirmDialog
        open={confirmDelete.value}
        onClose={confirmDelete.onFalse}
        title="Do you want to permanently delete the connection?"
        content="An connection once deleted cannot be restored in any case."
        action={
          <Tooltip
            title="Click here to delete permanently the connection"
            placement="top"
            arrow
            disableInteractive
          >
            <Button variant="contained" color="error" onClick={handleConfirmDelete}>
              Delete Permantly
            </Button>
          </Tooltip>
        }
      />

      <MoveToFolderPopover
        open={moveToFolderPopoverOpen}
        onClose={() => setMoveToFolderPopoverOpen(false)}
      />
    </Card>
  );
}

function applyFilter({ inputData, comparator, filters }) {
  let filteredData = inputData;
  if (filters.name)
    filteredData = filteredData.filter((row) =>
      row.connection_name.toLowerCase().includes(filters.name.toLowerCase())
    );
  if (filters.status !== 'all')
    filteredData = filteredData.filter((row) => row.status === filters.status);
  return filteredData;
}
