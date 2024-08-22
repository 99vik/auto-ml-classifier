import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { TrainingDataType } from "./ModelConfigurator";
import {
  Label,
  PolarGrid,
  PolarRadiusAxis,
  RadialBar,
  RadialBarChart,
} from "recharts";
import { ChartConfig, ChartContainer } from "@/components/ui/chart";
import { Progress } from "@/components/ui/progress";

const chartConfig = {
  accuracy: {
    label: "Accuracy",
  },
} satisfies ChartConfig;

export default function TrainingResults({
  progress,
  data,
  trainingTime,
}: {
  progress: number;
  data: TrainingDataType[];
  trainingTime: number;
}) {
  console.log(progress);
  return (
    <div className="grid grid-cols-4 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Training progress</CardTitle>
          <CardDescription>
            Track the training progress of your model.
          </CardDescription>
        </CardHeader>
        <div>
          <CardContent>
            <div className="relative flex flex-col items-center justify-center gap-1 text-sm text-muted-foreground">
              <Progress className="h-7" value={progress} />
              <p className="absolute font-medium text-secondary">
                {progress.toFixed(0)}%
              </p>
            </div>
          </CardContent>
        </div>
        <div>
          <CardTitle className="mb-1 text-center">Training time</CardTitle>
          <CardContent>
            <div className="flex flex-col items-center justify-center text-xl font-medium">
              <p>
                {Math.floor(trainingTime / 60)
                  .toString()
                  .padStart(2, "0")}{" "}
                : {(trainingTime % 60).toFixed(0).toString().padStart(2, "0")}
              </p>
            </div>
          </CardContent>
        </div>
      </Card>
      <Card className="col-span-3">
        <CardHeader>
          <CardTitle>Training results</CardTitle>
          <CardDescription>
            Monitor the training metrics of your model.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-4">
          <div className="flex flex-col space-y-3">
            <div className="flex flex-col items-center justify-center">
              <p className="">Test Accuracy</p>
              <p className="text-xl font-bold">
                {data[0]
                  ? data[data.length - 1].testAccuracy.toFixed(2) + "%"
                  : "-"}
              </p>
            </div>
            <div className="flex flex-col items-center justify-center">
              <p className="">Test Loss</p>
              <p className="text-xl font-bold">
                {data[0] ? data[data.length - 1].testLoss.toFixed(4) : "-"}
              </p>
            </div>
          </div>

          <div className="flex flex-col space-y-3">
            <div className="flex flex-col items-center justify-center">
              <p className="">Training Accuracy</p>
              <p className="text-xl font-bold">
                {data[0]
                  ? data[data.length - 1].trainAccuracy.toFixed(2) + "%"
                  : "-"}
              </p>
            </div>

            <div className="flex flex-col items-center justify-center">
              <p className="">Training Loss</p>
              <p className="text-xl font-bold">
                {data[0] ? data[data.length - 1].trainLoss.toFixed(4) : "-"}
              </p>
            </div>
          </div>
          <div className="flex flex-col space-y-3">
            <div className="flex flex-col items-center justify-center">
              <p className="">F1 Score</p>
              <p className="text-xl font-bold">
                {data[0] ? data[data.length - 1].f1Score.toFixed(2) : "-"}
              </p>
            </div>
            <div className="flex flex-col items-center justify-center">
              <p className="">Training time</p>
              <p className="text-xl font-bold">{trainingTime} seconds</p>
            </div>
          </div>

          <div className="flex items-center justify-center">
            <ChartContainer
              config={chartConfig}
              className="aspect-square h-[130px]"
            >
              <RadialBarChart
                data={[
                  {
                    accuracy: data[0] ? data[data.length - 1].testAccuracy : 0,
                  },
                ]}
                startAngle={90}
                endAngle={
                  90 +
                  ((data[0] ? data[data.length - 1].testAccuracy : 0) / 100) *
                    360
                }
                innerRadius={50}
                outerRadius={80}
              >
                <PolarGrid
                  gridType="circle"
                  radialLines={false}
                  stroke="none"
                  className="first:fill-muted last:fill-background"
                  polarRadius={[55, 45]}
                />
                <RadialBar dataKey="accuracy" background cornerRadius={10} />
                <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
                  <Label
                    content={({ viewBox }) => {
                      if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                        return (
                          <text
                            x={viewBox.cx}
                            y={viewBox.cy}
                            textAnchor="middle"
                            dominantBaseline="middle"
                            className="-translate-y-1.5"
                          >
                            <tspan
                              x={viewBox.cx}
                              y={viewBox.cy}
                              className="fill-foreground text-xl font-bold"
                            >
                              {data[0]
                                ? `${data[data.length - 1].testAccuracy.toFixed(1).toLocaleString()}%`
                                : "-"}
                            </tspan>
                            <tspan
                              x={viewBox.cx}
                              y={(viewBox.cy || 0) + 24}
                              className="fill-muted-foreground"
                            >
                              Accuracy
                            </tspan>
                          </text>
                        );
                      }
                    }}
                  />
                </PolarRadiusAxis>
              </RadialBarChart>
            </ChartContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
