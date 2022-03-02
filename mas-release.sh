#!/bin/sh

rm -r src/renderer/public/drawio
rm -r src/renderer/public/embed/*
rm -r src/renderer/public/vs

yarn
node scripts/download-pandoc.js
yarn run build
yarn electron-builder --mac --universal
