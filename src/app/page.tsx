'use client';

import Papa from 'papaparse';

export default function Page() {
  function handleFileUpload(e: any) {
    const file = e.target.files[0];
    console.log(file);

    Papa.parse(file, {
      complete: (result) => {
        console.log(result);
        console.log(result.data[1]);
      },
      error: (error) => {
        console.error(error);
      },
    });
  }

  return (
    <main className="flex min-h-screen flex-col">
      <input onInput={handleFileUpload} type="file" accept=".csv" />
    </main>
  );
}
