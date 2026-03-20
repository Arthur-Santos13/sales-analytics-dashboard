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
