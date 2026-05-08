import { VersionedTransaction } from '@solana/web3.js'
import { SOL_MINT, USDC_MINT } from '../constants/addresses'

export { SOL_MINT, USDC_MINT }

// Step 1 — Get best swap quote from Jupiter aggregator
export const getSwapQuote = async (inputMint, outputMint, amount, slippageBps = 50) => {
  const url =
    `https://quote-api.jup.ag/v6/quote` +
    `?inputMint=${inputMint}` +
    `&outputMint=${outputMint}` +
    `&amount=${amount}` +
    `&slippageBps=${slippageBps}`
  const res = await fetch(url)
  if (!res.ok) throw new Error('Jupiter quote API failed')
  return res.json()
}

// Step 2 — Build swap transaction
export const buildSwapTx = async (quoteResponse, walletPublicKey) => {
  const res = await fetch('https://quote-api.jup.ag/v6/swap', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      quoteResponse,
      userPublicKey: walletPublicKey,
      wrapUnwrapSOL: true,
    }),
  })
  if (!res.ok) throw new Error('Jupiter swap build failed')
  const { swapTransaction } = await res.json()
  return swapTransaction
}

// Step 3 — Sign & broadcast
export const executeSwap = async (connection, wallet, swapTx) => {
  const tx = VersionedTransaction.deserialize(Buffer.from(swapTx, 'base64'))
  const signed = await wallet.signTransaction(tx)
  const txId = await connection.sendRawTransaction(signed.serialize(), {
    skipPreflight: false,
    maxRetries: 3,
  })
  await connection.confirmTransaction(txId, 'confirmed')
  return txId
}

// All-in-one — Step 1 + 2 + 3 ek saath
export const swapTokens = async (
  connection,
  wallet,
  inputMint,
  outputMint,
  amountLamports
) => {
  const quote = await getSwapQuote(inputMint, outputMint, amountLamports)
  const tx    = await buildSwapTx(quote, wallet.publicKey.toString())
  const txId  = await executeSwap(connection, wallet, tx)
  return { txId, quote }
}