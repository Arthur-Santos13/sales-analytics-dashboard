-- Migration: 004 — order_items
-- Line items that belong to an order (products + qty + price at time of sale).

CREATE TABLE IF NOT EXISTS order_items (
  id         UUID           PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id   UUID           NOT NULL REFERENCES orders   (id) ON DELETE CASCADE,
  product_id UUID           NOT NULL REFERENCES products (id) ON DELETE RESTRICT,
  quantity   INT            NOT NULL CHECK (quantity > 0),
  unit_price NUMERIC(10, 2) NOT NULL CHECK (unit_price >= 0),
  created_at TIMESTAMPTZ    NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_order_items_order_id   ON order_items (order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_product_id ON order_items (product_id);
