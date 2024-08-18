"use client";

import { Input } from "@/components/ui/input";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
} from "@/components/ui/select";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function ModelConfigurator({
  fileData,
  columns,
}: {
  fileData: string;
  columns: string[];
}) {
  const [selectedColumn, setSelectedColumn] = useState<null | string>(null);

  async function trainModel() {
    const csvBlob = new Blob([fileData], { type: "text/csv" });
    const csvFile = new File([csvBlob], "data.csv", { type: "text/csv" });
    const formData = new FormData();

    formData.append("file", csvFile);
    formData.append("label_index", columns.indexOf(selectedColumn!).toString());
    const response = await fetch("http://127.0.0.1:5000/api/test", {
      method: "POST",
      body: formData,
    });
    console.log(response);
    const body = await response.json();
    console.log(body);
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Target label</CardTitle>
          <CardDescription>
            Select the target label you want to train on.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Select onValueChange={setSelectedColumn}>
            <SelectTrigger className="">
              <SelectValue placeholder="Select a column" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {columns.map((column, index) => (
                  <SelectItem key={index} value={column}>
                    {column}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Model configuration</CardTitle>
          <CardDescription>
            Adjust the hyperparameters for the training process.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-1">
                <label htmlFor="epochs" className="text-sm font-medium">
                  Epochs
                </label>
                <Input
                  id="epochs"
                  type="number"
                  defaultValue={100}
                  min={1}
                  max={1000}
                  className="w-full"
                />
              </div>
              <div className="grid gap-1">
                <label htmlFor="batch-size" className="text-sm font-medium">
                  Batch Size
                </label>
                <Input
                  id="batch-size"
                  type="number"
                  defaultValue={32}
                  min={1}
                  max={256}
                  className="w-full"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-1">
                <label htmlFor="learning-rate" className="text-sm font-medium">
                  Learning Rate
                </label>
                <Input
                  id="learning-rate"
                  type="number"
                  defaultValue={0.001}
                  step={0.0001}
                  min={0.0001}
                  max={0.1}
                  className="w-full"
                />
              </div>
              <div className="grid gap-1">
                <label htmlFor="momentum" className="text-sm font-medium">
                  Momentum
                </label>
                <Input
                  id="momentum"
                  type="number"
                  defaultValue={0.9}
                  step={0.1}
                  min={0}
                  max={1}
                  className="w-full"
                />
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="border-t pt-4">
          <Button
            onClick={trainModel}
            disabled={selectedColumn === null}
            className="w-full"
          >
            Train model
          </Button>
        </CardFooter>
      </Card>
    </>
  );
}
