/* eslint-disable no-unused-vars */
"use client";

import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";

interface DataTableProps {
  data: any[];
  columns: {
    key: string;
    label: string;
    render?: (item: any) => React.ReactNode;
  }[];
  filters?: {
    key: string;
    label: string;
    options: { label: string; value: string }[];
  }[];
  itemsPerPage?: number;
}

export function DataTable({ data, columns, filters, itemsPerPage = 10 }: DataTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>({});

  // Filter data based on search and active filters.
  const filteredData = data.filter((item) => {
    const searchMatch = search === "" || Object.values(item).some((value) => value && value.toString().toLowerCase().includes(search.toLowerCase()));
    const filterMatch = Object.entries(activeFilters).every(([key, value]) => !value || item[key] === value);
    return searchMatch && filterMatch;
  });

  // Pagination calculations.
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage);

  const handleFilterChange = (key: string, value: string) => {
    setActiveFilters((prev) => ({
      ...prev,
      [key]: value === "all" ? "" : value,
    }));
    setCurrentPage(1);
  };

  return (
    <div className="space-y-6">
      {/* Filters & Search */}
      <div className="flex items-center gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            className="pl-10 border border-gray-200 bg-gray-50 text-gray-900 rounded-md"
          />
        </div>
        {filters?.map((filter) => (
          <Select
            key={filter.key}
            value={activeFilters[filter.key] || "all"}
            onValueChange={(value) => handleFilterChange(filter.key, value)}>
            <SelectTrigger className="w-[180px] bg-gray-50 border border-gray-200 rounded-md text-gray-900">
              <SelectValue placeholder={filter.label} />
            </SelectTrigger>
            <SelectContent className="shadow-lg rounded-md bg-gray-50">
              <SelectItem value="all">All {filter.label}s</SelectItem>
              {filter.options.map((option) => (
                <SelectItem
                  key={option.value}
                  value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ))}
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl shadow-lg bg-white">
        <Table className="w-full">
          <TableHeader className="bg-gray-100 text-gray-700">
            <TableRow className="border-none">
              {columns.map((column) => (
                <TableHead
                  key={column.key}
                  className="px-6 py-3 text-left">
                  {column.label}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.map((item, index) => (
              <TableRow
                key={index}
                className="hover:bg-gray-50 transition-all border-none">
                {columns.map((column) => (
                  <TableCell
                    key={column.key}
                    className="px-6 py-4 text-gray-900">
                    {column.render ? column.render(item) : item[column.key]}
                  </TableCell>
                ))}
              </TableRow>
            ))}
            {paginatedData.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="text-center py-6 text-gray-700">
                  No results found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between text-gray-600">
        <p className="text-sm">
          Showing {filteredData.length > 0 ? startIndex + 1 : 0} to {Math.min(startIndex + itemsPerPage, filteredData.length)} of{" "}
          {filteredData.length} entries
        </p>
        {totalPages > 1 && (
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="border-none bg-gray-50 hover:bg-gray-100 text-gray-700">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                variant={currentPage === page ? "default" : "ghost"}
                size="sm"
                onClick={() => setCurrentPage(page)}
                className={`${currentPage === page ? "bg-blue-600 text-white" : "hover:bg-gray-200 text-gray-700"}`}>
                {page}
              </Button>
            ))}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="border-none bg-gray-50 hover:bg-gray-100 text-gray-700">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
