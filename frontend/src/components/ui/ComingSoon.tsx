import { Construction } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface ComingSoonProps {
  title: string;
  description?: string;
  icon?: LucideIcon;
}

export function ComingSoon({ title, description, icon: Icon = Construction }: ComingSoonProps) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 py-24">
      <div
        className="flex h-16 w-16 items-center justify-center rounded-2xl"
        style={{ background: "var(--bg-surface)", border: "1px solid var(--border)" }}
      >
        <Icon size={28} style={{ color: "var(--accent)" }} />
      </div>
      <div className="text-center">
        <p className="text-base font-semibold" style={{ color: "var(--text-primary)" }}>
          {title}
        </p>
        <p className="mt-1 text-sm" style={{ color: "var(--text-muted)" }}>
          {description ?? "Esta seção está em desenvolvimento."}
        </p>
      </div>
    </div>
  );
}
