import type { AppUser, SdrMetric, CloserMetric, SocialSellingMetric, Team, FunnelStage, FunnelEntry, Goal, Funnel, FunnelSummary, FunnelReport, PersonProductSales } from "@/lib/supabase/types";

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

// Funis / Produtos
export const mockFunnels: Funnel[] = [
  { id: "fun1", name: "Mentoria Premium", category: "Educação", is_active: true, created_at: "2024-01-01" },
  { id: "fun2", name: "Consultoria Empresarial", category: "Consultoria", is_active: true, created_at: "2024-01-01" },
  { id: "fun3", name: "Curso Online", category: "Educação", is_active: true, created_at: "2024-01-01" },
  { id: "fun4", name: "Assessoria Financeira", category: "Financeiro", is_active: true, created_at: "2024-01-01" },
];

export const mockFunnelSummaries: FunnelSummary[] = [
  { funnel_id: "fun1", funnel_name: "Mentoria Premium", category: "Educação", total_leads: 120, total_qualified: 85, total_calls_scheduled: 60, total_calls_done: 52, total_sales: 18, total_revenue: 162000, total_entries: 54000, conversion_rate: 15.0 },
  { funnel_id: "fun2", funnel_name: "Consultoria Empresarial", category: "Consultoria", total_leads: 95, total_qualified: 62, total_calls_scheduled: 45, total_calls_done: 38, total_sales: 12, total_revenue: 228000, total_entries: 76000, conversion_rate: 12.6 },
  { funnel_id: "fun3", funnel_name: "Curso Online", category: "Educação", total_leads: 250, total_qualified: 180, total_calls_scheduled: 90, total_calls_done: 78, total_sales: 45, total_revenue: 89550, total_entries: 44775, conversion_rate: 18.0 },
  { funnel_id: "fun4", funnel_name: "Assessoria Financeira", category: "Financeiro", total_leads: 68, total_qualified: 42, total_calls_scheduled: 30, total_calls_done: 25, total_sales: 8, total_revenue: 96000, total_entries: 32000, conversion_rate: 11.8 },
];

export const mockFunnelReports: Record<string, FunnelReport> = {
  fun1: { funnel_id: "fun1", funnel_name: "Mentoria Premium", total_leads: 120, total_qualified: 85, total_calls_scheduled: 60, total_calls_done: 52, total_sales: 18, total_revenue: 162000, total_entries: 54000, leads_to_qualified_rate: 70.8, qualified_to_scheduled_rate: 70.6, scheduled_to_done_rate: 86.7, done_to_sales_rate: 34.6 },
  fun2: { funnel_id: "fun2", funnel_name: "Consultoria Empresarial", total_leads: 95, total_qualified: 62, total_calls_scheduled: 45, total_calls_done: 38, total_sales: 12, total_revenue: 228000, total_entries: 76000, leads_to_qualified_rate: 65.3, qualified_to_scheduled_rate: 72.6, scheduled_to_done_rate: 84.4, done_to_sales_rate: 31.6 },
  fun3: { funnel_id: "fun3", funnel_name: "Curso Online", total_leads: 250, total_qualified: 180, total_calls_scheduled: 90, total_calls_done: 78, total_sales: 45, total_revenue: 89550, total_entries: 44775, leads_to_qualified_rate: 72.0, qualified_to_scheduled_rate: 50.0, scheduled_to_done_rate: 86.7, done_to_sales_rate: 57.7 },
  fun4: { funnel_id: "fun4", funnel_name: "Assessoria Financeira", total_leads: 68, total_qualified: 42, total_calls_scheduled: 30, total_calls_done: 25, total_sales: 8, total_revenue: 96000, total_entries: 32000, leads_to_qualified_rate: 61.8, qualified_to_scheduled_rate: 71.4, scheduled_to_done_rate: 83.3, done_to_sales_rate: 32.0 },
};

