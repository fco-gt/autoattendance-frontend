"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface SectionCardsProps {
  title: string;
  value: string;
  trendValue?: string;
  lottieAnimation?: object | null;
  lottieSize?: number;
}

export function SectionCards({
  title,
  value
}: SectionCardsProps) {
  return (
    <Card className="@container/card bg-white dark:bg-slate-800/50 shadow-md hover:shadow-lg transition-shadow duration-300 rounded-lg border border-green-200 dark:border-slate-700 overflow-hidden">
      <CardHeader className="pb-3">
        <CardDescription className="text-md text-slate-600 dark:text-slate-400">
          {title}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-start gap-2">
        <div className="flex w-full items-center justify-between gap-3">
          <CardTitle className="text-3xl font-bold text-green-900 dark:text-slate-50 tabular-nums @[200px]/card:text-4xl">
            {value}
          </CardTitle>
        </div>
      </CardContent>
    </Card>
  );
}
