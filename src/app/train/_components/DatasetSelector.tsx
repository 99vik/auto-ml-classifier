"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { formatBytes } from "@/lib/utils";
import { MoveRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
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
import Link from "next/link";

interface File {
  name: string;
  sizeInBytes: number;
  importedTime: Date;
  path: string;
  samples: number;
  columnsNum: number;
  columns: unknown;
  createdTime: Date;
}

export default function DatasetSelector({ files }: { files: File[] }) {
  const [selectedFile, setSelectedFile] = useState<null | File>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["csv-file-data", selectedFile?.path],
    queryFn: async () => {
      const fileData = await getCsvFileData(selectedFile?.path!);
      const data = Papa.parse(fileData, {
        header: true,
      });
      return data;
    },
    enabled: selectedFile !== null,
  });

  function handleFileChange(filePath: string) {
    const file = files.find((file) => file.path === filePath);
    setSelectedFile(file!);
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Select Dataset</CardTitle>
          <CardDescription>
            Select a dataset to review and train your classification model.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Select onValueChange={handleFileChange}>
            <SelectTrigger className="">
              <SelectValue placeholder="Select dataset" />
            </SelectTrigger>
            <SelectContent>
              {files.map((file) => (
                <SelectItem key={file.name} value={file.path}>
                  {file.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>
      {selectedFile && (
        <Card className="mt-4">
          <CardHeader>
            <CardTitle className="text-lg">Selected Dataset</CardTitle>
            <CardDescription>
              Review the details of the selected dataset.
            </CardDescription>
          </CardHeader>
          <CardContent className="mt-4 space-y-5">
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">
                Dataset name
              </p>
              <p>{selectedFile.name}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">
                Number of samples
              </p>
              <p>{selectedFile.samples}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">
                Number of features
              </p>
              <p>{selectedFile.columnsNum}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">
                Columns
              </p>
              {/* @ts-ignore */}
              <p className="">{selectedFile.columns.join(", ")}</p>
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">
                  File size
                </p>
                <p>{formatBytes(selectedFile.sizeInBytes)}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">
                  Created at
                </p>
                <p>{selectedFile.createdTime.toLocaleDateString("en-DE")}</p>
              </div>
            </div>
          </CardContent>
          <CardFooter className="border-t pt-4">
            <Link
              href={`/train/${selectedFile.name}`}
              className={buttonVariants({ className: "w-full gap-2" })}
            >
              Continue
              <MoveRight />
            </Link>
          </CardFooter>
        </Card>
      )}
      {data && (
        <Card className="mt-4 overflow-auto">
          <CardHeader>
            <CardTitle className="text-lg">Dataset preview</CardTitle>
            <CardDescription>
              Showing the first 10 rows of the selected dataset.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  {data.meta.fields!.map((column) => (
                    <TableHead key={column}>
                      <div className="flex w-full items-center gap-2">
                        {column}
                      </div>
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.data.slice(1, 10).map((row, indexRow) => (
                  <TableRow key={indexRow}>
                    {Object.values(row!).map((column, indexColumn) => (
                      <TableCell key={`${indexRow}-${indexColumn}`}>
                        {column!}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </>
  );
}
