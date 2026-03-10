import { supabase } from "./client";
import type {
  AppUser,
  Team,
  SdrMetric,
  CloserMetric,
  SocialSellingMetric,
  Goal,
  FunnelStage,
  FunnelEntry,
  Funnel,
  FunnelSummary,
  FunnelReport,
  PersonProductSales,
} from "./types";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function throwOnError<T>(result: { data: T | null; error: unknown }): T {
  if (result.error) throw result.error;
  return result.data as T;
}

// ─── Users & Teams ────────────────────────────────────────────────────────────

export async function fetchUsers(): Promise<AppUser[]> {
  return throwOnError(
    await supabase.from("app_users").select("*").order("name")
  );
}

export async function fetchTeams(): Promise<Team[]> {
  return throwOnError(
    await supabase.from("teams").select("*").order("name")
  );
}

// ─── SDR Metrics ──────────────────────────────────────────────────────────────

export async function fetchSdrMetrics(): Promise<SdrMetric[]> {
  return throwOnError(
    await supabase
      .from("sdr_metrics")
      .select("*, user:app_users(*)")
      .order("date", { ascending: false })
  );
}

// ─── Closer Metrics ───────────────────────────────────────────────────────────

export async function fetchCloserMetrics(): Promise<CloserMetric[]> {
  return throwOnError(
    await supabase
      .from("closer_metrics")
      .select("*, user:app_users(*)")
      .order("date", { ascending: false })
  );
}

// ─── Social Selling Metrics ───────────────────────────────────────────────────

export async function fetchSocialSellingMetrics(): Promise<SocialSellingMetric[]> {
  return throwOnError(
    await supabase
      .from("social_selling_metrics")
      .select("*, user:app_users(*)")
      .order("date", { ascending: false })
  );
}

// ─── Goals ────────────────────────────────────────────────────────────────────

export async function fetchGoals(): Promise<Goal[]> {
  return throwOnError(
    await supabase.from("goals").select("*")
  );
}

// ─── Funnel (pipeline visual) ─────────────────────────────────────────────────

export async function fetchFunnelStages(): Promise<FunnelStage[]> {
  return throwOnError(
    await supabase.from("funnel_stages").select("*").order("order")
  );
}

export async function fetchFunnelEntries(): Promise<FunnelEntry[]> {
  return throwOnError(
    await supabase
      .from("funnel_entries")
      .select("*, stage:funnel_stages(*)")
      .order("created_at", { ascending: false })
  );
}

// ─── Funnels / Produtos ───────────────────────────────────────────────────────

export async function fetchFunnels(): Promise<Funnel[]> {
  return throwOnError(
    await supabase.from("funnels").select("*").order("name")
  );
}

export async function fetchFunnelSummaries(): Promise<FunnelSummary[]> {
  return throwOnError(
    await supabase.from("funnel_summaries").select("*")
  );
}

export async function fetchFunnelReports(): Promise<FunnelReport[]> {
  return throwOnError(
    await supabase.from("funnel_reports").select("*")
  );
}

// ─── Person × Product Sales ──────────────────────────────────────────────────

export async function fetchPersonProductSales(): Promise<PersonProductSales[]> {
  return throwOnError(
    await supabase.from("person_product_sales").select("*")
  );
}
