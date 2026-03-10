"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, CartesianGrid } from "recharts";

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
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={config} className="h-[300px] w-full">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis dataKey="name" className="text-xs" tick={{ fontSize: 12 }} />
            <YAxis className="text-xs" tick={{ fontSize: 12 }} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey={dataKey} fill={color} radius={[4, 4, 0, 0]} />
            {dataKey2 && <Bar dataKey={dataKey2} fill={color2} radius={[4, 4, 0, 0]} />}
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
