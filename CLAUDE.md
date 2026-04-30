# AURA

Simulation 3D ambient — la cité-monde de l'Architecte. Voir `VISION.md` pour la vision complète du projet.

## Stack

- **Monorepo** : workspaces Bun (`apps/web`, `apps/api`)
- **Frontend** (`apps/web`) : Babylon.js + React + Vite
- **Backend** (`apps/api`) : Fastify + Node.js + PostgreSQL + TypeORM
- **Outillage** : Bun (package manager + runtime), Biome (lint + format), Vitest (tests), TypeScript strict

## Règles critiques

- **TypeScript strict** partout. Pas de `any` sans justification explicite en commentaire.
- **Aucune feature ne doit contredire le double geste de la VISION** (constatation + planification). Cf. `VISION.md` § 7.
- Le frontend doit rester **performant en idle** (l'app tourne en permanence sur écran secondaire) : éviter les re-renders inutiles, les animations CPU, les timers non-throttlés.
- Pas de `console.log` de debug oublié, pas d'import inutilisé, pas de commentaires évidents.
- Chaque fichier modifié doit être dans un état propre et committable.

## Git

### Branches

Format : `type/numero-titre-court`

| Préfixe | Usage |
|---------|-------|
| `feat/` | Nouvelle fonctionnalité |
| `fix/` | Correction de bug |
| `refactor/` | Refactoring |
| `perf/` | Optimisation performance |
| `docs/` | Documentation |
| `chore/` | Maintenance / config |

Le titre est en **kebab-case anglais**, **5 mots max**. Le numéro = numéro d'issue GitHub.

### Commits

Format : `emoji type(scope): description en français`

| Emoji | Type |
|-------|------|
| ✨ | feat |
| 🐛 | fix |
| ♻️ | refactor |
| ⚡ | perf |
| 📝 | docs |
| 🔧 | chore |

Le scope est obligatoire pour `feat`, `fix`, `refactor`, `perf`. Il correspond au module métier (`city`, `building`, `webhook`, `ui`...).

**Aucune signature automatique** (`Co-Authored-By` ou autre) dans les messages de commit.

### Pull Requests

- Titre : `[Type] Titre de l'issue (#numero)`
- Body : doit contenir `Closes #XX` pour chaque issue liée
- Cible : `main`

## Workflow

Pipeline AI-Driven Development disponible via les commandes `/pipe-*` :

```
/pipe-hello → /pipe-plan → /pipe-code → /pipe-review → /pipe-test → /pipe-changelog → /pipe-pr → [merge] → /pipe-tag
```

## Décisions techniques

Les décisions structurantes vivent dans `docs/DECISIONS.md` (ADRs) au fur et à mesure qu'elles sont prises.
