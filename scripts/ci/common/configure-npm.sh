#!/usr/bin/env bash

[ -n "$DEBUG" ] && set -x
set -e
set -o pipefail

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
PROJECT_DIR="$( cd "$SCRIPT_DIR/../../.." && pwd )"

cd "$PROJECT_DIR"

git crypt unlock

source config/secrets/npm/credentials.sh
echo "//registry.npmjs.org/:_authToken=${NPM_TOKEN}" > ~/.npmrc
chmod 0600 ~/.npmrc
