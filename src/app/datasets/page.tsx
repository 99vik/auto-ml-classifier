"use client";

import { readFiles, removeFiles } from "@/actions";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import UploadDialog from "./_components/UploadDialog";
import CsvFileDataDialog from "./_components/CsvFileDataDialog";
import { cn, formatBytes } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { Ellipsis, Trash } from "lucide-react";
import { useState } from "react";

export default function Page() {
  const [checkedBoxes, setCheckedBoxes] = useState<string[]>([]);
  const [allChecked, setAllChecked] = useState(false);

  const { data: files, refetch } = useQuery({
    queryKey: ["files"],
    queryFn: () => readFiles(),
    refetchOnWindowFocus: false,
  });

  return (
    <div className="h-full">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-semibold">Datasets</h1>
        <div className="flex items-center gap-2">
          <UploadDialog refetch={refetch} />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                disabled={checkedBoxes.length === 0}
                variant="outline"
                className="relative focus-visible:ring-0"
              >
                <div
                  className={cn(
                    "absolute -right-1 -top-1 hidden aspect-square size-4 items-center justify-center rounded-full bg-primary text-xs text-secondary",
                    checkedBoxes.length > 0 && "flex",
                  )}
                >
                  {checkedBoxes.length}
                </div>
                <Ellipsis size={20} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={async () => {
                  await removeFiles(checkedBoxes);
                  setCheckedBoxes([]);
                  setAllChecked(false);
                  refetch();
                }}
                className="gap-2 text-destructive hover:text-destructive"
              >
                <Trash size={12} />
                Delete datasets
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div className="my-2 h-px w-full bg-foreground/20" />
      {files === undefined ? (
        <div className="h-[500px] animate-pulse overflow-hidden rounded-xl border bg-background"></div>
      ) : (
        <>
          {files!.length === 0 ? (
            <div className="mt-10 flex items-center justify-center font-semibold">
              <p>No datasets found.</p>
            </div>
          ) : (
            <div className="overflow-hidden rounded-xl border bg-background">
              <div className="grid grid-cols-5 border-b bg-zinc-50 p-4 font-semibold">
                <div className="col-span-2 flex items-center gap-3">
                  <Checkbox
                    checked={
                      allChecked && checkedBoxes.length === files!.length
                    }
                    onCheckedChange={(state) => {
                      if (state) {
                        setAllChecked(true);
                        setCheckedBoxes([]);
                        files!.forEach((file) => {
                          setCheckedBoxes((prev) => [...prev, file.path]);
                        });
                      } else {
                        setAllChecked(false);
                        setCheckedBoxes([]);
                      }
                    }}
                  />
                  <p>Name</p>
                </div>
                <p>Size</p>
                <p>Imported at</p>
              </div>
              <div className="flex flex-col divide-y">
                {files!.map((file) => (
                  <div
                    key={file.name}
                    className="grid grid-cols-5 items-center p-4 text-sm"
                  >
                    <div className="col-span-2 flex items-center gap-3">
                      <Checkbox
                        checked={checkedBoxes.includes(file.path)}
                        onCheckedChange={(state) => {
                          if (state) {
                            setCheckedBoxes((prev) => [...prev, file.path]);
                          } else {
                            setAllChecked(false);
                            setCheckedBoxes((prev) =>
                              prev.filter((item) => item !== file.path),
                            );
                          }
                        }}
                      />
                      <p className=" ">{file.name}</p>
                    </div>
                    <p className="">{formatBytes(file.sizeInBytes)}</p>
                    <p className="">
                      {file.importedTime.toLocaleString("en-DE", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </p>
                    <div>
                      <CsvFileDataDialog
                        fileName={file.name}
                        filePath={file.path}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
