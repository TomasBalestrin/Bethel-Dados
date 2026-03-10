"use client";

import { FunnelChart } from "@/components/dashboard/FunnelChart";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { mockFunnelStages, mockFunnelEntries } from "@/model/entities/mock-data";
import { Filter, DollarSign, TrendingUp, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function FunilPage() {
  const stageData = mockFunnelStages.map((stage) => {
    const entries = mockFunnelEntries.filter((e) => e.stage_id === stage.id);
    return {
      ...stage,
      count: entries.length,
      value: entries.reduce((s, e) => s + e.value, 0),
      entries,
    };
  });

  const totalLeads = stageData[0]?.count ?? 0;
  const funnelChartData = stageData.map((stage, i) => ({
    name: stage.name,
    count: stage.count,
    value: stage.value,
    color: stage.color,
    conversionRate: i === 0 ? 100 : (stage.count / totalLeads) * 100,
  }));

  const totalValue = stageData.reduce((s, st) => s + st.value, 0);
  const closedValue = stageData[stageData.length - 1]?.value ?? 0;
  const overallConversion = totalLeads > 0 ? ((stageData[stageData.length - 1]?.count ?? 0) / totalLeads) * 100 : 0;

  const stageConversions = stageData.map((stage, i) => {
    if (i === 0) return { from: "-", to: stage.name, rate: 100 };
    return {
      from: stageData[i - 1].name,
      to: stage.name,
      rate: stageData[i - 1].count > 0 ? (stage.count / stageData[i - 1].count) * 100 : 0,
    };
  });

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-foreground tracking-tight flex items-center gap-2">
          <Filter className="h-6 w-6 text-info" />
          Funil de Vendas
        </h1>
        <p className="text-sm text-muted-foreground mt-0.5">Visualização completa do pipeline de vendas</p>
      </div>

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard title="Total de Leads" value={totalLeads} icon={Users} variant="info" />
        <MetricCard title="Valor Total no Funil" value={`R$ ${(totalValue / 1000).toFixed(0)}k`} icon={DollarSign} variant="info" />
        <MetricCard title="Valor Fechado" value={`R$ ${(closedValue / 1000).toFixed(0)}k`} icon={DollarSign} variant="success" />
        <MetricCard title="Conversão Geral" value={`${overallConversion.toFixed(1)}%`} icon={TrendingUp} variant="warning" />
      </div>

      <FunnelChart title="Pipeline de Vendas" stages={funnelChartData} />

      <div className="glass-card">
        <div className="p-5 sm:p-6 space-y-4">
          <p className="section-label">Conversão entre Etapas</p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/40">
                  <th className="text-left py-2.5 px-3 text-muted-foreground font-medium text-xs">De</th>
                  <th className="text-left py-2.5 px-3 text-muted-foreground font-medium text-xs">Para</th>
                  <th className="text-right py-2.5 px-3 text-muted-foreground font-medium text-xs">Taxa de Conversão</th>
                </tr>
              </thead>
              <tbody>
                {stageConversions.slice(1).map((conv) => (
                  <tr key={conv.to} className="border-b border-border/20 last:border-0">
                    <td className="py-2.5 px-3">{conv.from}</td>
                    <td className="py-2.5 px-3">{conv.to}</td>
                    <td className="py-2.5 px-3 text-right">
                      <Badge variant={conv.rate > 50 ? "default" : "secondary"}>
                        {conv.rate.toFixed(1)}%
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="glass-card">
        <div className="p-5 sm:p-6 space-y-4">
          <p className="section-label">Detalhes por Etapa</p>
          <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-5">
            {stageData.map((stage) => (
              <div
                key={stage.id}
                className="p-4 rounded-xl bg-muted/30 border border-border/20 text-center space-y-1"
                style={{ borderTopColor: stage.color, borderTopWidth: "3px" }}
              >
                <p className="text-sm font-medium">{stage.name}</p>
                <p className="text-2xl font-bold">{stage.count}</p>
                <p className="text-xs text-muted-foreground">R$ {(stage.value / 1000).toFixed(0)}k</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
