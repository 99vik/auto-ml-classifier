import { getDataByFileName } from "@/actions";
import ModelConfigurator from "./_components/ModelConfigurator";
import { Button, buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import { MoveLeft } from "lucide-react";

export default async function Page({
  params,
}: {
  params: { fileName: string };
}) {
  const { fileName } = params;
  const { fileData, columns } = await getDataByFileName(fileName);

  return (
    <>
      <Link
        className={buttonVariants({
          variant: "link",
          className: "absolute -right-[16px] -top-[24px] gap-2",
        })}
        href="/train"
      >
        <MoveLeft size={16} strokeWidth={2} />
        Back to dataset selector
      </Link>
      <ModelConfigurator fileData={fileData} columns={columns} />
    </>
  );
}
