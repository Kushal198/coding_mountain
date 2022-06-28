/* eslint-disable react/prop-types */
import React, { useEffect } from 'react';
import {
  useTable,
  usePagination,
  Column,
  useSortBy,
  useFilters,
  Cell,
  TableOptions,
  TableInstance,
  UsePaginationInstanceProps,
  UsePaginationState,
  UseSortByInstanceProps,
  UseColumnOrderState,
  UseFiltersState,
  UseExpandedState,
  UseGlobalFiltersState,
  UseResizeColumnsState,
  UseGroupByState,
  UseRowSelectState,
  UseRowStateState,
  UseSortByState,
} from 'react-table';
import PropTypes from 'prop-types';

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Pagination,
  TablePagination,
} from '@mui/material';

interface TableProps {
  columns: any[];
  data: any[];
  defaultPageSize?: number;
  pagination?: any;
  searchKeyword?: string;
}

type TableType = TableInstance & {
  gotoPage: (index: number) => void;
  setFilter: (arg1: any, arg2: any) => void;
  setPageSize: () => void;
  page: any;
  canPreviousPage: boolean;
  canNextPage: boolean;
  pageCount: number;
  state: {
    pageIndex: number;
    pageSize: number;
  };
};

export const CryptoTable: React.FC<TableProps> = ({
  columns,
  data,
  defaultPageSize = 20,
  pagination,
  searchKeyword,
}) => {
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

      // initialState: {
      //   pageIndex: 0,
      //   // sortBy: [
      //   //   {
      //   //     id: 'rank',
      //   //     asc: false,
      //   //   },
      //   // ],
      //   pageSize: defaultPageSize,
      // },
    },
    useFilters,
    useSortBy,
    usePagination
  ) as TableType;
  useEffect(() => {
    setFilter('price', searchKeyword);
  }, [searchKeyword]);

  // rendering the UI of table
  return (
    <>
      <TableContainer component={Paper} sx={{ my: 4 }}>
        <br />
        <Table {...getTableProps()}>
          <TableHead>
            {headerGroups.map((headerGroup: any) => (
              <TableRow
                {...headerGroup.getHeaderGroupProps()}
                key={`tr_${headerGroup.id}`}
              >
                {headerGroup.headers.map((column: any, columnIndex: number) => (
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
            {page.map((row: any) => {
              prepareRow(row);
              return (
                <TableRow {...row.getRowProps()} key={`tr_${row.id}`}>
                  {row.cells.map((cell: any, cellIndex: number) => {
                    return (
                      <>
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
                      </>
                    );
                  })}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
        {pagination && (
          <Pagination
            count={pageCount - 1}
            color="secondary"
            page={pageIndex}
            onChange={(e, p) => gotoPage(p)}
            sx={{ p: 4, display: 'flex', justifyContent: 'center' }}
          />
        )}
      </TableContainer>
      )
    </>
  );
};
