"use client";

import { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
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
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <Upload className="h-6 w-6" />
          Importar Dados
        </h2>
        <p className="text-muted-foreground">Importe dados via CSV ou Excel</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Nova Importação</CardTitle>
          <CardDescription>Selecione o tipo de dados e faça upload do arquivo</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Tipo de Dados</Label>
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
            <Label>Arquivo (CSV ou Excel)</Label>
            <div
              className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:border-primary/50 transition-colors"
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
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Histórico de Importações</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Arquivo</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Linhas</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Data</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockImports.map((imp) => (
                <TableRow key={imp.id}>
                  <TableCell className="font-medium">{imp.filename}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{imp.type}</Badge>
                  </TableCell>
                  <TableCell>{imp.rows}</TableCell>
                  <TableCell>
                    {imp.status === "success" ? (
                      <span className="flex items-center gap-1 text-green-600 text-sm">
                        <CheckCircle className="h-3 w-3" /> Sucesso
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-red-600 text-sm">
                        <AlertCircle className="h-3 w-3" /> Erro
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {new Date(imp.date).toLocaleDateString("pt-BR")}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
