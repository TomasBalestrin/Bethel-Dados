import type { AppUser, SdrMetric, CloserMetric, SocialSellingMetric, Team, FunnelStage, FunnelEntry, Goal } from "@/lib/supabase/types";

export const mockUsers: AppUser[] = [
  { id: "1", email: "admin@bethel.com", name: "Admin Bethel", role: "admin", team_id: null, avatar_url: null, created_at: "2024-01-01" },
  { id: "2", email: "carlos@bethel.com", name: "Carlos Silva", role: "vendedor", team_id: "t1", avatar_url: null, created_at: "2024-01-01" },
  { id: "3", email: "ana@bethel.com", name: "Ana Santos", role: "vendedor", team_id: "t1", avatar_url: null, created_at: "2024-01-01" },
  { id: "4", email: "pedro@bethel.com", name: "Pedro Oliveira", role: "vendedor", team_id: "t2", avatar_url: null, created_at: "2024-01-01" },
  { id: "5", email: "maria@bethel.com", name: "Maria Costa", role: "vendedor", team_id: "t2", avatar_url: null, created_at: "2024-01-01" },
  { id: "6", email: "lucas@bethel.com", name: "Lucas Ferreira", role: "vendedor", team_id: "t3", avatar_url: null, created_at: "2024-01-01" },
  { id: "7", email: "julia@bethel.com", name: "Julia Mendes", role: "gestor", team_id: null, avatar_url: null, created_at: "2024-01-01" },
];

export const mockTeams: Team[] = [
  { id: "t1", name: "SDRs Alpha", type: "sdr", created_at: "2024-01-01" },
  { id: "t2", name: "Closers Beta", type: "closer", created_at: "2024-01-01" },
  { id: "t3", name: "Social Selling", type: "social_selling", created_at: "2024-01-01" },
];

function generateDates(days: number): string[] {
  const dates: string[] = [];
  const today = new Date();
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    dates.push(d.toISOString().split("T")[0]);
  }
  return dates;
}

const last30Days = generateDates(30);

export const mockSdrMetrics: SdrMetric[] = last30Days.flatMap((date) => [
  { id: `s1-${date}`, user_id: "2", date, calls_made: 30 + Math.floor(Math.random() * 20), meetings_scheduled: 3 + Math.floor(Math.random() * 5), qualified_leads: 2 + Math.floor(Math.random() * 4), emails_sent: 20 + Math.floor(Math.random() * 15), follow_ups: 10 + Math.floor(Math.random() * 8), conversion_rate: 8 + Math.random() * 7, user: mockUsers[1] },
  { id: `s2-${date}`, user_id: "3", date, calls_made: 25 + Math.floor(Math.random() * 25), meetings_scheduled: 2 + Math.floor(Math.random() * 6), qualified_leads: 1 + Math.floor(Math.random() * 5), emails_sent: 18 + Math.floor(Math.random() * 20), follow_ups: 8 + Math.floor(Math.random() * 10), conversion_rate: 6 + Math.random() * 9, user: mockUsers[2] },
]);

export const mockCloserMetrics: CloserMetric[] = last30Days.flatMap((date) => [
  { id: `c1-${date}`, user_id: "4", date, meetings_held: 2 + Math.floor(Math.random() * 4), proposals_sent: 1 + Math.floor(Math.random() * 3), deals_closed: Math.floor(Math.random() * 2), revenue: Math.floor(Math.random() * 15000) + 5000, average_ticket: 5000 + Math.floor(Math.random() * 5000), conversion_rate: 15 + Math.random() * 20, user: mockUsers[3] },
  { id: `c2-${date}`, user_id: "5", date, meetings_held: 3 + Math.floor(Math.random() * 3), proposals_sent: 2 + Math.floor(Math.random() * 2), deals_closed: Math.floor(Math.random() * 3), revenue: Math.floor(Math.random() * 20000) + 8000, average_ticket: 6000 + Math.floor(Math.random() * 6000), conversion_rate: 18 + Math.random() * 22, user: mockUsers[4] },
]);

