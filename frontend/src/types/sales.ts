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
