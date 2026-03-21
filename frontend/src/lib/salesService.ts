import { api } from "./api";
import type {
  SalesSummary, MonthlySale, CategorySale, TopProduct, RegionSale,
  ProductItem, ProductInput,
  OrderListItem, OrderDetail, OrdersStats, OrderStatus,
  CustomerListItem, CustomersStats,
} from "@/types/sales";

export async function getSalesSummary(year?: number): Promise<SalesSummary> {
  const params = year ? { year } : {};
  const { data } = await api.get<{ status: string; data: SalesSummary }>(
    "/sales/summary",
    { params }
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

// ─── Orders ───────────────────────────────────────────────────────────────────

export async function getOrdersStats(): Promise<OrdersStats> {
  const { data } = await api.get<{ status: string; data: OrdersStats }>("/orders/stats");
  return data.data;
}

export async function getOrdersList(): Promise<OrderListItem[]> {
  const { data } = await api.get<{ status: string; data: OrderListItem[] }>("/orders");
  return data.data;
}

export async function getOrderById(id: string): Promise<OrderDetail> {
  const { data } = await api.get<{ status: string; data: OrderDetail }>(`/orders/${id}`);
  return data.data;
}

export async function updateOrderStatus(id: string, status: OrderStatus): Promise<void> {
  await api.put(`/orders/${id}/status`, { status });
}

// ─── Customers ───────────────────────────────────────────────────────────────

export async function getCustomersStats(): Promise<CustomersStats> {
  const { data } = await api.get<{ status: string; data: CustomersStats }>("/customers/stats");
  return data.data;
}

export async function getCustomersList(): Promise<CustomerListItem[]> {
  const { data } = await api.get<{ status: string; data: CustomerListItem[] }>("/customers");
  return data.data;
}
