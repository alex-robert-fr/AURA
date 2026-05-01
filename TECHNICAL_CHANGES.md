# Technical Changes

All notable technical changes targeted at contributors will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Refactor

- Système de champ d'herbe modulaire en ThinInstances : `grass-blade` (géométrie simple plane biface, touffes 7 brins), `grass-blade-material` (shader GLSL gradient + lambert + rétro-éclairage + vent), `grass-field` (50k touffes step 0.18, grille jitterée sur 40×40), `dirt-ground` (sol 40×40), `grass-postprocess` (pipeline DOF+FXAA+ACES), `grass-palette` (palette statique) ([#2](https://github.com/alex-robert-fr/AURA/pull/2))
- Optimisations de rendu idle : backface culling avec bifaces géométriques (-50 % fill rate), frustum culling restauré (retrait de `alwaysSelectAsActiveMesh`), throttle de l'uniform `time` à 30 Hz, DOF auto-désactivé après 1 s d'inactivité caméra, buffers `Vector3`/`Quaternion`/`Matrix` pré-alloués dans la boucle d'init ([#2](https://github.com/alex-robert-fr/AURA/pull/2))
- Retrait de la logique de transition d'ère de la scène 3D : module `grass-era-transition.ts` supprimé, palette statique `defaultGrassPalette`, setters dynamiques retirés ([#2](https://github.com/alex-robert-fr/AURA/pull/2))
- Garde d'enregistrement shader corrigée : vérification dans `Effect.ShadersStore` au lieu d'un flag de module local, robuste aux hot-reloads Vite ([#2](https://github.com/alex-robert-fr/AURA/pull/2))

### Chore

- Overlay DOM FPS et temps de frame lissé (EMA α=0.06, refresh 2 Hz) pour profiler le rendu en développement ([#2](https://github.com/alex-robert-fr/AURA/pull/2))

### Dependencies

- Ajout de `@babylonjs/materials ^7.36.0` dans `apps/web` ([#2](https://github.com/alex-robert-fr/AURA/pull/2))

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
