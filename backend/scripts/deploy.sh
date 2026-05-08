#!/usr/bin/env bash
set -e

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo " DeployFi — Devnet Deploy Script"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# 1. Switch to devnet
solana config set --url devnet
echo "✅ Network: devnet"

# 2. Show wallet
WALLET=$(solana address)
echo "📍 Wallet: $WALLET"

# 3. Check balance
BALANCE=$(solana balance --output json-compact | python3 -c "import sys,json; print(json.load(sys.stdin)['lamports']/1e9)")
echo "💰 Balance: $BALANCE SOL"

# 4. Build
echo ""
echo "🔨 Building Anchor program..."
anchor build
echo "✅ Build complete"

# 5. Get program ID
PROGRAM_ID=$(anchor keys list | awk '/launchpad/{print $2}')
echo "📋 Program ID: $PROGRAM_ID"

# 6. Deploy
echo ""
echo "🚀 Deploying to devnet..."
anchor deploy --provider.cluster devnet
echo "✅ Deployed!"

# 7. Export IDL
echo ""
echo "📤 Syncing IDL to frontend..."
cp target/idl/launchpad.json ../frontend/src/constants/idl.json
echo "✅ IDL synced to frontend/src/constants/idl.json"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo " NEXT STEPS:"
echo " 1. Update addresses.js → PROGRAM_ID = '$PROGRAM_ID'"
echo " 2. Set USE_MOCK = false in config.js"
echo " 3. npm run dev from root"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"