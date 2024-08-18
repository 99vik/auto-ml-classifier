import { readFiles } from "@/actions";
import DatasetSelector from "./_components/DatasetSelector";

export default async function Page() {
  const files = await readFiles();

  return <DatasetSelector files={files} />;
}
