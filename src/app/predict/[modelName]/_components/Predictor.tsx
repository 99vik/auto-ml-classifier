"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

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
        <div>
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
        </div>
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
