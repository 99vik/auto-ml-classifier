'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import Papa from 'papaparse';
import { useEffect, useState } from 'react';
import { Checkbox } from './ui/checkbox';
import { cn } from '@/lib/utils';
export default function CsvPreview({ file }: { file: File }) {
  const [data, setData] = useState<string[][]>([]);
  const [checkedColumns, setCheckedColumns] = useState<number[]>([]);
  console.log(checkedColumns);
  useEffect(() => {
    Papa.parse(file, {
      complete: (result: any) => {
        console.log(result);
        setData(result.data as string[][]);
        setCheckedColumns(Array.from(Array(result.data[0].length).keys()));
      },
      error: (error) => {
        console.error(error);
      },
    });
  }, [file]);

  if (data.length === 0) {
    return null;
  }

  function checkboxChange(CheckedState: string | boolean, columnIndex: number) {
    console.log(CheckedState, columnIndex);
    if (CheckedState) {
      setCheckedColumns((prevState) => [...prevState, columnIndex]);
    } else {
      setCheckedColumns((prevState) =>
        prevState.filter((index) => index !== columnIndex)
      );
    }
  }

  return (
    <div className="h-[450px] rounded-lg relative overflow-auto w-full border-b">
      <Table>
        <TableHeader className="sticky -translate-y-px top-0 bg-background ">
          <TableRow>
            {data[0].map((column, index) => (
              <TableHead
                key={column}
                className={cn(
                  checkedColumns.includes(index)
                    ? 'bg-secondary text-primary'
                    : 'bg-zinc-200 line-through text-primary/40'
                )}
              >
                <div className="flex w-full items-center gap-2">
                  <Checkbox
                    defaultChecked
                    id={column}
                    onCheckedChange={(CheckedState) =>
                      checkboxChange(CheckedState, index)
                    }
                  />
                  {column}
                </div>
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody className="">
          {data.slice(1, 51).map((row, indexRow) => (
            <TableRow key={indexRow}>
              {row.map((column, indexColumn) => (
                <TableCell
                  className={cn(
                    'border-r border-l',
                    !checkedColumns.includes(indexColumn) &&
                      'bg-zinc-100 text-primary/40'
                  )}
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
