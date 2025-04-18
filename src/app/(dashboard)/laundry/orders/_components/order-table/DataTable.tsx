// /* eslint-disable @typescript-eslint/no-unused-vars */
// /* eslint-disable @typescript-eslint/no-explicit-any */
// "use client";
// import { Button } from "@/components/ui/button";
// import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import {
//   DoubleArrowLeftIcon,
//   DoubleArrowRightIcon,
// } from "@radix-ui/react-icons";
// import {
//   ColumnDef,
//   flexRender,
//   getCoreRowModel,
//   getPaginationRowModel,
//   PaginationState,
//   useReactTable,
// } from "@tanstack/react-table";
// import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
// import { parseAsInteger, useQueryState } from "nuqs";

// function PaginationNavigation({
//   table,
//   currentPage,
//   totalPages,
// }: {
//   table: any;
//   currentPage: number;
//   totalPages: number;
// }) {
//   return (
//     <div className="flex items-center space-x-2">
//       <Button
//         aria-label="Về trang đầu"
//         variant="outline"
//         className="hidden h-8 w-8 p-0 lg:flex"
//         onClick={() => table.setPageIndex(0)}
//         disabled={!table.getCanPreviousPage()}
//       >
//         <DoubleArrowLeftIcon className="h-4 w-4" aria-hidden="true" />
//       </Button>
//       <Button
//         aria-label="Về trang trước"
//         variant="outline"
//         className="h-8 w-8 p-0"
//         onClick={() => table.previousPage()}
//         disabled={!table.getCanPreviousPage()}
//       >
//         <ChevronLeftIcon className="h-4 w-4" aria-hidden="true" />
//       </Button>
//       <div className="flex w-[90px] items-center justify-center text-sm font-medium">
//         {totalPages > 0 ? (
//           <>
//             {currentPage} / {totalPages}
//           </>
//         ) : (
//           "0 / 0"
//         )}
//       </div>
//       <Button
//         aria-label="Đến trang sau"
//         variant="outline"
//         className="h-8 w-8 p-0"
//         onClick={() => table.nextPage()}
//         disabled={!table.getCanNextPage()}
//       >
//         <ChevronRightIcon className="h-4 w-4" aria-hidden="true" />
//       </Button>
//       <Button
//         aria-label="Đến trang cuối"
//         variant="outline"
//         className="hidden h-8 w-8 p-0 lg:flex"
//         onClick={() => table.setPageIndex(table.getPageCount() - 1)}
//         disabled={!table.getCanNextPage()}
//       >
//         <DoubleArrowRightIcon className="h-4 w-4" aria-hidden="true" />
//       </Button>
//     </div>
//   );
// }

// interface DataTableProps<TData, TValue> {
//   columns: ColumnDef<TData, TValue>[];
//   data: TData[];
//   totalItems: number;
//   onRowClick?: (row: TData) => void;
//   pageSizeOptions?: number[];
//   isLoading?: boolean;
// }

// export function DataTableProps<TData, TValue>({
//   columns,
//   data,
//   totalItems,
//   onRowClick,
//   pageSizeOptions = [5, 10, 20, 30, 40, 50, 100, 200],
//   isLoading = false,
// }: DataTableProps<TData, TValue>) {
//   const [currentPage, setCurrentPage] = useQueryState(
//     "page",
//     parseAsInteger.withOptions({ shallow: false }).withDefault(1)
//   );
//   const [pageSize, setPageSize] = useQueryState(
//     "size",
//     parseAsInteger
//       .withOptions({ shallow: false, history: "push" })
//       .withDefault(10)
//   );

//   const paginationState = {
//     pageIndex: currentPage - 1, // zero-based index for React Table
//     pageSize: pageSize,
//   };

//   const pageCount = Math.ceil(totalItems / pageSize);

