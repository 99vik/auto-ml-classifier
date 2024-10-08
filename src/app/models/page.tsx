"use client";

import { readModels, removeModels } from "@/actions";
import { readFiles, removeFiles } from "@/actions";
import { Button, buttonVariants } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn, formatBytes } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { Ellipsis, Trash } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function Page() {
  const [checkedBoxes, setCheckedBoxes] = useState<string[]>([]);
  const [allChecked, setAllChecked] = useState(false);

  const { data: models, refetch } = useQuery({
    queryKey: ["models"],
    queryFn: () => readModels(),
    refetchOnWindowFocus: false,
  });

  return (
    <div className="min-h-full space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-semibold">Models</h1>
        <div className="flex items-center gap-2">
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
                  await removeModels(checkedBoxes);
                  setCheckedBoxes([]);
                  setAllChecked(false);
                  refetch();
                }}
                className="gap-2 text-destructive hover:text-destructive"
              >
                <Trash size={12} />
                Delete model/s
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      {models === undefined ? (
        <div className="h-[500px] animate-pulse overflow-hidden rounded-xl border bg-background"></div>
      ) : (
        <>
          {models!.length === 0 ? (
            <div className="mt-10 flex items-center justify-center font-semibold">
              <p>No models found.</p>
            </div>
          ) : (
            <div className="overflow-hidden rounded-xl border bg-background">
              <div className="grid grid-cols-5 border-b bg-zinc-50 p-4 font-semibold">
                <div className="col-span-2 flex items-center gap-3">
                  <Checkbox
                    checked={
                      allChecked && checkedBoxes.length === models!.length
                    }
                    onCheckedChange={(state) => {
                      if (state) {
                        setAllChecked(true);
                        setCheckedBoxes([]);
                        models!.forEach((model) => {
                          setCheckedBoxes((prev) => [...prev, model.path]);
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
                {models!.map((model) => (
                  <div
                    key={model.name}
                    className="grid grid-cols-5 items-center p-4 text-sm"
                  >
                    <div className="col-span-2 flex items-center gap-3">
                      <Checkbox
                        checked={checkedBoxes.includes(model.path)}
                        onCheckedChange={(state) => {
                          if (state) {
                            setCheckedBoxes((prev) => [...prev, model.path]);
                          } else {
                            setAllChecked(false);
                            setCheckedBoxes((prev) =>
                              prev.filter((item) => item !== model.path),
                            );
                          }
                        }}
                      />
                      <p className=" ">{model.name}</p>
                    </div>
                    <p className="">{formatBytes(model.sizeInBytes)}</p>
                    <p className="">
                      {model.importedTime.toLocaleString("en-DE", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </p>
                    <div>
                      <Link
                        className={buttonVariants({
                          size: "sm",
                          className: "w-full",
                        })}
                        href={`/predict/${model.name}`}
                      >
                        Predict
                      </Link>
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
