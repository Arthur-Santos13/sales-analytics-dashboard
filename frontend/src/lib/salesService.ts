import { api } from "./api";
import type { SalesSummary, MonthlySale, CategorySale } from "@/types/sales";

export async function getSalesSummary(): Promise<SalesSummary> {
  const { data } = await api.get<{ status: string; data: SalesSummary }>(
    "/sales/summary"
  );
  return data.data;
}

export async function getMonthlySales(year?: number): Promise<MonthlySale[]> {
  const params = year ? { year } : {};
  const { data } = await api.get<{ status: string; data: MonthlySale[] }>(
    "/sales/monthly",
    { params }
  );
  return data.data;
}

export async function getSalesByCategory(): Promise<CategorySale[]> {
  const { data } = await api.get<{ status: string; data: CategorySale[] }>(
    "/sales/by-category"
  );
  return data.data;
}
