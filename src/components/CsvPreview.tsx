'use client';

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import Papa from 'papaparse';
import { use, useEffect, useState } from 'react';
export default function CsvPreview({ file }: { file: File }) {
  const [data, setData] = useState<string[][]>([]);
  console.log(file);

  useEffect(() => {
    Papa.parse(file, {
      complete: (result) => {
        console.log(result);
        console.log(result.data[0]);
        setData(result.data as string[][]);
        //   sendFile(file);
      },
      error: (error) => {
        console.error(error);
      },
    });
  }, [file]);

  if (data.length === 0) {
    return null;
  }

  return (
    <div className="h-[500px] rounded-lg relative overflow-auto w-full border-b">
      <Table>
        <TableHeader className="sticky -translate-y-px top-0 bg-background ">
          <TableRow>
            {data[0].map((column) => (
              <TableHead
                key={column}
                className="text-primary border bg-secondary"
              >
                {column}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody className="">
          {data.slice(1, 51).map((row, indexRow) => (
            <TableRow key={indexRow}>
              {row.map((column, indexColumn) => (
                <TableCell
                  className="border-r border-l"
                  key={`${indexRow}-${indexColumn}`}
                >
                  {column}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
