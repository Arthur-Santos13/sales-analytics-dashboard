"use client";

import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import type { ProductItem, ProductInput } from "@/types/sales";

const CATEGORIES = ["Eletrônicos", "Móveis", "Livros", "Saúde"];

interface ProductModalProps {
  product?: ProductItem | null;     // null/undefined = create mode
  onClose: () => void;
  onConfirm: (data: ProductInput) => Promise<void>;
}

const inputStyle: React.CSSProperties = {
  background: "var(--bg-surface-2)",
  border: "1px solid var(--border)",
  color: "var(--text-primary)",
  borderRadius: "0.5rem",
  padding: "0.5rem 0.75rem",
  fontSize: "0.875rem",
  outline: "none",
  width: "100%",
};

const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: "0.75rem",
  fontWeight: 600,
  textTransform: "uppercase",
  letterSpacing: "0.05em",
  color: "var(--text-muted)",
  marginBottom: "0.375rem",
};

export function ProductModal({ product, onClose, onConfirm }: ProductModalProps) {
  const isEdit = !!product;

  const [form, setForm] = useState<ProductInput>({
    name:     product?.name     ?? "",
    category: product?.category ?? CATEGORIES[0],
    price:    product?.price    ?? 0,
    quantity: product?.quantity ?? 0,
  });
  // Price stored as integer cents (e.g. 1999 = R$ 19,99)
  // Initialise from the product price: multiply by 100 and round
  const [priceCents, setPriceCents] = useState<number>(
    product?.price ? Math.round(Number(product.price) * 100) : 0
  );

  /** Format cents integer into "1.234,56" style display string */
  function formatCents(cents: number): string {
    if (cents === 0) return "";
    const str = String(cents).padStart(3, "0");   // at least "001"
    const intPart  = str.slice(0, -2) || "0";      // digits before cents
    const centPart = str.slice(-2);                 // last 2 digits
    // Add thousand separators to intPart
    const withDots = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    return `${withDots},${centPart}`;
  }
  const [quantityStr, setQuantityStr] = useState(product?.quantity ? String(product.quantity) : "");

  const [saving, setSaving]   = useState(false);
  const [error,  setError]    = useState<string | null>(null);
  const [confirm, setConfirm] = useState(false); // confirmation step

  const nameRef = useRef<HTMLInputElement>(null);
  useEffect(() => { nameRef.current?.focus(); }, []);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  function set(field: keyof ProductInput, value: string | number) {
    setForm((prev) => ({ ...prev, [field]: value }));
    setError(null);
  }

  function validate(): string | null {
    if (!form.name.trim())     return "Nome é obrigatório.";
    if (!form.category)        return "Categoria é obrigatória.";
    const price    = priceCents / 100;
    const quantity = parseInt(quantityStr);
    if (priceCents <= 0)                                              return "Preço deve ser maior que zero.";
    if (quantityStr !== "" && (isNaN(quantity) || quantity < 0))      return "Quantidade não pode ser negativa.";
    // Sync parsed values into form before confirming
    setForm((prev) => ({ ...prev, price, quantity: isNaN(quantity) ? 0 : quantity }));
    return null;
  }

  function handleSubmit() {
    const err = validate();
    if (err) { setError(err); return; }
    // Require confirmation before saving
    setConfirm(true);
  }

  async function handleConfirm() {
    setSaving(true);
    try {
      // Ensure latest parsed values are in form before calling onConfirm
      const price    = priceCents / 100;
      const quantity = parseInt(quantityStr) || 0;
      await onConfirm({ ...form, price, quantity });
      onClose();
    } catch {
      setError("Erro ao salvar. Tente novamente.");
      setConfirm(false);
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 flex items-center justify-center"
        style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(2px)" }}
        onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      >
        {/* Modal */}
        <div
          className="relative w-full max-w-md rounded-2xl p-6 shadow-2xl"
          style={{ background: "var(--bg-surface)", border: "1px solid var(--border)" }}
        >
          {/* Header */}
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-base font-semibold" style={{ color: "var(--text-primary)" }}>
              {isEdit ? "Editar Produto" : "Adicionar Produto"}
            </h2>
            <button onClick={onClose} className="rounded-lg p-1.5 transition-colors hover:bg-[var(--bg-overlay)]">
              <X size={16} style={{ color: "var(--text-muted)" }} />
            </button>
          </div>

          {/* Form */}
          <div className="flex flex-col gap-4">
            {/* ID (read-only in edit) */}
            {isEdit && (
              <div>
                <label style={labelStyle}>ID</label>
                <input
                  readOnly
                  value={product!.id}
                  style={{ ...inputStyle, opacity: 0.5, cursor: "not-allowed", fontSize: "0.75rem" }}
                />
              </div>
            )}

            {/* Name */}
            <div>
              <label style={labelStyle}>Nome *</label>
              <input
                ref={nameRef}
                type="text"
                value={form.name}
                onChange={(e) => set("name", e.target.value)}
                placeholder="Ex: Notebook Gamer"
                style={inputStyle}
              />
            </div>

            {/* Category */}
            <div>
              <label style={labelStyle}>Categoria *</label>
              <select
                value={form.category}
                onChange={(e) => set("category", e.target.value)}
                style={inputStyle}
              >
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            {/* Price + Quantity side by side */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label style={labelStyle}>Preço Unitário (R$) *</label>
                <input
                  type="text"
                  inputMode="numeric"
                  value={formatCents(priceCents)}
                  placeholder="0,00"
                  onChange={(e) => {
                    // Keep only digits, then treat as right-to-left cents entry
                    const digits = e.target.value.replace(/[^0-9]/g, "");
                    const cents  = parseInt(digits || "0", 10);
                    setPriceCents(cents);
                    setForm((prev) => ({ ...prev, price: cents / 100 }));
                    setError(null);
                  }}
                  style={inputStyle}
                />
              </div>
              <div>
                <label style={labelStyle}>Quantidade em Estoque</label>
                <input
                  type="text"
                  inputMode="numeric"
                  value={quantityStr}
                  placeholder="0"
                  onChange={(e) => {
                    // Allow only digits
                    const raw = e.target.value.replace(/[^0-9]/g, "");
                    setQuantityStr(raw);
                    setForm((prev) => ({ ...prev, quantity: parseInt(raw) || 0 }));
                    setError(null);
                  }}
                  style={inputStyle}
                />
              </div>
            </div>

            {/* Error */}
            {error && (
              <p className="rounded-lg px-3 py-2 text-xs" style={{ background: "#ef444420", color: "#ef4444", border: "1px solid #ef444440" }}>
                {error}
              </p>
            )}

            {/* Actions */}
            <div className="mt-1 flex justify-end gap-2">
              <button
                onClick={onClose}
                className="rounded-lg px-4 py-2 text-sm font-medium transition-colors"
                style={{ background: "var(--bg-surface-2)", color: "var(--text-secondary)", border: "1px solid var(--border)" }}
              >
                Cancelar
              </button>
              <button
                onClick={handleSubmit}
                className="rounded-lg px-4 py-2 text-sm font-semibold transition-colors"
                style={{ background: "#00b4d8", color: "#fff" }}
              >
                {isEdit ? "Salvar alterações" : "Adicionar"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation overlay */}
      {confirm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(2px)" }}
        >
          <div
            className="w-full max-w-sm rounded-2xl p-6 shadow-2xl"
            style={{ background: "var(--bg-surface)", border: "1px solid var(--border)" }}
          >
            <h3 className="mb-2 text-base font-semibold" style={{ color: "var(--text-primary)" }}>
              Confirmar {isEdit ? "edição" : "cadastro"}
            </h3>
            <p className="mb-5 text-sm" style={{ color: "var(--text-secondary)" }}>
              {isEdit
                ? `Deseja salvar as alterações em "${form.name}"?`
                : `Deseja adicionar "${form.name}" ao catálogo?`}
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setConfirm(false)}
                disabled={saving}
                className="rounded-lg px-4 py-2 text-sm font-medium"
                style={{ background: "var(--bg-surface-2)", color: "var(--text-secondary)", border: "1px solid var(--border)" }}
              >
                Voltar
              </button>
              <button
                onClick={handleConfirm}
                disabled={saving}
                className="rounded-lg px-4 py-2 text-sm font-semibold"
                style={{ background: "#00b4d8", color: "#fff", opacity: saving ? 0.7 : 1 }}
              >
                {saving ? "Salvando..." : "Confirmar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
