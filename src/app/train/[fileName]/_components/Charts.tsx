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
import { TrainingDataType } from "./ModelConfigurator";

const chartData = [
  { iteration: "10", testLoss: 186, trainLoss: 80 },
  { iteration: "20", testLoss: 305, trainLoss: 200 },
  //   { iteration: "30", testLoss: 237, trainLoss: 120 },
  //   { iteration: "40", testLoss: 73, trainLoss: 190 },
  //   { iteration: "50", testLoss: 209, trainLoss: 130 },
  //   { iteration: "60", testLoss: 214, trainLoss: 140 },
];
const chartConfig = {
  testLoss: {
    label: "Test set loss",
    color: "hsl(var(--chart-1))",
  },
  trainLoss: {
    label: "Train set loss",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

export default function Charts({ data }: { data: TrainingDataType[] }) {
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
            data={data}
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
      <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">asd</div>
      </CardFooter>
    </Card>
  );
}
