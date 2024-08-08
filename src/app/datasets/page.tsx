'use client';

import { readFiles, removeFiles } from '@/actions';
import CsvFileDataDialog from '@/components/CsvFileDataDialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import UploadDialog from '@/components/UploadDialog';
import { cn, formatBytes } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';
import { Ellipsis, Trash } from 'lucide-react';
import { useState } from 'react';

export default function Page() {
  const [checkedBoxes, setCheckedBoxes] = useState<string[]>([]);
  const [allChecked, setAllChecked] = useState(false);

  const { data: files, refetch } = useQuery({
    queryKey: ['files'],
    queryFn: () => readFiles(),
    refetchOnWindowFocus: false,
  });

  console.log(checkedBoxes.length);

  return (
    <div className="h-full">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-semibold">Datasets</h1>
        <div className="flex gap-2 items-center">
          <UploadDialog refetch={refetch} />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="focus-visible:ring-0 relative"
              >
                <div
                  className={cn(
                    'text-secondary text-xs hidden bg-primary size-4 items-center justify-center rounded-full aspect-square absolute -top-1 -right-1',
                    checkedBoxes.length > 0 && 'flex'
                  )}
                >
                  {checkedBoxes.length}
                </div>
                <Ellipsis size={20} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem className="text-destructive  gap-2 hover:text-destructive">
                <Trash size={12} />
                Delete datasets
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* <Button
            onClick={async () => {
              await removeFiles(checkedBoxes);
              refetch();
            }}
            variant="destructive"
            className="gap-2"
          >
            <Trash size={16} />
          </Button> */}
        </div>
      </div>
      <div className="h-px w-full bg-foreground/20 my-2" />
      {files === undefined ? (
        <div className="h-[500px] animate-pulse bg-background rounded-xl border overflow-hidden"></div>
      ) : (
        <>
          {files!.length === 0 ? (
            <div className="flex mt-10 items-center justify-center font-semibold">
              <p>No datasets found.</p>
            </div>
          ) : (
            <div className="bg-background rounded-xl border overflow-hidden">
              <div className="grid grid-cols-5 font-semibold bg-zinc-50 p-4 border-b">
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
                    className="grid items-center grid-cols-5 p-4 text-sm"
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
                              prev.filter((item) => item !== file.path)
                            );
                          }
                        }}
                      />
                      <p className=" ">{file.name}</p>
                    </div>
                    <p className="">{formatBytes(file.sizeInBytes)}</p>
                    <p className="">
                      {file.importedTime.toLocaleString('en-DE', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
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
