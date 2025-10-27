import { toast } from 'sonner';
import { useNavigate } from 'react-router';
import { useState, useCallback } from 'react';

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
  CircularProgress,
} from '@mui/material';

import { useSetState } from 'src/hooks/use-set-state';

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

import { TeamMemberTableRow } from './team-member-table-row';
import { TeamMemberDialog } from '../../hooks/add-team-member';
import { TeamMemberTableToolbar } from './team-member-table-toolbar';
import { TeamMemberTableFiltersResult } from './team-member-table-filters-result';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'sno', label: 'S.No', width: 'flex', whiteSpace: 'nowrap', tooltip: 'Serial Number' },
  {
    id: 'shared_on',
    label: 'Shared On',
    width: '200px',
    whiteSpace: 'nowrap',
    tooltip: 'View connections status and date of creation.',
  },
  {
    id: 'team_member_email',
    label: 'Team Member Email',
    width: '200px',
    whiteSpace: 'nowrap',
    tooltip: 'Name of connections and folder where it is located.',
  },
  {
    id: 'business_shared',
    label: 'Business Shared',
    width: '600px',
    whiteSpace: 'nowrap',
    tooltip: 'Business shared with the team member.',
  },
  {
    id: 'permission_type',
    label: 'Permission Type',
    width: 'flex',
    whiteSpace: 'nowrap',
    align: 'right',
    tooltip: 'View the permission type of the team member.',
  },
  { id: '', width: 10 },
];

const dataOn = [
  {
    id: '1',
    shared_date: 'Oct 23, 2024 17:45:32',
    email: 'test@test.com',
    business_shared: 'Pixel & CO',
    permission_type: 'Read Only Access',
  },
  
];

// ----------------------------------------------------------------------

export function TeamMemberTable() {
  const navigate = useNavigate();
  const table = useTable({
    defaultRowsPerPage: 10,
    defaultOrderBy: 'orderNumber',
    defaultSelected: [],
  });

  const [tableData, setTableData] = useState(dataOn);
  const [isLoading, setIsLoading] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [checkboxAnchorEl, setCheckboxAnchorEl] = useState(null);
  const [selectedRowId, setSelectedRowId] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [openTeamMemberDialog, setOpenTeamMemberDialog] = useState(false);
  const [currentMember, setCurrentMember] = useState(null);

  const filters = useSetState({
    name: '',
    status: 'all',
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

  const onOpenUpdateConnection = (row) => {
    navigate('/app/update-connection', {
      state: {
        currentConnection: row.connection_name,
        folderName: row.folder_name,
      },
    });
  };

  const handleEvent = () => {
    navigate('/app/events');
  };

  const handleRequest = () => {
    navigate('/app/requests');
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

  const handleOpenTeamMemberDialog = () => {
    // Get the selected row data for update
    const selectedRowData = selectedRowId
      ? tableData.find((row) => row.id === selectedRowId)
      : table.selected.length > 0
        ? tableData.find((row) => row.id === table.selected[0])
        : null;

    if (selectedRowData) {
      // Transform the row data to match the expected format for the dialog
      const memberData = {
        email: selectedRowData.email,
        permission: selectedRowData.permission_type,
        folders_you_shared: selectedRowData.business_shared,
      };
      setCurrentMember(memberData);
    }

    setOpenTeamMemberDialog(true);
    handlePopoverClose();
    handleCheckboxPopoverClose();
  };

  const handleCloseTeamMemberDialog = () => {
    setOpenTeamMemberDialog(false);
    setCurrentMember(null);
  };

  const handleOpenConfirmDelete = () => {
    setConfirmDelete(true);
    handlePopoverClose();
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

    return (
      <MenuList>
        <Tooltip title="Update access to shared folder." arrow placement="left" disableInteractive>
          <MenuItem onClick={handleOpenTeamMemberDialog}>
            <Iconify icon="solar:pen-bold" />
            Update Access
          </MenuItem>
        </Tooltip>
        <Divider style={{ borderStyle: 'dashed' }} />
        <Tooltip title="Remove access to shared folder." arrow placement="left" disableInteractive>
          <MenuItem onClick={handleOpenConfirmDelete} sx={{ color: 'error.main' }}>
            <Iconify icon="solar:trash-bin-trash-bold" />
            Remove Access
          </MenuItem>
        </Tooltip>
      </MenuList>
    );
  };

  // Render ellipsis menu content
  const renderEllipsisPopoverContent = () => {
    if (!selectedRow) return null;

    return (
      <MenuList>
        <Tooltip title="Update access to shared folder." arrow placement="left" disableInteractive>
          <MenuItem onClick={handleOpenTeamMemberDialog}>
            <Iconify icon="solar:pen-bold" />
            Update Access
          </MenuItem>
        </Tooltip>
        <Divider style={{ borderStyle: 'dashed' }} />
        <Tooltip title="Remove access to shared folder." arrow placement="left" disableInteractive>
          <MenuItem onClick={handleOpenConfirmDelete} sx={{ color: 'error.main' }}>
            <Iconify icon="solar:trash-bin-trash-bold" />
            Remove Access
          </MenuItem>
        </Tooltip>
      </MenuList>
    );
  };

  return (
    <Card
      sx={{
        mt: 3,
      }}
    >
      <CardHeader
        title={
          <Box display="inline-block">
            <Tooltip arrow placement="top" disableInteractive title="Folder Name: Home">
              <Typography variant="h6">Team Members</Typography>
            </Tooltip>
          </Box>
        }
        subheader="View and manage team members with assigned permissions. Add new members, filter access, and update roles efficiently."
        sx={{ pb: 3 }}
      />
      <Divider />

      <TeamMemberTableToolbar
        filters={filters}
        onResetPage={table.onResetPage}
        numSelected={table.selected.length}
        onSelectActionOpen={handleToolbarSelectAction}
      />

      {canReset && (
        <TeamMemberTableFiltersResult
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
        <Scrollbar>
          <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 960 }}>
            <TableHeadCustom
              showCheckbox
              order={table.order}
              orderBy={table.orderBy}
              headLabel={TABLE_HEAD}
              rowCount={dataFiltered.length}
              numSelected={table.selected.length}
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
                  <TeamMemberTableRow
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

      <CustomPopover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handlePopoverClose}
        slotProps={{ arrow: { placement: 'right-top' } }}
      >
        {renderEllipsisPopoverContent()}
      </CustomPopover>

      <TeamMemberDialog
        open={openTeamMemberDialog}
        onClose={handleCloseTeamMemberDialog}
        currentMember={currentMember}
      />

      <ConfirmDialog
        open={confirmDelete}
        onClose={handleCloseConfirmDelete}
        disabled={isLoading}
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
            {isLoading ? <CircularProgress size={24} /> : 'Remove Access'}
          </Button>
        }
      />
    </Card>
  );
}

function applyFilter({ inputData, comparator, filters, dateError }) {
  const { status, name } = filters;

  let filteredData = inputData;

  // Filter by search term (name)
  if (name) {
    filteredData = filteredData.filter(
      (item) =>
        // Search in email field
        (item.email && item.email.toLowerCase().includes(name.toLowerCase())) ||
        // Search in business_shared field
        (item.business_shared && item.business_shared.toLowerCase().includes(name.toLowerCase())) ||
        // Search in permission_type field
        (item.permission_type && item.permission_type.toLowerCase().includes(name.toLowerCase()))
    );
  }

  // Filter by status functionality (if you implement status filtering later)
  if (status !== 'all') {
    filteredData = filteredData.filter((item) => item.status === status);
  }

  // Sort the data using the comparator
  filteredData.sort(comparator);

  return filteredData;
}