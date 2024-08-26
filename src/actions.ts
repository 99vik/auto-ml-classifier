"use server";

import fs from "fs/promises";
import path from "path";
import Papa from "papaparse";
import { revalidatePath } from "next/cache";

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
    modelName + ".json",
  );
  await fs.writeFile(filePath, model);
  revalidatePath("/models");
}

export async function getModel(label: string) {
  const filePath = path.join(
    process.cwd(),
    "public",
    "models",
    label + ".json",
  );
  const fileContect = await fs.readFile(filePath, "utf8");
  return JSON.parse(fileContect);
}

export async function getCsvFileData(filePath: string) {
  return await fs.readFile(filePath, "utf8");
}

export async function getDataByFileName(fileName: string) {
  const filePath = path.join(process.cwd(), "public", "csv", fileName + ".csv");
  const fileData = await fs.readFile(filePath, "utf8");
  // console.log(fileData);
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

  return fileNames;
  // const model = await fs.readFile(path.join(csvDir, fileNames[0]), "utf8");
  // console.log(typeof model);
  // const files = await Promise.all(
  //   fileNames.map(async (fileName) => {
  //     const { data } = Papa.parse(
  //       await fs.readFile(path.join(csvDir, fileName), "utf8"),
  //     );
  // const { size, mtime, birthtime } = await fs.stat(
  //   path.join(csvDir, fileName),
  // );
  // return {
  //   name: fileName.replace(".csv", ""),
  //   sizeInBytes: size,
  //   importedTime: mtime,
  //   createdTime: birthtime,
  //   path: path.join(csvDir, fileName),
  //   samples: data.length - 1,
  //   // @ts-ignore
  //   columnsNum: data[0].length,
  //   columns: data[0],
  // };
  // }),
  // );

  // return files;
}

export async function removeFiles(filePaths: string[]) {
  await Promise.all(
    filePaths.map(async (filePath) => {
      await fs.unlink(filePath);
    }),
  );
  revalidatePath("/train");
}
