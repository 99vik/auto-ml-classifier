'use client';

import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Loader, Upload } from 'lucide-react';
import { Button } from './ui/button';
import { Suspense, useState } from 'react';
import CsvDropzone from './CsvDropzone';
import CsvPreview from './CsvPreview';
import Papa from 'papaparse';
import uploadCsv from '@/actions';

export default function UploadDialog({ refetch }: { refetch: () => void }) {
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<'upload' | 'preview'>('upload');
  const [file, setFile] = useState<File | null>(null);
  const [checkedColumns, setCheckedColumns] = useState<number[]>([]);

  async function handleImport() {
    setIsLoading(true);
    Papa.parse(file!, {
      complete: async (result: { data: string[][] }) => {
        const data = result.data.map((row) =>
          checkedColumns.map((index) => row[index])
        );
        data.pop();
        await uploadCsv({ dataArray: data, fileName: file!.name });
        refetch();
        setOpen(false);
        setTimeout(() => {
          setIsLoading(false);
          setStep('upload');
        }, 300);
      },
      error: (error) => {
        console.error(error);
      },
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Upload size={16} />
          Upload CSV
        </Button>
      </DialogTrigger>
      {step === 'upload' ? (
        <DialogContent className="w-[600px]" aria-describedby={undefined}>
          <DialogTitle>Upload CSV file</DialogTitle>
          <div className="h-px w-full bg-foreground/30" />
          <CsvDropzone
            setFile={setFile}
            setPreview={() => setStep('preview')}
          />
        </DialogContent>
      ) : (
        <DialogContent
          className="w-full  min-h-[300px] pb-5"
          aria-describedby={undefined}
        >
          <DialogTitle>Preview CSV file</DialogTitle>
          <div className="h-px w-full bg-foreground/30" />
          <CsvPreview
            file={file!}
            checkedColumns={checkedColumns}
            setCheckedColumns={setCheckedColumns}
            isLoading={isLoading}
          />
          <p className="text-center text-sm text-muted-foreground -mt-3">
            Showing first 50 rows
          </p>
          <div className="flex justify-end gap-2 -mt-6">
            <Button
              disabled={isLoading}
              variant="outline"
              onClick={() => {
                setStep('upload');
                setFile(null);
              }}
            >
              Back
            </Button>
            <Button
              className="w-[76px]"
              disabled={isLoading}
              onClick={handleImport}
            >
              {isLoading ? (
                <Loader size={16} className="animate-spin" />
              ) : (
                'Import'
              )}
            </Button>
          </div>
        </DialogContent>
      )}
    </Dialog>
  );
}
