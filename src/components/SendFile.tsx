'use client';

import Papa from 'papaparse';

export default function Page() {
  async function sendFile(file: File) {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch('http://127.0.0.1:5000/api/test', {
      method: 'POST',
      body: formData,
    });
    console.log(response);
    const body = await response.json();
    console.log(body);
  }
  function handleFileUpload(e: any) {
    const file = e.target.files[0];
    console.log(file);

    Papa.parse(file, {
      complete: (result) => {
        console.log(result);
        console.log(result.data[1]);
        sendFile(file);
      },
      error: (error) => {
        console.error(error);
      },
    });
  }

  return (
    <div className="flex min-h-screen flex-col">
      <input onInput={handleFileUpload} type="file" accept=".csv" />
    </div>
  );
}
