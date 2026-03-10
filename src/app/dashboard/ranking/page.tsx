"use client";

import { RankingTable } from "@/components/dashboard/RankingTable";
import { mockSdrMetrics, mockCloserMetrics, mockSocialSellingMetrics, mockUsers, mockGoals } from "@/model/entities/mock-data";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trophy, Target, Award } from "lucide-react";

export default function RankingPage() {
  const sdrRanking = mockUsers
    .filter((u) => u.team_id === "t1")
    .map((user) => {
      const metrics = mockSdrMetrics.filter((m) => m.user_id === user.id);
      return { position: 0, name: user.name, team: "SDR", metric: metrics.reduce((s, m) => s + m.meetings_scheduled, 0), metricLabel: "Reuniões Agendadas" };
    }).sort((a, b) => (b.metric as number) - (a.metric as number)).map((e, i) => ({ ...e, position: i + 1 }));

  const closerRanking = mockUsers
    .filter((u) => u.team_id === "t2")
    .map((user) => {
      const metrics = mockCloserMetrics.filter((m) => m.user_id === user.id);
      const rev = metrics.reduce((s, m) => s + m.revenue, 0);
      return { position: 0, name: user.name, team: "Closer", metric: `R$ ${(rev / 1000).toFixed(0)}k`, metricLabel: "Receita", _numericMetric: rev };
    }).sort((a, b) => b._numericMetric - a._numericMetric).map((e, i) => ({ ...e, position: i + 1 }));

  const ssRanking = mockUsers
    .filter((u) => u.team_id === "t3")
    .map((user) => {
      const metrics = mockSocialSellingMetrics.filter((m) => m.user_id === user.id);
      return { position: 0, name: user.name, team: "Social Selling", metric: metrics.reduce((s, m) => s + m.leads_generated, 0), metricLabel: "Leads Gerados" };
    }).sort((a, b) => (b.metric as number) - (a.metric as number)).map((e, i) => ({ ...e, position: i + 1 }));

  const goalsProgress = mockGoals.map((goal) => {
    const user = mockUsers.find((u) => u.id === goal.user_id);
    return { ...goal, userName: user?.name ?? "Equipe", percent: Math.min((goal.current_value / goal.target_value) * 100, 100) };
  });

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-foreground tracking-tight flex items-center gap-2">
          <Trophy className="h-6 w-6 text-yellow-500" />
          Ranking & Gamificação
        </h1>
        <p className="text-sm text-muted-foreground mt-0.5">Rankings por equipe e acompanhamento de metas</p>
      </div>

      <Tabs defaultValue="sdr">
        <TabsList>
          <TabsTrigger value="sdr">SDRs</TabsTrigger>
          <TabsTrigger value="closer">Closers</TabsTrigger>
          <TabsTrigger value="social">Social Selling</TabsTrigger>
        </TabsList>
        <TabsContent value="sdr" className="mt-4">
          <RankingTable title="Ranking SDRs - Reuniões Agendadas" entries={sdrRanking} />
        </TabsContent>
        <TabsContent value="closer" className="mt-4">
          <RankingTable title="Ranking Closers - Receita" entries={closerRanking} />
        </TabsContent>
        <TabsContent value="social" className="mt-4">
          <RankingTable title="Ranking Social Selling - Leads" entries={ssRanking} />
        </TabsContent>
      </Tabs>

      <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
        <div className="glass-card">
          <div className="p-5 sm:p-6 space-y-4">
            <div className="flex items-center gap-2">
              <Target size={16} className="text-muted-foreground" />
              <p className="section-label">Progresso de Metas</p>
            </div>
            {goalsProgress.map((goal) => (
              <div key={goal.id} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">{goal.userName} - {goal.metric_type.replace(/_/g, " ")}</span>
                  <span className="text-muted-foreground text-xs">{goal.percent.toFixed(0)}%</span>
                </div>
                <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                  <div className="h-full rounded-full bg-primary transition-all duration-500" style={{ width: `${goal.percent}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-card">
          <div className="p-5 sm:p-6">
            <div className="flex items-center gap-2 mb-4">
              <Award size={16} className="text-muted-foreground" />
              <p className="section-label">Conquistas</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                { emoji: "🔥", title: "Em Chamas", desc: "5 dias acima da meta", user: "Carlos Silva" },
                { emoji: "⭐", title: "Estrela da Semana", desc: "Maior nº de deals", user: "Maria Costa" },
                { emoji: "🎯", title: "Precisão Total", desc: "100% conversão no dia", user: "Pedro Oliveira" },
                { emoji: "🚀", title: "Foguete", desc: "Dobrou a meta mensal", user: "Ana Santos" },
              ].map((badge) => (
                <div key={badge.title} className="p-3 rounded-xl bg-muted/30 border border-border/20 text-center space-y-1">
                  <span className="text-2xl">{badge.emoji}</span>
                  <p className="text-sm font-medium">{badge.title}</p>
                  <p className="text-[11px] text-muted-foreground">{badge.desc}</p>
                  <p className="text-[11px] font-medium text-primary">{badge.user}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
