import { TrendingUp } from "lucide-react";
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
  CardFooter,
} from "@/components/ui/card";

const chartData = [
  { iteration: "10", testData: 186, trainData: 80 },
  { iteration: "20", testData: 305, trainData: 200 },
  { iteration: "30", testData: 237, trainData: 120 },
  { iteration: "40", testData: 73, trainData: 190 },
  { iteration: "50", testData: 209, trainData: 130 },
  { iteration: "60", testData: 214, trainData: 140 },
];
const chartConfig = {
  testData: {
    label: "Test set loss",
    color: "hsl(var(--chart-1))",
  },
  trainData: {
    label: "Train set loss",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

export default function Charts() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Model loss</CardTitle>
        <CardDescription>Model loss over time</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <LineChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <ChartLegend content={<ChartLegendContent />} />
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="iteration"
              tickMargin={4}
              label={{
                value: "Iteration",
                position: "insideBottom",
                offset: -2,
              }}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent labelFormatter={(v) => "Iteration " + v} />
              }
            />
            <Line
              dataKey="trainData"
              type="monotone"
              stroke="var(--color-trainData)"
              strokeWidth={2}
              dot={false}
            />
            <Line
              dataKey="testData"
              type="monotone"
              stroke="var(--color-testData)"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
      <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">asd</div>
      </CardFooter>
    </Card>
  );
}
