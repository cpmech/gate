#!/bin/bash

STAGE=${1:-"dev"}

BUCKET="dev.${GATE_DOMAIN}-website"
DISTROID=${GATE_CLOUDFRONT_ID_DEV}
if [ "$STAGE" = "prod" ]; then
    BUCKET="${GATE_DOMAIN}-website"
    DISTROID=${GATE_CLOUDFRONT_ID_PROD}
fi

ASSETS="build"
NOCACHE_FILES="index.html"
INVALID_FILES="/index.html"
NOCACHE_OPTIONS="max-age=0, no-cache, no-store, must-revalidate"

echo "... 🔥 building the website ..."
npm run --silent build -- $STAGE

echo "... ⚡ sending files to S3 ..."
aws s3 cp --recursive --acl public-read ./${ASSETS} s3://${BUCKET}/

for f in $NOCACHE_FILES; do
    echo "... ⚡ sending ${f} without caching ..."
    aws s3 cp --acl public-read --cache-control="${NOCACHE_OPTIONS}" ./${ASSETS}/${f} s3://${BUCKET}/
done

echo "... ✨ creating cloudfront invalidation ..."
aws cloudfront create-invalidation --distribution-id ${DISTROID} --paths ${INVALID_FILES}

echo "... 👍 done ..."
