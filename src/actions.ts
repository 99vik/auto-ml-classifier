'use server';

import fs from 'fs/promises';
import path from 'path';

export default async function uploadCsv(
  fileData: Uint8Array,
  fileName: string
) {
  const filePath = path.join(process.cwd(), 'public', 'csv', fileName);
  await fs.writeFile(filePath, Buffer.from(fileData));
}
