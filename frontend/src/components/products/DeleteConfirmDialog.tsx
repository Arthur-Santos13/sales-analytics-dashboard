"use client";

import { Trash2 } from "lucide-react";

interface DeleteConfirmDialogProps {
  productName: string;
  onCancel: () => void;
  onConfirm: () => Promise<void>;
  deleting?: boolean;
}

export function DeleteConfirmDialog({ productName, onCancel, onConfirm, deleting }: DeleteConfirmDialogProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(2px)" }}
    >
      <div
        className="w-full max-w-sm rounded-2xl p-6 shadow-2xl"
        style={{ background: "var(--bg-surface)", border: "1px solid #ef444440" }}
      >
        {/* Icon */}
        <div
          className="mb-4 flex h-11 w-11 items-center justify-center rounded-full"
          style={{ background: "#ef444420", border: "1px solid #ef444440" }}
        >
          <Trash2 size={20} style={{ color: "#ef4444" }} />
        </div>

        <h3 className="mb-2 text-base font-semibold" style={{ color: "var(--text-primary)" }}>
          Excluir produto
        </h3>
        <p className="mb-1 text-sm" style={{ color: "var(--text-secondary)" }}>
          Tem certeza que deseja excluir{" "}
          <span className="font-semibold" style={{ color: "var(--text-primary)" }}>"{productName}"</span>?
        </p>
        <p className="mb-5 text-xs" style={{ color: "var(--text-muted)" }}>
          Esta ação não pode ser desfeita.
        </p>

        <div className="flex justify-end gap-2">
          <button
            onClick={onCancel}
            disabled={deleting}
            className="rounded-lg px-4 py-2 text-sm font-medium"
            style={{ background: "var(--bg-surface-2)", color: "var(--text-secondary)", border: "1px solid var(--border)" }}
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            disabled={deleting}
            className="rounded-lg px-4 py-2 text-sm font-semibold"
            style={{ background: "#ef4444", color: "#fff", opacity: deleting ? 0.7 : 1 }}
          >
            {deleting ? "Excluindo..." : "Excluir"}
          </button>
        </div>
      </div>
    </div>
  );
}
