import { getDataByFileName, getModelByName } from "@/actions";
import { Button, buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import { MoveLeft } from "lucide-react";
import Predictor from "./_components/Predictor";

export default async function Page({
  params,
}: {
  params: { modelName: string };
}) {
  const { modelName } = params;
  const modelData = await getModelByName(modelName);

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
      <Predictor modelData={modelData} />
    </>
  );
}
