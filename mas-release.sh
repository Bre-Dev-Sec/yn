#!/bin/sh

rm -r src/renderer/public/vs

yarn
node scripts/download-pandoc.js
yarn run build
yarn electron-builder --mac --universal
