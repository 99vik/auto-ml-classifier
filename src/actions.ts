"use server";

import fs from "fs/promises";
import path from "path";
import Papa from "papaparse";
import { revalidatePath } from "next/cache";
import { InputData, ModelData } from "./types";

export default async function uploadCsv({
  dataArray,
  fileName,
}: {
  dataArray: string[][];
  fileName: string;
}) {
  const fileData = dataArray.map((row) => row.join(",")).join("\n");
  const filePath = path.join(process.cwd(), "public", "csv", fileName);
  await fs.writeFile(filePath, fileData);
  revalidatePath("/train");
}

export async function saveModel(model: string, modelName: string) {
  const filePath = path.join(
    process.cwd(),
    "public",
    "models",
    modelName.trim() + ".json",
  );
  await fs.writeFile(filePath, model);
  revalidatePath("/models");
}

export async function getModel(path: string) {
  const fileContent = await fs.readFile(path, "utf8");
  return JSON.parse(fileContent) as ModelData;
}

export async function getModelByName(modelName: string) {
  const filePath = path.join(
    process.cwd(),
    "public",
    "models",
    decodeURIComponent(modelName) + ".json",
  );
  const fileContent = await fs.readFile(filePath, "utf8");
  return JSON.parse(fileContent) as ModelData;
}

export async function predictLabel(modelData: ModelData, inputData: InputData) {
  const reqBody = {
    model: modelData.model,
    inputSize: modelData.inputSize,
    outputSize: modelData.outputSize,
    activationFunction: modelData.activationFunction,
    hiddenLayers: modelData.hiddenLayers,
    inputs: Object.values(inputData),
  };
  const res = await fetch("http://127.0.0.1:5000/api/predict", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(reqBody),
  });
  const data = await res.json();
  return data.prediction;
}

export async function getCsvFileData(filePath: string) {
  return await fs.readFile(filePath, "utf8");
}

export async function getCsvFilesForDownload({ paths }: { paths: string[] }) {
  console.log(paths);
  const files = await Promise.all(
    paths.map(async (filePath) => {
      const fileData = await fs.readFile(filePath, "utf8");
      const fileName = path.basename(filePath);

      return {
        fileName: fileName,
        content: fileData,
      };
    }),
    //   const { size, mtime, birthtime } = await fs.stat(
    //     path.join(csvDir, fileName),
    //   );
    //   return {
    //     name: fileName.replace(".csv", ""),
    //     sizeInBytes: size,
    //     importedTime: mtime,
    //     createdTime: birthtime,
    //     path: path.join(csvDir, fileName),
    //     samples: data.length - 1,
    //     // @ts-ignore
    //     columnsNum: data[0].length,
    //     columns: data[0],
    //   };
    // }),
  );
  return files;
}

export async function getDataByFileName(fileName: string) {
  const filePath = path.join(process.cwd(), "public", "csv", fileName + ".csv");
  const fileData = await fs.readFile(filePath, "utf8");
  const { data } = Papa.parse(fileData);
  return { fileData: fileData, columns: data[0] } as {
    fileData: string;
    columns: string[];
  };
}

export async function readFiles() {
  const csvDir = path.join(process.cwd(), "public", "csv");
  const fileNames = await fs.readdir(csvDir);
  const files = await Promise.all(
    fileNames.map(async (fileName) => {
      const { data } = Papa.parse(
        await fs.readFile(path.join(csvDir, fileName), "utf8"),
      );
      const { size, mtime, birthtime } = await fs.stat(
        path.join(csvDir, fileName),
      );
      return {
        name: fileName.replace(".csv", ""),
        sizeInBytes: size,
        importedTime: mtime,
        createdTime: birthtime,
        path: path.join(csvDir, fileName),
        samples: data.length - 1,
        // @ts-ignore
        columnsNum: data[0].length,
        columns: data[0],
      };
    }),
  );

  return files;
}

export async function readModels() {
  const csvDir = path.join(process.cwd(), "public", "models");
  const fileNames = await fs.readdir(csvDir);

  const models = await Promise.all(
    fileNames.map(async (fileName) => {
      const { size, mtime, birthtime } = await fs.stat(
        path.join(csvDir, fileName),
      );
      return {
        name: fileName.replace(".json", ""),
        sizeInBytes: size,
        importedTime: mtime,
        createdTime: birthtime,
        path: path.join(csvDir, fileName),
      };
    }),
  );

  return models;
}

export async function removeModels(filePaths: string[]) {
  console.log(filePaths);
  await Promise.all(
    filePaths.map(async (filePath) => {
      await fs.unlink(filePath);
    }),
  );
  revalidatePath("/models");
}

export async function removeFiles(filePaths: string[]) {
  await Promise.all(
    filePaths.map(async (filePath) => {
      await fs.unlink(filePath);
    }),
  );
  revalidatePath("/train");
}
