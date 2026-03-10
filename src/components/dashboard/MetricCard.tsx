"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: LucideIcon;
  trend?: number;
  variant?: "default" | "success" | "warning" | "info";
}

const variantStyles = {
  default: "",
  success: "border-green-500/20 bg-green-50 dark:bg-green-950/20",
  warning: "border-yellow-500/20 bg-yellow-50 dark:bg-yellow-950/20",
  info: "border-blue-500/20 bg-blue-50 dark:bg-blue-950/20",
};

const iconVariantStyles = {
  default: "text-primary",
  success: "text-green-600",
  warning: "text-yellow-600",
  info: "text-blue-600",
};

export function MetricCard({ title, value, description, icon: Icon, trend, variant = "default" }: MetricCardProps) {
  return (
    <Card className={cn("transition-all hover:shadow-md", variantStyles[variant])}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        {Icon && <Icon className={cn("h-4 w-4", iconVariantStyles[variant])} />}
      </CardHeader>
      <CardContent>
        <div className="flex items-end gap-2">
          <span className="text-2xl font-bold">{value}</span>
          {trend !== undefined && (
            <span
              className={cn(
                "flex items-center text-xs font-medium mb-1",
                trend > 0 ? "text-green-600" : trend < 0 ? "text-red-600" : "text-muted-foreground"
              )}
            >
              {trend > 0 ? <TrendingUp className="h-3 w-3 mr-0.5" /> : trend < 0 ? <TrendingDown className="h-3 w-3 mr-0.5" /> : <Minus className="h-3 w-3 mr-0.5" />}
              {Math.abs(trend)}%
            </span>
          )}
        </div>
        {description && <p className="text-xs text-muted-foreground mt-1">{description}</p>}
      </CardContent>
    </Card>
  );
}
