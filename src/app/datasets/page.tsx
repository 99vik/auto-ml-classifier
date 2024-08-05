import UploadDialog from '@/components/UploadDialog';

export default function Page() {
  return (
    <div className="h-full">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-semibold">Datasets</h1>
        <UploadDialog />
      </div>
      <div className="h-px w-full bg-foreground/20 my-2" />
      <p>datasets</p>
    </div>
  );
}
