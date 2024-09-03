export interface ModelData {
  model: string;
  label: string;
  columns: string[];
  inputSize: number;
  outputSize: number;
  activationFunction: "relu" | "tanh" | "sigmoid" | "linear";
  hiddenLayers: number[];
  labels: number[];
  dataByLabels: ("Number" | string[])[];
  totalParams: number;
  labelIndex: number;
  f1Score: number;
  accuracy: number;
  normalization: boolean;
}

export interface InputData {
  [key: string]: number | string | null;
}
