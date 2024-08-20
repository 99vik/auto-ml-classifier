import { getDataByFileName } from "@/actions";
import ModelConfigurator from "./_components/ModelConfigurator";

export default async function Page({
  params,
}: {
  params: { fileName: string };
}) {
  const { fileName } = params;
  const { fileData, columns } = await getDataByFileName(fileName);

  return <ModelConfigurator fileData={fileData} columns={columns} />;
}
