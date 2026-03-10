"use client";

import { useState, useMemo } from "react";
import { FileText, TrendingUp, Users, Phone, DollarSign, Target, Filter } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { FunnelReportChart } from "@/components/dashboard/FunnelReportChart";
import { ProductSalesTable } from "@/components/dashboard/ProductSalesTable";
import { EditableCell } from "@/components/dashboard/EditableCell";
import { useFunnelSummaries, useFunnelReports, usePersonProductSales } from "@/hooks/use-data";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import type { FunnelReport } from "@/lib/supabase/types";

export default function RelatoriosPage() {
  const [selectedFunnelId, setSelectedFunnelId] = useState<string | null>(null);

  const { data: funnelSummaries, isLoading: loadingSummaries } = useFunnelSummaries();
  const { data: funnelReports, isLoading: loadingReports } = useFunnelReports();
  const { data: personProductSales, isLoading: loadingSales } = usePersonProductSales();

  const isLoading = loadingSummaries || loadingReports || loadingSales;

  // Converte array de reports em Record para acesso por ID  
  const funnelReportsMap = useMemo(() => {
    const map: Record<string, FunnelReport> = {};
    funnelReports.forEach((r) => {
      map[r.funnel_id] = r;
    });
    return map;
  }, [funnelReports]);

  const displayedSummaries = useMemo(() => {
    return selectedFunnelId
      ? funnelSummaries.filter((f) => f.funnel_id === selectedFunnelId)
      : funnelSummaries;
  }, [selectedFunnelId, funnelSummaries]);

  const totals = useMemo(() => {
    if (displayedSummaries.length === 0) return null;
    return {
      leads: displayedSummaries.reduce((s, f) => s + f.total_leads, 0),
      qualified: displayedSummaries.reduce((s, f) => s + f.total_qualified, 0),
      scheduled: displayedSummaries.reduce((s, f) => s + f.total_calls_scheduled, 0),
      done: displayedSummaries.reduce((s, f) => s + f.total_calls_done, 0),
      sales: displayedSummaries.reduce((s, f) => s + f.total_sales, 0),
      revenue: displayedSummaries.reduce((s, f) => s + f.total_revenue, 0),
      entries: displayedSummaries.reduce((s, f) => s + f.total_entries, 0),
    };
  }, [displayedSummaries]);

  const detailedReport = selectedFunnelId ? funnelReportsMap[selectedFunnelId] : null;

  const formatCurrency = (v: number) =>
    new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(v);

  const handleCellSave = () => {
    toast.success("Valor atualizado! (mock)");
  };

  if (isLoading) {
    return (
      <div className="space-y-8 animate-fade-in">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-48" />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-primary/10">
            <FileText size={28} className="text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground tracking-tight">Relatórios por Funil</h1>
            <p className="text-sm text-muted-foreground mt-0.5">Visão consolidada de todos os funis e produtos</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="by-product">Por Produto</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6 mt-4">
          {/* Funnel filter */}
          <div className="flex items-center gap-2">
            <Select
              value={selectedFunnelId || "all"}
              onValueChange={(v) => setSelectedFunnelId(v === "all" ? null : (v ?? null))}
            >
              <SelectTrigger className="w-[220px]">
                <Filter size={16} className="mr-2 text-muted-foreground" />
                <SelectValue placeholder="Todos os Funis" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os Funis</SelectItem>
                {funnelSummaries.map((f) => (
                  <SelectItem key={f.funnel_id} value={f.funnel_id}>
                    {f.funnel_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Summary Cards */}
          {totals && (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
              <SummaryCard icon={Users} title="Leads" value={totals.leads} />
              <SummaryCard icon={Target} title="Qualificados" value={totals.qualified} />
              <SummaryCard icon={Phone} title="Agendadas" value={totals.scheduled} />
              <SummaryCard icon={Phone} title="Realizadas" value={totals.done} />
              <SummaryCard icon={TrendingUp} title="Vendas" value={totals.sales} />
              <SummaryCard icon={DollarSign} title="Faturamento" value={formatCurrency(totals.revenue)} />
              <SummaryCard icon={DollarSign} title="Entradas" value={formatCurrency(totals.entries)} />
            </div>
          )}

          {/* Funnel Chart */}
          {detailedReport && selectedFunnelId && (
            <FunnelReportChart report={detailedReport} />
          )}

          {/* Funnel Data Table */}
          {displayedSummaries.length > 0 && (
            <div className="glass-card">
              <div className="p-5 sm:p-6 space-y-4">
                <p className="section-label">Desempenho por Funil</p>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border/40">
                        <th className="text-left py-2.5 px-3 text-muted-foreground font-medium text-xs">Funil</th>
                        <th className="text-right py-2.5 px-3 text-muted-foreground font-medium text-xs">Leads</th>
                        <th className="text-right py-2.5 px-3 text-muted-foreground font-medium text-xs">Qualificados</th>
                        <th className="text-right py-2.5 px-3 text-muted-foreground font-medium text-xs">Agendadas</th>
                        <th className="text-right py-2.5 px-3 text-muted-foreground font-medium text-xs">Realizadas</th>
                        <th className="text-right py-2.5 px-3 text-muted-foreground font-medium text-xs">Vendas</th>
                        <th className="text-right py-2.5 px-3 text-muted-foreground font-medium text-xs">Faturamento</th>
                        <th className="text-right py-2.5 px-3 text-muted-foreground font-medium text-xs">Entradas</th>
                        <th className="text-right py-2.5 px-3 text-muted-foreground font-medium text-xs">Conversão</th>
                      </tr>
                    </thead>
                    <tbody>
                      {displayedSummaries.map((f) => (
                        <tr key={f.funnel_id} className="border-b border-border/20 last:border-0">
                          <td className="py-2.5 px-3 font-medium">
                            {f.funnel_name}
                            {f.category && (
                              <Badge variant="secondary" className="ml-2 text-[10px]">{f.category}</Badge>
                            )}
                          </td>
                          <td className="py-2.5 px-3 text-right">
                            <EditableCell value={f.total_leads} onSave={handleCellSave} disabled={false} />
                          </td>
                          <td className="py-2.5 px-3 text-right">
                            <EditableCell value={f.total_qualified} onSave={handleCellSave} disabled={false} />
                          </td>
                          <td className="py-2.5 px-3 text-right">
                            <EditableCell value={f.total_calls_scheduled} onSave={handleCellSave} disabled={false} />
                          </td>
                          <td className="py-2.5 px-3 text-right">
                            <EditableCell value={f.total_calls_done} onSave={handleCellSave} disabled={false} />
                          </td>
                          <td className="py-2.5 px-3 text-right">
                            <EditableCell value={f.total_sales} onSave={handleCellSave} disabled={false} />
                          </td>
                          <td className="py-2.5 px-3 text-right">
                            <EditableCell value={f.total_revenue} onSave={handleCellSave} disabled={false} isCurrency />
                          </td>
                          <td className="py-2.5 px-3 text-right">
                            <EditableCell value={f.total_entries} onSave={handleCellSave} disabled={false} isCurrency />
                          </td>
                          <td className="py-2.5 px-3 text-right font-semibold">{f.conversion_rate.toFixed(1)}%</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="by-product" className="mt-4">
          <div className="glass-card">
            <div className="p-5 sm:p-6">
              <ProductSalesTable data={personProductSales} canEdit={true} />
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function SummaryCard({ icon: Icon, title, value }: { icon: React.ElementType; title: string; value: string | number }) {
  return (
    <div className="glass-card">
      <div className="p-3 sm:p-4">
        <div className="flex items-center gap-2 mb-1.5">
          <Icon size={14} className="text-muted-foreground" />
          <span className="text-[11px] text-muted-foreground">{title}</span>
        </div>
        <p className="text-lg font-bold text-foreground">{value}</p>
      </div>
    </div>
  );
}
