#!/usr/bin/env bash
set -e

export BICHARD_REDIRECT_URL="http://localhost:3000/bichard-ui/Authenticate"

npm run build

START_CMD="npm:start > /dev/null 2>&1"

if [ $# -eq 0 ]; then
    npx concurrently --raw --kill-others --success first "$START_CMD" "npm:cypress:run"
else
    FILES=""
    for f in "$@"; do
        [[ $f =~ ^cypress/integration ]] && file_path="$f" || file_path="cypress/integration/$f"
        FILES="$file_path,${FILES}"
    done

    npx concurrently --raw --kill-others --success first "$START_CMD" "npm:cypress:run:file ${FILES%,}"
fi
