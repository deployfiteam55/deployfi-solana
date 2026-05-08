import { Program, AnchorProvider, web3, BN } from '@project-serum/anchor'
import { PublicKey, SystemProgram, Keypair } from '@solana/web3.js'
import { TOKEN_PROGRAM_ID, createMint } from '@solana/spl-token'
import { USE_MOCK } from '../constants/config'
import { PROGRAM_ID } from '../constants/addresses'

// Lazy-load IDL — only present after `npm run sync:idl`
let _idl = null
const getIDL = async () => {
  if (_idl) return _idl
  try {
    _idl = await import('../constants/idl.json')
    return _idl
  } catch {
    throw new Error('IDL not found. Run: npm run sync:idl')
  }
}

export const getProgram = async (connection, wallet) => {
  const idl = await getIDL()
  const provider = new AnchorProvider(connection, wallet, { commitment: 'confirmed' })
  return new Program(idl, new PublicKey(PROGRAM_ID), provider)
}

// ─── Create Token ─────────────────────────────────────────────────────────────
export const createToken = async (connection, wallet, { name, symbol, supply, price, metadataUri }) => {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 1500))
    return {
      txId: 'mock_tx_' + Date.now(),
      mintAddress: '7xKpMockAddress3mNq' + Math.random().toString(36).slice(2, 8),
    }
  }

  const program = await getProgram(connection, wallet)
  const launchKeypair = Keypair.generate()
  const mintKeypair   = Keypair.generate()

  const tx = await program.methods
    .createToken(name, symbol, new BN(supply), new BN(price))
    .accounts({
      launch:        launchKeypair.publicKey,
      mint:          mintKeypair.publicKey,
      creator:       wallet.publicKey,
      systemProgram: SystemProgram.programId,
      tokenProgram:  TOKEN_PROGRAM_ID,
    })
    .signers([launchKeypair, mintKeypair])
    .rpc()

  return { txId: tx, mintAddress: mintKeypair.publicKey.toString() }
}

// ─── Buy Tokens ───────────────────────────────────────────────────────────────
export const buyTokens = async (connection, wallet, { launchAddress, amount }) => {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 1200))
    return 'mock_buy_tx_' + Date.now()
  }

  const program = await getProgram(connection, wallet)
  const tx = await program.methods
    .buyTokens(new BN(amount))
    .accounts({
      launch:        new PublicKey(launchAddress),
      buyer:         wallet.publicKey,
      systemProgram: SystemProgram.programId,
    })
    .rpc()

  return tx
}

// ─── Finalize Launch ──────────────────────────────────────────────────────────
export const finalizeLaunch = async (connection, wallet, launchAddress) => {
  if (USE_MOCK) return 'mock_finalize_tx_' + Date.now()

  const program = await getProgram(connection, wallet)
  return program.methods
    .finalizeLaunch()
    .accounts({ launch: new PublicKey(launchAddress), creator: wallet.publicKey })
    .rpc()
}