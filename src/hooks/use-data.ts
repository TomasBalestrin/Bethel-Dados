"use client";

import { useSupabaseQuery } from "./use-supabase-query";
import {
  fetchUsers,
  fetchTeams,
  fetchSdrMetrics,
  fetchCloserMetrics,
  fetchSocialSellingMetrics,
  fetchGoals,
  fetchFunnelStages,
  fetchFunnelEntries,
  fetchFunnels,
  fetchFunnelSummaries,
  fetchFunnelReports,
  fetchPersonProductSales,
} from "@/lib/supabase/queries";
import {
  mockUsers,
  mockTeams,
  mockSdrMetrics,
  mockCloserMetrics,
  mockSocialSellingMetrics,
  mockGoals,
  mockFunnelStages,
  mockFunnelEntries,
  mockFunnels,
  mockFunnelSummaries,
  mockPersonProductSales,
} from "@/model/entities/mock-data";
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
} from "@/lib/supabase/types";

// ─── Users & Teams ────────────────────────────────────────────────────────────

export function useUsers() {
  return useSupabaseQuery<AppUser>({
    queryKey: "users",
    queryFn: fetchUsers,
    fallbackData: mockUsers,
    realtimeTable: "app_users",
  });
}

export function useTeams() {
  return useSupabaseQuery<Team>({
    queryKey: "teams",
    queryFn: fetchTeams,
    fallbackData: mockTeams,
    realtimeTable: "teams",
  });
}

// ─── SDR Metrics ──────────────────────────────────────────────────────────────

export function useSdrMetrics() {
  return useSupabaseQuery<SdrMetric>({
    queryKey: "sdr-metrics",
    queryFn: fetchSdrMetrics,
    fallbackData: mockSdrMetrics,
    realtimeTable: "sdr_metrics",
  });
}

// ─── Closer Metrics ───────────────────────────────────────────────────────────

export function useCloserMetrics() {
  return useSupabaseQuery<CloserMetric>({
    queryKey: "closer-metrics",
    queryFn: fetchCloserMetrics,
    fallbackData: mockCloserMetrics,
    realtimeTable: "closer_metrics",
  });
}

// ─── Social Selling Metrics ───────────────────────────────────────────────────

export function useSocialSellingMetrics() {
  return useSupabaseQuery<SocialSellingMetric>({
    queryKey: "social-selling-metrics",
    queryFn: fetchSocialSellingMetrics,
    fallbackData: mockSocialSellingMetrics,
    realtimeTable: "social_selling_metrics",
  });
}

// ─── Goals ────────────────────────────────────────────────────────────────────

export function useGoals() {
  return useSupabaseQuery<Goal>({
    queryKey: "goals",
    queryFn: fetchGoals,
    fallbackData: mockGoals,
    realtimeTable: "goals",
  });
}

// ─── Funnel (pipeline visual) ─────────────────────────────────────────────────

export function useFunnelStages() {
  return useSupabaseQuery<FunnelStage>({
    queryKey: "funnel-stages",
    queryFn: fetchFunnelStages,
    fallbackData: mockFunnelStages,
    realtimeTable: "funnel_stages",
  });
}

export function useFunnelEntries() {
  return useSupabaseQuery<FunnelEntry>({
    queryKey: "funnel-entries",
    queryFn: fetchFunnelEntries,
    fallbackData: mockFunnelEntries,
    realtimeTable: "funnel_entries",
  });
}

// ─── Funnels / Produtos ───────────────────────────────────────────────────────

export function useFunnels() {
  return useSupabaseQuery<Funnel>({
    queryKey: "funnels",
    queryFn: fetchFunnels,
    fallbackData: mockFunnels,
    realtimeTable: "funnels",
  });
}

export function useFunnelSummaries() {
  return useSupabaseQuery<FunnelSummary>({
    queryKey: "funnel-summaries",
    queryFn: fetchFunnelSummaries,
    fallbackData: mockFunnelSummaries,
    realtimeTable: "funnel_summaries",
  });
}

export function useFunnelReports() {
  return useSupabaseQuery<FunnelReport>({
    queryKey: "funnel-reports",
    queryFn: fetchFunnelReports,
    fallbackData: [],
    realtimeTable: "funnel_reports",
  });
}

// ─── Person × Product Sales ──────────────────────────────────────────────────

export function usePersonProductSales() {
  return useSupabaseQuery<PersonProductSales>({
    queryKey: "person-product-sales",
    queryFn: fetchPersonProductSales,
    fallbackData: mockPersonProductSales,
    realtimeTable: "person_product_sales",
  });
}
