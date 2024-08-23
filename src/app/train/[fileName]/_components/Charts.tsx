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
        <CardContent className="relative flex pb-12 pl-10 pr-16 text-sm font-medium">
          <div className="grid w-fit grid-cols-1 gap-1 pr-5">
            <div className="h-8"></div>
            {labels.map((label, index) => (
              <div
                key={`${label}-${index}`}
                className="flex h-20 items-center justify-center"
              >
                {label}
              </div>
            ))}
          </div>
          <div className="flex-1 space-y-1">
            <p className="absolute right-0 top-1/2 -translate-y-1/2 -rotate-90 text-xl text-muted-foreground">
              Predicted
            </p>

            <div className={cn("grid", `grid-cols-${labels.length}`)}>
              {labels.map((label, index) => (
                <div
                  key={`${label}-${index}`}
                  className="flex h-8 w-full items-center justify-center"
                >
                  {label}
                </div>
              ))}
            </div>
            {labels.map((label, labelIndex) => (
              <div
                key={`${labelIndex}-${label}`}
                className={cn("grid gap-1", `grid-cols-${labels.length}`)}
              >
                {data[0]
                  ? data[data.length - 1].confusionMatrix[labelIndex].map(
                      (value, index) => (
                        <div
                          key={index}
                          className={cn(
                            "flex h-20 w-full items-center justify-center rounded-lg border",
                            index === labelIndex
                              ? "bg-green-200"
                              : "bg-red-200",
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
                          index === labelIndex ? "bg-green-100" : "bg-red-100",
                        )}
                      >
                        -
                      </div>
                    ))}
              </div>
            ))}
            <p className="absolute bottom-4 left-1/2 -translate-x-1/2 text-center text-xl text-muted-foreground">
              Expected
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// necessary classes for grid to render properly every time
// grid-cols-2 grid-cols-3 grid-cols-4 grid-cols-5 grid-cols-6 grid-cols-7 grid-cols-8 grid-cols-9 grid-cols-10 grid-cols-11 grid-cols-12
