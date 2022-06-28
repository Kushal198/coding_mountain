/* eslint-disable  */
import React from 'react';
import {
  useTable,
  usePagination,
  Column,
  useSortBy,
  useFilters,
  Cell,
  TableOptions,
} from 'react-table';
import PropTypes from 'prop-types';
// import DatatablePagination from 'components/DatatablePagination';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Pagination,
} from '@mui/material';

export function CryptoTable({
  columns,
  data,
  defaultPageSize = 50,
  // searchKeyword,
}) {
  const {
    getTableProps,
    getTableBodyProps,
    prepareRow,
    setFilter,
    headerGroups,
    page,
    canPreviousPage,
    canNextPage,
    pageCount,
    gotoPage,
    setPageSize,
    state: { pageIndex, pageSize },
  } = useTable(
    {
      columns,
      data,
      initialState: {
        pageIndex: 0,
        sortBy: [
          {
            id: 'rank',
            asc: false,
          },
        ],
        pageSize: defaultPageSize,
      },
    },
    useFilters,
    useSortBy,
    usePagination
  );
  // React.useEffect(() => {
  //   // setFilter('price', searchKeyword); // Update the show.name filter. Now our table will filter and show only the rows which have a matching value
  // }, [searchKeyword]);

  // rendering the UI of table
  return (
    <>
      <TableContainer component={Paper} sx={{ my: 4 }}>
        <br />
        <Table {...getTableProps()}>
          <TableHead>
            {headerGroups.map((headerGroup) => (
              <TableRow {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column, columnIndex) => (
                  <TableCell
                    key={`th_${columnIndex}`}
                    {...column.getHeaderProps(column.getSortByToggleProps())}
                    className={
                      column.isSorted
                        ? column.isSortedDesc
                          ? 'sorted-desc'
                          : 'sorted-asc'
                        : ''
                    }
                    sx={{
                      fontWeight: 'bold',
                      letterSpacing: '2.4px',
                      lineHeight: '11px',
                      color: '#214a88',
                      textTransform: 'uppercase',
                    }}
                  >
                    {column.render('Header')}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableHead>

          <TableBody {...getTableBodyProps()}>
            {page.map((row) => {
              prepareRow(row);
              return (
                <TableRow {...row.getRowProps()}>
                  {row.cells.map((cell, cellIndex) => (
                    <TableCell
                      key={`td_${cellIndex}`}
                      sx={{
                        letterSpacing: '.35px',
                        color: '#002358',
                        fontWeight: 600,
                      }}
                    >
                      {cell.render('Cell')}
                    </TableCell>
                  ))}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
        <Pagination
          count={pageCount}
          color="secondary"
          sx={{ alignContent: 'center' }}
        />
        {/* <DatatablePagination
        page={pageIndex}
        pages={pageCount}
        canPrevious={canPreviousPage}
        canNext={canNextPage}
        pageSizeOptions={[4, 10, 20, 30, 40, 50]}
        showPageSizeOptions={false}
        showPageJump={false}
        defaultPageSize={pageSize}
        onPageChange={(p) => gotoPage(p)}
        onPageSizeChange={(s) => setPageSize(s)}
        paginationMaxSize={pageCount}
      /> */}
      </TableContainer>
      )
    </>
  );
}
