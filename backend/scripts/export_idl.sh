#!/usr/bin/env bash
set -e
echo "📤 Exporting IDL to frontend..."
cp target/idl/launchpad.json ../frontend/src/constants/idl.json
echo "✅ Done — frontend/src/constants/idl.json updated"