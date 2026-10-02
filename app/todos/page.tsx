'use client'

import { Toggle } from "@/components/tailgrids/core/toggle";

import {
  NativeSelect,
  NativeSelectOption
} from "@/components/tailgrids/core/native-select";

import {
  TableRoot,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell
} from "@/components/tailgrids/core/table";

import { Pagination } from "@/components/tailgrids/core/pagination";
import { useState } from "react";

export default function Page() {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 3;
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    // todos container
    <div className="w-150 mx-auto">
      {/* cotroller */}
      <div className="mt-4 flex justify-between gap-4">

        {/* toggle */}
        <Toggle label="Show only waiting" defaultChecked />

        {/* dropdown */}
        <div className="w-2/5">
          <NativeSelect placeholder="Select an option">
            <NativeSelectOption value="5">5 items per page</NativeSelectOption>
            <NativeSelectOption value="10">10 items per page</NativeSelectOption>
            <NativeSelectOption value="50">50 items per page</NativeSelectOption>
          </NativeSelect>
        </div>

      </div>

      {/* table */}
      <div className="mt-4">
        <TableRoot>
          <TableHeader>
            <TableRow>
              <TableHead scope="col">ID</TableHead>
              <TableHead scope="col">Title</TableHead>
              <TableHead scope="col">Completed</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
              <TableRow>
                <TableCell>
                  10
                </TableCell>

                <TableCell>
                  Title
                </TableCell>

                <TableCell>
                  Completed
                </TableCell>
              </TableRow>
          </TableBody>
        </TableRoot>
      </div>

      {/* pagination */}
      <div className="mt-4 w-2/3 mx-auto">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          sideLayout='label'
        />
      </div>
    </div>
  )
}
