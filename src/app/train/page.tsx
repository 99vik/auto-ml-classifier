import { readFiles } from "@/actions";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default async function Page() {
  const files = await readFiles();

  return (
    <div className="h-full">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-semibold">Train</h1>
      </div>
      <div className="my-2 h-px w-full bg-foreground/20" />
      <Card>
        <CardHeader>
          <CardTitle>Select Dataset</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Select>
              <SelectTrigger className="w-fit">
                <SelectValue placeholder="Select dataset" />
              </SelectTrigger>
              <SelectContent>
                {files.map((file) => (
                  <SelectItem key={file.name} value={file.path}>
                    {file.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Samples: 150</span>
              <span className="text-sm font-medium">Features: 4</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Classes: 3</span>
              <span className="text-sm font-medium">
                Last Updated: 2023-04-15
              </span>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button>Start Training</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
