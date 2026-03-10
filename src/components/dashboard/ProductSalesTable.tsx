"use client";

import { useMemo, useState } from "react";
import { Filter, Users, Package } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { PersonProductSales } from "@/lib/supabase/types";
import { EditableCell } from "./EditableCell";
import { toast } from "sonner";

interface ProductSalesTableProps {
  data: PersonProductSales[];
  canEdit: boolean;
}

export function ProductSalesTable({ data, canEdit }: ProductSalesTableProps) {
  const [selectedProduct, setSelectedProduct] = useState("all");

  const products = useMemo(() => {
    return [...new Set(data.map((d) => d.funnel_name))].sort();
  }, [data]);

  const filtered = useMemo(() => {
    return selectedProduct === "all" ? data : data.filter((d) => d.funnel_name === selectedProduct);
  }, [data, selectedProduct]);

  const personTotals = useMemo(() => {
    const map = new Map<string, { person_id: string; person_name: string; person_type: string; total_sales: number; total_revenue: number; total_leads: number; total_done: number; total_entries: number }>();
    filtered.forEach((row) => {
      const key = `${row.person_name}-${row.person_type}`;
      const existing = map.get(key) || { person_id: row.person_id, person_name: row.person_name, person_type: row.person_type, total_sales: 0, total_revenue: 0, total_leads: 0, total_done: 0, total_entries: 0 };
      existing.total_sales += row.total_sales;
      existing.total_revenue += row.total_revenue;
      existing.total_leads += row.total_leads;
      existing.total_done += row.total_done;
      existing.total_entries += row.total_entries;
      map.set(key, existing);
    });
    return [...map.values()].sort((a, b) => b.total_sales - a.total_sales);
  }, [filtered]);

  const grandTotal = useMemo(() => ({
    sales: personTotals.reduce((s, p) => s + p.total_sales, 0),
    revenue: personTotals.reduce((s, p) => s + p.total_revenue, 0),
    leads: personTotals.reduce((s, p) => s + p.total_leads, 0),
    done: personTotals.reduce((s, p) => s + p.total_done, 0),
    entries: personTotals.reduce((s, p) => s + p.total_entries, 0),
  }), [personTotals]);

  const formatCurrency = (v: number) =>
    new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(v);

  const typeLabel = (t: string) => {
    if (t === "closer") return "Closer";
    if (t === "sdr") return "SDR";
    if (t === "social_selling") return "Social Selling";
    return t;
  };

  const handleSave = (field: string, _personId: string) => {
    toast.success("Valor atualizado! (mock)");
  };

  if (!data || data.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <Package size={48} className="mx-auto mb-4 opacity-50" />
        <p>Nenhum dado de vendas por produto encontrado.</p>
      </div>
    );
  }

  const rows = selectedProduct !== "all" ? filtered : personTotals.map((p) => ({ ...p, funnel_name: "Agregado", funnel_id: null, total_qualified: 0, total_scheduled: 0 }));

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <Users size={16} className="text-muted-foreground" />
          <p className="section-label">Vendas por Pessoa × Produto</p>
        </div>
        <Select value={selectedProduct} onValueChange={(v) => setSelectedProduct(v ?? "all")}>
          <SelectTrigger className="w-[220px]">
            <Filter size={16} className="mr-2 text-muted-foreground" />
            <SelectValue placeholder="Todos os Produtos" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os Produtos</SelectItem>
            {products.map((p) => (
              <SelectItem key={p} value={p}>{p}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border/40">
              <th className="text-left py-2.5 px-3 text-muted-foreground font-medium text-xs">Nome</th>
              <th className="text-left py-2.5 px-3 text-muted-foreground font-medium text-xs">Tipo</th>
              <th className="text-right py-2.5 px-3 text-muted-foreground font-medium text-xs">Leads</th>
              <th className="text-right py-2.5 px-3 text-muted-foreground font-medium text-xs">Realizadas</th>
              <th className="text-right py-2.5 px-3 text-muted-foreground font-medium text-xs">Vendas</th>
              <th className="text-right py-2.5 px-3 text-muted-foreground font-medium text-xs">Faturamento</th>
              <th className="text-right py-2.5 px-3 text-muted-foreground font-medium text-xs">Valor Entrada</th>
              <th className="text-right py-2.5 px-3 text-muted-foreground font-medium text-xs">Conversão</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i} className="border-b border-border/20 last:border-0">
                <td className="py-2.5 px-3 font-medium">{row.person_name}</td>
                <td className="py-2.5 px-3">
                  <Badge variant="secondary" className="text-xs">{typeLabel(row.person_type)}</Badge>
                </td>
                <td className="py-2.5 px-3 text-right">{row.total_leads}</td>
                <td className="py-2.5 px-3 text-right">{row.total_done}</td>
                <td className="py-2.5 px-3 text-right">
                  <EditableCell value={row.total_sales} onSave={() => handleSave("sales", row.person_id)} disabled={!canEdit} />
                </td>
                <td className="py-2.5 px-3 text-right">
                  <EditableCell value={row.total_revenue} onSave={() => handleSave("revenue", row.person_id)} disabled={!canEdit || row.person_type !== "closer"} isCurrency />
                </td>
                <td className="py-2.5 px-3 text-right">
                  <EditableCell value={row.total_entries} onSave={() => handleSave("entries", row.person_id)} disabled={!canEdit || row.person_type !== "closer"} isCurrency />
                </td>
                <td className="py-2.5 px-3 text-right font-semibold">
                  {row.total_done > 0 ? ((row.total_sales / row.total_done) * 100).toFixed(1) : "0.0"}%
                </td>
              </tr>
            ))}
            {rows.length > 1 && (
              <tr className="bg-muted/30 font-semibold border-t border-border/40">
                <td className="py-2.5 px-3">Total</td>
                <td className="py-2.5 px-3"></td>
                <td className="py-2.5 px-3 text-right">{grandTotal.leads}</td>
                <td className="py-2.5 px-3 text-right">{grandTotal.done}</td>
                <td className="py-2.5 px-3 text-right">{grandTotal.sales}</td>
                <td className="py-2.5 px-3 text-right">{formatCurrency(grandTotal.revenue)}</td>
                <td className="py-2.5 px-3 text-right">{formatCurrency(grandTotal.entries)}</td>
                <td className="py-2.5 px-3 text-right">
                  {grandTotal.done > 0 ? ((grandTotal.sales / grandTotal.done) * 100).toFixed(1) : "0.0"}%
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
