#!/bin/bash

LIVEGATE=${1:-"false"}
MYIP=`ip route get 1 | sed -n 's/^.*src \([0-9.]*\) .*$/\1/p'`

if [ "$LIVEGATE" = "true" ]; then
    echo "...with live gate..."
    REACT_APP_KEY="gate" \
    REACT_APP_STAGE="dev" \
    REACT_APP_LIVEGATE="true" \
    REACT_APP_DOMAIN=${GATE_DOMAIN} \
    REACT_APP_APIURL="http://${MYIP}:4444/" \
    REACT_APP_COGNITO_POOLID=${GATE_COGNITO_POOLID_DEV} \
    REACT_APP_COGNITO_CLIENTID=${GATE_COGNITO_CLIENTID_DEV} \
    npm run react-scripts -- start
else
    echo "...with local gate..."
    REACT_APP_STAGE="dev" \
    REACT_APP_KEY="gate" \
    REACT_APP_LIVEGATE="false" \
    REACT_APP_DOMAIN=${GATE_DOMAIN} \
    REACT_APP_APIURL="http://${MYIP}:4444/" \
    REACT_APP_COGNITO_POOLID="nada" \
    REACT_APP_COGNITO_CLIENTID="nada" \
    npm run react-scripts -- start
fi
