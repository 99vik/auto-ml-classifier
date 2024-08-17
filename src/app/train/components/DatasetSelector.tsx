"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { formatBytes } from "@/lib/utils";

interface File {
  name: string;
  sizeInBytes: number;
  importedTime: Date;
  path: string;
  samples: number;
  columnsNum: number;
  columns: string[];
  createdTime: Date;
}

export default function DatasetSelector({ files }: { files: File[] }) {
  const [selectedFile, setSelectedFile] = useState<null | File>(null);

  function handleFileChange(filePath: string) {
    const file = files.find((file) => file.path === filePath);
    setSelectedFile(file!);
    console.log(file);
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
        {/* <CardFooter>
        <Button>Start Training</Button>
      </CardFooter> */}
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
                Number of columns
              </p>
              <p>{selectedFile.columnsNum}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">
                Columns
              </p>
              <p>{selectedFile.columns.join(", ")}</p>
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
            {/* <div className="flex items-center justify-between">
              <span className="text-sm font-medium">
                Samples: {selectedFile.samples}
              </span>
              <span className="text-sm font-medium">
                Size: {formatBytes(selectedFile.sizeInBytes)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">
                Number of columns: {selectedFile.features}
              </span>
              <span className="text-sm font-medium">
                Created at:{" "}
                {selectedFile.createdTime.toLocaleString("en-DE", {
                  day: "numeric",
                  month: "numeric",
                  year: "numeric",
                })}
              </span>
            </div> */}
          </CardContent>
        </Card>
      )}
    </>
  );
}
