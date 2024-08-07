import { readFiles } from '@/actions';
import CsvFileDataDialog from '@/components/CsvFileDataDialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import UploadDialog from '@/components/UploadDialog';
import { formatBytes } from '@/lib/utils';

export default async function Page() {
  const files = await readFiles();
  return (
    <div className="h-full">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-semibold">Datasets</h1>
        <UploadDialog />
      </div>
      <div className="h-px w-full bg-foreground/20 my-2" />
      <div className=" bg-background rounded-xl border overflow-hidden">
        <div className="grid grid-cols-5 font-semibold bg-zinc-50 p-4 border-b">
          <div className="col-span-2 flex items-center gap-3">
            <Checkbox />
            <p>Name</p>
          </div>
          <p>Size</p>
          <p>Imported at</p>
        </div>
        <div className="flex flex-col divide-y">
          {files.map((file) => (
            <div
              key={file.name}
              className="grid items-center grid-cols-5 p-4 text-sm"
            >
              <div className="col-span-2 flex items-center gap-3">
                <Checkbox />
                <p className=" ">{file.name}</p>
              </div>
              <p className="">{formatBytes(file.sizeInBytes)}</p>
              <p className="">
                {file.importedTime.toLocaleString('en-DE', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </p>
              <div>
                <CsvFileDataDialog fileName={file.name} filePath={file.path} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
