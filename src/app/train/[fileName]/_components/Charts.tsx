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
import { cn } from "@/lib/utils";

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

export default function Charts({
  data,
  labels,
}: {
  data: TrainingDataType[];
  labels: string[];
}) {
  return (
    <div className="space-y-6">
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
      <Card>
        <CardHeader>
          <CardTitle>Confusion matrix</CardTitle>
          <CardDescription>
            Compare predicted values with the true values.
          </CardDescription>
        </CardHeader>
        <CardContent className="relative space-y-2 pl-40 pr-52 text-sm font-medium">
          <p className="absolute right-36 top-1/2 -rotate-90 text-xl text-muted-foreground">
            Predicted
          </p>

          <div className={cn("grid", `grid-cols-${labels.length + 1}`)}>
            {[""].concat(labels).map((label, index) => (
              <div
                key={`${label}-${index}`}
                className="flex h-10 w-full items-center justify-center"
              >
                {label}
              </div>
            ))}
          </div>
          {labels.map((label, labelIndex) => (
            <div
              key={`${labelIndex}-${label}`}
              className={cn("grid gap-2", `grid-cols-${labels.length + 1}`)}
            >
              <div className="flex w-full items-center justify-end pr-5">
                {label}
              </div>
              {data[0]
                ? data[data.length - 1].confusionMatrix[labelIndex].map(
                    (value, index) => (
                      <div
                        key={index}
                        className={cn(
                          "flex h-20 w-full items-center justify-center rounded-lg border",
                          index === labelIndex ? "bg-green-200" : "bg-red-200",
                        )}
                      >
                        {value}
                      </div>
                    ),
                  )
                : [...Array(labels.length)].map((_, index) => (
                    <div
                      key={index}
                      className={cn(
                        "flex h-20 w-full items-center justify-center rounded-lg border",
                        index === labelIndex ? "bg-green-200" : "bg-red-200",
                      )}
                    >
                      -
                    </div>
                  ))}
            </div>
          ))}
          <div className="mt-2 grid grid-cols-4">
            <div></div>
            <p className="col-span-3 text-center text-xl text-muted-foreground">
              Expected
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
