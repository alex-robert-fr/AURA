---
name: workflow-config
description: Configuration du workflow AI-Driven Development pour ce projet. Contrat entre le plugin et le projet — lu par tous les skills du workflow. Rempli par /setup.
user-invocable: false
---

## Plateforme

- **Git hosting** : GitHub
- **Issue tracker** : GitHub Issues
- **Branche par defaut** : main

## Commandes

- **Lint** : `bun run lint` (= `biome check .`)
- **Format** : `bun run format` (= `biome check --write .`)
- **Test** : `bun run test` (= `vitest run` sur tous les workspaces)
- **Build** : `bun run build`
- **Typecheck** : `bun run typecheck` (= `tsc --noEmit -b`)

## Notifications

- **Canal** : aucun
- **MCP** : aucun

## Conventions

- **Branches** : type/numero-titre
- **Commits** : emoji type(scope): description
- **PR titre** : [Type] Titre de l'issue (#numero)
