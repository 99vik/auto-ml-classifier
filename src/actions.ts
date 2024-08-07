'use server';

import fs, { stat } from 'fs/promises';
import { revalidatePath } from 'next/cache';
import path from 'path';

export default async function uploadCsv({
  dataArray,
  fileName,
}: {
  dataArray: string[][];
  fileName: string;
}) {
  const fileData = dataArray.map((row) => row.join(',')).join('\n');
  const filePath = path.join(process.cwd(), 'public', 'csv', fileName);
  await fs.writeFile(filePath, fileData);
  revalidatePath('/');
}

export async function getCsvFileData(filePath: string) {
  return await fs.readFile(filePath, 'utf8');
}

export async function readFiles() {
  const csvDir = path.join(process.cwd(), 'public', 'csv');
  const fileNames = await fs.readdir(csvDir);

  const files = await Promise.all(
    fileNames.map(async (fileName) => {
      const { size, mtime } = await fs.stat(path.join(csvDir, fileName));
      return {
        name: fileName.replace('.csv', ''),
        sizeInBytes: size,
        importedTime: mtime,
        path: path.join(csvDir, fileName),
      };
    })
  );
  return files;
}
