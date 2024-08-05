'use client';

import { cn } from '@/lib/utils';
import { FileSpreadsheet, LoaderCircle } from 'lucide-react';
import { useState } from 'react';
import Dropzone, { FileRejection } from 'react-dropzone';
import { Button } from './ui/button';
import uploadCsv from '@/actions';
import { useMutation } from '@tanstack/react-query';

export default function CsvDropzone({
  setPreview,
  setFile,
}: {
  setPreview: () => void;
  setFile: (file: File) => void;
}) {
  const [isDragOver, setIsDragOver] = useState(false);

  const { mutate: uploadFile, isPending } = useMutation({
    mutationKey: ['csv-upload'],
    mutationFn: uploadCsv,
    onSuccess: () => setPreview(),
  });
  async function onDropAccepted(files: File[]) {
    setIsDragOver(false);
    const file = files[0];
    setPreview();
    setFile(file);
    // console.log(file);
    // Papa.parse(file, {
    //   complete: (result) => {
    //     console.log(result);
    //     console.log(result.data[0]);
    //     //   sendFile(file);
    //   },
    //   error: (error) => {
    //     console.error(error);
    //   },
    // });
    // const arrayBuffer = await file.arrayBuffer();
    // const uint8Array = new Uint8Array(arrayBuffer);
    // uploadFile({ fileData: uint8Array, fileName: file.name });
  }

  function onDropRejected(files: FileRejection[]) {
    setIsDragOver(false);
    console.error('rejected');
    // toast({
    //   title: "Error has occurred.",
    //   description: files[0].errors[0].message,
    //   variant: "destructive",
    // });
  }

  return (
    <Dropzone
      disabled={isPending}
      onDragEnter={() => setIsDragOver(true)}
      onDragLeave={() => setIsDragOver(false)}
      onDropAccepted={onDropAccepted}
      onDropRejected={onDropRejected}
      maxFiles={1}
      accept={{
        'text/csv': ['.csv'],
      }}
    >
      {({ getRootProps, getInputProps }) => (
        <div
          className={cn(
            'flex h-[300px] items-center justify-center rounded-3xl border-2 border-dashed transition bg-secondary',
            isDragOver && 'border-primary'
          )}
          {...getRootProps()}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center gap-1 text-foreground">
            <FileSpreadsheet size={30} className="mb-2" />
            <p>
              <span className="font-semibold">Click or drag</span> here to
              upload
            </p>
            <p className="text-xs text-muted-foreground">
              Only works with CSV files
            </p>
            <Button className="mt-3">Choose file</Button>
          </div>
        </div>
      )}
    </Dropzone>
  );
}
