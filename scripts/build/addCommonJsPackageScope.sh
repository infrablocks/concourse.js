#!/usr/bin/env bash

[ -n "$DEBUG" ] && set -x
set -e
set -o pipefail

mkdir -p commonjs

echo "{ \"type\": \"commonjs\" }" > commonjs/package.json

