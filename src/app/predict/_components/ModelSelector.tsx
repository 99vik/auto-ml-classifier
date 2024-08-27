"use client";

import { getModel } from "@/actions";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useState } from "react";

export default function ModelSelector({
  models,
}: {
  models: {
    name: string;
    sizeInBytes: number;
    importedTime: Date;
    createdTime: Date;
    path: string;
  }[];
}) {
  const [selectedModel, setSelectedModel] = useState<
    | {
        name: string;
        sizeInBytes: number;
        importedTime: Date;
        createdTime: Date;
        path: string;
      }
    | undefined
  >(undefined);

  const { data } = useQuery({
    queryKey: ["csv-file-data", selectedModel?.path],
    queryFn: async () => {
      const fileData = await getModel(selectedModel?.path!);
      return fileData;
    },
    enabled: selectedModel !== undefined,
  });

  console.log(data);

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Select model</CardTitle>
          <CardDescription>Select a model to make predictions.</CardDescription>
        </CardHeader>
        <CardContent>
          <Select
            onValueChange={(value) =>
              setSelectedModel(models.find((model) => model.path === value))
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select model" />
            </SelectTrigger>
            <SelectContent>
              {models.map((model) => (
                <SelectItem key={model.name} value={model.path}>
                  {model.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>
    </>
  );
}
