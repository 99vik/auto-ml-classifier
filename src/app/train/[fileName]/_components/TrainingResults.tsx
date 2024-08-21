import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
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

const chartData = [{ accuracy: 90.254 }];

const chartConfig = {
  accuracy: {
    label: "Accuracy",
  },
} satisfies ChartConfig;

export default function TrainingResults({
  data,
}: {
  data: TrainingDataType[];
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Training results</CardTitle>
        <CardDescription>
          Monitor the training metrics of your model.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-3">
        <div className="col-span-2">
          <p>
            Accuracy:{" "}
            {data[0]
              ? data[data.length - 1].testAccuracy.toFixed(2) + "%"
              : "-"}
          </p>
        </div>
        <div className="flex items-center justify-center">
          <ChartContainer
            config={chartConfig}
            className="aspect-square h-[130px]"
          >
            <RadialBarChart
              data={chartData}
              startAngle={90}
              //   endAngle={data[0] ? data[data.length - 1].testAccuracy : 0}
              endAngle={
                90 +
                ((data[0] ? data[data.length - 1].testAccuracy : 0) / 100) * 360
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
  );
}
