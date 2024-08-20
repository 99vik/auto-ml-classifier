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
import Charts from "./Charts";
import NeuralNetworkArchitecture from "./NeuralNetworkArchitecture";

export interface TrainingDataType {
  status: "training" | "preparing" | "complete";
  iteration: string;
  trainLoss: number;
  trainAccuracy: number;
  testLoss: number;
  testAccuracy: number;
}

interface ModelConfiguration {
  iterations: number;
  batchSize: number;
  learningRate: number;
  activationFunction: "relu" | "tanh" | "sigmoid" | "linear";
}

export default function ModelConfigurator({
  fileData,
  columns,
}: {
  fileData: string;
  columns: string[];
}) {
  const [selectedColumn, setSelectedColumn] = useState<null | string>(null);
  const [status, setStatus] = useState<string>("");
  const [trainingData, setTrainingData] = useState<[] | TrainingDataType[]>([]);
  const [modelConfiguration, setModelConfiguration] =
    useState<ModelConfiguration>({
      iterations: 100,
      batchSize: 32,
      learningRate: 0.01,
      activationFunction: "tanh",
    });

  async function trainModel() {
    setTrainingData([]);
    const csvBlob = new Blob([fileData], { type: "text/csv" });
    const csvFile = new File([csvBlob], "data.csv", { type: "text/csv" });
    const formData = new FormData();

    formData.append("file", csvFile);
    formData.append("label_index", columns.indexOf(selectedColumn!).toString());
    formData.append("iterations", modelConfiguration.iterations.toString());
    // formData.append("batch_size", modelConfiguration.batchSize.toString());
    formData.append(
      "learning_rate",
      modelConfiguration.learningRate.toString(),
    );
    formData.append(
      "activation_function",
      modelConfiguration.activationFunction,
    );

    const eventSource = new EventSource(
      `http://127.0.0.1:5000/api/train_progress`,
    );

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data) as TrainingDataType;
      if (data.status === "complete") {
        eventSource.close();
        return;
      }
      if (data.status === "preparing") {
        return;
      }
      setTrainingData((prevData) => [...prevData, data]);
    };

    await fetch("http://127.0.0.1:5000/api/train_model", {
      method: "POST",
      body: formData,
    });
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
                <label htmlFor="iteration" className="text-sm font-medium">
                  Iterations
                </label>
                <Input
                  onChange={(e) =>
                    setModelConfiguration({
                      ...modelConfiguration,
                      iterations: parseInt(e.target.value),
                    })
                  }
                  id="iteration"
                  type="number"
                  defaultValue={100}
                  min={1}
                  max={5000}
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
                <Select
                  defaultValue="0.01"
                  onValueChange={(e) =>
                    setModelConfiguration({
                      ...modelConfiguration,
                      learningRate: parseFloat(e),
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue id="learning-rate" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0.0001">0.0001</SelectItem>
                    <SelectItem value="0.001">0.001</SelectItem>
                    <SelectItem value="0.01">0.01</SelectItem>
                    <SelectItem value="0.1">0.1</SelectItem>
                    <SelectItem value="1">1</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-1">
                <label
                  htmlFor="activation-function"
                  className="text-sm font-medium"
                >
                  Activation function
                </label>
                <Select
                  defaultValue="tanh"
                  onValueChange={(e) =>
                    setModelConfiguration({
                      ...modelConfiguration,
                      activationFunction: e as
                        | "relu"
                        | "tanh"
                        | "sigmoid"
                        | "linear",
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue id="learning-rate" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="relu">ReLU</SelectItem>
                    <SelectItem value="tanh">Tanh</SelectItem>
                    <SelectItem value="sigmoid">Sigmoid</SelectItem>
                    <SelectItem value="linear">Linear</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </CardContent>
        <CardContent className="border-t pt-4">
          <p className="text-center font-medium">Neural network architecture</p>
          <NeuralNetworkArchitecture />
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
      <Charts data={trainingData} />
    </>
  );
}
