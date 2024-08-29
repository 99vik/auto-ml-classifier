import { getCsvFilesForDownload } from "@/actions";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { ArrowDownToLine } from "lucide-react";

export function CsvDownloader({
  checkedBoxes,
  resetCheckBoxes,
}: {
  checkedBoxes: string[];
  resetCheckBoxes: () => void;
}) {
  async function downloadCSVs() {
    const csvFiles = await getCsvFilesForDownload({ paths: checkedBoxes });
    csvFiles.forEach(({ fileName, content }) => {
      const blob = new Blob([content], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", fileName);
        link.style.visibility = "hidden";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    });
    resetCheckBoxes();
  }

  return (
    <DropdownMenuItem className="gap-2" onClick={downloadCSVs}>
      <ArrowDownToLine size={12} />
      Download CSV File/s
    </DropdownMenuItem>
  );
}
