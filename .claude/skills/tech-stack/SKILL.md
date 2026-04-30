---
name: tech-stack
description: Stack technique et conventions de code du projet AURA. Utiliser lors de l'ecriture ou la revue de code pour respecter les standards et la stack du projet.
user-invocable: false
---

## Stack technique

### Monorepo

- **Outil** : Bun workspaces
- **Structure** :
  - `apps/web` — client (simulation 3D + UI)
  - `apps/api` — backend (webhooks, persistance)
  - `packages/*` — code partagé (types, schémas, utils) si nécessaire

### Backend (`apps/api`)

- **Runtime** : Node.js (TypeORM nécessite des decorators stables, donc Node, pas Bun runtime)
- **Framework** : Fastify
- **ORM** : TypeORM
- **Base de données** : PostgreSQL
- **Validation** : Zod (sur les boundaries — payloads HTTP, webhooks, env)

### Frontend (`apps/web`)

- **Runtime / build** : Bun + Vite
- **Framework UI** : React
- **Moteur 3D** : Babylon.js (sans wrapper React — Babylon gère son propre cycle de rendu, React contrôle uniquement l'UI overlay)
- **State management** : Zustand (léger, suffisant pour l'app)
- **CSS** : Tailwind CSS (utility-first, cohérent avec le glassmorphism visionOS)

### Outillage commun

- **Lint + format** : Biome (un seul outil)
- **Tests** : Vitest
- **TypeScript** : strict mode partout
- **Package manager** : Bun

## Git

- **Branche par defaut** : main

## Architecture

- **Pattern backend** : architecture par feature (modules métier autonomes : `city`, `building`, `webhook`, `architect`, etc.)
- **Pattern frontend** : séparation stricte **scène 3D Babylon** ↔ **UI React**. La scène 3D s'abonne au store Zustand, React n'appelle jamais directement Babylon.
- **Boundary scène/UI** : tout passe par le store. Pas de refs Babylon dans les composants React.

## Conventions de nommage

| Contexte | Convention |
|----------|-----------|
| Fichiers | `kebab-case` (ex: `building-store.ts`) |
| Variables, fonctions, propriétés | `camelCase` |
| Types, classes, composants React | `PascalCase` |
| Constantes globales | `SCREAMING_SNAKE_CASE` |
| Identifiants (IDs) | UUID v7 (triables temporellement) |

## Regles de qualité

- Pas de `any` TypeScript sans justification explicite en commentaire au-dessus
- Pas de commentaires évidents — le code doit se lire seul
- Chaque fichier créé ou modifié doit être dans un état propre et committable
- Pas de `console.log` de debug oublié
- Pas d'import inutilisé
- Pas de logique métier dans les composants React — extraire en hooks ou stores
- Pas d'appels Babylon dans React — passer par le store

## Performance (spécifique AURA)

- L'app tourne en **persistance permanente** sur écran secondaire — chaque animation, timer ou re-render coûte sur la durée
- Préférer `requestAnimationFrame` aux `setInterval`
- Les sélecteurs Zustand doivent être **fins** (un sélecteur par valeur lue, pas l'état entier)
- Les meshes Babylon doivent être **pooled** quand possible (réutilisation pour les piétons, voitures, fumée ambient)
