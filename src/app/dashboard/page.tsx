"use client";

import { MetricCard } from "@/components/dashboard/MetricCard";
import { PerformanceChart } from "@/components/dashboard/PerformanceChart";
import { FunnelChart } from "@/components/dashboard/FunnelChart";
import { RankingTable } from "@/components/dashboard/RankingTable";
import { mockSdrMetrics, mockCloserMetrics, mockSocialSellingMetrics, mockFunnelStages, mockFunnelEntries, mockUsers } from "@/model/entities/mock-data";
import { DollarSign, Phone, Handshake, Target, TrendingUp, XCircle } from "lucide-react";

export default function DashboardOverview() {
  const totalCalls = mockSdrMetrics.reduce((sum, m) => sum + m.calls_made, 0);
  const totalMeetings = mockSdrMetrics.reduce((sum, m) => sum + m.meetings_scheduled, 0);
  const totalDeals = mockCloserMetrics.reduce((sum, m) => sum + m.deals_closed, 0);
  const totalRevenue = mockCloserMetrics.reduce((sum, m) => sum + m.revenue, 0);
  const totalLeads = mockSocialSellingMetrics.reduce((sum, m) => sum + m.leads_generated, 0);
  const avgConversion = mockCloserMetrics.reduce((sum, m) => sum + m.conversion_rate, 0) / mockCloserMetrics.length;

  const last7 = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const dateStr = d.toISOString().split("T")[0];
    const dayCalls = mockSdrMetrics.filter((m) => m.date === dateStr).reduce((s, m) => s + m.calls_made, 0);
    const dayRevenue = mockCloserMetrics.filter((m) => m.date === dateStr).reduce((s, m) => s + m.revenue, 0);
    return {
      name: d.toLocaleDateString("pt-BR", { weekday: "short" }),
      value: dayCalls,
      value2: Math.round(dayRevenue / 1000),
    };
  });

  const funnelData = mockFunnelStages.map((stage) => {
    const entries = mockFunnelEntries.filter((e) => e.stage_id === stage.id);
    return { name: stage.name, count: entries.length, value: entries.reduce((s, e) => s + e.value, 0), color: stage.color };
  });
  const funnelWithConversion = funnelData.map((stage, i) => ({
    ...stage,
    conversionRate: i === 0 ? 100 : (stage.count / funnelData[0].count) * 100,
  }));

  const sdrRanking = mockUsers
    .filter((u) => u.team_id === "t1")
    .map((user) => {
      const metrics = mockSdrMetrics.filter((m) => m.user_id === user.id);
      return { position: 0, name: user.name, team: "SDR", metric: metrics.reduce((s, m) => s + m.meetings_scheduled, 0), metricLabel: "Reuniões" };
    })
    .sort((a, b) => (b.metric as number) - (a.metric as number))
    .map((e, i) => ({ ...e, position: i + 1 }));

  const closerRanking = mockUsers
    .filter((u) => u.team_id === "t2")
    .map((user) => {
      const metrics = mockCloserMetrics.filter((m) => m.user_id === user.id);
      const rev = metrics.reduce((s, m) => s + m.revenue, 0);
      return { position: 0, name: user.name, team: "Closer", metric: `R$ ${(rev / 1000).toFixed(0)}k`, metricLabel: "Receita" };
    })
    .sort((a, b) => parseInt(b.metric as string) - parseInt(a.metric as string))
    .map((e, i) => ({ ...e, position: i + 1 }));

  const allRanking = [...sdrRanking, ...closerRanking].map((e, i) => ({ ...e, position: i + 1 }));

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">Dashboard Geral</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Acompanhe as métricas de todas as equipes</p>
        </div>
      </div>

      {/* Main metrics - large cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <MetricCard title="Receita Total" value={`R$ ${(totalRevenue / 1000).toFixed(1)} mil`} icon={DollarSign} trend={22} variant="success" large />
        <MetricCard title="Deals Fechados" value={totalDeals} icon={Target} trend={15} variant="warning" large />
      </div>

      {/* Secondary metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <MetricCard title="Calls Realizadas" value={totalCalls.toLocaleString("pt-BR")} icon={Phone} />
        <MetricCard title="Reuniões Agendadas" value={totalMeetings} icon={Handshake} />
        <MetricCard title="Taxa de Conversão" value={`${avgConversion.toFixed(1)}%`} icon={TrendingUp} />
      </div>

      {/* Social selling compact */}
      <div className="space-y-3">
        <p className="section-label text-xs px-1">Social Selling</p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          <MetricCard title="Leads Gerados" value={totalLeads} icon={TrendingUp} variant="info" compact />
          <MetricCard title="Conversão Média" value={`${avgConversion.toFixed(1)}%`} icon={Target} variant="warning" compact />
          <MetricCard title="Total Membros" value={mockUsers.filter((u) => u.team_id).length} icon={XCircle} compact />
        </div>
      </div>

      {/* Charts */}
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
        <PerformanceChart
          title="Ligações vs Receita (últimos 7 dias)"
          data={last7}
          dataKey="value"
          dataKey2="value2"
          label1="Ligações"
          label2="Receita (R$ mil)"
        />
        <FunnelChart title="Funil de Vendas" stages={funnelWithConversion} />
      </div>

      {/* Ranking */}
      <div className="space-y-3">
        <p className="section-label text-xs px-1">Top Performers</p>
        <RankingTable title="Ranking Geral" entries={allRanking.slice(0, 5)} />
      </div>
    </div>
  );
}
