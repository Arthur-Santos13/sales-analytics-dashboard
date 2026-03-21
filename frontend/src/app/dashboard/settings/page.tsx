"use client";

import { useState } from "react";
import {
  User,
  Bell,
  Globe,
  Database,
  Shield,
  ChevronRight,
  Check,
} from "lucide-react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";

// ─── Types ─────────────────────────────────────────────────────────────────

type SectionId = "profile" | "notifications" | "preferences" | "data" | "security";

interface Section {
  id: SectionId;
  icon: React.ElementType;
  label: string;
}

const SECTIONS: Section[] = [
  { id: "profile",       icon: User,     label: "Perfil" },
  { id: "notifications", icon: Bell,     label: "Notificações" },
  { id: "preferences",   icon: Globe,    label: "Preferências" },
  { id: "data",          icon: Database, label: "Dados" },
  { id: "security",      icon: Shield,   label: "Segurança" },
];

// ─── Small reusable components ─────────────────────────────────────────────

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{ background: "var(--bg-surface)", border: "1px solid var(--border)" }}
    >
      <div
        className="px-6 py-3.5"
        style={{ borderBottom: "1px solid var(--border)", background: "var(--bg-surface-2)" }}
      >
        <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
          {title}
        </p>
      </div>
      <div className="divide-y" style={{ borderColor: "var(--border)" }}>
        {children}
      </div>
    </div>
  );
}

function SettingRow({
  label,
  description,
  children,
}: {
  label: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-4 px-6 py-4">
      <div>
        <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>{label}</p>
        {description && (
          <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>{description}</p>
        )}
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  );
}

function Toggle({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!value)}
      className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors"
      style={{ background: value ? "#00b4d8" : "var(--bg-overlay)" }}
    >
      <span
        className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform"
        style={{ transform: value ? "translateX(1.375rem)" : "translateX(0.25rem)" }}
      />
    </button>
  );
}

function Select({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      style={{
        background: "var(--bg-surface-2)",
        border: "1px solid var(--border)",
        color: "var(--text-primary)",
        borderRadius: "0.5rem",
        padding: "0.375rem 0.75rem",
        fontSize: "0.8rem",
        outline: "none",
        cursor: "pointer",
        minWidth: 140,
      }}
    >
      {options.map((o) => (
        <option key={o.value} value={o.value}>{o.label}</option>
      ))}
    </select>
  );
}

// ─── Page ──────────────────────────────────────────────────────────────────