export const mockPersonProductSales: PersonProductSales[] = [
  // Closers
  { person_id: "4", person_name: "Pedro Oliveira", person_type: "closer", funnel_id: "fun1", funnel_name: "Mentoria Premium", total_sales: 10, total_revenue: 90000, total_leads: 45, total_qualified: 32, total_scheduled: 25, total_done: 22, total_entries: 30000 },
  { person_id: "4", person_name: "Pedro Oliveira", person_type: "closer", funnel_id: "fun2", funnel_name: "Consultoria Empresarial", total_sales: 5, total_revenue: 95000, total_leads: 30, total_qualified: 20, total_scheduled: 15, total_done: 12, total_entries: 31667 },
  { person_id: "4", person_name: "Pedro Oliveira", person_type: "closer", funnel_id: "fun3", funnel_name: "Curso Online", total_sales: 20, total_revenue: 39800, total_leads: 80, total_qualified: 58, total_scheduled: 30, total_done: 28, total_entries: 19900 },
  { person_id: "5", person_name: "Maria Costa", person_type: "closer", funnel_id: "fun1", funnel_name: "Mentoria Premium", total_sales: 8, total_revenue: 72000, total_leads: 40, total_qualified: 28, total_scheduled: 20, total_done: 18, total_entries: 24000 },
  { person_id: "5", person_name: "Maria Costa", person_type: "closer", funnel_id: "fun2", funnel_name: "Consultoria Empresarial", total_sales: 7, total_revenue: 133000, total_leads: 35, total_qualified: 22, total_scheduled: 18, total_done: 15, total_entries: 44333 },
  { person_id: "5", person_name: "Maria Costa", person_type: "closer", funnel_id: "fun3", funnel_name: "Curso Online", total_sales: 25, total_revenue: 49750, total_leads: 90, total_qualified: 65, total_scheduled: 35, total_done: 32, total_entries: 24875 },
  { person_id: "5", person_name: "Maria Costa", person_type: "closer", funnel_id: "fun4", funnel_name: "Assessoria Financeira", total_sales: 8, total_revenue: 96000, total_leads: 38, total_qualified: 22, total_scheduled: 15, total_done: 13, total_entries: 32000 },
  // SDRs
  { person_id: "2", person_name: "Carlos Silva", person_type: "sdr", funnel_id: "fun1", funnel_name: "Mentoria Premium", total_sales: 3, total_revenue: 0, total_leads: 55, total_qualified: 40, total_scheduled: 28, total_done: 0, total_entries: 0 },
  { person_id: "2", person_name: "Carlos Silva", person_type: "sdr", funnel_id: "fun3", funnel_name: "Curso Online", total_sales: 5, total_revenue: 0, total_leads: 100, total_qualified: 72, total_scheduled: 40, total_done: 0, total_entries: 0 },
  { person_id: "3", person_name: "Ana Santos", person_type: "sdr", funnel_id: "fun2", funnel_name: "Consultoria Empresarial", total_sales: 2, total_revenue: 0, total_leads: 45, total_qualified: 30, total_scheduled: 22, total_done: 0, total_entries: 0 },
  { person_id: "3", person_name: "Ana Santos", person_type: "sdr", funnel_id: "fun4", funnel_name: "Assessoria Financeira", total_sales: 1, total_revenue: 0, total_leads: 30, total_qualified: 20, total_scheduled: 15, total_done: 0, total_entries: 0 },
  // Social Selling
  { person_id: "6", person_name: "Lucas Ferreira", person_type: "social_selling", funnel_id: "fun1", funnel_name: "Mentoria Premium", total_sales: 2, total_revenue: 0, total_leads: 25, total_qualified: 15, total_scheduled: 7, total_done: 0, total_entries: 0 },
  { person_id: "6", person_name: "Lucas Ferreira", person_type: "social_selling", funnel_id: "fun3", funnel_name: "Curso Online", total_sales: 8, total_revenue: 0, total_leads: 80, total_qualified: 55, total_scheduled: 25, total_done: 0, total_entries: 0 },
];

export const mockGoals: Goal[] = [
  { id: "g1", user_id: "2", team_id: "t1", metric_type: "calls_made", target_value: 800, current_value: 650, period_start: "2024-03-01", period_end: "2024-03-31" },
  { id: "g2", user_id: "2", team_id: "t1", metric_type: "meetings_scheduled", target_value: 100, current_value: 78, period_start: "2024-03-01", period_end: "2024-03-31" },
  { id: "g3", user_id: "4", team_id: "t2", metric_type: "deals_closed", target_value: 30, current_value: 22, period_start: "2024-03-01", period_end: "2024-03-31" },
  { id: "g4", user_id: "4", team_id: "t2", metric_type: "revenue", target_value: 300000, current_value: 235000, period_start: "2024-03-01", period_end: "2024-03-31" },
  { id: "g5", user_id: "6", team_id: "t3", metric_type: "leads_generated", target_value: 50, current_value: 38, period_start: "2024-03-01", period_end: "2024-03-31" },
];
