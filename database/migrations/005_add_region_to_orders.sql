-- Migration: 005 — add region column to orders
ALTER TABLE orders
ADD COLUMN IF NOT EXISTS region VARCHAR(50) NOT NULL DEFAULT 'Sudeste';

-- Assign specific regions to the existing seeded orders
UPDATE orders
SET
    region = 'Sudeste'
WHERE
    id = '33333333-0000-0000-0000-000000000001';

UPDATE orders
SET
    region = 'Sul'
WHERE
    id = '33333333-0000-0000-0000-000000000002';

UPDATE orders
SET
    region = 'Nordeste'
WHERE
    id = '33333333-0000-0000-0000-000000000003';

UPDATE orders
SET
    region = 'Norte'
WHERE
    id = '33333333-0000-0000-0000-000000000004';

UPDATE orders
SET
    region = 'Centro-Oeste'
WHERE
    id = '33333333-0000-0000-0000-000000000005';

UPDATE orders
SET
    region = 'Sudeste'
WHERE
    id = '33333333-0000-0000-0000-000000000006';

UPDATE orders
SET
    region = 'Sul'
WHERE
    id = '33333333-0000-0000-0000-000000000007';

UPDATE orders
SET
    region = 'Nordeste'
WHERE
    id = '33333333-0000-0000-0000-000000000008';