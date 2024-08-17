"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { getCsvFileData } from "@/actions";
import Papa from "papaparse";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
export default function CsvFileDataDialog({
  fileName,
  filePath,
}: {
  fileName: string;
  filePath: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const { data, isLoading } = useQuery({
    queryKey: ["csv-file-data", filePath],
    queryFn: async () => {
      const fileData = await getCsvFileData(filePath);
      const data = Papa.parse(fileData, {
        header: true,
      });
      //   console.log(data);
      return data;
    },
    enabled: isOpen,
  });

  // useEffect(() => {
  //     const fileData = await getCsvFileData(filePath);
  //     const data = Papa.parse(fileData, {
  //       header: true,
  //       skipEmptyLines: true,
  //       dynamicTyping: true,
  //     });
  //     console.log('--------------------');
  //     console.log(data.meta.fields);
  //     }, [filePath]);
  return (
    <Dialog onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline" className="w-full">
          View data
        </Button>
      </DialogTrigger>

      <DialogContent
        className="min-h-[300px] w-full pb-5"
        aria-describedby={undefined}
      >
        <DialogDescription hidden>File data</DialogDescription>
        <DialogTitle className="text-center">
          {fileName} csv file data
        </DialogTitle>
        <div className="h-px w-full bg-foreground/30" />
        <div className="h-[450px] w-full overflow-auto rounded-lg border-b">
          {isLoading ? (
            <div className="flex h-[450px] w-full flex-col items-center justify-center gap-2">
              <p className="animate-pulse text-lg">Loading data...</p>
            </div>
          ) : !data ? null : (
            <Table>
              <TableHeader className="sticky top-0">
                <TableRow>
                  {data.meta.fields!.map((column) => (
                    <TableHead
                      key={column}
                      className="bg-secondary text-primary"
                    >
                      <div className="flex w-full items-center gap-2">
                        {column}
                      </div>
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody className="">
                {data.data.map((row, indexRow) => (
                  <TableRow key={indexRow}>
                    {Object.values(row!).map((column, indexColumn) => (
                      <TableCell
                        className="border-l border-r"
                        key={`${indexRow}-${indexColumn}`}
                      >
                        {column!}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
