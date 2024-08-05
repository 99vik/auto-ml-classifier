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
    <div className="">
      <Table>
        <TableHeader>
          <TableRow>
            {data[0].map((column) => (
              <TableHead key={column} className="font-medium">
                {column}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody className="max-h-[450px] overflow-x-auto">
          {data.slice(1, 5).map((row, indexRow) => (
            <TableRow key={indexRow}>
              {row.map((column, indexColumn) => (
                <TableCell key={`${indexRow}-${indexColumn}`}>
                  {column}
                </TableCell>
              ))}
            </TableRow>
          ))}
          {/* <TableRow>
            <TableCell className="font-medium">INV001</TableCell>
            <TableCell>Paid</TableCell>
            <TableCell>Credit Card</TableCell>
            <TableCell className="text-right">$250.00</TableCell>
          </TableRow> */}
        </TableBody>
      </Table>
    </div>
  );
}