//   const handlePaginationChange = (
//     updaterOrValue:
//       | PaginationState
//       | ((old: PaginationState) => PaginationState)
//   ) => {
//     const pagination =
//       typeof updaterOrValue === "function"
//         ? updaterOrValue(paginationState)
//         : updaterOrValue;

//     setCurrentPage(pagination.pageIndex + 1); // converting zero-based index to one-based
//     setPageSize(pagination.pageSize);
//   };

//   const table = useReactTable({
//     data,
//     columns,
//     pageCount: pageCount,
//     state: {
//       pagination: paginationState,
//     },
//     onPaginationChange: handlePaginationChange,
//     getCoreRowModel: getCoreRowModel(),
//     getPaginationRowModel: getPaginationRowModel(),
//     manualPagination: true,
//   });

//   return (
//     <div className="space-y-4">

//       <ScrollArea className="grid h-[calc(80vh-220px)] rounded-md border md:h-[calc(90dvh-240px)]">
//         <Table className="relative">
//           <TableHeader>
//             {table.getHeaderGroups().map((headerGroup) => (
//               <TableRow key={headerGroup.id}>
//                 {headerGroup.headers.map((header) => (
//                   <TableHead key={header.id}>
//                     {header.isPlaceholder
//                       ? null
//                       : flexRender(
//                           header.column.columnDef.header,
//                           header.getContext()
//                         )}
//                   </TableHead>
//                 ))}
//               </TableRow>
//             ))}
//           </TableHeader>
//           <TableBody>
//             {table.getRowModel().rows?.length ? (
//               table.getRowModel().rows.map((row) => (
//                 <TableRow
//                   key={row.id}
//                   data-state={row.getIsSelected() && "selected"}
//                   onClick={() => onRowClick && onRowClick(row.original)}
//                 >
//                   {row.getVisibleCells().map((cell) => (
//                     <TableCell key={cell.id}>
//                       {flexRender(
//                         cell.column.columnDef.cell,
//                         cell.getContext()
//                       )}
//                     </TableCell>
//                   ))}
//                 </TableRow>
//               ))
//             ) : (
//               <TableRow>
//                 <TableCell
//                   colSpan={columns.length}
//                   className="h-24 text-center"
//                 >
//                   {isLoading ? "Đang tải..." : "Không có dữ liệu"}
//                 </TableCell>
//               </TableRow>
//             )}
//           </TableBody>
//         </Table>
//         <ScrollBar orientation="horizontal" />
//       </ScrollArea>

//       <div className="flex flex-col items-center justify-end gap-2 space-x-2 py-4 sm:flex-row pl-[30px]">
//         <div className="flex w-full items-center justify-between">
//           <div className="flex-1 text-sm text-muted-foreground">
//             {totalItems > 0 ? (
//               <>
//                 Hiển thị{" "}
//                 {paginationState.pageIndex * paginationState.pageSize + 1} đến{" "}
//                 {Math.min(
//                   (paginationState.pageIndex + 1) * paginationState.pageSize,
//                   totalItems
//                 )}{" "}
//                 của {totalItems} đơn hàng
//               </>
//             ) : (
//               "Không có đơn hàng nào"
//             )}
//           </div>
//           <div className="flex flex-col items-center gap-4 sm:flex-row sm:gap-6 lg:gap-8 pr-[100px]">
//             <div className="flex items-center space-x-2">
//               <p className="whitespace-nowrap text-sm font-medium">
//                 Số dòng trên trang
//               </p>
//               <Select
//                 value={`${paginationState.pageSize}`}
//                 onValueChange={(value) => {
//                   table.setPageSize(Number(value));
//                 }}
//               >
//                 <SelectTrigger className="h-8 w-[70px]">
//                   <SelectValue placeholder={paginationState.pageSize} />
//                 </SelectTrigger>
//                 <SelectContent side="top">
//                   {pageSizeOptions.map((pageSize) => (
//                     <SelectItem key={pageSize} value={`${pageSize}`}>
//                       {pageSize}
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }