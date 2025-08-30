"use client";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend,
  ChartOptions,
} from "chart.js";
import { Line } from "react-chartjs-2";
import type { Click } from "@prisma/client";
import { format, addDays } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend
);

export function LinkAnalytics({ clicks }: { clicks: Click[] }) {
  const clickCounts: Record<string, number> = {};
  clicks.forEach((click) => {
    const day = format(new Date(click.createdAt), "yyyy-MM-dd");
    clickCounts[day] = (clickCounts[day] || 0) + 1;
  });

  let labels: string[] = [];
  if (Object.keys(clickCounts).length > 0) {
    const clickDates = Object.keys(clickCounts).map((d) => new Date(d));
    const minDate = new Date(Math.min(...clickDates.map((d) => d.getTime())));
    const maxDate = new Date(Math.max(...clickDates.map((d) => d.getTime())));
    const days: string[] = [];
    for (
      let dt = new Date(minDate.getFullYear(), minDate.getMonth(), minDate.getDate());
      dt <= new Date(maxDate.getFullYear(), maxDate.getMonth(), maxDate.getDate());
      dt = addDays(dt, 1)
    ) {
      days.push(format(dt, "yyyy-MM-dd"));
    }
    labels = days;
  }

  const dataPoints = labels.length > 0 ? labels.map((d) => Math.round(clickCounts[d] || 0)) : [];
  const maxValue = dataPoints.length > 0 ? Math.max(...dataPoints) : 0;
  let stepSize = 1;
  if (maxValue <= 10) stepSize = 1;
  else if (maxValue <= 50) stepSize = Math.ceil(maxValue / 5);
  else stepSize = Math.ceil(maxValue / 10);
  const suggestedMax = Math.max(maxValue + stepSize, 1);

  const data = {
    labels,
    datasets: [
      {
        label: "Clicks",
        data: dataPoints,
        fill: true,
        borderColor: "hsl(var(--primary))", 
        borderWidth: 3,
        backgroundColor: (context: any) => {
          const ctx = context.chart.ctx;
          const chartArea = context.chart.chartArea;
          if (!chartArea) return null;
          const primaryRgb = getComputedStyle(document.documentElement)
            .getPropertyValue("--primary-rgb")
            .trim();
          if (!primaryRgb) return "rgba(99, 102, 241, 0.2)";
          const gradient = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
          gradient.addColorStop(0, `rgba(${primaryRgb}, 0.4)`);
          gradient.addColorStop(1, `rgba(${primaryRgb}, 0)`);
          return gradient;
        },
        tension: 0.4,
        pointRadius: 3,
        pointHoverRadius: 6,
        pointBackgroundColor: "hsl(var(--background))",
        pointBorderColor: "hsl(var(--chart-1))", 
      },
    ],
  };

  const options: ChartOptions<"line"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        mode: "index",
        intersect: false,
        backgroundColor: "hsl(var(--background))",
        titleColor: "hsl(var(--foreground))",
        bodyColor: "hsl(var(--foreground))",
        borderColor: "hsl(var(--border))",
        borderWidth: 1,
        callbacks: {
          label: function (context) {
            const val = context.parsed?.y ?? 0;
            return `Clicks: ${Math.round(Number(val))}`;
          },
        },
      },
    },
    interaction: {
      mode: "nearest",
      axis: "x",
      intersect: false,
    },
    scales: {
      x: {
        ticks: { color: "hsl(var(--foreground))" },
        grid: { display: false },
      },
      y: {
        beginAtZero: true,
        suggestedMax,
        ticks: {
          color: "hsl(var(--foreground))",
          stepSize,
          callback: function (value) {
            return `${Math.round(Number(value))}`;
          },
        },
        grid: { color: "hsl(var(--border))" },
      },
    },
  };

  return (
    <Card className="shadow-sm border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900">
      <CardHeader>
        <CardTitle className="text-base font-semibold text-slate-900 dark:text-white">
          Clicks Over Time
        </CardTitle>
      </CardHeader>
      <CardContent>
        {labels.length > 0 ? (
          <div className="h-[350px]">
            <Line data={data} options={options} />
          </div>
        ) : (
          <div className="h-[350px] flex items-center justify-center">
            <p className="text-muted-foreground text-sm">No click data yet.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}