"use client";

import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: LucideIcon;
  trend?: number;
  variant?: "default" | "success" | "warning" | "info" | "destructive";
  compact?: boolean;
  large?: boolean;
}

export function MetricCard({
  title,
  value,
  description,
  icon: Icon,
  trend,
  variant = "default",
  compact = false,
  large = false,
}: MetricCardProps) {
  const getIconBackground = () => {
    switch (variant) {
      case "success": return "bg-success/10 text-success";
      case "warning": return "bg-warning/10 text-warning";
      case "info": return "bg-info/10 text-info";
      case "destructive": return "bg-destructive/10 text-destructive";
      default: return "bg-primary/10 text-primary";
    }
  };

  if (compact) {
    return (
      <div
        className="p-3 sm:p-4 rounded-2xl bg-card border border-border/30 transition-all duration-300 animate-fade-in"
        style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.03)" }}
      >
        <div className="flex items-center justify-between gap-2 mb-1.5">
          <p className="section-label">{title}</p>
          {Icon && (
            <div className={cn("p-1.5 rounded-full shrink-0", getIconBackground())}>
              <Icon size={14} />
            </div>
          )}
        </div>
        <h3 className="text-lg sm:text-xl font-bold text-card-foreground tracking-tight">
          {value}
        </h3>
        {description && <p className="text-xs text-muted-foreground mt-1">{description}</p>}
      </div>
    );
  }

  return (
    <div className={cn("glass-card transition-all duration-300 animate-fade-in", large && "glass-card-elevated")}>
      <div className={cn("p-5 sm:p-6", large && "p-6 sm:p-8")}>
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <p className="section-label mb-2 sm:mb-3">{title}</p>
            <h3
              className={cn(
                "font-bold text-card-foreground tracking-tight",
                large ? "text-2xl sm:text-3xl md:text-4xl" : "text-lg sm:text-xl md:text-2xl"
              )}
            >
              {value}
            </h3>
            {trend !== undefined && (
              <div
                className={cn(
                  "flex items-center mt-2 sm:mt-3 text-xs sm:text-sm font-medium",
                  trend >= 0 ? "text-success" : "text-destructive"
                )}
              >
                {trend >= 0 ? (
                  <TrendingUp size={14} className="mr-1 shrink-0" />
                ) : (
                  <TrendingDown size={14} className="mr-1 shrink-0" />
                )}
                <span>
                  {trend >= 0 ? "+" : ""}
                  {trend.toFixed(1)}%
                </span>
              </div>
            )}
            {description && <p className="text-xs text-muted-foreground mt-1">{description}</p>}
          </div>
          {Icon && (
            <div className={cn("p-2.5 sm:p-3 rounded-full shrink-0", getIconBackground())}>
              <Icon size={large ? 24 : 20} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
