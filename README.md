# Rush Launch
![ci status svg](https://github.com/JmRush/rush.launch/actions/workflows/ci.yml/badge.svg)
![cd status svg](https://github.com/JmRush/rush.launch/actions/workflows/cd.yml/badge.svg)



## Ai prodcued this documentation, the application was created by me.

Next.js + Bun + TypeScript + SQLite scaffold with recommended file structure.

## Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Runtime:** Bun
- **Language:** TypeScript
- **Database:** SQLite with Drizzle ORM
- **Styling:** Tailwind CSS

## Project Structure

```
├── app/                    # Next.js App Router (frontend)
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── server/                 # Backend (Express + SQLite)
│   ├── index.ts           # API: /health, /db
│   ├── db/                # Database layer
│   │   ├── index.ts
│   │   └── schema.ts
│   ├── migrate.ts         # Migration runner
│   ├── drizzle/           # SQL migrations
│   ├── drizzle.config.ts  # Drizzle Kit config
│   └── data/              # SQLite database
├── components/
│   └── ui/
└── lib/
    ├── api.ts             # Frontend API client
    └── utils.ts
```

## Getting Started

### Install dependencies

```bash
bun install
```

### Initialize database

**Option A – Push schema (quick for dev):**
```bash
bun run db:push
```

**Option B – Migrations (for production):**
```bash
bun run db:generate   # Generate migrations from schema
bun run db:migrate    # Apply migrations
```

### Development

```bash
bun run dev
```

Starts both:
- **Next.js** at [http://localhost:3000](http://localhost:3000)
- **API server** at [http://localhost:3001](http://localhost:3001)

Run API only: `bun run api`

### Build & Production

```bash
bun run build
bun run start
```

## Database Commands

| Command | Description |
|---------|-------------|
| `bun run db:generate` | Generate migrations from schema |
| `bun run db:migrate` | Apply migrations |
| `bun run db:studio` | Open Drizzle Studio (DB GUI) |

## Environment

Copy `.env.example` to `.env`. Options:
- `DATABASE_URL` – SQLite path (default: `server/data/sqlite.db`)
- `API_PORT` – API server port (default: `3001`)
- `CORS_ORIGIN` – Allowed origin for API (default: `http://localhost:3000`)
