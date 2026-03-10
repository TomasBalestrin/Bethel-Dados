"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {stages.map((stage, index) => {
          const widthPercent = (stage.count / maxCount) * 100;
          return (
            <div key={stage.name} className="space-y-1">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">{stage.name}</span>
                <div className="flex items-center gap-3">
                  <span className="text-muted-foreground">{stage.count} leads</span>
                  <span className="font-medium">
                    R$ {stage.value.toLocaleString("pt-BR")}
                  </span>
                  {stage.conversionRate !== undefined && (
                    <span className="text-xs text-muted-foreground">
                      ({stage.conversionRate.toFixed(0)}%)
                    </span>
                  )}
                </div>
              </div>
              <div className="h-8 w-full bg-muted rounded-md overflow-hidden">
                <div
                  className={cn("h-full rounded-md transition-all duration-500 flex items-center px-2")}
                  style={{
                    width: `${widthPercent}%`,
                    backgroundColor: stage.color,
                    minWidth: "2rem",
                  }}
                >
                  <span className="text-xs font-medium text-white">{stage.count}</span>
                </div>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
