"use client";

import { useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase/client";

/**
 * Verifica se o Supabase está configurado (variáveis de ambiente preenchidas).
 * Quando não está, os hooks caem para os dados mock automaticamente.
 */
export function isSupabaseConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}

interface UseSupabaseQueryOptions<T> {
  /** Chave única para o React Query cache */
  queryKey: string;
  /** Função que busca os dados no Supabase */
  queryFn: () => Promise<T[]>;
  /** Dados mock para usar quando o Supabase não está configurado */
  fallbackData: T[];
  /** Nome da tabela no Supabase para escutar via Realtime */
  realtimeTable?: string;
}

/**
 * Hook genérico que combina React Query + Supabase Realtime.
 *
 * - Se Supabase não está configurado → retorna `fallbackData` (mock) direto.
 * - Se Supabase está configurado → faz fetch via `queryFn` e escuta Realtime
 *   para invalidar o cache automaticamente quando há mudanças.
 */
export function useSupabaseQuery<T>({
  queryKey,
  queryFn,
  fallbackData,
  realtimeTable,
}: UseSupabaseQueryOptions<T>) {
  const queryClient = useQueryClient();
  const configured = isSupabaseConfigured();

  const query = useQuery<T[]>({
    queryKey: [queryKey],
    queryFn: configured ? queryFn : () => Promise.resolve(fallbackData),
    // Se não há Supabase, nunca fica stale (é dado estático)
    staleTime: configured ? 30_000 : Infinity,
  });

  // ─── Realtime listener ────────────────────────────────────────────────
  useEffect(() => {
    if (!configured || !realtimeTable) return;

    const channel = supabase
      .channel(`realtime-${realtimeTable}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: realtimeTable },
        () => {
          // Invalida o cache do React Query → refetch automático
          queryClient.invalidateQueries({ queryKey: [queryKey] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [configured, realtimeTable, queryKey, queryClient]);

  return {
    data: query.data ?? fallbackData,
    isLoading: configured ? query.isLoading : false,
    error: query.error,
    isUsingMock: !configured,
  };
}
