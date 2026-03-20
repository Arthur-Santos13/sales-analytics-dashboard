-- Seed: 001 — customers (20 sample customers)
-- Run with: npx ts-node src/database/migrate.ts --seed

INSERT INTO customers (id, name, email) VALUES
  ('11111111-0000-0000-0000-000000000001', 'Ana Souza',       'ana.souza@example.com'),
  ('11111111-0000-0000-0000-000000000002', 'Bruno Lima',      'bruno.lima@example.com'),
  ('11111111-0000-0000-0000-000000000003', 'Carla Mendes',    'carla.mendes@example.com'),
  ('11111111-0000-0000-0000-000000000004', 'Diego Ferreira',  'diego.ferreira@example.com'),
  ('11111111-0000-0000-0000-000000000005', 'Elena Costa',     'elena.costa@example.com'),
  ('11111111-0000-0000-0000-000000000006', 'Felipe Oliveira', 'felipe.oliveira@example.com'),
  ('11111111-0000-0000-0000-000000000007', 'Gabriela Rocha',  'gabriela.rocha@example.com'),
  ('11111111-0000-0000-0000-000000000008', 'Hugo Nunes',      'hugo.nunes@example.com'),
  ('11111111-0000-0000-0000-000000000009', 'Isabella Pinto',  'isabella.pinto@example.com'),
  ('11111111-0000-0000-0000-000000000010', 'João Alves',      'joao.alves@example.com')
ON CONFLICT (email) DO NOTHING;
