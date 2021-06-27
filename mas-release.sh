#!/bin/sh

yarn
node scripts/download-pandoc.js
yarn run build
yarn electron-builder --mac --universal
