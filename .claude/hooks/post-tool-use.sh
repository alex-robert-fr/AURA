#!/bin/bash
# PostToolUse — auto-format Biome sur les fichiers modifies (silencieux si Biome absent)

INPUT=$(cat)
FILE=$(echo "$INPUT" | jq -r '.tool_input.file_path // empty')

if [ -z "$FILE" ]; then
  exit 0
fi

if [[ "$FILE" =~ \.(ts|tsx|js|jsx|json|jsonc|css)$ ]]; then
  if command -v bunx >/dev/null 2>&1; then
    bunx --bun biome check --write "$FILE" 2>/dev/null || true
  elif command -v npx >/dev/null 2>&1; then
    npx --no-install biome check --write "$FILE" 2>/dev/null || true
  fi
fi

exit 0
