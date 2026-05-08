import { useState, useEffect } from 'react'
import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import { LAMPORTS_PER_SOL } from '@solana/web3.js'

export const useSOLBalance = () => {
  const { connection } = useConnection()
  const { publicKey } = useWallet()
  const [balance, setBalance] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!publicKey) { setBalance(null); return }

    const fetch = async () => {
      setLoading(true)
      try {
        const bal = await connection.getBalance(publicKey)
        setBalance((bal / LAMPORTS_PER_SOL).toFixed(4))
      } catch (e) {
        console.error('Balance fetch error:', e)
      } finally {
        setLoading(false)
      }
    }

    fetch()
    const id = connection.onAccountChange(publicKey, (info) => {
      setBalance((info.lamports / LAMPORTS_PER_SOL).toFixed(4))
    })

    return () => connection.removeAccountChangeListener(id)
  }, [publicKey, connection])

  return { balance, loading }
}