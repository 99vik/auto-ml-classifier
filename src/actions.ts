'use server';

import fs from 'fs/promises';
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
}
