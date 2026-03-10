"use client";

import { MetricCard } from "@/components/dashboard/MetricCard";
import { PerformanceChart } from "@/components/dashboard/PerformanceChart";
import { mockSocialSellingMetrics, mockUsers, mockGoals } from "@/model/entities/mock-data";
import { Share2, Heart, UserPlus, MessageSquare, Target } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

export default function SocialSellingPage() {
  const totalPosts = mockSocialSellingMetrics.reduce((s, m) => s + m.posts_published, 0);
  const avgEngagement = mockSocialSellingMetrics.reduce((s, m) => s + m.engagement_rate, 0) / mockSocialSellingMetrics.length;
  const totalLeads = mockSocialSellingMetrics.reduce((s, m) => s + m.leads_generated, 0);
  const totalConnections = mockSocialSellingMetrics.reduce((s, m) => s + m.connections_made, 0);
  const totalMessages = mockSocialSellingMetrics.reduce((s, m) => s + m.messages_sent, 0);

  // Weekly data
  const weeklyData = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const dateStr = d.toISOString().split("T")[0];
    const dayPosts = mockSocialSellingMetrics.filter((m) => m.date === dateStr).reduce((s, m) => s + m.posts_published, 0);
    const dayLeads = mockSocialSellingMetrics.filter((m) => m.date === dateStr).reduce((s, m) => s + m.leads_generated, 0);
    return {
      name: d.toLocaleDateString("pt-BR", { weekday: "short" }),
      value: dayPosts,
      value2: dayLeads,
    };
  });

  // Channel breakdown
  const channels = ["linkedin", "instagram", "twitter", "other"] as const;
  const channelData = channels.map((ch) => {
    const metrics = mockSocialSellingMetrics.filter((m) => m.channel === ch);
    return {
      channel: ch,
      posts: metrics.reduce((s, m) => s + m.posts_published, 0),
      leads: metrics.reduce((s, m) => s + m.leads_generated, 0),
      engagement: metrics.length > 0 ? metrics.reduce((s, m) => s + m.engagement_rate, 0) / metrics.length : 0,
    };
  }).filter((c) => c.posts > 0);

  const ssGoals = mockGoals.filter((g) => g.team_id === "t3");

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Dashboard Social Selling</h2>
        <p className="text-muted-foreground">Métricas de presença e conversão nas redes sociais</p>
      </div>

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-5">
        <MetricCard title="Posts Publicados" value={totalPosts} icon={Share2} trend={14} variant="info" />
        <MetricCard title="Engajamento Médio" value={`${avgEngagement.toFixed(1)}%`} icon={Heart} trend={6} variant="success" />
        <MetricCard title="Leads Gerados" value={totalLeads} icon={UserPlus} trend={20} variant="success" />
        <MetricCard title="Conexões" value={totalConnections} icon={Target} trend={10} />
        <MetricCard title="Mensagens Enviadas" value={totalMessages} icon={MessageSquare} trend={8} />
      </div>

      <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
        <PerformanceChart
          title="Posts vs Leads (última semana)"
          data={weeklyData}
          dataKey="value"
          dataKey2="value2"
          label1="Posts"
          label2="Leads"
        />

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Performance por Canal</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {channelData.map((ch) => (
              <div key={ch.channel} className="flex items-center justify-between p-3 rounded-md border">
                <div className="flex items-center gap-3">
                  <Badge variant="secondary" className="capitalize">
                    {ch.channel}
                  </Badge>
                  <span className="text-sm text-muted-foreground">{ch.posts} posts</span>
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <span>{ch.leads} leads</span>
                  <span className="text-muted-foreground">{ch.engagement.toFixed(1)}% eng.</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Meta vs Realizado</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {ssGoals.map((goal) => {
            const percent = Math.min((goal.current_value / goal.target_value) * 100, 100);
            return (
              <div key={goal.id} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium capitalize">{goal.metric_type.replace(/_/g, " ")}</span>
                  <span className="text-muted-foreground">
                    {goal.current_value} / {goal.target_value} ({percent.toFixed(0)}%)
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
