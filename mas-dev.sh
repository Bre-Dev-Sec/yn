#!/bin/sh

sed -i '' 's/mas-universal/mas-dev-arm64/' electron-builder.json
sed -i '' 's/"mas"/"mas-dev"/' electron-builder.json

yarn build:main
yarn electron-builder --mac --arm64
codesign -d --entitlements :- out/mas-dev-arm64/Yank\ Note.app/ | sed 's#<key>com.apple.developer.team-identifier</key><string>AGB983TWRL</string>##' > tmp.plist
codesign -s 'EAE127EFC2E3BC7FE3254B782450F23B5C8A9536' -f --entitlements ./tmp.plist ./out/mas-dev-arm64/Yank\ Note.app/
rm tmp.plist
