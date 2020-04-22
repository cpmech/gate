#!/bin/bash

yarn build
rsync -av dist/* ../epop-v2/epop-mobile/node_modules/@cpmech/gate
