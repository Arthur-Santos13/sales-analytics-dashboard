"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { DollarSign, ShoppingCart, TrendingUp, Package } from "lucide-react";

import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { KpiCard } from "@/components/ui/KpiCard";
import { ChartCard } from "@/components/ui/ChartCard";
import { FilterBar, type DashboardFilters } from "@/components/dashboard/FilterBar";
import { MonthlySalesChart } from "@/components/charts/MonthlySalesChart";
import { TopProductsChart } from "@/components/charts/TopProductsChart";
import { SalesByCategoryChart } from "@/components/charts/SalesByCategoryChart";

import {
  getSalesSummary,
  getMonthlySales,
  getSalesByCategory,
  getTopProducts,
} from "@/lib/salesService";
import { formatCurrency, formatNumber } from "@/lib/format";
import type {
  SalesSummary,
  MonthlySale,
  CategorySale,
  TopProduct,
} from "@/types/sales";

export default function DashboardPage() {
  const currentYear = new Date().getFullYear();

  const [filters, setFilters] = useState<DashboardFilters>({
    year: currentYear,
    category: "",
  });

  const [summary, setSummary] = useState<SalesSummary | null>(null);
  const [monthly, setMonthly] = useState<MonthlySale[]>([]);
  const [categories, setCategories] = useState<CategorySale[]>([]);
  const [topProducts, setTopProducts] = useState<TopProduct[]>([]);

  const [loadingSummary, setLoadingSummary] = useState(true);
  const [loadingMonthly, setLoadingMonthly] = useState(true);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [loadingProducts, setLoadingProducts] = useState(true);

  // Fetch summary (static — no year filter needed for demo)
  useEffect(() => {
    setLoadingSummary(true);
    getSalesSummary()
      .then(setSummary)
      .catch(console.error)
      .finally(() => setLoadingSummary(false));
  }, []);

  // Fetch monthly sales when year changes
  useEffect(() => {
    setLoadingMonthly(true);
    getMonthlySales(filters.year)
      .then(setMonthly)
      .catch(console.error)
      .finally(() => setLoadingMonthly(false));
  }, [filters.year]);

  // Fetch category breakdown
  useEffect(() => {
    setLoadingCategories(true);
    getSalesByCategory()
      .then(setCategories)
      .catch(console.error)
      .finally(() => setLoadingCategories(false));
  }, []);

  // Fetch top products
  useEffect(() => {
    setLoadingProducts(true);
    getTopProducts(8)
      .then(setTopProducts)
      .catch(console.error)
      .finally(() => setLoadingProducts(false));
  }, []);

  // Derive category names for FilterBar
  const categoryNames = useMemo(
    () => categories.map((c) => c.category),
    [categories]
  );

  // Filter products by selected category
  const filteredProducts = useMemo(() => {
    if (!filters.category) return topProducts;
    return topProducts.filter((p) => p.category === filters.category);
  }, [topProducts, filters.category]);

  // Filter category chart data
  const filteredCategories = useMemo(() => {
    if (!filters.category) return categories;
    return categories.filter((c) => c.category === filters.category);
  }, [categories, filters.category]);

  const handleFilterChange = useCallback((f: DashboardFilters) => {
    setFilters(f);
  }, []);

  return (
    <DashboardLayout
      title="Dashboard de Vendas"
      subtitle="Visão geral das vendas e indicadores"
    >
      {/* ── Filters ───────────────────────────────────────────── */}
      <FilterBar
        filters={filters}
        categories={categoryNames}
        onFilterChange={handleFilterChange}
      />

      {/* ── KPI Cards ─────────────────────────────────────────── */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <KpiCard
          title="Receita Total"
          value={summary ? formatCurrency(summary.total_revenue) : "—"}
          sub="acumulado no período"
          icon={DollarSign}
          trend="up"
          trendLabel="+12% vs mês anterior"
          loading={loadingSummary}
        />
        <KpiCard
          title="Total de Pedidos"
          value={summary ? formatNumber(summary.total_orders) : "—"}
          sub="pedidos realizados"
          icon={ShoppingCart}
          trend="up"
          trendLabel="+8% vs mês anterior"
          loading={loadingSummary}
        />
        <KpiCard
          title="Ticket Médio"
          value={summary ? formatCurrency(summary.average_ticket) : "—"}
          sub="por pedido"
          icon={TrendingUp}
          trend={
            summary && summary.average_ticket > 500
              ? "up"
              : summary
              ? "down"
              : "neutral"
          }
          trendLabel="comparado à meta"
          loading={loadingSummary}
        />
      </div>

      {/* ── Charts row 1 ─────────────────────────────────────── */}
      <div className="mt-6 grid gap-6 xl:grid-cols-3">
        {/* Monthly sales — takes 2/3 */}
        <div className="xl:col-span-2">
          <ChartCard
            title="Vendas Mensais"
            subtitle={`Receita e pedidos — ${filters.year}`}
          >
            <MonthlySalesChart data={monthly} loading={loadingMonthly} />
          </ChartCard>
        </div>

        {/* Category donut — takes 1/3 */}
        <div className="xl:col-span-1">
          <ChartCard
            title="Vendas por Categoria"
            subtitle="Distribuição de receita"
          >
            <SalesByCategoryChart
              data={filteredCategories}
              loading={loadingCategories}
            />
          </ChartCard>
        </div>
      </div>

      {/* ── Charts row 2: Top Products ────────────────────────── */}
      <div className="mt-6">
        <ChartCard
          title="Top Produtos"
          subtitle={
            filters.category
              ? `Categoria: ${filters.category}`
              : "Maiores receitas por produto"
          }
          action={
            <span
              className="flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium"
              style={{ background: "var(--bg-overlay)", color: "var(--text-secondary)" }}
            >
              <Package size={11} />
              {filteredProducts.length} produto
              {filteredProducts.length !== 1 ? "s" : ""}
            </span>
          }
        >
          <TopProductsChart
            data={filteredProducts}
            loading={loadingProducts}
          />
        </ChartCard>
      </div>
    </DashboardLayout>
  );
}
