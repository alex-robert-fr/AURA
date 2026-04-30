# Technical Changes

All notable technical changes targeted at contributors will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.0.1] - 2026-04-30

### CI

- Mise en place des hooks Claude Code (`pre-tool-use`, `post-tool-use`, `stop`) — protection contre les commandes destructrices, auto-format Biome après écriture, vérification des tests avant arrêt ([`99e0221`](https://github.com/alex-robert-fr/AURA/commit/99e0221))

### Chore

- Initialisation du monorepo Bun avec workspaces `apps/web` et `apps/api` ([`99e0221`](https://github.com/alex-robert-fr/AURA/commit/99e0221))
- Frontend `apps/web` : Babylon.js, React 18, Vite, Zustand, Tailwind, séparation stricte scène 3D / UI React via store ([`99e0221`](https://github.com/alex-robert-fr/AURA/commit/99e0221))
- Backend `apps/api` : Fastify, TypeORM, PostgreSQL, validation des variables d'environnement avec Zod ([`99e0221`](https://github.com/alex-robert-fr/AURA/commit/99e0221))
- Outillage commun : Biome (lint + format), Vitest, TypeScript strict avec `noUncheckedIndexedAccess` ([`99e0221`](https://github.com/alex-robert-fr/AURA/commit/99e0221))
- Cleanup idempotent du moteur Babylon avec `stopRenderLoop` avant `dispose` pour éviter les fuites mémoire en double-mount StrictMode ([`9befb5a`](https://github.com/alex-robert-fr/AURA/commit/9befb5a))
- Abonnement de la scène 3D au store Zustand pour réagir aux changements d'état sans recréer le moteur ([`9befb5a`](https://github.com/alex-robert-fr/AURA/commit/9befb5a))
- `NODE_ENV` obligatoire sans valeur par défaut dans le schéma Zod — force la définition explicite en production ([`9befb5a`](https://github.com/alex-robert-fr/AURA/commit/9befb5a))
- Chemins entités et migrations TypeORM conditionnés à l'environnement (`dist/*.js` en production, `src/*.ts` en développement) ([`9befb5a`](https://github.com/alex-robert-fr/AURA/commit/9befb5a))
- Import `reflect-metadata` centralisé dans `server.ts` uniquement ([`9befb5a`](https://github.com/alex-robert-fr/AURA/commit/9befb5a))
- `pino-pretty` déclaré en `devDependencies` du package API ([`9befb5a`](https://github.com/alex-robert-fr/AURA/commit/9befb5a))
- `bun.lockb` retiré du `.gitignore` — le format texte `bun.lock` est désormais versionné ([`9befb5a`](https://github.com/alex-robert-fr/AURA/commit/9befb5a))

[Unreleased]: https://github.com/alex-robert-fr/AURA/compare/v0.0.1...HEAD
[0.0.1]: https://github.com/alex-robert-fr/AURA/releases/tag/v0.0.1
