"use client";

import { cn } from "@/lib/utils";

interface FunnelStageData {
  name: string;
  count: number;
  value: number;
  color: string;
  conversionRate?: number;
}

interface FunnelChartProps {
  title: string;
  stages: FunnelStageData[];
}

export function FunnelChart({ title, stages }: FunnelChartProps) {
  const maxCount = Math.max(...stages.map((s) => s.count));

  return (
    <div className="glass-card animate-fade-in">
      <div className="p-5 sm:p-6 space-y-4">
        <p className="section-label">{title}</p>
        <div className="space-y-3">
          {stages.map((stage) => {
            const widthPercent = (stage.count / maxCount) * 100;
            return (
              <div key={stage.name} className="space-y-1.5">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-card-foreground">{stage.name}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-muted-foreground text-xs">{stage.count} leads</span>
                    <span className="font-medium text-sm">
                      R$ {stage.value.toLocaleString("pt-BR")}
                    </span>
                    {stage.conversionRate !== undefined && (
                      <span className="text-[11px] text-muted-foreground">
                        ({stage.conversionRate.toFixed(0)}%)
                      </span>
                    )}
                  </div>
                </div>
                <div className="h-7 w-full bg-muted rounded-lg overflow-hidden">
                  <div
                    className="h-full rounded-lg transition-all duration-500 flex items-center px-2.5"
                    style={{
                      width: `${widthPercent}%`,
                      backgroundColor: stage.color,
                      minWidth: "2rem",
                    }}
                  >
                    <span className="text-[11px] font-semibold text-white">{stage.count}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
