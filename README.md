# Sales Analytics Dashboard

A full-stack sales analytics dashboard for real-time reporting, built with Next.js, Node.js, PostgreSQL, and Recharts.

---

## Tech Stack

| Layer     | Technology              |
| --------- | ----------------------- |
| Frontend  | Next.js 15 + TypeScript |
| Styling   | Tailwind CSS            |
| Charts    | Recharts                |
| Backend   | Node.js + Express       |
| Database  | PostgreSQL 16           |
| Container | Docker / Docker Compose |

---

## Project Structure

```
sales-analytics-dashboard/
├── frontend/                   # Next.js application
│   └── src/
│       ├── app/                # App Router pages and layouts
│       ├── components/
│       │   ├── charts/         # Recharts chart components
│       │   ├── dashboard/      # Dashboard layout and KPI cards
│       │   └── ui/             # Reusable UI primitives
│       ├── lib/                # API client and helper functions
│       └── types/              # TypeScript interfaces
│
├── backend/                    # Node.js + Express REST API
│   └── src/
│       ├── controllers/        # Request handlers
│       ├── routes/             # Route definitions
│       ├── models/             # Database query layer
│       ├── middleware/         # Auth, validation, error handling
│       ├── config/             # Database and env configuration
│       └── utils/              # Logger and shared utilities
│
├── database/
│   ├── migrations/             # SQL migration scripts
│   └── seeds/                  # SQL seed data
│
├── docker-compose.yml
└── package.json                # Root workspace (npm workspaces)
```

---

## Getting Started

### Prerequisites

- Node.js >= 20
- Docker & Docker Compose (recommended)
- PostgreSQL 16 (if running without Docker)

### 1. Clone the repository

```bash
git clone https://github.com/<your-username>/sales-analytics-dashboard.git
cd sales-analytics-dashboard
```

### 2. Configure environment variables

```bash
cp backend/.env.example backend/.env
cp frontend/.env.local.example frontend/.env.local
```

Edit the `.env` files as needed.

### 3. Start with Docker (recommended)

```bash
docker-compose up --build
```

### 4. Or run manually

```bash
# Install dependencies
npm install

# Start both frontend and backend in dev mode
npm run dev
```

| Service  | URL                   |
| -------- | --------------------- |
| Frontend | http://localhost:3000 |
| API      | http://localhost:3001 |

---

## Scripts

| Command         | Description                          |
| --------------- | ------------------------------------ |
| `npm run dev`   | Start frontend + backend in dev mode |
| `npm run build` | Build both frontend and backend      |
| `npm run lint`  | Lint all workspaces                  |

---

## Roadmap

- [ ] KPI cards (revenue, orders, average ticket)
- [ ] Sales over time line chart
- [ ] Revenue by category bar chart
- [ ] Top products table
- [ ] Date range filter
- [ ] CSV export

---

## License

MIT

Dashboard interativo para visualização de métricas de vendas com gráficos e filtros dinâmicos. Stack: React, Node.js, PostgreSQL, Recharts.
