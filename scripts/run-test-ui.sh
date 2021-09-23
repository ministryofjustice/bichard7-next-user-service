#!/usr/bin/env bash

export BICHARD_REDIRECT_URL="http://localhost:3000/bichard-ui/Authenticate"

npm run build

npx concurrently --raw --kill-others --success first "npm:start > /dev/null 2>&1 " "npm:cypress:run"
