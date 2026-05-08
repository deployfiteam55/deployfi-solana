import { Marinade, MarinadeConfig } from '@marinade.finance/marinade-ts-sdk'
import BN from 'bn.js'

// Stake SOL → mSOL via Marinade liquid staking (~7.8% APY)
export const stakeSOL = async (connection, wallet, amountSOL) => {
  const config = new MarinadeConfig({
    connection,
    publicKey: wallet.publicKey,
  })
  const marinade = new Marinade(config)

  const { transaction } = await marinade.deposit(
    new BN(Math.floor(amountSOL * 1e9)) // convert SOL to lamports
  )

  const signed  = await wallet.signTransaction(transaction)
  const txId    = await connection.sendRawTransaction(signed.serialize(), {
    skipPreflight: false,
    maxRetries: 3,
  })
  await connection.confirmTransaction(txId, 'confirmed')
  return txId
}

// Unstake mSOL → SOL (delayed — subject to unstake ticket)
export const unstakeSOL = async (connection, wallet, amountMSOL) => {
  const config = new MarinadeConfig({ connection, publicKey: wallet.publicKey })
  const marinade = new Marinade(config)
  const { transaction } = await marinade.liquidUnstake(new BN(Math.floor(amountMSOL * 1e9)))
  const signed = await wallet.signTransaction(transaction)
  const txId   = await connection.sendRawTransaction(signed.serialize())
  await connection.confirmTransaction(txId, 'confirmed')
  return txId
}