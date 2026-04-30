#!/bin/bash
# Stop — verifie que les tests passent avant de finir
# Skip silencieusement si le projet n'a pas encore de package.json ou pas de script test

if [ ! -f "package.json" ]; then
  exit 0
fi

if ! jq -e '.scripts.test' package.json >/dev/null 2>&1; then
  exit 0
fi

if ! command -v bun >/dev/null 2>&1; then
  exit 0
fi

bun run test 2>&1
