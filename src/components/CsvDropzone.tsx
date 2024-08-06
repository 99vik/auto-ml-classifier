'use client';

import { cn } from '@/lib/utils';
import { FileSpreadsheet } from 'lucide-react';
import { useState } from 'react';
import Dropzone, { FileRejection } from 'react-dropzone';
import { Button } from './ui/button';

export default function CsvDropzone({
  setPreview,
  setFile,
}: {
  setPreview: () => void;
  setFile: (file: File) => void;
}) {
  const [isDragOver, setIsDragOver] = useState(false);

  async function onDropAccepted(files: File[]) {
    setIsDragOver(false);
    const file = files[0];
    setPreview();
    setFile(file);
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
