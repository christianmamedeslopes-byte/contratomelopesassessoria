import React from "react";
import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, FilePlus, Archive, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { path: "/", label: "Painel", icon: LayoutDashboard },
  { path: "/novo-contrato", label: "Novo Contrato", icon: FilePlus },
  { path: "/contratos", label: "Meus Contratos", icon: Archive },
];

export default function Sidebar() {
  const location = useLocation();

  return (
    <aside className="hidden lg:flex flex-col w-64 bg-sidebar text-sidebar-foreground border-r border-sidebar-border min-h-screen">
      {/* Brand */}
      <div className="p-6 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-sidebar-primary flex items-center justify-center">
            <span className="text-sidebar-primary-foreground font-heading font-bold text-sm">ML</span>
          </div>
          <div>
            <h2 className="font-heading text-sm font-semibold text-sidebar-foreground">M e Lopes</h2>
            <p className="text-[11px] text-sidebar-foreground/50 tracking-wide uppercase">Assessoria</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {NAV_ITEMS.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-sidebar-accent text-sidebar-primary"
                  : "text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent/50"
              )}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-sidebar-border">
        <p className="text-[10px] text-sidebar-foreground/30 text-center tracking-wider uppercase">
          Business Suite v1.0
        </p>
      </div>
    </aside>
  );
}
