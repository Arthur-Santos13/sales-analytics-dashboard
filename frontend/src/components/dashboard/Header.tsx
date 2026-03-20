"use client";

import { Bell, Search, ChevronDown } from "lucide-react";

interface HeaderProps {
  title: string;
  subtitle?: string;
}

export function Header({ title, subtitle }: HeaderProps) {
  return (
    <header
      className="flex h-16 items-center justify-between px-6"
      style={{
        background:   "var(--bg-surface)",
        borderBottom: "1px solid var(--border)",
      }}
    >
      {/* Page title */}
      <div>
        <h1
          className="text-lg font-semibold leading-tight tracking-tight"
          style={{ color: "var(--text-primary)" }}
        >
          {title}
        </h1>
        {subtitle && (
          <p className="text-xs" style={{ color: "var(--text-muted)" }}>
            {subtitle}
          </p>
        )}
      </div>

      {/* Right controls — hidden in print */}
      <div className="print-hide flex items-center gap-3">
        {/* Search */}
        <div
          className="flex items-center gap-2 rounded-lg px-3 py-2"
          style={{ background: "var(--bg-surface-2)", border: "1px solid var(--border)" }}
        >
          <Search size={14} style={{ color: "var(--text-muted)" }} />
          <input
            type="text"
            placeholder="Buscar..."
            className="w-40 bg-transparent text-sm outline-none"
            style={{ color: "var(--text-primary)" }}
          />
        </div>

        {/* Notifications */}
        <button
          className="relative flex h-9 w-9 items-center justify-center rounded-lg transition-colors"
          style={{ background: "var(--bg-surface-2)", border: "1px solid var(--border)" }}
          aria-label="Notificações"
        >
          <Bell size={16} style={{ color: "var(--text-secondary)" }} />
          <span
            className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full"
            style={{ background: "var(--accent)" }}
          />
        </button>

        {/* User avatar */}
        <button
          className="flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm transition-colors"
          style={{ background: "var(--bg-surface-2)", border: "1px solid var(--border)" }}
        >
          <div
            className="flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold"
            style={{ background: "var(--accent)", color: "#fff" }}
          >
            A
          </div>
          <span style={{ color: "var(--text-primary)" }}>Admin</span>
          <ChevronDown size={13} style={{ color: "var(--text-muted)" }} />
        </button>
      </div>
    </header>
  );
}
