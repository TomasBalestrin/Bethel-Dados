"use client";

import { MetricCard } from "@/components/dashboard/MetricCard";
import { PerformanceChart } from "@/components/dashboard/PerformanceChart";
import { FunnelChart } from "@/components/dashboard/FunnelChart";
import { RankingTable } from "@/components/dashboard/RankingTable";
import { useUsers, useSdrMetrics, useCloserMetrics, useSocialSellingMetrics, useFunnelStages, useFunnelEntries } from "@/hooks/use-data";
import { DollarSign, Phone, Handshake, Target, TrendingUp, XCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardOverview() {
  const { data: users, isLoading: loadingUsers } = useUsers();
  const { data: sdrMetrics, isLoading: loadingSdr } = useSdrMetrics();
  const { data: closerMetrics, isLoading: loadingCloser } = useCloserMetrics();
  const { data: socialMetrics, isLoading: loadingSocial } = useSocialSellingMetrics();
  const { data: funnelStages, isLoading: loadingStages } = useFunnelStages();
  const { data: funnelEntries, isLoading: loadingEntries } = useFunnelEntries();

  const isLoading = loadingUsers || loadingSdr || loadingCloser || loadingSocial || loadingStages || loadingEntries;

  if (isLoading) {
    return (
      <div className="space-y-8 animate-fade-in">
        <div>
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-72 mt-2" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Skeleton className="h-24" />
          <Skeleton className="h-24" />
          <Skeleton className="h-24" />
        </div>
      </div>
    );
  }

  const totalCalls = sdrMetrics.reduce((sum, m) => sum + m.calls_made, 0);
  const totalMeetings = sdrMetrics.reduce((sum, m) => sum + m.meetings_scheduled, 0);
  const totalDeals = closerMetrics.reduce((sum, m) => sum + m.deals_closed, 0);
  const totalRevenue = closerMetrics.reduce((sum, m) => sum + m.revenue, 0);
  const totalLeads = socialMetrics.reduce((sum, m) => sum + m.leads_generated, 0);
  const avgConversion = closerMetrics.length > 0
    ? closerMetrics.reduce((sum, m) => sum + m.conversion_rate, 0) / closerMetrics.length
    : 0;

  const last7 = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const dateStr = d.toISOString().split("T")[0];
    const dayCalls = sdrMetrics.filter((m) => m.date === dateStr).reduce((s, m) => s + m.calls_made, 0);
    const dayRevenue = closerMetrics.filter((m) => m.date === dateStr).reduce((s, m) => s + m.revenue, 0);
    return {
      name: d.toLocaleDateString("pt-BR", { weekday: "short" }),
      value: dayCalls,
      value2: Math.round(dayRevenue / 1000),
    };
  });

  const funnelData = funnelStages.map((stage) => {
    const entries = funnelEntries.filter((e) => e.stage_id === stage.id);
    return { name: stage.name, count: entries.length, value: entries.reduce((s, e) => s + e.value, 0), color: stage.color };
  });
  const funnelWithConversion = funnelData.map((stage, i) => ({
    ...stage,
    conversionRate: i === 0 ? 100 : (stage.count / funnelData[0].count) * 100,
  }));

  const sdrRanking = users
    .filter((u) => u.team_id === "t1")
    .map((user) => {
      const metrics = sdrMetrics.filter((m) => m.user_id === user.id);
      return { position: 0, name: user.name, team: "SDR", metric: metrics.reduce((s, m) => s + m.meetings_scheduled, 0), metricLabel: "Reuniões" };
    })
    .sort((a, b) => (b.metric as number) - (a.metric as number))
    .map((e, i) => ({ ...e, position: i + 1 }));

  const closerRanking = users
    .filter((u) => u.team_id === "t2")
    .map((user) => {
      const metrics = closerMetrics.filter((m) => m.user_id === user.id);
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
          <MetricCard title="Total Membros" value={users.filter((u) => u.team_id).length} icon={XCircle} compact />
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
