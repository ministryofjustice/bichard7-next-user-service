#!/usr/bin/env bash
set -e

npm run build

START_CMD="npm:start > /dev/null 2>&1"
TOTAL_CHUNKS=${TOTAL_CHUNKS:-1}
CHUNK_NUMBER=${CHUNK_NUMBER:-0}

echo "TOTAL_CHUNKS: ${TOTAL_CHUNKS}"
echo "CHUNK_NUMBER: ${CHUNK_NUMBER}"

if [ $# -eq 0 ]; then
    CHUNKS=$(find cypress/integration/** -iname '*.spec.js' | sort | awk "(NR % $TOTAL_CHUNKS == $CHUNK_NUMBER)" | paste -d ' ' -s -)
    npx concurrently --raw --kill-others --success first "$START_CMD" "npm:cypress:run:file ${CHUNKS}"
else
    FILES=""
    for f in "$@"; do
        [[ $f =~ ^cypress/integration ]] && file_path="$f" || file_path="cypress/integration/$f"
        FILES="$file_path,${FILES}"
    done

    npx concurrently --raw --kill-others --success first "$START_CMD" "npm:cypress:run:file ${FILES%,}"
fi
