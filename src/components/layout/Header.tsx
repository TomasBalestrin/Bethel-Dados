"use client";

import { useAuth } from "@/contexts/AuthContext";
import { usePathname } from "next/navigation";
import { BarChart3, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { MobileNav } from "./MobileNav";

const pageNames: Record<string, string> = {
  "/dashboard": "Visão Geral",
  "/dashboard/sdrs": "SDRs",
  "/dashboard/closers": "Closers",
  "/dashboard/social-selling": "Social Selling",
  "/dashboard/ranking": "Ranking",
  "/dashboard/funil": "Funil",
  "/admin/usuarios": "Usuários",
  "/admin/importar": "Importar",
};

export function Header() {
  const { user } = useAuth();
  const pathname = usePathname();
  const pageName = pageNames[pathname] ?? "Dashboard";

  return (
    <header
      className="sticky top-0 z-30 bg-background/80 backdrop-blur-xl"
      style={{ boxShadow: "0 1px 2px rgba(0,0,0,0.04)" }}
    >
      <div className="flex items-center justify-between h-14 px-4 md:px-6">
        {/* Left side - mobile menu + breadcrumb */}
        <div className="flex items-center gap-4">
          <Sheet>
            <SheetTrigger render={<Button variant="ghost" size="icon" className="md:hidden" />}>
              <Menu size={20} />
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-64">
              <SheetTitle className="sr-only">Menu de navegação</SheetTitle>
              <MobileNav />
            </SheetContent>
          </Sheet>

          {/* Mobile logo */}
          <div className="flex items-center gap-2 md:hidden">
            <BarChart3 className="h-5 w-5 text-primary" />
            <span className="font-semibold text-sm">Bethel Dados</span>
          </div>

          {/* Desktop breadcrumb */}
          <div className="hidden md:flex items-center gap-1.5 text-sm">
            <span className="text-muted-foreground/70">Dashboard</span>
            <span className="text-muted-foreground/40">/</span>
            <span className="text-foreground font-medium">{pageName}</span>
          </div>
        </div>

        {/* Right side - user avatar */}
        <div className="flex items-center gap-2.5">
          <Avatar className="h-8 w-8 ring-2 ring-border/50">
            <AvatarFallback className="bg-primary text-primary-foreground text-xs font-semibold">
              {user?.name?.charAt(0) ?? "U"}
            </AvatarFallback>
          </Avatar>
          <div className="hidden sm:block text-left">
            <p className="text-sm font-medium leading-none">{user?.name?.split(" ")[0]}</p>
            <p className="text-[11px] text-muted-foreground mt-0.5 capitalize">{user?.role}</p>
          </div>
        </div>
      </div>
    </header>
  );
}
