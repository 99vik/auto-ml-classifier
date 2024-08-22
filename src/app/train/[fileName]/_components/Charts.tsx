import { CartesianGrid, Line, LineChart, XAxis } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { TrainingDataType } from "./ModelConfigurator";

const lossChartConfig = {
  testLoss: {
    label: "Test set loss",
    color: "hsl(var(--chart-1))",
  },
  trainLoss: {
    label: "Train set loss",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

const accuracyChartConfig = {
  testAccuracy: {
    label: "Test set accuracy (%)",
    color: "hsl(var(--chart-1))",
  },
  trainAccuracy: {
    label: "Train set accuracy (%)",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

export default function Charts({ data }: { data: TrainingDataType[] }) {
  return (
    <div className="grid grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Model loss</CardTitle>
          <CardDescription>Model loss over time</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={lossChartConfig}>
            <LineChart accessibilityLayer data={data}>
              <ChartLegend content={<ChartLegendContent />} />
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="iteration"
                tickMargin={4}
                label={{
                  value: "Iteration",
                  position: "insideBottom",
                  offset: -4,
                }}
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    className="w-40"
                    labelFormatter={(value) => "Iteration " + value}
                  />
                }
              />
              <Line
                dataKey="trainLoss"
                type="monotone"
                stroke="var(--color-trainLoss)"
                strokeWidth={2}
                dot={false}
              />
              <Line
                dataKey="testLoss"
                type="monotone"
                stroke="var(--color-testLoss)"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Model accuracy</CardTitle>
          <CardDescription>Model accuracy over time</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={accuracyChartConfig}>
            <LineChart accessibilityLayer data={data}>
              <ChartLegend content={<ChartLegendContent />} />
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="iteration"
                tickMargin={4}
                label={{
                  value: "Iteration",
                  position: "insideBottom",
                  offset: -4,
                }}
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    className="w-56"
                    labelFormatter={(value) => "Iteration " + value}
                  />
                }
              />
              <Line
                dataKey="trainAccuracy"
                type="monotone"
                stroke="var(--color-trainAccuracy)"
                strokeWidth={2}
                dot={false}
              />
              <Line
                dataKey="testAccuracy"
                type="monotone"
                stroke="var(--color-testAccuracy)"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
}
