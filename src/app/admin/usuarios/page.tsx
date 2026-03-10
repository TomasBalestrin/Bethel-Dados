"use client";

import { useState } from "react";
import { useUsers, useTeams } from "@/hooks/use-data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Users as UsersIcon, Plus } from "lucide-react";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

const roleBadgeVariant: Record<string, "default" | "secondary" | "destructive"> = {
  admin: "destructive",
  gestor: "default",
  vendedor: "secondary",
};

export default function UsuariosPage() {
  const [isOpen, setIsOpen] = useState(false);

  const { data: users, isLoading: loadingUsers } = useUsers();
  const { data: teams, isLoading: loadingTeams } = useTeams();

  const isLoading = loadingUsers || loadingTeams;

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Usuário criado com sucesso! (mock)");
    setIsOpen(false);
  };

  if (isLoading) {
    return (
      <div className="space-y-8 animate-fade-in">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64" />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight flex items-center gap-2">
            <UsersIcon className="h-6 w-6 text-primary" />
            Gestão de Usuários
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">Gerencie os usuários e permissões do sistema</p>
        </div>
        <Button onClick={() => setIsOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Novo Usuário
        </Button>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Criar Novo Usuário</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreateUser} className="space-y-4">
              <div className="space-y-2">
                <Label>Nome</Label>
                <Input placeholder="Nome completo" required />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input type="email" placeholder="email@bethel.com" required />
              </div>
              <div className="space-y-2">
                <Label>Role</Label>
                <Select defaultValue="vendedor">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="gestor">Gestor</SelectItem>
                    <SelectItem value="vendedor">Vendedor</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Equipe</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecionar equipe" />
                  </SelectTrigger>
                  <SelectContent>
                    {teams.map((team) => (
                      <SelectItem key={team.id} value={team.id}>
                        {team.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button type="submit" className="w-full">
                Criar Usuário
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="glass-card">
        <div className="p-5 sm:p-6 space-y-4">
          <p className="section-label">Usuários ({users.length})</p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/40">
                  <th className="text-left py-2.5 px-3 text-muted-foreground font-medium text-xs">Nome</th>
                  <th className="text-left py-2.5 px-3 text-muted-foreground font-medium text-xs">Email</th>
                  <th className="text-left py-2.5 px-3 text-muted-foreground font-medium text-xs">Role</th>
                  <th className="text-left py-2.5 px-3 text-muted-foreground font-medium text-xs">Equipe</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => {
                  const team = teams.find((t) => t.id === user.team_id);
                  return (
                    <tr key={user.id} className="border-b border-border/20 last:border-0">
                      <td className="py-2.5 px-3 font-medium">{user.name}</td>
                      <td className="py-2.5 px-3 text-muted-foreground">{user.email}</td>
                      <td className="py-2.5 px-3">
                        <Badge variant={roleBadgeVariant[user.role] ?? "secondary"} className="capitalize">
                          {user.role}
                        </Badge>
                      </td>
                      <td className="py-2.5 px-3 text-muted-foreground">{team?.name ?? "-"}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