export default function SettingsPage() {
  const [active, setActive] = useState<SectionId>("profile");
  const [saved, setSaved]   = useState(false);

  // Profile
  const [name,  setName]  = useState("Admin");
  const [email, setEmail] = useState("admin@salesanalytics.com");
  const [role,  setRole]  = useState("Administrador");

  // Notifications
  const [notifEmail,   setNotifEmail]   = useState(true);
  const [notifOrders,  setNotifOrders]  = useState(true);
  const [notifReports, setNotifReports] = useState(false);
  const [notifAlerts,  setNotifAlerts]  = useState(true);

  // Preferences
  const [language,  setLanguage]  = useState("pt-BR");
  const [currency,  setCurrency]  = useState("BRL");
  const [dateFormat, setDateFormat] = useState("dd/MM/yyyy");
  const [pageSize,  setPageSize]  = useState("20");

  // Data
  const [autoRefresh,   setAutoRefresh]   = useState(false);
  const [refreshInterval, setRefreshInterval] = useState("5");
  const [exportFormat,  setExportFormat]  = useState("csv");

  // Security
  const [twoFactor,  setTwoFactor]  = useState(false);
  const [sessionTimeout, setSessionTimeout] = useState("60");

  function handleSave() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  const inputStyle: React.CSSProperties = {
    background: "var(--bg-surface-2)",
    border: "1px solid var(--border)",
    color: "var(--text-primary)",
    borderRadius: "0.5rem",
    padding: "0.4rem 0.75rem",
    fontSize: "0.875rem",
    outline: "none",
    width: 220,
  };

  return (
    <DashboardLayout title="Configurações" subtitle="Preferências e configurações do sistema">
      <div className="flex gap-6">

        {/* ── Sidebar nav ── */}
        <aside
          className="hidden shrink-0 flex-col gap-1 rounded-xl p-2 md:flex"
          style={{
            width: 200,
            background: "var(--bg-surface)",
            border: "1px solid var(--border)",
            alignSelf: "start",
          }}
        >
          {SECTIONS.map(({ id, icon: Icon, label }) => (
            <button
              key={id}
              onClick={() => setActive(id)}
              className="flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium transition-colors"
              style={
                active === id
                  ? { background: "var(--bg-overlay)", color: "#00b4d8" }
                  : { color: "var(--text-secondary)" }
              }
            >
              <div className="flex items-center gap-2.5">
                <Icon size={15} />
                {label}
              </div>
              {active === id && <ChevronRight size={13} />}
            </button>
          ))}
        </aside>

        {/* ── Content ── */}
        <div className="flex flex-1 flex-col gap-4 min-w-0">

          {/* Profile */}
          {active === "profile" && (
            <>
              <SectionCard title="Informações do Perfil">
                <SettingRow label="Nome" description="Nome exibido no sistema">
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    style={inputStyle}
                  />
                </SettingRow>
                <SettingRow label="E-mail" description="Endereço de e-mail da conta">
                  <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={inputStyle}
                  />
                </SettingRow>
                <SettingRow label="Cargo / Função" description="Função no sistema">
                  <input
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    style={inputStyle}
                  />
                </SettingRow>
              </SectionCard>

              <SectionCard title="Avatar">
                <SettingRow label="Inicial do nome" description="Usada como avatar em todo o sistema">
                  <div
                    className="flex h-12 w-12 items-center justify-center rounded-full text-lg font-bold"
                    style={{ background: "#00b4d8", color: "#fff" }}
                  >
                    {name.charAt(0).toUpperCase()}
                  </div>
                </SettingRow>
              </SectionCard>
            </>
          )}

          {/* Notifications */}
          {active === "notifications" && (
            <SectionCard title="Canais e Eventos">
              <SettingRow label="Notificações por e-mail" description="Receber alertas por e-mail">
                <Toggle value={notifEmail} onChange={setNotifEmail} />
              </SettingRow>
              <SettingRow label="Novos pedidos" description="Alerta quando um pedido é criado">
                <Toggle value={notifOrders} onChange={setNotifOrders} />
              </SettingRow>
              <SettingRow label="Relatórios prontos" description="Aviso ao exportar relatório">
                <Toggle value={notifReports} onChange={setNotifReports} />
              </SettingRow>
              <SettingRow label="Alertas de estoque" description="Produtos com quantidade zero">
                <Toggle value={notifAlerts} onChange={setNotifAlerts} />
              </SettingRow>
            </SectionCard>
          )}

          {/* Preferences */}
          {active === "preferences" && (
            <SectionCard title="Exibição e Localização">
              <SettingRow label="Idioma" description="Idioma da interface">
                <Select
                  value={language}
                  onChange={setLanguage}
                  options={[
                    { value: "pt-BR", label: "Português (BR)" },
                    { value: "en-US", label: "English (US)" },
                    { value: "es-ES", label: "Español" },
                  ]}
                />
              </SettingRow>
              <SettingRow label="Moeda" description="Moeda usada nos valores">
                <Select
                  value={currency}
                  onChange={setCurrency}
                  options={[
                    { value: "BRL", label: "BRL — Real" },
                    { value: "USD", label: "USD — Dólar" },
                    { value: "EUR", label: "EUR — Euro" },
                  ]}
                />
              </SettingRow>
              <SettingRow label="Formato de data">
                <Select
                  value={dateFormat}
                  onChange={setDateFormat}
                  options={[
                    { value: "dd/MM/yyyy",   label: "DD/MM/AAAA" },
                    { value: "MM/dd/yyyy",   label: "MM/DD/AAAA" },
                    { value: "yyyy-MM-dd",   label: "AAAA-MM-DD" },
                  ]}
                />
              </SettingRow>
              <SettingRow label="Itens por página" description="Tabelas de pedidos e clientes">
                <Select
                  value={pageSize}
                  onChange={setPageSize}
                  options={[
                    { value: "10", label: "10 itens" },
                    { value: "20", label: "20 itens" },
                    { value: "50", label: "50 itens" },
                  ]}
                />
              </SettingRow>
            </SectionCard>
          )}

          {/* Data */}
          {active === "data" && (
            <>
              <SectionCard title="Atualização Automática">
                <SettingRow label="Auto-refresh" description="Atualizar dados automaticamente">
                  <Toggle value={autoRefresh} onChange={setAutoRefresh} />
                </SettingRow>
                <SettingRow label="Intervalo" description="Frequência de atualização (minutos)">
                  <Select
                    value={refreshInterval}
                    onChange={setRefreshInterval}
                    options={[
                      { value: "1",  label: "1 minuto" },
                      { value: "5",  label: "5 minutos" },
                      { value: "10", label: "10 minutos" },
                      { value: "30", label: "30 minutos" },
                    ]}
                  />
                </SettingRow>
              </SectionCard>
              <SectionCard title="Exportação">
                <SettingRow label="Formato padrão" description="Formato ao exportar dados">
                  <Select
                    value={exportFormat}
                    onChange={setExportFormat}
                    options={[
                      { value: "csv",  label: "CSV" },
                      { value: "xlsx", label: "Excel (XLSX)" },
                      { value: "pdf",  label: "PDF" },
                    ]}
                  />
                </SettingRow>
              </SectionCard>
            </>
          )}

          {/* Security */}
          {active === "security" && (
            <>
              <SectionCard title="Autenticação">
                <SettingRow
                  label="Verificação em duas etapas"
                  description="Adicionar camada extra de segurança"
                >
                  <Toggle value={twoFactor} onChange={setTwoFactor} />
                </SettingRow>
                <SettingRow
                  label="Timeout da sessão"
                  description="Encerrar sessão após inatividade"
                >
                  <Select
                    value={sessionTimeout}
                    onChange={setSessionTimeout}
                    options={[
                      { value: "15",  label: "15 minutos" },
                      { value: "30",  label: "30 minutos" },
                      { value: "60",  label: "1 hora" },
                      { value: "240", label: "4 horas" },
                    ]}
                  />
                </SettingRow>
              </SectionCard>
              <SectionCard title="Versão do Sistema">
                <SettingRow label="Sales Analytics Dashboard" description="Versão atual">
                  <span className="text-sm font-mono" style={{ color: "var(--text-muted)" }}>v1.0.0</span>
                </SettingRow>
                <SettingRow label="Backend API" description="Node.js + Express + PostgreSQL">
                  <span className="text-sm font-mono" style={{ color: "var(--text-muted)" }}>v1.0.0</span>
                </SettingRow>
              </SectionCard>
            </>
          )}

          {/* Save button */}
          <div className="flex justify-end">
            <button
              onClick={handleSave}
              className="flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold transition-all"
              style={{ background: saved ? "#22c55e" : "#00b4d8", color: "#fff", minWidth: 140 }}
            >
              {saved ? (
                <>
                  <Check size={15} />
                  Salvo!
                </>
              ) : (
                "Salvar alterações"
              )}
            </button>
          </div>

        </div>
      </div>
    </DashboardLayout>
  );
}