export const mockSocialSellingMetrics: SocialSellingMetric[] = last30Days.flatMap((date) => [
  { id: `ss1-${date}`, user_id: "6", date, posts_published: 1 + Math.floor(Math.random() * 3), engagement_rate: 2 + Math.random() * 6, leads_generated: Math.floor(Math.random() * 4), connections_made: 5 + Math.floor(Math.random() * 15), messages_sent: 10 + Math.floor(Math.random() * 20), channel: "linkedin" as const, user: mockUsers[5] },
]);

export const mockFunnelStages: FunnelStage[] = [
  { id: "f1", name: "Lead", order: 1, color: "#3b82f6" },
  { id: "f2", name: "Qualificação", order: 2, color: "#8b5cf6" },
  { id: "f3", name: "Proposta", order: 3, color: "#f59e0b" },
  { id: "f4", name: "Negociação", order: 4, color: "#f97316" },
  { id: "f5", name: "Fechamento", order: 5, color: "#22c55e" },
];

export const mockFunnelEntries: FunnelEntry[] = [
  ...Array.from({ length: 45 }, (_, i) => ({ id: `fe-${i}`, stage_id: "f1", lead_name: `Lead ${i + 1}`, value: 5000 + Math.floor(Math.random() * 15000), assigned_to: mockUsers[1 + (i % 5)].name, created_at: "2024-01-01", updated_at: "2024-01-01" })),
  ...Array.from({ length: 30 }, (_, i) => ({ id: `fe-q-${i}`, stage_id: "f2", lead_name: `Qualificado ${i + 1}`, value: 8000 + Math.floor(Math.random() * 12000), assigned_to: mockUsers[1 + (i % 5)].name, created_at: "2024-01-01", updated_at: "2024-01-01" })),
  ...Array.from({ length: 18 }, (_, i) => ({ id: `fe-p-${i}`, stage_id: "f3", lead_name: `Proposta ${i + 1}`, value: 10000 + Math.floor(Math.random() * 10000), assigned_to: mockUsers[1 + (i % 5)].name, created_at: "2024-01-01", updated_at: "2024-01-01" })),
  ...Array.from({ length: 10 }, (_, i) => ({ id: `fe-n-${i}`, stage_id: "f4", lead_name: `Negociação ${i + 1}`, value: 12000 + Math.floor(Math.random() * 8000), assigned_to: mockUsers[1 + (i % 5)].name, created_at: "2024-01-01", updated_at: "2024-01-01" })),
  ...Array.from({ length: 5 }, (_, i) => ({ id: `fe-f-${i}`, stage_id: "f5", lead_name: `Fechado ${i + 1}`, value: 15000 + Math.floor(Math.random() * 10000), assigned_to: mockUsers[1 + (i % 5)].name, created_at: "2024-01-01", updated_at: "2024-01-01" })),
];

export const mockGoals: Goal[] = [
  { id: "g1", user_id: "2", team_id: "t1", metric_type: "calls_made", target_value: 800, current_value: 650, period_start: "2024-03-01", period_end: "2024-03-31" },
  { id: "g2", user_id: "2", team_id: "t1", metric_type: "meetings_scheduled", target_value: 100, current_value: 78, period_start: "2024-03-01", period_end: "2024-03-31" },
  { id: "g3", user_id: "4", team_id: "t2", metric_type: "deals_closed", target_value: 30, current_value: 22, period_start: "2024-03-01", period_end: "2024-03-31" },
  { id: "g4", user_id: "4", team_id: "t2", metric_type: "revenue", target_value: 300000, current_value: 235000, period_start: "2024-03-01", period_end: "2024-03-31" },
  { id: "g5", user_id: "6", team_id: "t3", metric_type: "leads_generated", target_value: 50, current_value: 38, period_start: "2024-03-01", period_end: "2024-03-31" },
];
