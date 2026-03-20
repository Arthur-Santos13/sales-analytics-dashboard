-- Migration: 006 — add quantity to products
-- Tracks stock count for each product.

ALTER TABLE products
ADD COLUMN IF NOT EXISTS quantity INTEGER NOT NULL DEFAULT 0 CHECK (quantity >= 0);