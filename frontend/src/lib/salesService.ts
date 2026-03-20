import { api } from "./api";
import type { SalesSummary, MonthlySale, CategorySale, TopProduct, RegionSale, ProductItem, ProductInput } from "@/types/sales";

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

export async function getTopProducts(limit = 5): Promise<TopProduct[]> {
  const { data } = await api.get<{ status: string; data: TopProduct[] }>(
    "/sales/top-products",
    { params: { limit } }
  );
  return data.data;
}

export async function getSalesByRegion(): Promise<RegionSale[]> {
  const { data } = await api.get<{ status: string; data: RegionSale[] }>(
    "/sales/by-region"
  );
  return data.data;
}

export async function getProductsList(): Promise<ProductItem[]> {
  const { data } = await api.get<{ status: string; data: ProductItem[] }>(
    "/sales/products"
  );
  return data.data;
}

export async function createProduct(input: ProductInput): Promise<ProductItem> {
  const { data } = await api.post<{ status: string; data: ProductItem }>(
    "/sales/products",
    input
  );
  return data.data;
}

export async function updateProduct(id: string, input: ProductInput): Promise<ProductItem> {
  const { data } = await api.put<{ status: string; data: ProductItem }>(
    `/sales/products/${id}`,
    input
  );
  return data.data;
}

export async function deleteProduct(id: string): Promise<void> {
  await api.delete(`/sales/products/${id}`);
}
