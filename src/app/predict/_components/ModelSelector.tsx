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
import { formatBytes } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { MoveRight } from "lucide-react";
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
    (typeof models)[0] | undefined
  >(undefined);

  const { data: modelData } = useQuery({
    queryKey: ["model-data", selectedModel?.path],
    queryFn: async () => {
      const fileData = await getModel(selectedModel?.path!);
      return fileData;
    },
    enabled: selectedModel !== undefined,
  });

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
      {modelData && (
        <Card className="mt-4">
          <CardHeader>
            <CardTitle className="text-lg">Selected Model</CardTitle>
            <CardDescription>
              Review the details of the selected model.
            </CardDescription>
          </CardHeader>
          <CardContent className="mt-4 space-y-5">
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">
                Model name
              </p>
              <p>{selectedModel!.name}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">
                Target variable
              </p>
              <p>{modelData.label}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">
                Possible outputs ({modelData.outputSize})
              </p>
              <p>
                {(
                  modelData.dataByLabels[modelData.labelIndex] as string[]
                ).join(", ")}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">
                Accuracy on test set
              </p>
              <p>{modelData.accuracy}%</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">
                F1 score
              </p>
              <p>{modelData.f1Score}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">
                Number of parameters
              </p>
              <p>{modelData.totalParams}</p>
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">
                  File size
                </p>
                <p>{formatBytes(selectedModel!.sizeInBytes)}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">
                  Created at
                </p>
                <p>{selectedModel!.createdTime.toLocaleDateString("en-DE")}</p>
              </div>
            </div>
          </CardContent>
          <CardFooter className="border-t pt-4">
            <Link
              href={`/predict/${selectedModel!.name}`}
              className={buttonVariants({ className: "w-full gap-2" })}
            >
              Make Predictions
              <MoveRight />
            </Link>
          </CardFooter>
        </Card>
      )}
    </>
  );
}
