import { getDataByFileName } from "@/actions";
import { Button, buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import { MoveLeft } from "lucide-react";

export default async function Page({
  params,
}: {
  params: { modelName: string };
}) {
  const { modelName } = params;
  //   const { fileData, columns } = await getDataByFileName(modelName);

  return (
    <>
      <Link
        className={buttonVariants({
          variant: "link",
          className: "absolute -right-[16px] -top-[24px] gap-2",
        })}
        href="/predict"
      >
        <MoveLeft size={16} strokeWidth={2} />
        Back to model selector
      </Link>
      <p>Predict {modelName}</p>
    </>
  );
}
