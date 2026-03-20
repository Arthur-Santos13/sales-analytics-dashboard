"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  TrendingUp,
  ShoppingCart,
  Users,
  Package,
  BarChart2,
  Settings,
  ChevronRight,
} from "lucide-react";

const navItems = [
  { label: "Dashboard",   href: "/dashboard",            icon: LayoutDashboard },
  { label: "Vendas",      href: "/dashboard/sales",      icon: TrendingUp },
  { label: "Pedidos",     href: "/dashboard/orders",     icon: ShoppingCart },
  { label: "Clientes",    href: "/dashboard/customers",  icon: Users },
  { label: "Produtos",    href: "/dashboard/products",   icon: Package },
  { label: "Relatórios",  href: "/dashboard/reports",    icon: BarChart2 },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside
      className="flex h-screen w-60 flex-col"
      style={{
        background: "var(--bg-surface)",
        borderRight: "1px solid var(--border)",
      }}
    >
      {/* Logo */}
      <div
        className="flex h-16 items-center gap-3 px-5"
        style={{ borderBottom: "1px solid var(--border)" }}
      >
        <div
          className="flex h-8 w-8 items-center justify-center rounded-lg"
          style={{ background: "#00b4d8", boxShadow: "0 0 12px rgba(0,180,216,0.25)" }}
        >
          <BarChart2 size={16} color="#fff" />
        </div>
        <span
          className="text-sm font-bold tracking-wide uppercase"
          style={{ color: "var(--text-primary)" }}
        >
          Sales Analytics
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex flex-1 flex-col gap-1 overflow-y-auto px-3 py-4">
        {navItems.map(({ label, href, icon: Icon }) => {
          const isActive = pathname === href || pathname.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              className="group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-150"
              style={{
                background:    isActive ? "var(--bg-overlay)"  : "transparent",
                color:         isActive ? "var(--accent-bright)" : "var(--text-secondary)",
                borderLeft:    isActive ? "3px solid var(--accent)" : "3px solid transparent",
              }}
            >
              <Icon size={17} />
              <span className="flex-1">{label}</span>
              {isActive && <ChevronRight size={14} style={{ color: "var(--accent)" }} />}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div
        className="px-3 py-4"
        style={{ borderTop: "1px solid var(--border)" }}
      >
        <Link
          href="/dashboard/settings"
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-150"
          style={{ color: "var(--text-muted)" }}
        >
          <Settings size={17} />
          <span>Configurações</span>
        </Link>
      </div>
    </aside>
  );
}
