import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default function DashboardRouteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // The visual layout (sidebar + header) is injected per-page via DashboardLayout,
  // so this file only carries the metadata boundary for the /dashboard segment.
  return <>{children}</>;
}
