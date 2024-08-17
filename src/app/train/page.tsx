import { readFiles } from "@/actions";
import DatasetSelector from "./_components/DatasetSelector";

export default async function Page() {
  const files = await readFiles();

  return (
    <div className="min-h-full">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-semibold">Train</h1>
      </div>
      <div className="my-2 h-px w-full bg-foreground/20" />
      <DatasetSelector files={files} />
    </div>
  );
}
