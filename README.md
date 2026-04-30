# AURA

Simulation 3D ambient — la cité-monde de l'Architecte.

Voir [`VISION.md`](./VISION.md) pour la vision complète et [`CLAUDE.md`](./CLAUDE.md) pour les conventions de développement.

## Démarrage

```bash
bun install
bun run dev:web   # frontend Babylon + React
bun run dev:api   # backend Fastify + TypeORM
```

## Structure

```
apps/
├── web/   → simulation 3D + UI (Babylon.js + React + Vite)
└── api/   → backend webhooks + persistance (Fastify + TypeORM + Postgres)

packages/  → code partagé (types, schémas, utils)
```

## Scripts racine

| Commande | Effet |
|----------|-------|
| `bun run lint` | Biome check |
| `bun run format` | Biome check --write |
| `bun run test` | Vitest sur tous les workspaces |
| `bun run typecheck` | TypeScript --noEmit sur tous les workspaces |
| `bun run build` | Build tous les workspaces |
