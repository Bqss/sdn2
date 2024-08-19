"use client";
import { Card, CardContent } from "@/components/ui/card";
import { FiChevronLeft, FiChevronRight, FiChevronsLeft, FiChevronsRight } from "react-icons/fi";
import { FaPencilAlt } from "react-icons/fa";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import React, { useEffect, useMemo, useState } from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { NewsService } from "@/services/news";
import Image from "next/image";
import { FaTrashAlt } from "react-icons/fa";
import { Badge } from "@/components/ui/badge";


interface DatatableProps {
  // slideshows: Slideshow[];
  handleDelete: (id: string) => void;
  handleEdit: (id: string) => void;
}

export default function Datatable({ handleDelete, handleEdit }: DatatableProps) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10
  });

  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({});

  const { data: slideshows, refetch, isFetching } = useQuery({
    queryKey: ["news"],
    queryFn: () => NewsService.paginatedBerita({
      page: pagination.pageIndex,
      perPage: pagination.pageSize
    }),
    placeholderData: keepPreviousData,
  });

  useEffect(() => {
    refetch();
  }, [pagination, refetch])

  const columns: ColumnDef<Slideshow>[] = useMemo(() => {
    return [
      {
        id: "select",
        header: ({ table }) => (
          <Checkbox
            checked={
              table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() && "indeterminate")
            }
            onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
            aria-label="Select all"
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select row"
          />
        ),
        enableSorting: false,
        enableHiding: false,
      },
      {
        id: "actions",
        header: ({ table }) => {
          return <div className="text-center">
            Actions
          </div>
        },
        size: 180,
        enableHiding: false,
        cell: ({ row }) => {
          const slidesow = row.original;
          return (
            <div className="flex justify-center">
              <Button
                variant="default"
                size="sm"
                className="mr-2"
                onClick={() => handleEdit(slidesow.id)}
              >
                <FaPencilAlt />
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => handleDelete(slidesow.id)}
              >
                <FaTrashAlt />
              </Button>
            </div>
          )
        },
      },
      {
        accessorKey: "judul",
        header: "Judul",
        cell: ({ row }) => (
          <div className="capitalize">{row.getValue("judul")}</div>
        ),
      },
      {
        accessorKey: "deskripsi",
        header: "Deskripsi",
        cell: ({ row }) => (
          <div className="capitalize">{row.getValue("deskripsi")}</div>
        ),
      },
      {
        accessorKey: "thumbnail",
        header: "Thumbnail",
        cell: ({ row }) => (
          <Image
            src={row.getValue("thumbnail")}
            width={50}
            className="rounded-md object-cover"
            height={50}
            alt="Gambar"
          />
        ),
      },
      {
        accessorKey: "created_at",
        header: "Publish pada",
        cell : ({ row }) => {
          const date = new Date(row.getValue("created_at")._seconds * 1000);
          return date?.toLocaleDateString("id-ID", {
            timeZone: "Asia/Jakarta",
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          });
        }
      }
    ]
  }, []);

  const table = useReactTable({
    data: slideshows?.data ?? [],
    columns,
    manualPagination: true,
    pageCount: slideshows?.pageCount, //you can now pass in `rowCount` instead of pageCount and `pageCount` will be calculated internally (new in v8.13.0)
    rowCount: slideshows?.rowCount, //
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: setPagination,
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      pagination
    },
  })

  return (

        <div className="w-full">
          {/* <div className="flex items-center py-4">
            <Input
              placeholder="Filter emails..."
              value={(table.getColumn("email")?.getFilterValue() as string) ?? ""}
              onChange={(event) =>
                table.getColumn("email")?.setFilterValue(event.target.value)
              }
              className="max-w-sm"
            />
          </div> */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                      return (
                        <TableHead key={header.id}>
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                        </TableHead>
                      )
                    })}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {isFetching ? (
                  <tr>
                    <td colSpan={table.getVisibleLeafColumns().length}>
                      <div className="flex items-center justify-center w-full h-24 bg-white">
                        <div className="h-7 w-7 animate-spin rounded-full border-4 border-solid border-primary border-t-transparent"></div>
                      </div>
                    </td>
                  </tr>
                ) : table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && "selected"}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center"
                    >
                      No results.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          <div className="flex items-center justify-end space-x-2 py-4">
            <div className="flex-1 text-sm text-muted-foreground">
              {table.getFilteredSelectedRowModel().rows.length > 0 ? (
                <span>
                  {table.getFilteredSelectedRowModel().rows.length} rows selected from {slideshows?.rowCount} total
                </span>
              ) : (
                <span>
                  {table.getFilteredRowModel().rows.length} rows displayed from {slideshows?.rowCount} total
                </span>
              )}
            </div>
            <div className="space-x-2">
              <Button
                variant={"secondary"}
                onClick={() => table.firstPage()}
                disabled={!table.getCanPreviousPage()}
              >
                <FiChevronsLeft />
              </Button>
              <Button
                variant={"secondary"}
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                <FiChevronLeft />
              </Button>
              <Button
                variant={"secondary"}
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                <FiChevronRight />
              </Button>
              <Button
                variant={"secondary"}
                onClick={() => table.lastPage()}
                disabled={!table.getCanNextPage()}
              >
                <FiChevronsRight />
              </Button>
            </div>
          </div>
        </div>
     
  )
}
