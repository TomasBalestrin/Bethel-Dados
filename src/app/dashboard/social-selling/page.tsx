"use client";

import { MetricCard } from "@/components/dashboard/MetricCard";
import { PerformanceChart } from "@/components/dashboard/PerformanceChart";
import { mockSocialSellingMetrics, mockGoals } from "@/model/entities/mock-data";
import { Share2, Heart, UserPlus, MessageSquare, Target } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function SocialSellingPage() {
  const totalPosts = mockSocialSellingMetrics.reduce((s, m) => s + m.posts_published, 0);
  const avgEngagement = mockSocialSellingMetrics.reduce((s, m) => s + m.engagement_rate, 0) / mockSocialSellingMetrics.length;
  const totalLeads = mockSocialSellingMetrics.reduce((s, m) => s + m.leads_generated, 0);
  const totalConnections = mockSocialSellingMetrics.reduce((s, m) => s + m.connections_made, 0);
  const totalMessages = mockSocialSellingMetrics.reduce((s, m) => s + m.messages_sent, 0);

  const weeklyData = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const dateStr = d.toISOString().split("T")[0];
    return {
      name: d.toLocaleDateString("pt-BR", { weekday: "short" }),
      value: mockSocialSellingMetrics.filter((m) => m.date === dateStr).reduce((s, m) => s + m.posts_published, 0),
      value2: mockSocialSellingMetrics.filter((m) => m.date === dateStr).reduce((s, m) => s + m.leads_generated, 0),
    };
  });

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
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-foreground tracking-tight">Dashboard Social Selling</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Métricas de presença e conversão nas redes sociais</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <MetricCard title="Posts Publicados" value={totalPosts} icon={Share2} trend={14} />
        <MetricCard title="Leads Gerados" value={totalLeads} icon={UserPlus} trend={20} variant="success" />
        <MetricCard title="Engajamento Médio" value={`${avgEngagement.toFixed(1)}%`} icon={Heart} trend={6} />
      </div>

      <div className="space-y-3">
        <p className="section-label text-xs px-1">Atividades</p>
        <div className="grid grid-cols-2 gap-3">
          <MetricCard title="Conexões Feitas" value={totalConnections} icon={Target} variant="info" compact />
          <MetricCard title="Mensagens Enviadas" value={totalMessages} icon={MessageSquare} compact />
        </div>
      </div>

      <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
        <PerformanceChart title="Posts vs Leads (última semana)" data={weeklyData} dataKey="value" dataKey2="value2" label1="Posts" label2="Leads" />

        <div className="glass-card">
          <div className="p-5 sm:p-6 space-y-4">
            <p className="section-label">Performance por Canal</p>
            <div className="space-y-3">
              {channelData.map((ch) => (
                <div key={ch.channel} className="flex items-center justify-between p-3 rounded-xl bg-muted/30 border border-border/20">
                  <div className="flex items-center gap-3">
                    <Badge variant="secondary" className="capitalize">{ch.channel}</Badge>
                    <span className="text-xs text-muted-foreground">{ch.posts} posts</span>
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="font-medium">{ch.leads} leads</span>
                    <span className="text-xs text-muted-foreground">{ch.engagement.toFixed(1)}% eng.</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <p className="section-label text-xs px-1">Meta vs Realizado</p>
        <div className="glass-card p-5 sm:p-6 space-y-4">
          {ssGoals.map((goal) => {
            const percent = Math.min((goal.current_value / goal.target_value) * 100, 100);
            return (
              <div key={goal.id} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium capitalize">{goal.metric_type.replace(/_/g, " ")}</span>
                  <span className="text-muted-foreground text-xs">
                    {goal.current_value} / {goal.target_value} ({percent.toFixed(0)}%)
                  </span>
                </div>
                <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                  <div className="h-full rounded-full bg-info transition-all duration-500" style={{ width: `${percent}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
