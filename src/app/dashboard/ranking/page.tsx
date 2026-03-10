"use client";

import { RankingTable } from "@/components/dashboard/RankingTable";
import { mockSdrMetrics, mockCloserMetrics, mockSocialSellingMetrics, mockUsers, mockGoals } from "@/model/entities/mock-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trophy, Target, Award } from "lucide-react";

export default function RankingPage() {
  // SDR ranking by meetings
  const sdrRanking = mockUsers
    .filter((u) => u.team_id === "t1")
    .map((user) => {
      const metrics = mockSdrMetrics.filter((m) => m.user_id === user.id);
      return {
        position: 0,
        name: user.name,
        team: "SDR",
        metric: metrics.reduce((s, m) => s + m.meetings_scheduled, 0),
        metricLabel: "Reuniões Agendadas",
      };
    })
    .sort((a, b) => (b.metric as number) - (a.metric as number))
    .map((e, i) => ({ ...e, position: i + 1 }));

  // Closer ranking by revenue
  const closerRanking = mockUsers
    .filter((u) => u.team_id === "t2")
    .map((user) => {
      const metrics = mockCloserMetrics.filter((m) => m.user_id === user.id);
      const rev = metrics.reduce((s, m) => s + m.revenue, 0);
      return {
        position: 0,
        name: user.name,
        team: "Closer",
        metric: `R$ ${(rev / 1000).toFixed(0)}k`,
        metricLabel: "Receita",
        _numericMetric: rev,
      };
    })
    .sort((a, b) => b._numericMetric - a._numericMetric)
    .map((e, i) => ({ ...e, position: i + 1 }));

  // Social selling ranking
  const ssRanking = mockUsers
    .filter((u) => u.team_id === "t3")
    .map((user) => {
      const metrics = mockSocialSellingMetrics.filter((m) => m.user_id === user.id);
      return {
        position: 0,
        name: user.name,
        team: "Social Selling",
        metric: metrics.reduce((s, m) => s + m.leads_generated, 0),
        metricLabel: "Leads Gerados",
      };
    })
    .sort((a, b) => (b.metric as number) - (a.metric as number))
    .map((e, i) => ({ ...e, position: i + 1 }));

  // Goals progress
  const goalsProgress = mockGoals.map((goal) => {
    const user = mockUsers.find((u) => u.id === goal.user_id);
    const percent = Math.min((goal.current_value / goal.target_value) * 100, 100);
    return { ...goal, userName: user?.name ?? "Equipe", percent };
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <Trophy className="h-6 w-6 text-yellow-500" />
          Ranking & Gamificação
        </h2>
        <p className="text-muted-foreground">Rankings por equipe e acompanhamento de metas</p>
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
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Target className="h-4 w-4" />
              Progresso de Metas
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {goalsProgress.map((goal) => (
              <div key={goal.id} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">{goal.userName} - {goal.metric_type.replace(/_/g, " ")}</span>
                  <span className="text-muted-foreground">{goal.percent.toFixed(0)}%</span>
                </div>
                <Progress value={goal.percent} className="h-2" />
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Award className="h-4 w-4" />
              Conquistas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              {[
                { emoji: "🔥", title: "Em Chamas", desc: "5 dias consecutivos acima da meta", user: "Carlos Silva" },
                { emoji: "⭐", title: "Estrela da Semana", desc: "Maior número de deals fechados", user: "Maria Costa" },
                { emoji: "🎯", title: "Precisão Total", desc: "100% de conversão no dia", user: "Pedro Oliveira" },
                { emoji: "🚀", title: "Foguete", desc: "Dobrou a meta mensal", user: "Ana Santos" },
              ].map((badge) => (
                <div key={badge.title} className="p-3 rounded-md border text-center space-y-1">
                  <span className="text-2xl">{badge.emoji}</span>
                  <p className="text-sm font-medium">{badge.title}</p>
                  <p className="text-xs text-muted-foreground">{badge.desc}</p>
                  <p className="text-xs font-medium text-primary">{badge.user}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
