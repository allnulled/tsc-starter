#!/usr/bin/bash

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

cd "$DIR"

refrescador \
  -w "$(pwd)/.." \
  -i "**/dist/**" \
  -i "**.dist.*" \
  -i "**/dist.*" \
  -e "sh" \
  -e "ts" \
  -e "tsx" \
  -e "js" \
  -e "json" \
  -e "css" \
  -e "html" \
  -x "node $(pwd)/build.js" \
  -x "bash $(pwd)/test.sh" \