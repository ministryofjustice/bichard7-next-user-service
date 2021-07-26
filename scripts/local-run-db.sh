#!/usr/bin/env bash

read -n 1 -r -s -p $'Warning! This script will atempt to build, run, seed and perform any defined data migration scripts on the postgres database dependancy. \nPlease press any key if you understand the implications or exit this script.\n'
sh ./scripts/run-db.sh
