-- Migration: 003 — orders
-- Stores each sale / purchase order.

CREATE TYPE order_status AS ENUM ('pending', 'confirmed', 'shipped', 'delivered', 'cancelled');

CREATE TABLE IF NOT EXISTS orders (
  id           UUID           PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id  UUID           NOT NULL REFERENCES customers (id) ON DELETE RESTRICT,
  status       order_status   NOT NULL DEFAULT 'pending',
  total_amount NUMERIC(12, 2) NOT NULL CHECK (total_amount >= 0),
  created_at   TIMESTAMPTZ    NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ    NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_orders_customer_id ON orders (customer_id);
CREATE INDEX IF NOT EXISTS idx_orders_created_at  ON orders (created_at);
CREATE INDEX IF NOT EXISTS idx_orders_status       ON orders (status);
