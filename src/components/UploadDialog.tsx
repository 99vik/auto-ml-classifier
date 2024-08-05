'use client';

import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Upload } from 'lucide-react';
import { Button } from './ui/button';
import DropzoneComp from './DropzoneComp';

export default function UploadDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Upload size={16} />
          Upload CSV
        </Button>
      </DialogTrigger>
      <DialogContent className="w-full" aria-describedby={undefined}>
        <DialogTitle>Upload CSV file</DialogTitle>
        <div className="h-px w-full bg-foreground/30" />
        <DropzoneComp />
      </DialogContent>
    </Dialog>
  );
}
