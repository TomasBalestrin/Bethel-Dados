"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Trophy, Medal, Award } from "lucide-react";

interface RankingEntry {
  position: number;
  name: string;
  team: string;
  metric: string | number;
  metricLabel: string;
  trend?: number;
}

interface RankingTableProps {
  title: string;
  entries: RankingEntry[];
}

function PositionIcon({ position }: { position: number }) {
  if (position === 1) return <Trophy className="h-4 w-4 text-yellow-500" />;
  if (position === 2) return <Medal className="h-4 w-4 text-gray-400" />;
  if (position === 3) return <Award className="h-4 w-4 text-amber-600" />;
  return <span className="text-sm text-muted-foreground font-medium">{position}°</span>;
}

export function RankingTable({ title, entries }: RankingTableProps) {
  return (
    <div className="glass-card animate-fade-in">
      <div className="p-5 sm:p-6">
        <p className="section-label mb-4">{title}</p>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">#</TableHead>
              <TableHead>Nome</TableHead>
              <TableHead>Equipe</TableHead>
              <TableHead className="text-right">{entries[0]?.metricLabel ?? "Métrica"}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {entries.map((entry) => (
              <TableRow key={entry.position}>
                <TableCell>
                  <PositionIcon position={entry.position} />
                </TableCell>
                <TableCell className="font-medium">{entry.name}</TableCell>
                <TableCell>
                  <Badge variant="secondary">{entry.team}</Badge>
                </TableCell>
                <TableCell className="text-right font-semibold">{entry.metric}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
