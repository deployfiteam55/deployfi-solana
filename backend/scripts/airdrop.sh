#!/usr/bin/env bash
set -e

echo "💧 Requesting 2 SOL airdrop on devnet..."
solana config set --url devnet
solana airdrop 2
echo "✅ Airdrop complete!"
solana balance