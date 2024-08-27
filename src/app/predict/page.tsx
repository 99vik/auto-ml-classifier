import { readModels } from "@/actions";
import ModelSelector from "./_components/ModelSelector";

export default async function Page() {
  const models = await readModels();

  return <ModelSelector models={models} />;
}
