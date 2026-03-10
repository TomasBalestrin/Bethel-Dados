"use client";

import { MetricCard } from "@/components/dashboard/MetricCard";
import { PerformanceChart } from "@/components/dashboard/PerformanceChart";
import { RankingTable } from "@/components/dashboard/RankingTable";
import { mockCloserMetrics, mockUsers, mockGoals } from "@/model/entities/mock-data";
import { Handshake, FileText, DollarSign, Target, TrendingUp } from "lucide-react";

export default function ClosersPage() {
  const closerUsers = mockUsers.filter((u) => u.team_id === "t2");

  const totalMeetings = mockCloserMetrics.reduce((s, m) => s + m.meetings_held, 0);
  const totalProposals = mockCloserMetrics.reduce((s, m) => s + m.proposals_sent, 0);
  const totalDeals = mockCloserMetrics.reduce((s, m) => s + m.deals_closed, 0);
  const totalRevenue = mockCloserMetrics.reduce((s, m) => s + m.revenue, 0);
  const avgTicket = totalRevenue / (totalDeals || 1);

  const weeklyData = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const dateStr = d.toISOString().split("T")[0];
    return {
      name: d.toLocaleDateString("pt-BR", { weekday: "short" }),
      value: mockCloserMetrics.filter((m) => m.date === dateStr).reduce((s, m) => s + m.deals_closed, 0),
      value2: Math.round(mockCloserMetrics.filter((m) => m.date === dateStr).reduce((s, m) => s + m.revenue, 0) / 1000),
    };
  });

  const closerRanking = closerUsers.map((user) => {
    const metrics = mockCloserMetrics.filter((m) => m.user_id === user.id);
    const revenue = metrics.reduce((s, m) => s + m.revenue, 0);
    return { position: 0, name: user.name, team: "Closer", metric: `R$ ${(revenue / 1000).toFixed(0)}k`, metricLabel: "Receita" };
  }).sort((a, b) => parseInt(b.metric as string) - parseInt(a.metric as string)).map((e, i) => ({ ...e, position: i + 1 }));

  const closerGoals = mockGoals.filter((g) => g.team_id === "t2");

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-foreground tracking-tight">Dashboard Closers</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Métricas e performance dos Closers</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <MetricCard title="Receita Total" value={`R$ ${(totalRevenue / 1000).toFixed(1)} mil`} icon={DollarSign} trend={22} variant="success" large />
        <MetricCard title="Deals Fechados" value={totalDeals} icon={Target} trend={18} variant="warning" large />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <MetricCard title="Reuniões Realizadas" value={totalMeetings} icon={Handshake} />
        <MetricCard title="Propostas Enviadas" value={totalProposals} icon={FileText} />
        <MetricCard title="Ticket Médio" value={`R$ ${avgTicket.toFixed(0)}`} icon={TrendingUp} />
      </div>

      <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
        <PerformanceChart title="Deals vs Receita (última semana)" data={weeklyData} dataKey="value" dataKey2="value2" label1="Deals" label2="Receita (R$ mil)" />
        <RankingTable title="Ranking Closers" entries={closerRanking} />
      </div>

      <div className="space-y-3">
        <p className="section-label text-xs px-1">Meta vs Realizado</p>
        <div className="glass-card p-5 sm:p-6 space-y-4">
          {closerGoals.map((goal) => {
            const percent = Math.min((goal.current_value / goal.target_value) * 100, 100);
            const metricNames: Record<string, string> = { deals_closed: "Deals Fechados", revenue: "Receita" };
            const isRevenue = goal.metric_type === "revenue";
            return (
              <div key={goal.id} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">{metricNames[goal.metric_type] ?? goal.metric_type}</span>
                  <span className="text-muted-foreground text-xs">
                    {isRevenue ? `R$ ${(goal.current_value / 1000).toFixed(0)}k` : goal.current_value} / {isRevenue ? `R$ ${(goal.target_value / 1000).toFixed(0)}k` : goal.target_value} ({percent.toFixed(0)}%)
                  </span>
                </div>
                <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                  <div className="h-full rounded-full bg-success transition-all duration-500" style={{ width: `${percent}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
