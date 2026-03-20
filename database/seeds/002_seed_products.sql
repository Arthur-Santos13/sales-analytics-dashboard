-- Seed: 002 — products (16 sample products across 4 categories)

INSERT INTO
    products (id, name, category, price)
VALUES (
        '22222222-0000-0000-0000-000000000001',
        'Notebook Pro 15',
        'Eletrônicos',
        4999.90
    ),
    (
        '22222222-0000-0000-0000-000000000002',
        'Teclado Mecânico',
        'Eletrônicos',
        349.90
    ),
    (
        '22222222-0000-0000-0000-000000000003',
        'Mouse Sem Fio',
        'Eletrônicos',
        129.90
    ),
    (
        '22222222-0000-0000-0000-000000000004',
        'Monitor 4K 27"',
        'Eletrônicos',
        2199.00
    ),
    (
        '22222222-0000-0000-0000-000000000005',
        'Cadeira Ergonômica',
        'Móveis',
        1299.00
    ),
    (
        '22222222-0000-0000-0000-000000000006',
        'Mesa Standing Desk',
        'Móveis',
        2499.00
    ),
    (
        '22222222-0000-0000-0000-000000000007',
        'Estante de Carvalho',
        'Móveis',
        799.00
    ),
    (
        '22222222-0000-0000-0000-000000000008',
        'Luminária LED de Mesa',
        'Móveis',
        189.90
    ),
    (
        '22222222-0000-0000-0000-000000000009',
        'Código Limpo',
        'Livros',
        89.90
    ),
    (
        '22222222-0000-0000-0000-000000000010',
        'O Programador Pragmático',
        'Livros',
        79.90
    ),
    (
        '22222222-0000-0000-0000-000000000011',
        'Aplicações Intensivas em Dados',
        'Livros',
        99.90
    ),
    (
        '22222222-0000-0000-0000-000000000012',
        'System Design Interview',
        'Livros',
        69.90
    ),
    (
        '22222222-0000-0000-0000-000000000013',
        'Whey Protein 1kg',
        'Saúde',
        149.90
    ),
    (
        '22222222-0000-0000-0000-000000000014',
        'Creatina 300g',
        'Saúde',
        79.90
    ),
    (
        '22222222-0000-0000-0000-000000000015',
        'Tapete de Yoga',
        'Saúde',
        99.90
    ),
    (
        '22222222-0000-0000-0000-000000000016',
        'Kit Elásticos de Resistência',
        'Saúde',
        59.90
    ) ON CONFLICT DO NOTHING;