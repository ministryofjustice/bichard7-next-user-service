#!/usr/bin/env bash

export BICHARD_REDIRECT_URL="http://localhost:3000/bichard-ui/Authenticate"

npx concurrently --kill-others --success first npm:start npm:cypress:run