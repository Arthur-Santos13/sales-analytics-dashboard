export interface SalesSummary {
  total_revenue: number;
  total_orders: number;
  average_ticket: number;
}

export interface MonthlySale {
  month: string;
  revenue: number;
  orders: number;
}

export interface CategorySale {
  category: string;
  revenue: number;
  percentage: number;
}

export interface TopProduct {
  name: string;
  category: string;
  units_sold: number;
  revenue: number;
}

export interface RegionSale {
  region: string;
  orders: number;
  revenue: number;
}

export interface ProductItem {
  id: string;
  name: string;
  category: string;
  price: number;
  quantity: number;
  units_sold: number;
  revenue: number;
}

export interface ProductInput {
  name: string;
  category: string;
  price: number;
  quantity: number;
}

// ─── Orders ───────────────────────────────────────────────────────────────────

export type OrderStatus = "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";

export interface OrderListItem {
  id: string;
  created_at: string;
  customer_name: string;
  customer_email: string;
  region: string;
  status: OrderStatus;
  total_amount: number;
  items_count: number;
}

export interface OrderItemDetail {
  product_name: string;
  category: string;
  quantity: number;
  unit_price: number;
  subtotal: number;
}

export interface OrderDetail extends OrderListItem {
  items: OrderItemDetail[];
}

export interface OrdersStats {
  total: number;
  pending: number;
  confirmed: number;
  shipped: number;
  delivered: number;
  cancelled: number;
  total_revenue: number;
}

// ─── Customers ──────────────────────────────────────────────────────────────

export interface CustomerListItem {
  id: string;
  name: string;
  email: string;
  created_at: string;
  total_orders: number;
  total_spent: number;
  last_order_at: string | null;
}

export interface CustomersStats {
  total: number;
  new_this_month: number;
  avg_orders_per_customer: number;
  avg_spent_per_customer: number;
}
