# Sales Analytics Dashboard

Dashboard analítico full-stack para visualização de métricas de vendas, pedidos, clientes e produtos — desenvolvido como projeto de portfólio com Next.js, Node.js, PostgreSQL e Recharts.

---

## Demonstração

| Módulo            | Descrição                                                 |
| ----------------- | --------------------------------------------------------- |
| **Dashboard**     | Visão geral com KPIs consolidados e gráficos de tendência |
| **Vendas**        | Análise mensal por ano, categoria e região                |
| **Pedidos**       | Listagem com filtros, busca e gerenciamento de status     |
| **Clientes**      | Base de clientes com ticket médio e histórico             |
| **Produtos**      | Catálogo com CRUD completo                                |
| **Configurações** | Preferências de perfil, notificações e sistema            |

---

## Tech Stack

| Camada         | Tecnologia                           |
| -------------- | ------------------------------------ |
| Frontend       | Next.js 15 (App Router) + TypeScript |
| Estilização    | Tailwind CSS v4                      |
| Gráficos       | Recharts                             |
| Backend        | Node.js + Express + TypeScript       |
| Banco de dados | PostgreSQL 17                        |
| Container      | Docker / Docker Compose              |

---

## Estrutura do Projeto

```
sales-analytics-dashboard/
├── frontend/
│   └── src/
│       ├── app/
│       │   └── dashboard/
│       │       ├── page.tsx          # Visão geral (KPIs + gráficos)
│       │       ├── sales/            # Módulo de Vendas
│       │       ├── orders/           # Módulo de Pedidos
│       │       ├── customers/        # Módulo de Clientes
│       │       ├── products/         # Módulo de Produtos (CRUD)
│       │       ├── reports/          # Relatórios (em breve)
│       │       └── settings/         # Configurações do sistema
│       ├── components/
│       │   ├── charts/               # MonthlySales, ByCategory, ByRegion, TopProducts
│       │   ├── dashboard/            # DashboardLayout, Sidebar, Header, FilterBar
│       │   ├── orders/               # OrderDetailModal
│       │   ├── products/             # ProductModal
│       │   └── ui/                   # KpiCard, ChartCard, ComingSoon
│       ├── lib/
│       │   └── salesService.ts       # Funções de chamada à API
│       └── types/
│           └── sales.ts              # Interfaces TypeScript de todos os módulos
│
├── backend/
│   └── src/
│       ├── controllers/              # salesController, ordersController, customersController
│       ├── routes/                   # salesRoutes, ordersRoutes, customersRoutes
│       ├── models/                   # salesModel, ordersModel, customersModel
│       ├── middleware/               # Tratamento de erros, validação
│       ├── config/                   # Configuração do banco de dados
│       └── utils/                    # Logger
│
├── database/
│   ├── migrations/                   # Scripts SQL de criação das tabelas
│   └── seeds/                        # Dados de exemplo para desenvolvimento
│
├── docker-compose.yml
└── package.json                      # Workspace npm (frontend + backend)
```

---

## Módulos

### Dashboard (Visão Geral)

Página inicial com KPIs consolidados: receita total, total de pedidos, ticket médio e número de clientes. Inclui gráfico de linha com tendência mensal e cards de acesso rápido a cada módulo.

### Vendas

Análise completa de vendas com seletor de ano (2024 / 2025 / 2026). Exibe:

- 3 KPIs: receita total, número de vendas, ticket médio
- Gráfico composto (barras + linha) com evolução mensal
- Gráfico de rosca com distribuição por categoria
- Barras horizontais com desempenho por região
- Tabela dos top-10 produtos mais vendidos

### Pedidos

Gerenciamento de pedidos com:

- 6 KPIs de status: total, pendentes, confirmados, enviados, entregues, cancelados
- Barra de busca + filtro por status
- Tabela paginada (20 itens/página) com ID, data, cliente, região, total e status
- Modal de detalhe com itens do pedido, subtotais e alteração de status

### Clientes

Base de clientes com:

- 4 KPIs: total de clientes, novos no mês, média de pedidos por cliente, ticket médio
- Busca por nome/e-mail e ordenação por coluna
- Tabela paginada com avatar, contato, localização e histórico de compras

### Produtos (CRUD)

Catálogo de produtos com operações completas:

- Listagem com busca em tempo real por nome ou categoria
- Modal de criação e edição com campos de nome, categoria, preço e estoque
- Exclusão com confirmação
- Formatação de moeda no campo de preço (máscara automática)

### Configurações

Painel de configurações do sistema com navegação lateral em 5 seções:

- **Perfil** — Nome, e-mail e cargo editáveis; avatar com inicial do nome
- **Notificações** — Toggles para e-mail, novos pedidos, relatórios e alertas de estoque
- **Preferências** — Idioma, moeda, formato de data e itens por página
- **Dados** — Auto-refresh com intervalo configurável e formato de exportação
- **Segurança** — Verificação em duas etapas, timeout de sessão e versão do sistema

---

## Como Executar

### Pré-requisitos

- Node.js >= 20
- Docker & Docker Compose (recomendado)
- PostgreSQL 17 (caso rode sem Docker)

### 1. Clone o repositório

```bash
git clone https://github.com/<your-username>/sales-analytics-dashboard.git
cd sales-analytics-dashboard
```

### 2. Configure as variáveis de ambiente

```bash
cp backend/.env.example backend/.env
```

Valores padrão para desenvolvimento:

```env
DB_HOST=localhost
DB_PORT=5433
DB_NAME=sales_analytics
DB_USER=admin
DB_PASSWORD=secret
PORT=3001
```

### 3. Inicie com Docker (recomendado)

```bash
docker-compose up --build
```

### 4. Ou execute manualmente

```bash
# Instalar dependências
npm install

# Iniciar frontend e backend
npm run dev
```

| Serviço  | URL                   |
| -------- | --------------------- |
| Frontend | http://localhost:3000 |
| API      | http://localhost:3001 |

---

## API — Endpoints Disponíveis

| Método   | Rota                      | Descrição                     |
| -------- | ------------------------- | ----------------------------- |
| `GET`    | `/api/sales/summary`      | KPIs consolidados de vendas   |
| `GET`    | `/api/sales/monthly`      | Vendas mensais por ano        |
| `GET`    | `/api/sales/by-category`  | Receita por categoria         |
| `GET`    | `/api/sales/by-region`    | Receita por região            |
| `GET`    | `/api/sales/top-products` | Top-10 produtos mais vendidos |
| `GET`    | `/api/orders`             | Listagem paginada de pedidos  |
| `GET`    | `/api/orders/stats`       | KPIs de status de pedidos     |
| `GET`    | `/api/orders/:id`         | Detalhe de um pedido          |
| `PATCH`  | `/api/orders/:id/status`  | Atualizar status do pedido    |
| `GET`    | `/api/customers`          | Listagem paginada de clientes |
| `GET`    | `/api/customers/stats`    | KPIs de clientes              |
| `GET`    | `/api/sales/products`     | Listagem de produtos          |
| `POST`   | `/api/sales/products`     | Criar produto                 |
| `PUT`    | `/api/sales/products/:id` | Atualizar produto             |
| `DELETE` | `/api/sales/products/:id` | Excluir produto               |

---

## Scripts

| Comando         | Descrição                                         |
| --------------- | ------------------------------------------------- |
| `npm run dev`   | Inicia frontend + backend em modo desenvolvimento |
| `npm run build` | Build de produção (frontend + backend)            |
| `npm run lint`  | Lint em todos os workspaces                       |

---

## License

MIT
