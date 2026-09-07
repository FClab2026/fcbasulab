#!/bin/bash

set -e

echo "======================================"
echo " FC-BASU Lab Deployment Package"
echo "======================================"

echo ""
echo "[0/5] Cleaning up previous build artifacts..."

rm -rf .next
rm -rf node_modules

echo ""
echo "[1/5] Installing dependencies..."

npm ci


echo ""
echo "[2/5] Building application..."

npm run build

echo ""
echo "[3/5] Preparing standalone package..."

# Next.js standalone output
STANDALONE=".next/standalone"

if [ ! -f "$STANDALONE/server.js" ]; then
    echo "ERROR: Standalone server.js not found:"
    echo "$STANDALONE/server.js"
    exit 1
fi

# Copy required static assets
rm -rf "$STANDALONE/.next/static"
cp -r .next/static "$STANDALONE/.next/static"

# Copy public assets
rm -rf "$STANDALONE/public"
cp -r public "$STANDALONE/public"

echo "Removing unnecessary files from standalone package..."
# Never deploy local/build-time environment
rm -f "$STANDALONE/.env"

echo "Standalone package ready."

echo ""
echo "[4/5] Creating deployment archive..."

rm -f fcbasulab-deploy.tar.gz

tar -czf fcbasulab-deploy.tar.gz \
    -C "$STANDALONE" .

echo ""
echo "[5/5] Verifying archive..."

if ! tar -tzf fcbasulab-deploy.tar.gz | grep -q '^./server.js$'; then
    echo "ERROR: server.js missing from archive"
    exit 1
fi

if ! tar -tzf fcbasulab-deploy.tar.gz | grep -q '^./public/'; then
    echo "ERROR: public directory missing from archive"
    exit 1
fi

if ! tar -tzf fcbasulab-deploy.tar.gz | grep -q '^./.next/static/'; then
    echo "ERROR: .next/static missing from archive"
    exit 1
fi

echo "Archive verification passed."

echo ""
echo "[5/5] Deployment package:"

ls -lh fcbasulab-deploy.tar.gz

echo ""
echo "======================================"
echo " Ready to move to IITD server"
echo "======================================"