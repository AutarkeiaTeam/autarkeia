#!/bin/sh
# Run production build when staged changes touch high-risk UI surfaces.
set -e

STAGED=$(git diff --cached --name-only --diff-filter=ACMR)

if ! echo "$STAGED" | grep -qE '^(components/marketplace/|components/quiz/|components/profile/|app/marketplace/)'; then
  exit 0
fi

echo "pre-commit: marketplace/quiz/profile UI changed — running pnpm build..."

if command -v pnpm >/dev/null 2>&1; then
  pnpm build
elif [ -x ./node_modules/.bin/next ]; then
  ./node_modules/.bin/next build
else
  echo "pre-commit: pnpm and node_modules/.bin/next not found — install deps and retry." >&2
  exit 1
fi

echo "pre-commit: build passed."
