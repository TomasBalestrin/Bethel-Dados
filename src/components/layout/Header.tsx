"use client";

import { useAuth } from "@/contexts/AuthContext";
import { BarChart3, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { MobileNav } from "./MobileNav";

export function Header() {
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-40 flex h-14 items-center gap-4 border-b bg-background px-4 md:hidden">
      <Sheet>
        <SheetTrigger render={<Button variant="ghost" size="icon" className="md:hidden" />}>
          <Menu className="h-5 w-5" />
        </SheetTrigger>
        <SheetContent side="left" className="p-0 w-64">
          <SheetTitle className="sr-only">Menu de navegação</SheetTitle>
          <MobileNav />
        </SheetContent>
      </Sheet>

      <div className="flex items-center gap-2 flex-1">
        <BarChart3 className="h-5 w-5 text-primary" />
        <span className="font-semibold">Bethel Dados</span>
      </div>

      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium text-primary">
        {user?.name?.charAt(0) ?? "U"}
      </div>
    </header>
  );
}
