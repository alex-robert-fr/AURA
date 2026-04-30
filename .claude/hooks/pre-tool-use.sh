#!/bin/bash
# PreToolUse — bloque les commandes Bash destructrices

INPUT=$(cat)
COMMAND=$(echo "$INPUT" | jq -r '.tool_input.command // empty')

DANGEROUS_PATTERNS=(
  'rm\s+-rf\s+/'
  'rm\s+-rf\s+\.'
  'rm\s+-rf\s+~'
  'git\s+push\s+--force\s+(origin\s+)?(main|master)'
  'git\s+push\s+-f\s+(origin\s+)?(main|master)'
  'DROP\s+(TABLE|DATABASE)'
  'TRUNCATE\s+TABLE'
  'git\s+reset\s+--hard'
  'git\s+checkout\s+\.\s*$'
  'git\s+clean\s+-fd'
  'chmod\s+-R\s+777'
)

for pattern in "${DANGEROUS_PATTERNS[@]}"; do
  if echo "$COMMAND" | grep -qEi "$pattern"; then
    echo "BLOCKED: commande dangereuse detectee — $COMMAND"
    exit 2
  fi
done

exit 0
