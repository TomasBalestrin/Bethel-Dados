export type UserRole = "admin" | "gestor" | "vendedor";

export interface AppUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  team_id: string | null;
  avatar_url: string | null;
  created_at: string;
}

export interface Team {
  id: string;
  name: string;
  type: "sdr" | "closer" | "social_selling";
  created_at: string;
}

export interface TeamMember {
  id: string;
  user_id: string;
  team_id: string;
  user?: AppUser;
  team?: Team;
}

export interface SdrMetric {
  id: string;
  user_id: string;
  date: string;
  calls_made: number;
  meetings_scheduled: number;
  qualified_leads: number;
  emails_sent: number;
  follow_ups: number;
  conversion_rate: number;
  user?: AppUser;
}

export interface CloserMetric {
  id: string;
  user_id: string;
  date: string;
  meetings_held: number;
  proposals_sent: number;
  deals_closed: number;
  revenue: number;
  average_ticket: number;
  conversion_rate: number;
  user?: AppUser;
}

export interface SocialSellingMetric {
  id: string;
  user_id: string;
  date: string;
  posts_published: number;
  engagement_rate: number;
  leads_generated: number;
  connections_made: number;
  messages_sent: number;
  channel: "linkedin" | "instagram" | "twitter" | "other";
  user?: AppUser;
}

export interface Goal {
  id: string;
  user_id: string | null;
  team_id: string | null;
  metric_type: string;
  target_value: number;
  current_value: number;
  period_start: string;
  period_end: string;
}

export interface FunnelStage {
  id: string;
  name: string;
  order: number;
  color: string;
}

export interface FunnelEntry {
  id: string;
  stage_id: string;
  lead_name: string;
  value: number;
  assigned_to: string;
  created_at: string;
  updated_at: string;
  stage?: FunnelStage;
}

export interface Funnel {
  id: string;
  name: string;
  category: string | null;
  is_active: boolean;
  created_at: string;
}

export interface FunnelSummary {
  funnel_id: string;
  funnel_name: string;
  category: string | null;
  total_leads: number;
  total_qualified: number;
  total_calls_scheduled: number;
  total_calls_done: number;
  total_sales: number;
  total_revenue: number;
  total_entries: number;
  conversion_rate: number;
}

export interface FunnelReport {
  funnel_id: string;
  funnel_name: string;
  total_leads: number;
  total_qualified: number;
  total_calls_scheduled: number;
  total_calls_done: number;
  total_sales: number;
  total_revenue: number;
  total_entries: number;
  leads_to_qualified_rate: number;
  qualified_to_scheduled_rate: number;
  scheduled_to_done_rate: number;
  done_to_sales_rate: number;
}

export interface PersonProductSales {
  person_id: string;
  person_name: string;
  person_type: string;
  funnel_id: string | null;
  funnel_name: string;
  total_sales: number;
  total_revenue: number;
  total_leads: number;
  total_qualified: number;
  total_scheduled: number;
  total_done: number;
  total_entries: number;
}
