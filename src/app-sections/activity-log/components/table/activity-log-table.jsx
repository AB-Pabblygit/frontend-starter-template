import { useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import { Tooltip, CardHeader, Typography } from '@mui/material';

import { useSetState } from 'src/hooks/use-set-state';

import { ACTIVITY_LOG_STATUS_OPTIONS } from 'src/_mock/_table/_app/_activity_log';

import { Scrollbar } from 'src/components/scrollbar';
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

import { ActivityLogTableRow } from './activity-log-table-row';
import { ActivityLogDrawer } from '../drawer/activity-log-drawer';
import { ActivityLogTableToolbar } from './activity-log-table-toolbar';
import { ActivityLogTableFiltersResult } from './activity-log-table-filters-result';

// ----------------------------------------------------------------------

const STATUS_OPTIONS = [
  {
    value: 'all',
    label: 'All',
    tooltip: 'All shows a combined view of actions across Create, Updated, and Delete events.',
  },
  ...ACTIVITY_LOG_STATUS_OPTIONS,
];
const TABLE_HEAD = [
  {
    id: 'action_date',
    label: 'Action/Date',
    width: '300px',
    whiteSpace: 'nowrap',
    tooltip:
      'Date on which the activity was recorded and status which informs about the specific event that has been performed.',
  },

  {
    id: 'actor',
    label: 'Actor',
    width: '500px',
    whiteSpace: 'nowrap',
    tooltip: 'Name and email address of the user who performed the action.',
  },

  {
    id: 'event_source',
    label: 'Section/Source',
    width: 'flex',
    whiteSpace: 'nowrap',

    tooltip:
      ' View the section where the action occurred and whether it was done by a user or an API.',
  },

  {
    id: 'event_data',
    label: 'Activity Data',
    width: 'flex',
    whiteSpace: 'nowrap',
    align: 'right',
    tooltip: 'View the activity data recorded during the action performed.',
  },
];

const dataOn = [
  {
    id: '1',
    date: 'Oct 23, 2024 17:45:32',
    status: 'created',
    actor_name: 'Hardik Pradhan',
    actor_email: 'hardik.pradhan@pabbly.com',
    event: 'Dashboard',
    source: 'USER',
    event_data: '67764b1fb9e6371d99c28a37',
  },
  {
    id: '2',
    date: 'Oct 23, 2024 17:45:32',
    status: 'deleted',
    actor_name: 'Ankit Mandli',
    actor_email: 'ankit.mandli@pabbly.com',
    event: 'Dashboard',
    source: 'USER',
    event_data: '67764b1fb9e6371d99c28a37',
  },
  {
    id: '3',
    date: 'Oct 23, 2024 17:45:32',
    status: 'created',
    actor_name: 'Nikhil Patel',
    actor_email: 'nikhil.patel@pabbly.com',
    event: 'Dashboard',
    source: 'API',
    event_data: '67764b1fb9e6371d99c28a37',
  },
  {
    id: '4',
    date: 'Oct 23, 2024 17:45:32',
    status: 'updated',
    actor_name: 'Ankit Mandli',
    actor_email: 'ankit.mandli@pabbly.com',
    event: 'Team Member',
    source: 'USER',
    event_data: '67764b1fb9e6371d99c28a37',
  },
  {
    id: '5',
    date: 'Oct 23, 2024 17:45:32',
    status: 'updated',
    actor_name: 'Ankit Mandli',
    actor_email: 'ankit.mandli@pabbly.com',
    event: 'API',
    source: 'USER',
    event_data: '67764b1fb9e6371d99c28a37',
  },
  {
    id: '6',
    date: 'Oct 23, 2024 17:45:32',
    status: 'updated',
    actor_name: 'Ankit Mandli',
    actor_email: 'ankit.mandli@pabbly.com',
    event: 'Time Zone',
    source: 'USER',
    event_data: '67764b1fb9e6371d99c28a37',
  },
];

// ----------------------------------------------------------------------

export function ActivityLogTable() {
  const table = useTable({
    defaultRowsPerPage: 10,
    defaultOrderBy: 'orderNumber',
    defaultSelected: [], // Add this to initialize selected state
  });

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

  const [selectedRowData, setSelectedRowData] = useState(null);
  const [openDrawer, setOpenDrawer] = useState(false);

  const handleOpenDrawer = (rowData) => {
    setSelectedRowData(rowData);
    setOpenDrawer(true);
  };

  const handleCloseDrawer = () => {
    setOpenDrawer(false);
    setSelectedRowData(null);
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
                  title="View all the activity logs here."
                >
                  <span>Activity Log</span>
                </Tooltip>
              </Typography>
              <Typography sx={{'[data-mui-color-scheme="light"] &': { color: '#637381' },
'[data-mui-color-scheme="dark"] &': { color: 'var(--palette-text-secondary)' }, mt: '4px' }} variant="body2">
                Track all activities in your Pabbly Email Verification, including user actions and API
                requests. Monitor created, updated, and deleted actions to ensure transparency and
                security.
              </Typography>
            </Box>
            <Box display="inline-block">
              <ActivityLogTableToolbar
                filters={filters}
                onResetPage={table.onResetPage}
                numSelected={table.selected.length}
                // Updated to use handlePopoverOpen
              />
            </Box>
          </Box>
        }
        sx={{ pb: 3 }}
      />

      {canReset && (
        <ActivityLogTableFiltersResult
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
              showCheckbox={false}
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
                  <ActivityLogTableRow
                    key={index}
                    row={row}
                    selected={table.selected.includes(row.id)}
                    onSelectRow={() => table.onSelectRow(row.id)}
                    onOpenDrawer={() => handleOpenDrawer(row)}
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
      <ActivityLogDrawer open={openDrawer} onClose={handleCloseDrawer} rowData={selectedRowData} />
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
        (order.actor_name && order.actor_name.toLowerCase().includes(name.toLowerCase())) ||
        (order.actor_email && order.actor_email.toLowerCase().includes(name.toLowerCase())) ||
        (order.event && order.event.toLowerCase().includes(name.toLowerCase())) ||
        (order.event_data && order.event_data.toLowerCase().includes(name.toLowerCase()))
    );
  }

  // Filter by status
  if (status !== 'all') {
    filteredData = filteredData.filter((order) => order.status === status);
  }

  // Filter by date range

  return filteredData;
}
