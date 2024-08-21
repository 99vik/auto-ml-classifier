"use client";

import Papa from "papaparse";
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
import { Minus, Plus } from "lucide-react";
import TrainingResults from "./TrainingResults";

export interface TrainingDataType {
  status: "training" | "preparing" | "complete" | "";
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
  hiddenLayers: number[];
}

export default function ModelConfigurator({
  fileData,
  columns,
}: {
  fileData: string;
  columns: string[];
}) {
  const [selectedColumn, setSelectedColumn] = useState<null | string>(null);
  const [numberOfOutputs, setNumberOfOutputs] = useState<number>(0);
  const [status, setStatus] = useState<string>("");
  const [trainingData, setTrainingData] = useState<[] | TrainingDataType[]>([]);
  const [modelConfiguration, setModelConfiguration] =
    useState<ModelConfiguration>({
      iterations: 100,
      batchSize: 32,
      learningRate: 0.01,
      activationFunction: "tanh",
      hiddenLayers: [4],
    });

  function trainModel() {
    setStatus("preparing");
    setTrainingData([]);
    const csvBlob = new Blob([fileData], { type: "text/csv" });
    const csvFile = new File([csvBlob], "data.csv", { type: "text/csv" });
    const formData = new FormData();

    formData.append("file", csvFile);
    formData.append("label_index", columns.indexOf(selectedColumn!).toString());
    formData.append("iterations", modelConfiguration.iterations.toString());
    formData.append(
      "learning_rate",
      modelConfiguration.learningRate.toString(),
    );
    formData.append(
      "activation_function",
      modelConfiguration.activationFunction,
    );
    formData.append("hidden_layers", modelConfiguration.hiddenLayers.join(","));

    const eventSource = new EventSource(
      `http://127.0.0.1:5000/api/train_progress`,
    );

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data) as TrainingDataType;
      if (data.status === "complete") {
        setStatus("complete");
        eventSource.close();
        return;
      }
      if (data.status === "preparing") {
        return;
      }
      setStatus("training");
      setTrainingData((prevData) => [...prevData, data]);
    };

    fetch("http://127.0.0.1:5000/api/train_model", {
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
          <Select
            onValueChange={(value) => {
              setSelectedColumn(value);
              const { data } = Papa.parse(fileData) as {
                data: (string | number)[][];
              };
              const uniqueSpecies = new Set(
                data.slice(1).map((row) => row[columns.indexOf(value)]),
              );
              setNumberOfOutputs(uniqueSpecies.size);
            }}
          >
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
      {selectedColumn !== null && (
        <>
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
                    <label
                      htmlFor="learning-rate"
                      className="text-sm font-medium"
                    >
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
              <p className="text-center font-medium">
                Neural network architecture
              </p>
              <div className="mt-2 flex items-center justify-center gap-2 text-sm">
                <Button
                  disabled={modelConfiguration.hiddenLayers.length === 0}
                  variant="outline"
                  size="sm"
                  className="aspect-square rounded-full px-2"
                  onClick={() =>
                    setModelConfiguration((prevConfig) => ({
                      ...prevConfig,
                      hiddenLayers: prevConfig.hiddenLayers.slice(0, -1),
                    }))
                  }
                >
                  <Minus size={14} strokeWidth={2} />
                </Button>
                <Button
                  disabled={modelConfiguration.hiddenLayers.length === 5}
                  variant="outline"
                  size="sm"
                  className="aspect-square rounded-full px-2"
                  onClick={() =>
                    setModelConfiguration((prevConfig) => ({
                      ...prevConfig,
                      hiddenLayers: [...prevConfig.hiddenLayers, 4],
                    }))
                  }
                >
                  <Plus size={14} strokeWidth={2} />
                </Button>
                <p className="text-center">
                  {modelConfiguration.hiddenLayers.length} Hidden layers
                </p>
              </div>
              <NeuralNetworkArchitecture
                hiddenLayers={modelConfiguration.hiddenLayers}
                setHiddenLayers={(hiddenLayers) =>
                  setModelConfiguration((prevConfig) => ({
                    ...prevConfig,
                    hiddenLayers,
                  }))
                }
                numberOfInputs={columns.length - 1}
                numberOfOutputs={numberOfOutputs}
              />
            </CardContent>
            <CardFooter className="border-t pt-4">
              <Button
                onClick={trainModel}
                disabled={selectedColumn === null || status === "training"}
                className="w-full"
              >
                {status === "training" ? "Training..." : "Train model"}
              </Button>
            </CardFooter>
          </Card>
          <TrainingResults data={trainingData} />
          <Charts data={trainingData} />
        </>
      )}
    </>
  );
}
