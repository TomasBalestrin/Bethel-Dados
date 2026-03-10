"use client";

import { MetricCard } from "@/components/dashboard/MetricCard";
import { PerformanceChart } from "@/components/dashboard/PerformanceChart";
import { RankingTable } from "@/components/dashboard/RankingTable";
import { mockCloserMetrics, mockUsers, mockGoals } from "@/model/entities/mock-data";
import { Handshake, FileText, DollarSign, Target, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export default function ClosersPage() {
  const closerUsers = mockUsers.filter((u) => u.team_id === "t2");

  const totalMeetings = mockCloserMetrics.reduce((s, m) => s + m.meetings_held, 0);
  const totalProposals = mockCloserMetrics.reduce((s, m) => s + m.proposals_sent, 0);
  const totalDeals = mockCloserMetrics.reduce((s, m) => s + m.deals_closed, 0);
  const totalRevenue = mockCloserMetrics.reduce((s, m) => s + m.revenue, 0);
  const avgTicket = totalRevenue / (totalDeals || 1);

  // Weekly data
  const weeklyData = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const dateStr = d.toISOString().split("T")[0];
    const dayDeals = mockCloserMetrics.filter((m) => m.date === dateStr).reduce((s, m) => s + m.deals_closed, 0);
    const dayRevenue = mockCloserMetrics.filter((m) => m.date === dateStr).reduce((s, m) => s + m.revenue, 0);
    return {
      name: d.toLocaleDateString("pt-BR", { weekday: "short" }),
      value: dayDeals,
      value2: Math.round(dayRevenue / 1000),
    };
  });

  // Closer ranking
  const closerRanking = closerUsers.map((user) => {
    const metrics = mockCloserMetrics.filter((m) => m.user_id === user.id);
    const revenue = metrics.reduce((s, m) => s + m.revenue, 0);
    return {
      position: 0,
      name: user.name,
      team: "Closer",
      metric: `R$ ${(revenue / 1000).toFixed(0)}k`,
      metricLabel: "Receita",
    };
  })
    .sort((a, b) => parseInt(b.metric as string) - parseInt(a.metric as string))
    .map((e, i) => ({ ...e, position: i + 1 }));

  // Goals
  const closerGoals = mockGoals.filter((g) => g.team_id === "t2");

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Dashboard Closers</h2>
        <p className="text-muted-foreground">Métricas e performance dos Closers</p>
      </div>

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-5">
        <MetricCard title="Reuniões Realizadas" value={totalMeetings} icon={Handshake} trend={8} variant="info" />
        <MetricCard title="Propostas Enviadas" value={totalProposals} icon={FileText} trend={12} variant="info" />
        <MetricCard title="Deals Fechados" value={totalDeals} icon={Target} trend={18} variant="success" />
        <MetricCard title="Receita Total" value={`R$ ${(totalRevenue / 1000).toFixed(0)}k`} icon={DollarSign} trend={22} variant="success" />
        <MetricCard title="Ticket Médio" value={`R$ ${avgTicket.toFixed(0)}`} icon={TrendingUp} trend={5} />
      </div>

      <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
        <PerformanceChart
          title="Deals vs Receita (última semana)"
          data={weeklyData}
          dataKey="value"
          dataKey2="value2"
          label1="Deals"
          label2="Receita (R$ mil)"
        />
        <RankingTable title="Ranking Closers" entries={closerRanking} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Meta vs Realizado</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {closerGoals.map((goal) => {
            const percent = Math.min((goal.current_value / goal.target_value) * 100, 100);
            const metricNames: Record<string, string> = {
              deals_closed: "Deals Fechados",
              revenue: "Receita",
            };
            const isRevenue = goal.metric_type === "revenue";
            return (
              <div key={goal.id} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">{metricNames[goal.metric_type] ?? goal.metric_type}</span>
                  <span className="text-muted-foreground">
                    {isRevenue ? `R$ ${(goal.current_value / 1000).toFixed(0)}k` : goal.current_value} /{" "}
                    {isRevenue ? `R$ ${(goal.target_value / 1000).toFixed(0)}k` : goal.target_value} ({percent.toFixed(0)}%)
                  </span>
                </div>
                <Progress value={percent} className="h-2" />
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
}
