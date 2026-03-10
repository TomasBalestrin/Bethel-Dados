"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import {
  LayoutDashboard,
  Phone,
  Handshake,
  Share2,
  Trophy,
  Filter,
  FileText,
  Users,
  Upload,
  LogOut,
  BarChart3,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const navItems = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/sdrs", label: "SDRs", icon: Phone },
  { href: "/dashboard/closers", label: "Closers", icon: Handshake },
  { href: "/dashboard/social-selling", label: "Social Selling", icon: Share2 },
  { href: "/dashboard/ranking", label: "Ranking", icon: Trophy },
  { href: "/dashboard/funil", label: "Funil", icon: Filter },
  { href: "/dashboard/relatorios", label: "Relatórios", icon: FileText },
];

const adminItems = [
  { href: "/admin/usuarios", label: "Usuários", icon: Users },
  { href: "/admin/importar", label: "Importar Dados", icon: Upload },
];

export function MobileNav() {
  const pathname = usePathname();
  const { user, logout, hasRole } = useAuth();

  return (
    <div className="flex flex-col h-full bg-sidebar">
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 h-14">
        <div className="p-1.5 rounded-lg bg-sidebar-primary/20">
          <BarChart3 className="h-5 w-5 text-sidebar-primary" />
        </div>
        <h1 className="text-base font-bold text-sidebar-foreground tracking-tight">Bethel Dados</h1>
      </div>

      <div className="h-px bg-sidebar-border mx-3" />

      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground/60 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
              )}
            >
              <item.icon size={18} />
              {item.label}
            </Link>
          );
        })}

        {hasRole(["admin", "gestor"]) && (
          <>
            <div className="h-px bg-sidebar-border my-3" />
            <p className="px-3 text-[10px] font-semibold text-sidebar-foreground/40 uppercase tracking-widest mb-2">
              Administração
            </p>
            {adminItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200",
                    isActive
                      ? "bg-sidebar-accent text-sidebar-accent-foreground"
                      : "text-sidebar-foreground/60 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                  )}
                >
                  <item.icon size={18} />
                  {item.label}
                </Link>
              );
            })}
          </>
        )}
      </nav>

      <div className="px-3 py-3 border-t border-sidebar-border">
        <div className="flex items-center gap-3 px-2">
          <Avatar className="h-8 w-8 ring-2 ring-sidebar-border">
            <AvatarFallback className="bg-sidebar-primary text-sidebar-primary-foreground text-xs font-semibold">
              {user?.name?.charAt(0) ?? "U"}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-sidebar-foreground truncate">{user?.name}</p>
            <p className="text-[11px] text-sidebar-foreground/50 capitalize">{user?.role}</p>
          </div>
          <button
            onClick={logout}
            className="p-1.5 rounded-lg text-sidebar-foreground/40 hover:text-sidebar-foreground hover:bg-sidebar-accent transition-colors"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
