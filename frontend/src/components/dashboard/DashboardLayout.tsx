"use client";

import { BarChart2 } from "lucide-react";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";

interface DashboardLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}

export function DashboardLayout({ children, title, subtitle }: DashboardLayoutProps) {
  const printDate = new Date().toLocaleString("pt-BR", {
    day:    "2-digit",
    month:  "2-digit",
    year:   "2-digit",
    hour:   "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  return (
    <div className="flex h-screen overflow-hidden print:block print:h-auto print:overflow-visible" style={{ background: "var(--bg-base)" }}>
      <Sidebar />

      <div className="flex flex-1 flex-col overflow-hidden print:block print:overflow-visible">
        {/* Print-only header bar — one line */}
        <div
          className="hidden print:flex items-center justify-between gap-4 px-6 py-2"
          style={{ background: "#0d1f3c", borderBottom: "1px solid #1e3a5f" }}
        >
          {/* Left: icon + brand + separator + page title */}
          <div className="flex items-center gap-2">
            <div
              className="flex h-6 w-6 items-center justify-center rounded"
              style={{ background: "#00b4d8" }}
            >
              <BarChart2 size={13} color="#fff" />
            </div>
            <span className="text-xs font-bold uppercase tracking-wide" style={{ color: "#e8f0fe" }}>
              Sales Analytics
            </span>
            <span className="text-xs" style={{ color: "#4d6d9a" }}>|</span>
            <span className="text-xs font-semibold" style={{ color: "#e8f0fe" }}>
              {title}
            </span>
          </div>

          {/* Right: user + date */}
          <div className="flex items-center gap-2">
            <div
              className="flex h-5 w-5 items-center justify-center rounded-full text-xs font-bold"
              style={{ background: "#00b4d8", color: "#fff", fontSize: 10 }}
            >
              A
            </div>
            <span className="text-xs" style={{ color: "#e8f0fe" }}>Admin</span>
            <span className="text-xs" style={{ color: "#4d6d9a" }}>·</span>
            <span className="text-xs" style={{ color: "#8eafd4" }}>{printDate}</span>
          </div>
        </div>

        <Header title={title} subtitle={subtitle} />

        <main
          className="flex-1 overflow-y-auto p-6 print:overflow-visible print:p-0"
          style={{ background: "var(--bg-base)" }}
        >
          {children}
        </main>
      </div>
    </div>
  );
}
