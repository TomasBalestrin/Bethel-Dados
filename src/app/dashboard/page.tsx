"use client";

import { MetricCard } from "@/components/dashboard/MetricCard";
import { PerformanceChart } from "@/components/dashboard/PerformanceChart";
import { FunnelChart } from "@/components/dashboard/FunnelChart";
import { RankingTable } from "@/components/dashboard/RankingTable";
import { mockSdrMetrics, mockCloserMetrics, mockSocialSellingMetrics, mockFunnelStages, mockFunnelEntries, mockUsers } from "@/model/entities/mock-data";
import { DollarSign, Phone, Handshake, Users, TrendingUp, Target } from "lucide-react";

export default function DashboardOverview() {
  // Aggregate metrics
  const totalCalls = mockSdrMetrics.reduce((sum, m) => sum + m.calls_made, 0);
  const totalMeetings = mockSdrMetrics.reduce((sum, m) => sum + m.meetings_scheduled, 0);
  const totalDeals = mockCloserMetrics.reduce((sum, m) => sum + m.deals_closed, 0);
  const totalRevenue = mockCloserMetrics.reduce((sum, m) => sum + m.revenue, 0);
  const totalLeads = mockSocialSellingMetrics.reduce((sum, m) => sum + m.leads_generated, 0);
  const avgConversion = mockCloserMetrics.reduce((sum, m) => sum + m.conversion_rate, 0) / mockCloserMetrics.length;

  // Last 7 days performance data
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

  // Funnel data
  const funnelData = mockFunnelStages.map((stage) => {
    const entries = mockFunnelEntries.filter((e) => e.stage_id === stage.id);
    const count = entries.length;
    const value = entries.reduce((s, e) => s + e.value, 0);
    return { name: stage.name, count, value, color: stage.color };
  });

  // Add conversion rates
  const funnelWithConversion = funnelData.map((stage, i) => ({
    ...stage,
    conversionRate: i === 0 ? 100 : (stage.count / funnelData[0].count) * 100,
  }));

  // Top performers
  const sdrRanking = mockUsers
    .filter((u) => u.team_id === "t1")
    .map((user, i) => {
      const userMetrics = mockSdrMetrics.filter((m) => m.user_id === user.id);
      const totalMeetings = userMetrics.reduce((s, m) => s + m.meetings_scheduled, 0);
      return { position: i + 1, name: user.name, team: "SDR", metric: totalMeetings, metricLabel: "Reuniões" };
    })
    .sort((a, b) => (b.metric as number) - (a.metric as number))
    .map((e, i) => ({ ...e, position: i + 1 }));

  const closerRanking = mockUsers
    .filter((u) => u.team_id === "t2")
    .map((user) => {
      const userMetrics = mockCloserMetrics.filter((m) => m.user_id === user.id);
      const totalRev = userMetrics.reduce((s, m) => s + m.revenue, 0);
      return { position: 0, name: user.name, team: "Closer", metric: `R$ ${(totalRev / 1000).toFixed(0)}k`, metricLabel: "Receita" };
    })
    .sort((a, b) => parseInt(b.metric as string) - parseInt(a.metric as string))
    .map((e, i) => ({ ...e, position: i + 1 }));

  const allRanking = [...sdrRanking, ...closerRanking].map((e, i) => ({ ...e, position: i + 1 }));

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Dashboard Overview</h2>
        <p className="text-muted-foreground">Visão geral de todas as equipes</p>
      </div>

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <MetricCard title="Ligações" value={totalCalls.toLocaleString("pt-BR")} icon={Phone} trend={12} variant="info" />
        <MetricCard title="Reuniões Agendadas" value={totalMeetings} icon={Users} trend={8} variant="info" />
        <MetricCard title="Deals Fechados" value={totalDeals} icon={Handshake} trend={15} variant="success" />
        <MetricCard title="Receita Total" value={`R$ ${(totalRevenue / 1000).toFixed(0)}k`} icon={DollarSign} trend={22} variant="success" />
        <MetricCard title="Leads (Social)" value={totalLeads} icon={TrendingUp} trend={5} />
        <MetricCard title="Conversão Média" value={`${avgConversion.toFixed(1)}%`} icon={Target} trend={-3} variant="warning" />
      </div>

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

      <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
        <RankingTable title="Top Performers" entries={allRanking.slice(0, 5)} />
      </div>
    </div>
  );
}
