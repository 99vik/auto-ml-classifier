"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
export default function Predictor({ modelData }: { modelData: any }) {
  console.log(modelData);
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
              const isNumber =
                modelData.dataByLabels.filter(
                  (_: string, indexData: number) =>
                    indexData !== modelData.labelIndex,
                )[index] === "Number";

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
                      //   onChange={(e) => handleInputChange(column, e.target.value)}
                      className="w-full"
                    />
                  ) : (
                    <Select
                    //   onValueChange={(value) => handleInputChange(column, value)}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder={`Select ${column}`} />
                      </SelectTrigger>
                      <SelectContent>
                        {/* Replace with actual options for this column */}
                        <SelectItem value="option1">Option 1</SelectItem>
                        <SelectItem value="option2">Option 2</SelectItem>
                        <SelectItem value="option3">Option 3</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                </div>
              );
            })}
        </div>
        {/* <div>
          {modelData.columns
            .filter(
              (_: string, index: number) => index !== modelData.labelIndex,
            )
            .map((column: string, index: number) => (
              <div key={index} className="flex gap-2">
                <p className="">{column}</p>
                <p>
                  {modelData.dataByLabels.filter(
                    (_: string, indexData: number) =>
                      indexData !== modelData.labelIndex,
                  )[index] === "Number"
                    ? "number"
                    : "select"}
                </p>
              </div>
            ))}
        </div> */}
        {/* <Select
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
          </Select> */}
      </CardContent>
    </Card>
  );
}
