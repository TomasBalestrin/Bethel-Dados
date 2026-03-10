"use client";

import { FunnelChart } from "@/components/dashboard/FunnelChart";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { mockFunnelStages, mockFunnelEntries } from "@/model/entities/mock-data";
import { Filter, DollarSign, TrendingUp, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
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
  const avgDealValue = totalValue / mockFunnelEntries.length;

  // Stage-to-stage conversion
  const stageConversions = stageData.map((stage, i) => {
    if (i === 0) return { from: "-", to: stage.name, rate: 100 };
    return {
      from: stageData[i - 1].name,
      to: stage.name,
      rate: stageData[i - 1].count > 0 ? (stage.count / stageData[i - 1].count) * 100 : 0,
    };
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <Filter className="h-6 w-6" />
          Funil de Vendas
        </h2>
        <p className="text-muted-foreground">Visualização completa do pipeline de vendas</p>
      </div>

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard title="Total de Leads" value={totalLeads} icon={Users} variant="info" />
        <MetricCard title="Valor Total no Funil" value={`R$ ${(totalValue / 1000).toFixed(0)}k`} icon={DollarSign} variant="info" />
        <MetricCard title="Valor Fechado" value={`R$ ${(closedValue / 1000).toFixed(0)}k`} icon={DollarSign} variant="success" />
        <MetricCard title="Conversão Geral" value={`${overallConversion.toFixed(1)}%`} icon={TrendingUp} variant="warning" />
      </div>

      <FunnelChart title="Pipeline de Vendas" stages={funnelChartData} />

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Conversão entre Etapas</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>De</TableHead>
                <TableHead>Para</TableHead>
                <TableHead className="text-right">Taxa de Conversão</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {stageConversions.slice(1).map((conv) => (
                <TableRow key={conv.to}>
                  <TableCell>{conv.from}</TableCell>
                  <TableCell>{conv.to}</TableCell>
                  <TableCell className="text-right">
                    <Badge variant={conv.rate > 50 ? "default" : "secondary"}>
                      {conv.rate.toFixed(1)}%
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Detalhes por Etapa</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-5">
            {stageData.map((stage) => (
              <div
                key={stage.id}
                className="p-4 rounded-lg border text-center space-y-1"
                style={{ borderColor: stage.color }}
              >
                <div className="h-2 rounded-full mb-2" style={{ backgroundColor: stage.color }} />
                <p className="text-sm font-medium">{stage.name}</p>
                <p className="text-2xl font-bold">{stage.count}</p>
                <p className="text-xs text-muted-foreground">R$ {(stage.value / 1000).toFixed(0)}k</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
