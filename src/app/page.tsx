'use client';

export default function Home() {
  function handleFileUpload(e: any) {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = (e: any) => {
      const data = e.target.result;
      console.log(data);
    };

    reader.readAsText(file);
  }

  return (
    <main className="flex min-h-screen flex-col">
      <input onInput={handleFileUpload} type="file" accept=".csv" />
    </main>
  );
}
