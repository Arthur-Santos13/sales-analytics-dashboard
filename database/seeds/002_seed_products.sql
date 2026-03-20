-- Seed: 002 — products (16 sample products across 4 categories)

INSERT INTO
    products (id, name, category, price)
VALUES (
        '22222222-0000-0000-0000-000000000001',
        'Notebook Pro 15',
        'Electronics',
        4999.90
    ),
    (
        '22222222-0000-0000-0000-000000000002',
        'Mechanical Keyboard',
        'Electronics',
        349.90
    ),
    (
        '22222222-0000-0000-0000-000000000003',
        'Wireless Mouse',
        'Electronics',
        129.90
    ),
    (
        '22222222-0000-0000-0000-000000000004',
        '4K Monitor 27"',
        'Electronics',
        2199.00
    ),
    (
        '22222222-0000-0000-0000-000000000005',
        'Office Chair Ergonomic',
        'Furniture',
        1299.00
    ),
    (
        '22222222-0000-0000-0000-000000000006',
        'Standing Desk',
        'Furniture',
        2499.00
    ),
    (
        '22222222-0000-0000-0000-000000000007',
        'Bookshelf Oak',
        'Furniture',
        799.00
    ),
    (
        '22222222-0000-0000-0000-000000000008',
        'Desk Lamp LED',
        'Furniture',
        189.90
    ),
    (
        '22222222-0000-0000-0000-000000000009',
        'Clean Code (book)',
        'Books',
        89.90
    ),
    (
        '22222222-0000-0000-0000-000000000010',
        'The Pragmatic Programmer',
        'Books',
        79.90
    ),
    (
        '22222222-0000-0000-0000-000000000011',
        'Designing Data-Intensive Apps',
        'Books',
        99.90
    ),
    (
        '22222222-0000-0000-0000-000000000012',
        'System Design Interview',
        'Books',
        69.90
    ),
    (
        '22222222-0000-0000-0000-000000000013',
        'Whey Protein 1kg',
        'Health',
        149.90
    ),
    (
        '22222222-0000-0000-0000-000000000014',
        'Creatine 300g',
        'Health',
        79.90
    ),
    (
        '22222222-0000-0000-0000-000000000015',
        'Yoga Mat',
        'Health',
        99.90
    ),
    (
        '22222222-0000-0000-0000-000000000016',
        'Resistance Bands Set',
        'Health',
        59.90
    ) ON CONFLICT DO NOTHING;