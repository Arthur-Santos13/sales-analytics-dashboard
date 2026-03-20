import { query } from "../config/database";

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

export async function getSummary(): Promise<SalesSummary> {
  const result = await query<SalesSummary>(`
    SELECT
      COALESCE(SUM(total_amount), 0)::numeric                 AS total_revenue,
      COUNT(*)::int                                            AS total_orders,
      COALESCE(AVG(total_amount), 0)::numeric                 AS average_ticket
    FROM orders
  `);
  return result.rows[0];
}

export async function getMonthlySales(year: number): Promise<MonthlySale[]> {
  const result = await query<MonthlySale>(
    `
    SELECT
      TO_CHAR(created_at, 'Mon') AS month,
      SUM(total_amount)::numeric AS revenue,
      COUNT(*)::int              AS orders
    FROM orders
    WHERE EXTRACT(YEAR FROM created_at) = $1
    GROUP BY EXTRACT(MONTH FROM created_at), TO_CHAR(created_at, 'Mon')
    ORDER BY EXTRACT(MONTH FROM created_at)
    `,
    [year]
  );
  return result.rows;
}

export async function getSalesByCategory(): Promise<CategorySale[]> {
  const result = await query<CategorySale>(`
    SELECT
      p.category,
      SUM(oi.quantity * oi.unit_price)::numeric                                  AS revenue,
      ROUND(
        SUM(oi.quantity * oi.unit_price) * 100.0 / SUM(SUM(oi.quantity * oi.unit_price)) OVER (),
        2
      )::numeric                                                                  AS percentage
    FROM order_items oi
    JOIN products p ON p.id = oi.product_id
    GROUP BY p.category
    ORDER BY revenue DESC
  `);
  return result.rows;
}

export async function getTopProducts(limit = 5): Promise<TopProduct[]> {
  const result = await query<TopProduct>(
    `
    SELECT
      p.name,
      p.category,
      SUM(oi.quantity)::int              AS units_sold,
      SUM(oi.quantity * oi.unit_price)::numeric AS revenue
    FROM order_items oi
    JOIN products p ON p.id = oi.product_id
    GROUP BY p.id, p.name, p.category
    ORDER BY revenue DESC
    LIMIT $1
    `,
    [limit]
  );
  return result.rows;
}
