"use client";

export default function Page({ params }: { params: { fileName: string } }) {
  const { fileName } = params;
  return <div>{fileName}</div>;
}
