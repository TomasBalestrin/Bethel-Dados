"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Upload, FileSpreadsheet, CheckCircle, AlertCircle } from "lucide-react";
import { toast } from "sonner";

interface ImportRecord {
  id: number;
  filename: string;
  type: string;
  rows: number;
  status: "success" | "error" | "processing";
  date: string;
}

const mockImports: ImportRecord[] = [
  { id: 1, filename: "sdr_metrics_jan.csv", type: "SDR", rows: 120, status: "success", date: "2024-01-15" },
  { id: 2, filename: "closer_data_jan.xlsx", type: "Closer", rows: 85, status: "success", date: "2024-01-20" },
  { id: 3, filename: "social_feb.csv", type: "Social Selling", rows: 45, status: "error", date: "2024-02-01" },
  { id: 4, filename: "sdr_metrics_feb.csv", type: "SDR", rows: 150, status: "success", date: "2024-02-10" },
];

export default function ImportarPage() {
  const [selectedType, setSelectedType] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleImport = () => {
    if (!selectedFile || !selectedType) {
      toast.error("Selecione o tipo de dados e um arquivo");
      return;
    }
    toast.success(`Arquivo "${selectedFile.name}" importado com sucesso! (mock)`);
    setSelectedFile(null);
    setSelectedType("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-foreground tracking-tight flex items-center gap-2">
          <Upload className="h-6 w-6 text-info" />
          Importar Dados
        </h1>
        <p className="text-sm text-muted-foreground mt-0.5">Importe dados via CSV ou Excel</p>
      </div>

      <div className="glass-card">
        <div className="p-5 sm:p-6 space-y-5">
          <div>
            <p className="section-label">Nova Importação</p>
            <p className="text-xs text-muted-foreground mt-1">Selecione o tipo de dados e faça upload do arquivo</p>
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-medium">Tipo de Dados</Label>
            <Select value={selectedType} onValueChange={(v) => setSelectedType(v ?? "")}>
              <SelectTrigger className="w-full max-w-xs">
                <SelectValue placeholder="Selecionar tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sdr">Métricas SDR</SelectItem>
                <SelectItem value="closer">Métricas Closer</SelectItem>
                <SelectItem value="social">Métricas Social Selling</SelectItem>
                <SelectItem value="funnel">Funil de Vendas</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-medium">Arquivo (CSV ou Excel)</Label>
            <div
              className="border-2 border-dashed border-border/40 rounded-xl p-8 text-center cursor-pointer hover:border-primary/50 transition-colors bg-muted/20"
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv,.xlsx,.xls"
                onChange={handleFileSelect}
                className="hidden"
              />
              <FileSpreadsheet className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
              {selectedFile ? (
                <div>
                  <p className="font-medium">{selectedFile.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {(selectedFile.size / 1024).toFixed(1)} KB
                  </p>
                </div>
              ) : (
                <div>
                  <p className="font-medium">Clique para selecionar um arquivo</p>
                  <p className="text-sm text-muted-foreground">CSV, XLS ou XLSX</p>
                </div>
              )}
            </div>
          </div>

          <Button onClick={handleImport} disabled={!selectedFile || !selectedType}>
            <Upload className="h-4 w-4 mr-2" />
            Importar Dados
          </Button>
        </div>
      </div>

      <div className="glass-card">
        <div className="p-5 sm:p-6 space-y-4">
          <p className="section-label">Histórico de Importações</p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/40">
                  <th className="text-left py-2.5 px-3 text-muted-foreground font-medium text-xs">Arquivo</th>
                  <th className="text-left py-2.5 px-3 text-muted-foreground font-medium text-xs">Tipo</th>
                  <th className="text-left py-2.5 px-3 text-muted-foreground font-medium text-xs">Linhas</th>
                  <th className="text-left py-2.5 px-3 text-muted-foreground font-medium text-xs">Status</th>
                  <th className="text-left py-2.5 px-3 text-muted-foreground font-medium text-xs">Data</th>
                </tr>
              </thead>
              <tbody>
                {mockImports.map((imp) => (
                  <tr key={imp.id} className="border-b border-border/20 last:border-0">
                    <td className="py-2.5 px-3 font-medium">{imp.filename}</td>
                    <td className="py-2.5 px-3">
                      <Badge variant="secondary">{imp.type}</Badge>
                    </td>
                    <td className="py-2.5 px-3">{imp.rows}</td>
                    <td className="py-2.5 px-3">
                      {imp.status === "success" ? (
                        <span className="flex items-center gap-1 text-success text-sm">
                          <CheckCircle className="h-3 w-3" /> Sucesso
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-destructive text-sm">
                          <AlertCircle className="h-3 w-3" /> Erro
                        </span>
                      )}
                    </td>
                    <td className="py-2.5 px-3 text-muted-foreground">
                      {new Date(imp.date).toLocaleDateString("pt-BR")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
