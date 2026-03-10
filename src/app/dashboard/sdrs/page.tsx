"use client";

import { MetricCard } from "@/components/dashboard/MetricCard";
import { PerformanceChart } from "@/components/dashboard/PerformanceChart";
import { RankingTable } from "@/components/dashboard/RankingTable";
import { mockSdrMetrics, mockUsers, mockGoals } from "@/model/entities/mock-data";
import { Phone, CalendarCheck, UserCheck, Mail, Target } from "lucide-react";
import { Progress } from "@/components/ui/progress";

export default function SdrsPage() {
  const sdrUsers = mockUsers.filter((u) => u.team_id === "t1");

  const totalCalls = mockSdrMetrics.reduce((s, m) => s + m.calls_made, 0);
  const totalMeetings = mockSdrMetrics.reduce((s, m) => s + m.meetings_scheduled, 0);
  const totalQualified = mockSdrMetrics.reduce((s, m) => s + m.qualified_leads, 0);
  const totalEmails = mockSdrMetrics.reduce((s, m) => s + m.emails_sent, 0);
  const avgConversion = mockSdrMetrics.reduce((s, m) => s + m.conversion_rate, 0) / mockSdrMetrics.length;

  const weeklyData = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const dateStr = d.toISOString().split("T")[0];
    return {
      name: d.toLocaleDateString("pt-BR", { weekday: "short" }),
      value: mockSdrMetrics.filter((m) => m.date === dateStr).reduce((s, m) => s + m.calls_made, 0),
      value2: mockSdrMetrics.filter((m) => m.date === dateStr).reduce((s, m) => s + m.meetings_scheduled, 0),
    };
  });

  const sdrRanking = sdrUsers.map((user) => {
    const metrics = mockSdrMetrics.filter((m) => m.user_id === user.id);
    return { position: 0, name: user.name, team: "SDR", metric: metrics.reduce((s, m) => s + m.meetings_scheduled, 0), metricLabel: "Reuniões Agendadas" };
  }).sort((a, b) => (b.metric as number) - (a.metric as number)).map((e, i) => ({ ...e, position: i + 1 }));

  const sdrGoals = mockGoals.filter((g) => g.team_id === "t1");

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-foreground tracking-tight">Dashboard SDRs</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Métricas e performance dos SDRs</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <MetricCard title="Ligações Realizadas" value={totalCalls.toLocaleString("pt-BR")} icon={Phone} trend={10} />
        <MetricCard title="Reuniões Agendadas" value={totalMeetings} icon={CalendarCheck} trend={15} variant="success" />
        <MetricCard title="Taxa de Conversão" value={`${avgConversion.toFixed(1)}%`} icon={Target} trend={-2} />
      </div>

      <div className="space-y-3">
        <p className="section-label text-xs px-1">Métricas Secundárias</p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          <MetricCard title="Leads Qualificados" value={totalQualified} icon={UserCheck} variant="success" compact />
          <MetricCard title="Emails Enviados" value={totalEmails.toLocaleString("pt-BR")} icon={Mail} variant="info" compact />
          <MetricCard title="Follow-ups" value={mockSdrMetrics.reduce((s, m) => s + m.follow_ups, 0)} icon={Phone} compact />
        </div>
      </div>

      <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
        <PerformanceChart title="Ligações vs Reuniões (última semana)" data={weeklyData} dataKey="value" dataKey2="value2" label1="Ligações" label2="Reuniões" />
        <RankingTable title="Ranking SDRs" entries={sdrRanking} />
      </div>

      <div className="space-y-3">
        <p className="section-label text-xs px-1">Meta vs Realizado</p>
        <div className="glass-card p-5 sm:p-6 space-y-4">
          {sdrGoals.map((goal) => {
            const percent = Math.min((goal.current_value / goal.target_value) * 100, 100);
            const metricNames: Record<string, string> = { calls_made: "Ligações", meetings_scheduled: "Reuniões Agendadas" };
            return (
              <div key={goal.id} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">{metricNames[goal.metric_type] ?? goal.metric_type}</span>
                  <span className="text-muted-foreground text-xs">
                    {goal.current_value} / {goal.target_value} ({percent.toFixed(0)}%)
                  </span>
                </div>
                <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                  <div className="h-full rounded-full bg-primary transition-all duration-500" style={{ width: `${percent}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
