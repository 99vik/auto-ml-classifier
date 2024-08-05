'use server';

import fs from 'fs/promises';
import path from 'path';

export default async function uploadCsv() {
  const fileName = 'test_file.csv';
  const filePath = path.join(process.cwd(), 'public', 'csv', fileName);
  const content = 't1,t2,t3\n1,2,3';

  await fs.writeFile(filePath, content);
}
