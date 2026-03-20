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

export async function getSalesByRegion(): Promise<RegionSale[]> {
  const result = await query<RegionSale>(`
    SELECT
      region,
      COUNT(*)::int              AS orders,
      SUM(total_amount)::numeric AS revenue
    FROM orders
    GROUP BY region
    ORDER BY revenue DESC
  `);
  return result.rows;
}

export async function getProductsList(): Promise<ProductItem[]> {
  const result = await query<ProductItem>(`
    SELECT
      p.id,
      p.name,
      p.category,
      p.price,
      p.quantity,
      COALESCE(SUM(oi.quantity)::int, 0)              AS units_sold,
      COALESCE(SUM(oi.quantity * oi.unit_price), 0)::numeric AS revenue
    FROM products p
    LEFT JOIN order_items oi ON oi.product_id = p.id
    GROUP BY p.id, p.name, p.category, p.price, p.quantity
    ORDER BY revenue DESC
  `);
  return result.rows;
}

export async function createProduct(input: ProductInput): Promise<ProductItem> {
  const result = await query<ProductItem>(
    `INSERT INTO products (name, category, price, quantity)
     VALUES ($1, $2, $3, $4)
     RETURNING id, name, category, price, quantity, 0 AS units_sold, 0 AS revenue`,
    [input.name, input.category, input.price, input.quantity]
  );
  return result.rows[0];
}

export async function updateProduct(id: string, input: ProductInput): Promise<ProductItem | null> {
  const result = await query<ProductItem>(
    `UPDATE products
     SET name = $1, category = $2, price = $3, quantity = $4, updated_at = NOW()
     WHERE id = $5
     RETURNING id, name, category, price, quantity`,
    [input.name, input.category, input.price, input.quantity, id]
  );
  return result.rows[0] ?? null;
}

export async function deleteProduct(id: string): Promise<boolean> {
  const result = await query(`DELETE FROM products WHERE id = $1`, [id]);
  return (result.rowCount ?? 0) > 0;
}
