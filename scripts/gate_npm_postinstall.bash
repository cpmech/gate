#!/bin/bash

set -e

here=$(pwd)
left=(${here//node_modules/ })

if [ "$left" = "$here" ]; then
  echo "not inside node_modules"
  rm -rf ./src/rcomps
  rsync -av ./node_modules/@cpmech/rcomps/ ./src/rcomps
else
  echo "inside node_modules"
fi