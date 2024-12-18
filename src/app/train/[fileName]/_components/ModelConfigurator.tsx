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
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { getModel, saveModel } from "@/actions";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/components/ui/use-toast";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { normalize } from "path";

export interface TrainingDataType {
  status: "training" | "preparing" | "complete" | "" | "saved" | "error";
  iteration: string;
  trainLoss: number;
  trainAccuracy: number;
  testLoss: number;
  testAccuracy: number;
  f1Score: number;
  confusionMatrix: number[][];
  model: string;
  labels: number[];
  dataByLabels: ("Number" | string[])[];
  totalParams: number;
  error: string;
}

interface ModelConfiguration {
  iterations: number;
  batchSize: number;
  learningRate: number;
  activationFunction: "relu" | "tanh" | "sigmoid" | "linear";
  hiddenLayers: number[];
  normalization: boolean;
  dropout: number;
  trainTestSplit: number;
  randomSeed: number;
}

export default function ModelConfigurator({
  fileData,
  columns,
}: {
  fileData: string;
  columns: string[];
}) {
  const [selectedColumn, setSelectedColumn] = useState<null | string>(null);
  const [uniqueOutputs, setUniqueOutputs] = useState<any>(null);
  const [status, setStatus] = useState<string>("");
  const [trainingData, setTrainingData] = useState<[] | TrainingDataType[]>([]);
  const [trainingTime, setTrainingTime] = useState<string>("0");
  const [randomSeedEnabled, sedRandomSeedEnabled] = useState<boolean>(false);
  const [randomSeedValue, setRandomSeedValue] = useState<number>(100);
  const [trainPercentage, setTrainPercentage] = useState(80);
  const [dropOutPercentage, setDropOutPercentage] = useState(0);
  const [modelName, setModelName] = useState<string>("");
  const [modelConfiguration, setModelConfiguration] =
    useState<ModelConfiguration>({
      iterations: 100,
      batchSize: 32,
      learningRate: 0.01,
      activationFunction: "tanh",
      hiddenLayers: [4],
      normalization: false,
      dropout: 0,
      trainTestSplit: 80,
      randomSeed: 100,
    });
  const [modelData, setModel] = useState<{
    model: string;
    labels: number[];
    dataByLabels: ("Number" | string[])[];
    totalParams: number;
  } | null>(null);
  const { toast } = useToast();

  function trainModel() {
    setStatus("preparing");
    setTrainingData([]);
    setTrainingTime("0");

    const startTime = Date.now();
    let timerInterval: NodeJS.Timeout;

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
    formData.append(
      "normalization",
      modelConfiguration.normalization.toString(),
    );
    formData.append("dropout", modelConfiguration.dropout.toString());
    formData.append(
      "train_test_split",
      modelConfiguration.trainTestSplit.toString(),
    );
    formData.append(
      "random_seed",
      (randomSeedEnabled ? randomSeedValue : false).toString(),
    );

    const eventSource = new EventSource(
      `http://127.0.0.1:5000/api/train-progress`,
    );

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data) as TrainingDataType;
      if (data.status === "complete") {
        setStatus("complete");
        setModel({
          model: data.model,
          labels: data.labels,
          dataByLabels: data.dataByLabels,
          totalParams: data.totalParams,
        });
        eventSource.close();
        clearInterval(timerInterval);
        return;
      }
      if (data.status === "preparing") {
        return;
      }
      if (data.status === "error") {
        eventSource.close();
        clearInterval(timerInterval);
        setTrainingTime("0");
        setTrainingData([]);
        setStatus("");
        toast({
          variant: "destructive",
          title: "Error training model.",
          description: data.error,
        });
        return;
      }
      setStatus("training");
      setTrainingData((prevData) => [...prevData, data]);
      if (Number(data.iteration) === modelConfiguration.iterations) {
        toast({
          title: "Model trained successfully",
          description: `Model trained with final accuracy of ${data.testAccuracy.toFixed(1)}% on test set.`,
        });
      }
    };

    timerInterval = setInterval(() => {
      const elapsedTime = (Date.now() - startTime) / 1000;
      setTrainingTime(elapsedTime.toFixed(2));
    }, 100);

    fetch("http://127.0.0.1:5000/api/train-model", {
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
              setTrainingData([]);
              setSelectedColumn(value);
              const { data } = Papa.parse(fileData) as {
                data: (string | number)[][];
              };
              const uniqueOutputs = new Set(
                data.slice(1).map((row) => row[columns.indexOf(value)]),
              );
              setUniqueOutputs(uniqueOutputs);
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
          {selectedColumn !== null && (
            <Accordion type="single" collapsible>
              <AccordionItem
                className="mt-4 border-b-0 border-t"
                value="item-1"
              >
                <AccordionTrigger className="justify-center gap-6 pb-0 pt-3">
                  Target label information
                </AccordionTrigger>
                <AccordionContent className="space-y-1 pb-0 pt-2">
                  <p className="line-clamp-3 text-muted-foreground">
                    <span className="font-medium text-primary">
                      {columns.length - 1} input features (input layer):
                    </span>{" "}
                    {columns.filter((col) => col !== selectedColumn).join(", ")}
                  </p>
                  <p className="line-clamp-3 text-muted-foreground">
                    <span className="font-medium text-primary">
                      {uniqueOutputs.size} target labels (output layer):
                    </span>{" "}
                    {Array.from(uniqueOutputs).join(", ")}
                  </p>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          )}
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
              <div className="grid gap-5">
                <div className="grid grid-cols-3 gap-4">
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
                      // @ts-ignore
                      onWheel={(e) => e.target.blur()}
                      min={10}
                      step={10}
                      max={5000}
                      className="w-full"
                    />
                  </div>
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
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <label className="text-center text-sm font-medium">
                      Train/Test set ratio
                    </label>
                    <div className="mx-auto w-[250px]">
                      <Slider
                        defaultValue={[modelConfiguration.trainTestSplit]}
                        max={90}
                        min={10}
                        step={10}
                        onValueChange={(value) =>
                          setModelConfiguration({
                            ...modelConfiguration,
                            trainTestSplit: value[0],
                          })
                        }
                      />
                      <div className="mt-1 flex items-center justify-between text-sm text-muted-foreground">
                        <p>Train: {modelConfiguration.trainTestSplit}%</p>
                        <p>Test: {100 - modelConfiguration.trainTestSplit}%</p>
                      </div>
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <label className="text-center text-sm font-medium">
                      Dropout
                    </label>
                    <div className="mx-auto w-[250px]">
                      <Slider
                        defaultValue={[modelConfiguration.dropout]}
                        max={50}
                        min={0}
                        step={1}
                        onValueChange={(value) =>
                          setModelConfiguration({
                            ...modelConfiguration,
                            dropout: value[0],
                          })
                        }
                      />
                      <div className="mt-1 flex items-center justify-center text-sm text-muted-foreground">
                        <p>{modelConfiguration.dropout}%</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center justify-center space-x-2 py-3">
                    <Checkbox
                      id="randomSeed"
                      checked={randomSeedEnabled}
                      onCheckedChange={(checked: boolean) =>
                        sedRandomSeedEnabled(checked)
                      }
                    />
                    <label
                      htmlFor="randomSeed"
                      className="w-max text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Random seed
                    </label>
                    <Input
                      className="w-20"
                      disabled={!randomSeedEnabled}
                      value={randomSeedValue}
                      onChange={(e) =>
                        setRandomSeedValue(Number(e.target.value))
                      }
                    />
                  </div>
                  <div className="flex items-center justify-center space-x-2 py-3">
                    <Checkbox
                      id="normalization"
                      checked={modelConfiguration.normalization}
                      onCheckedChange={(checked: boolean) =>
                        setModelConfiguration({
                          ...modelConfiguration,
                          normalization: checked,
                        })
                      }
                    />
                    <label
                      htmlFor="normalization"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Normalization
                    </label>
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
                numberOfOutputs={uniqueOutputs.size}
              />
            </CardContent>
            <CardFooter className="border-t pt-4">
              <Button
                onClick={trainModel}
                disabled={
                  selectedColumn === null ||
                  status === "training" ||
                  status === "preparing"
                }
                className="w-full"
              >
                {status === "training" || status === "preparing"
                  ? "Training..."
                  : "Train model"}
              </Button>
            </CardFooter>
          </Card>
          <div className="grid grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Training progress</CardTitle>
                <CardDescription>
                  Track the training progress of your model.
                </CardDescription>
              </CardHeader>
              <div>
                <CardContent>
                  <div className="relative flex flex-col items-center justify-center gap-1 text-sm text-muted-foreground">
                    <Progress
                      className="h-7"
                      value={
                        status === "complete"
                          ? 100
                          : trainingData.length > 0
                            ? (Number(
                                trainingData[trainingData.length - 1].iteration,
                              ) /
                                modelConfiguration.iterations) *
                              100
                            : 0
                      }
                    />
                    <p className="absolute font-medium text-secondary">
                      {(status === "complete"
                        ? 100
                        : trainingData.length > 0
                          ? (Number(
                              trainingData[trainingData.length - 1].iteration,
                            ) /
                              modelConfiguration.iterations) *
                            100
                          : 0
                      ).toFixed(0)}
                      %
                    </p>
                  </div>
                </CardContent>
              </div>
              <div>
                <CardTitle className="mb-1 text-center">
                  Training time
                </CardTitle>
                <CardContent>
                  <div className="flex flex-col items-center justify-center text-xl font-medium">
                    <p>
                      {Math.floor(Number(trainingTime) / 60)
                        .toString()
                        .padStart(2, "0")}{" "}
                      :{" "}
                      {(Number(trainingTime) % 60)
                        .toFixed(0)
                        .toString()
                        .padStart(2, "0")}
                    </p>
                  </div>
                </CardContent>
              </div>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Save model</CardTitle>
                <CardDescription>
                  Save current trained model for future use.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex w-full flex-col items-center space-y-3">
                  <Input
                    value={modelName}
                    onChange={(e) => setModelName(e.target.value)}
                    disabled={status !== "complete"}
                    type="modelName"
                    placeholder="Name your model"
                  />
                  <Button
                    disabled={status !== "complete" || modelName.length < 1}
                    type="submit"
                    className="w-full"
                    onClick={async () => {
                      const modelJson = JSON.parse(modelData!.model);
                      const modelDataObject = {
                        model: modelJson,
                        label: selectedColumn,
                        columns: columns,
                        inputSize: columns.length - 1,
                        outputSize: uniqueOutputs.size,
                        activationFunction:
                          modelConfiguration.activationFunction,
                        hiddenLayers: modelConfiguration.hiddenLayers,
                        labels: modelData!.labels,
                        dataByLabels: modelData!.dataByLabels,
                        totalParams: modelData!.totalParams,
                        labelIndex: columns.indexOf(selectedColumn!),
                        normalization: modelConfiguration.normalization,
                        f1Score: trainingData[trainingData.length - 1].f1Score,
                        accuracy:
                          trainingData[trainingData.length - 1].testAccuracy,
                      };
                      await saveModel(
                        JSON.stringify(modelDataObject),
                        modelName,
                      );
                      toast({
                        title: "Model saved.",
                        description: `Model "${modelName}" saved successfully.`,
                      });
                      setStatus("saved");
                      setModelName("");
                    }}
                  >
                    {status === "saved" ? "Model saved." : "Save"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
          <TrainingResults trainingTime={trainingTime} data={trainingData} />
          <Charts labels={Array.from(uniqueOutputs)} data={trainingData} />
        </>
      )}
    </>
  );
}
