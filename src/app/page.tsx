import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowRight, Brain, Database, Layers, Puzzle } from "lucide-react";
import Link from "next/link";

export default function Page() {
  return (
    <div className="h-full space-y-2 rounded-lg border bg-background p-6">
      <h1 className="text-center text-4xl font-bold tracking-tight">
        Welcome to AutoML Classifier
      </h1>
      <p className="text-center text-lg leading-6 tracking-tight text-muted-foreground">
        Upload datasets, train models, and make predictions with ease. Your
        all-in-one machine learning classification solution.
      </p>
      <div className="space-y-4 pt-10">
        <h2 className="text-center text-2xl font-bold tracking-tight">
          Quick Access
        </h2>
        <div className="grid grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold">Datasets</h2>
                <Database size={20} />
              </div>
              <CardDescription>
                Upload and manage your datasets for training.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link
                className={buttonVariants({
                  className: "w-full items-center gap-2",
                })}
                href="/datasets"
              >
                Go to Datasets <ArrowRight size={20} />
              </Link>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold">Train</h2>
                <Brain size={20} />
              </div>
              <CardDescription>
                Train machine learning models on your datasets.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link
                className={buttonVariants({
                  className: "w-full items-center gap-2",
                })}
                href="/train"
              >
                Go to Training <ArrowRight size={20} />
              </Link>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold">Models</h2>
                <Layers size={20} />
              </div>
              <CardDescription>
                View and manage your trained models.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link
                className={buttonVariants({
                  className: "w-full items-center gap-2",
                })}
                href="/models"
              >
                Go to Models <ArrowRight size={20} />
              </Link>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold">Predict</h2>
                <Puzzle size={20} />
              </div>
              <CardDescription>
                Make predictions using your trained models.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link
                className={buttonVariants({
                  className: "w-full items-center gap-2",
                })}
                href="/predict"
              >
                Go to Predict <ArrowRight size={20} />
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
