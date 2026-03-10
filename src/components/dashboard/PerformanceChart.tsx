"use client";

import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";

interface PerformanceChartProps {
  title: string;
  data: Array<{ name: string; value: number; value2?: number }>;
  dataKey?: string;
  dataKey2?: string;
  color?: string;
  color2?: string;
  label1?: string;
  label2?: string;
}

export function PerformanceChart({
  title,
  data,
  dataKey = "value",
  dataKey2,
  color = "var(--color-chart-1)",
  color2 = "var(--color-chart-2)",
  label1 = "Valor",
  label2 = "Valor 2",
}: PerformanceChartProps) {
  const config: Record<string, { label: string; color: string }> = {
    [dataKey]: { label: label1, color },
  };
  if (dataKey2) {
    config[dataKey2] = { label: label2, color: color2 };
  }

  return (
    <div className="glass-card animate-fade-in">
      <div className="p-5 sm:p-6">
        <p className="section-label mb-4">{title}</p>
        <ChartContainer config={config} className="h-[280px] w-full">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis dataKey="name" className="text-xs" tick={{ fontSize: 11 }} />
            <YAxis className="text-xs" tick={{ fontSize: 11 }} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey={dataKey} fill={color} radius={[6, 6, 0, 0]} />
            {dataKey2 && <Bar dataKey={dataKey2} fill={color2} radius={[6, 6, 0, 0]} />}
          </BarChart>
        </ChartContainer>
      </div>
    </div>
  );
}
