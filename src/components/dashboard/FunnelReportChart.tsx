"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import type { FunnelReport } from "@/lib/supabase/types";

interface FunnelReportChartProps {
  report: FunnelReport;
}

const STAGE_COLORS = [
  "oklch(0.55 0.18 260)",
  "oklch(0.62 0.18 300)",
  "oklch(0.75 0.16 70)",
  "oklch(0.65 0.17 30)",
  "oklch(0.65 0.17 160)",
];

export function FunnelReportChart({ report }: FunnelReportChartProps) {
  const stages = [
    { name: "Leads", value: report.total_leads, rate: null as number | null },
    { name: "Qualificados", value: report.total_qualified, rate: report.leads_to_qualified_rate },
    { name: "Agendadas", value: report.total_calls_scheduled, rate: report.qualified_to_scheduled_rate },
    { name: "Realizadas", value: report.total_calls_done, rate: report.scheduled_to_done_rate },
    { name: "Vendas", value: report.total_sales, rate: report.done_to_sales_rate },
  ];

  const formatCurrency = (v: number) =>
    new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(v);

  return (
    <div className="glass-card animate-fade-in">
      <div className="p-5 sm:p-6 space-y-4">
        <div>
          <p className="section-label">Funil: {report.funnel_name}</p>
          <p className="text-sm text-muted-foreground mt-1">
            Faturamento total: {formatCurrency(report.total_revenue)}
          </p>
        </div>

        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={stages} layout="vertical" margin={{ left: 80 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis type="number" stroke="var(--color-muted-foreground)" />
              <YAxis type="category" dataKey="name" stroke="var(--color-muted-foreground)" width={75} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--color-card)",
                  border: "1px solid var(--color-border)",
                  borderRadius: "8px",
                  color: "var(--color-foreground)",
                }}
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                formatter={(value: any, _name: any, entry: any) => {
                  const rate = entry?.payload?.rate;
                  return [
                    `${value}${rate !== null && rate !== undefined ? ` (${rate.toFixed(1)}%)` : ""}`,
                    entry?.payload?.name ?? "",
                  ];
                }}
              />
              <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                {stages.map((_, i) => (
                  <Cell key={i} fill={STAGE_COLORS[i % STAGE_COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="flex flex-wrap gap-3">
          {stages.slice(1).map((stage, i) => (
            <div
              key={stage.name}
              className="flex items-center gap-1.5 text-xs text-muted-foreground bg-muted/50 px-3 py-1.5 rounded-full"
            >
              <span>{stages[i].name} → {stage.name}:</span>
              <span className="font-semibold text-foreground">
                {stage.rate !== null ? `${stage.rate.toFixed(1)}%` : "—"}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
