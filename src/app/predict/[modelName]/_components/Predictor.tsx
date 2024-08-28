"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ModelData } from "@/types";
import { useState } from "react";

interface InputData {
  [key: string]: number | string | null;
}

export default function Predictor({ modelData }: { modelData: ModelData }) {
  const [inputData, setInputData] = useState<InputData>(() => {
    const a: InputData = {};
    modelData.columns
      .filter((_: string, index: number) => index !== modelData.labelIndex)
      .map((column: string, index: number) => {
        a[column] = null;
      });
    return a;
  });
  console.log(inputData);
  console.log(modelData);

  function handleInputChange(column: string, value: string | number) {
    setInputData((prevState: InputData) => {
      return { ...prevState, [column]: value };
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Select inputs</CardTitle>
        <CardDescription>
          Select inputs for the model to make predictions.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {modelData.columns
            .filter(
              (_: string, index: number) => index !== modelData.labelIndex,
            )
            .map((column: string, index: number) => {
              const columnData = modelData.dataByLabels.filter(
                (_: any, indexData: number) =>
                  indexData !== modelData.labelIndex,
              )[index];
              const isNumber = columnData === "Number";

              return (
                <div
                  key={index}
                  className="grid grid-cols-2 items-center gap-4"
                >
                  <p>{column}</p>
                  {isNumber ? (
                    <Input
                      id={column}
                      type="number"
                      placeholder={`Enter ${column}`}
                      onWheel={(e: any) => e.target.blur()}
                      onChange={(e) =>
                        handleInputChange(column, Number(e.target.value))
                      }
                      className="w-full [&::-webkit-inner-spin-button]:appearance-none"
                    />
                  ) : (
                    <Select
                      onValueChange={(value) =>
                        handleInputChange(column, value)
                      }
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder={`Select ${column}`} />
                      </SelectTrigger>
                      <SelectContent>
                        {columnData.map((option: string) => (
                          <SelectItem
                            key={`${column}-${option}`}
                            value={option}
                          >
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                </div>
              );
            })}
        </div>
      </CardContent>
      <CardFooter>
        <Button
          //   onClick={handlePredict}
          className="w-full"
        >
          Make Prediction
        </Button>
      </CardFooter>
    </Card>
  );
}
