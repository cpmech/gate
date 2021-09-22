#!/bin/bash

set -e

STAGE=${1:-"dev"}

npm run test
npm run tsc
npm run lint

if [ "$STAGE" = "prod" ]; then
    echo "...build...prod..."
    REACT_APP_STAGE="prod" \
    REACT_APP_LIVEGATE="true" \
    REACT_APP_DOMAIN=${GATE_DOMAIN} \
    REACT_APP_APIURL="https://api-prod.${GATE_DOMAIN}" \
    REACT_APP_COGNITO_POOLID=${GATE_COGNITO_POOLID_PROD} \
    REACT_APP_COGNITO_CLIENTID=${GATE_COGNITO_CLIENTID_PROD} \
    npm run react-scripts -- build
else
    echo "...build...dev..."
    REACT_APP_STAGE="dev" \
    REACT_APP_LIVEGATE="true" \
    REACT_APP_DOMAIN=${GATE_DOMAIN} \
    REACT_APP_APIURL="https://api-dev.${GATE_DOMAIN}" \
    REACT_APP_COGNITO_POOLID=${GATE_COGNITO_POOLID_DEV} \
    REACT_APP_COGNITO_CLIENTID=${GATE_COGNITO_CLIENTID_DEV} \
    npm run react-scripts -- build
fi
