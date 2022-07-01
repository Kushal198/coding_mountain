/* eslint-disable react/jsx-key */
/* eslint-disable react/no-array-index-key */
import React, { useState, useEffect } from 'react';
import {
  useTable,
  usePagination,
  useSortBy,
  useFilters,
  TableInstance,
  UsePaginationOptions,
  TableState,
  useGlobalFilter,
} from 'react-table';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Pagination,
  Box,
  IconButton,
  Typography,
} from '@mui/material';

interface TableProps {
  columns: any[];
  data: any[];
  defaultPageSize?: number;
  pagination?: any;
  searchKeyword?: string;
}

export const CryptoTable: React.FC<TableProps> = ({
  columns,
  data,
  defaultPageSize,
  pagination,
  searchKeyword,
}) => {
  const {
    getTableProps,
    getTableBodyProps,
    setFilter,
    headerGroups,
    prepareRow,
    page,
    canPreviousPage,
    setGlobalFilter,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    setHiddenColumns,
    state: { pageIndex, pageSize },
  } = useTable(
    {
      columns,
      data,

      initialState: {
        pageIndex: 0,
        hiddenColumns: ['name'],
        pageSize: 10,
      },
    },
    useGlobalFilter,
    useFilters,
    useSortBy,
    usePagination
  );

  useEffect(() => {
    setGlobalFilter(searchKeyword);
  }, [searchKeyword]);

  // rendering the UI of table
  return (
    <>
      <TableContainer component={Paper} sx={{ my: 4 }}>
        <br />
        <Table {...getTableProps()}>
          <TableHead>
            {headerGroups.map((headerGroup: any) => (
              <TableRow {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column: any, columnIndex: number) => {
                  return (
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
                  );
                })}
              </TableRow>
            ))}
          </TableHead>

          <TableBody {...getTableBodyProps()}>
            {page.map((row: any) => {
              prepareRow(row);

              return (
                <TableRow {...row.getRowProps()}>
                  {row.cells.map((cell: any, cellIndex: number) => {
                    return (
                      <TableCell
                        key={`td_${cellIndex}`}
                        sx={{
                          letterSpacing: '.35px',
                          color: '#002358',
                          fontWeight: 600,
                          ...cell.getCellProps({
                            display: cell.column.cellClass,
                          }),
                        }}
                      >
                        {cell.render('Cell')}
                      </TableCell>
                    );
                  })}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>

        {pagination && (
          <Box
            className="pagination"
            sx={{ p: 3, display: 'flex', justifyContent: 'center' }}
          >
            <IconButton
              onClick={() => previousPage()}
              disabled={!canPreviousPage}
            >
              <ArrowBackIosNewIcon />
            </IconButton>{' '}
            <IconButton onClick={() => nextPage()} disabled={!canNextPage}>
              <ArrowForwardIosIcon />
            </IconButton>{' '}
            <div>
              <Typography variant="h6" component="div">
                Page{' '}
                <strong>
                  {pageIndex + 1} of {pageOptions.length}
                </strong>{' '}
              </Typography>
            </div>
          </Box>
        )}
      </TableContainer>
    </>
  );
};
