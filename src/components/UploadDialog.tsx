'use client';

import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Upload } from 'lucide-react';
import { Button } from './ui/button';
import { useState } from 'react';
import CsvDropzone from './CsvDropzone';
import CsvPreview from './CsvPreview';

export default function UploadDialog() {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<'upload' | 'preview'>('upload');
  const [file, setFile] = useState<File | null>(null);

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
        <DialogContent className="w-full pb-5" aria-describedby={undefined}>
          <DialogTitle>Preview CSV file</DialogTitle>
          <div className="h-px w-full bg-foreground/30" />
          <CsvPreview file={file!} />
          <p className="text-center text-sm text-muted-foreground -mt-3">
            Showing first 50 rows
          </p>
          <div className="flex justify-end gap-2 -mt-6">
            <Button
              variant="outline"
              onClick={() => {
                setStep('upload');
                setFile(null);
              }}
            >
              Back
            </Button>
            <Button>Import</Button>
          </div>
        </DialogContent>
      )}
    </Dialog>
  );
}
