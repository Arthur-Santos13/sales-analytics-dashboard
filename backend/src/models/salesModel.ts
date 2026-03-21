import { query } from "../config/database";

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

export async function getOrdersList(): Promise<OrderListItem[]> {
  const result = await query<OrderListItem>(`
    SELECT
      o.id,
      o.created_at,
      c.name  AS customer_name,
      c.email AS customer_email,
      o.region,
      o.status,
      o.total_amount,
      COUNT(oi.id)::int AS items_count
    FROM orders o
    JOIN customers c ON c.id = o.customer_id
    LEFT JOIN order_items oi ON oi.order_id = o.id
    GROUP BY o.id, c.name, c.email, o.region, o.status, o.total_amount, o.created_at
    ORDER BY o.created_at DESC
  `);
  return result.rows;
}

export async function getOrderById(id: string): Promise<OrderDetail | null> {
  const orderResult = await query<OrderListItem>(
    `SELECT
       o.id,
       o.created_at,
       c.name  AS customer_name,
       c.email AS customer_email,
       o.region,
       o.status,
       o.total_amount,
       COUNT(oi.id)::int AS items_count
     FROM orders o
     JOIN customers c ON c.id = o.customer_id
     LEFT JOIN order_items oi ON oi.order_id = o.id
     WHERE o.id = $1
     GROUP BY o.id, c.name, c.email, o.region, o.status, o.total_amount, o.created_at`,
    [id]
  );
  if (!orderResult.rows[0]) return null;

  const itemsResult = await query<OrderItemDetail>(
    `SELECT
       p.name    AS product_name,
       p.category,
       oi.quantity,
       oi.unit_price,
       (oi.quantity * oi.unit_price)::numeric AS subtotal
     FROM order_items oi
     JOIN products p ON p.id = oi.product_id
     WHERE oi.order_id = $1
     ORDER BY p.name`,
    [id]
  );

  return { ...orderResult.rows[0], items: itemsResult.rows };
}

export async function updateOrderStatus(
  id: string,
  status: OrderStatus
): Promise<OrderListItem | null> {
  const result = await query<OrderListItem>(
    `UPDATE orders
     SET status = $1, updated_at = NOW()
     WHERE id = $2
     RETURNING id, status`,
    [status, id]
  );
  return result.rows[0] ?? null;
}

export async function getOrdersStats(): Promise<OrdersStats> {
  const result = await query<OrdersStats>(`
    SELECT
      COUNT(*)::int                                          AS total,
      COUNT(*) FILTER (WHERE status = 'pending')::int       AS pending,
      COUNT(*) FILTER (WHERE status = 'confirmed')::int     AS confirmed,
      COUNT(*) FILTER (WHERE status = 'shipped')::int       AS shipped,
      COUNT(*) FILTER (WHERE status = 'delivered')::int     AS delivered,
      COUNT(*) FILTER (WHERE status = 'cancelled')::int     AS cancelled,
      COALESCE(SUM(total_amount), 0)::numeric               AS total_revenue
    FROM orders
  `);
  return result.rows[0];
}

// ─── Sales summary (existing) ─────────────────────────────────────────────────

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

export async function getSummary(year?: number): Promise<SalesSummary> {
  if (year) {
    const result = await query<SalesSummary>(
      `SELECT
        COALESCE(SUM(total_amount), 0)::numeric AS total_revenue,
        COUNT(*)::int                            AS total_orders,
        COALESCE(AVG(total_amount), 0)::numeric  AS average_ticket
       FROM orders
       WHERE EXTRACT(YEAR FROM created_at) = $1`,
      [year]
    );
    return result.rows[0];
  }
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
