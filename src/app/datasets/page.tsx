import { readFiles } from '@/actions';
import UploadDialog from '@/components/UploadDialog';
import { formatBytes } from '@/lib/utils';

export default async function Page() {
  const files = await readFiles();
  console.log(files);
  return (
    <div className="h-full">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-semibold">Datasets</h1>
        <UploadDialog />
      </div>
      <div className="h-px w-full bg-foreground/20 my-2" />
      <div className=" bg-background rounded-lg border">
        <div className="grid grid-cols-4 font-semibold bg-zinc-50 p-1 border-b">
          <p className="col-span-2">Name</p>
          <p>Size</p>
          <p>Imported at</p>
        </div>
        <div className="flex flex-col gap-2">
          {files.map((file) => (
            <div key={file.name} className="grid grid-cols-4 p-1">
              <p className="col-span-2">{file.name}</p>
              <p>{formatBytes(file.size)}</p>
              <p>{file.createdAt.toLocaleDateString()}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
