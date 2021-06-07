#!/usr/bin/env bash

set -e

TARGET_DIR=$(pwd)

# Compile the typescript
npx tsc

# Create a temporary folder
BUILD_DIR=$(mktemp -d)

# Copy in package.json, package-lock.json and built typescript code
cp package*.json $BUILD_DIR
cp dist/* $BUILD_DIR

pushd $BUILD_DIR

# Install prod node dependencies
npm install --production

# Zip it up
zip -r "$TARGET_DIR/lambda.zip" .

popd

# Clean up
rm -rf $BUILD_DIR
rm -rf dist
