"use client";

import { predictLabel } from "@/actions";
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
import { InputData, ModelData } from "@/types";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";

export default function Predictor({ modelData }: { modelData: ModelData }) {
  const [result, setResult] = useState<string | null>(null);
  const [inputData, setInputData] = useState<InputData>(() => {
    const a: InputData = {};
    modelData.columns
      .filter((_: string, index: number) => index !== modelData.labelIndex)
      .map((column: string, index: number) => {
        a[column] = null;
      });
    return a;
  });

  const { mutate: predict } = useMutation({
    mutationFn: async () => {
      const result = await predictLabel(modelData, inputData);
      setResult(
        modelData.dataByLabels[modelData.labelIndex][
          modelData.labels.findIndex((label) => label === result)
        ],
      );
    },
  });

  console.log(modelData);

  function handleInputChange(column: string, value: string | number) {
    setResult(null);
    setInputData((prevState: InputData) => {
      return { ...prevState, [column]: Number(value) };
    });
  }

  function handlePredict() {
    if (Object.values(inputData).some((value) => value === null)) {
      console.log("Please fill all inputs");
    } else {
      predict();
    }
  }

  return (
    <>
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
                          {columnData.map(
                            (option: string, columnIndex: number) => (
                              <SelectItem
                                key={`${column}-${option}`}
                                value={String(
                                  columnData.findIndex(
                                    (value) => value === option,
                                  ),
                                )}
                              >
                                {option}
                              </SelectItem>
                            ),
                          )}
                        </SelectContent>
                      </Select>
                    )}
                  </div>
                );
              })}
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handlePredict} className="w-full">
            Make Prediction
          </Button>
        </CardFooter>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Prediction</CardTitle>
          <CardDescription>The prediction for the input data.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-center text-lg font-medium">
            {result ? result : "-"}
          </p>
        </CardContent>
      </Card>
    </>
  );
}
