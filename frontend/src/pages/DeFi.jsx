import { useState } from 'react'
import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import PriceTicker from '../components/defi/PriceTicker'
import GoalPicker  from '../components/defi/GoalPicker'
import ActionPanel from '../components/defi/ActionPanel'
import TxStatus    from '../components/defi/TxStatus'
import YieldCard   from '../components/defi/YieldCard'
import { useBestYield } from '../hooks/useBestYield'
import { getSwapQuote, buildSwapTx, executeSwap, SOL_MINT, USDC_MINT } from '../utils/jupiter'
import { stakeSOL } from '../utils/staking'
import { USE_MOCK } from '../constants/config'
import useAppStore from '../store/useAppStore'

export default function DeFi() {
  const { connection } = useConnection()
  const wallet         = useWallet()
  const addTx          = useAppStore((s) => s.addTx)
  const { pools }      = useBestYield()

  const [selected,  setSelected]  = useState(null)
  const [amount,    setAmount]    = useState('')
  const [txStatus,  setTxStatus]  = useState(null)
  const [txId,      setTxId]      = useState(null)
  const [loading,   setLoading]   = useState(false)

  const handleExecute = async () => {
    if (!wallet.connected) { alert('Connect wallet first'); return }
    if (!amount || parseFloat(amount) <= 0) return

    setLoading(true)
    setTxStatus('approving')
    setTxId(null)

    try {
      let id

      if (USE_MOCK) {
        // Simulate delay in mock mode
        await new Promise((r) => setTimeout(r, 2000))
        id = 'mock_tx_' + Date.now()
      } else if (selected === 'swap') {
        const quote = await getSwapQuote(SOL_MINT, USDC_MINT, Math.floor(parseFloat(amount) * 1e9))
        const tx    = await buildSwapTx(quote, wallet.publicKey.toString())
        setTxStatus('processing')
        id = await executeSwap(connection, wallet, tx)
      } else if (selected === 'stake') {
        setTxStatus('processing')
        id = await stakeSOL(connection, wallet, parseFloat(amount))
      } else {
        await new Promise((r) => setTimeout(r, 1500))
        id = 'feature_coming_soon'
      }

      setTxId(id)
      setTxStatus('success')
      addTx({ type: selected, amount, txId: id, timestamp: Date.now() })
    } catch (e) {
      console.error(e)
      setTxStatus('failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0D0818] pt-24 pb-16 px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-black text-white mb-2">One Click DeFi</h1>
          <p className="text-gray-400">Select your goal, enter amount, execute it's that simple.</p>
        </div>

        <PriceTicker />
        <GoalPicker selected={selected} onSelect={setSelected} />

        {selected && (
          <ActionPanel
            selected={selected}
            amount={amount}
            setAmount={setAmount}
            onExecute={handleExecute}
            loading={loading}
          />
        )}

        <TxStatus status={txStatus} txId={txId} />

        {/* Yield Pools */}
        <div className="mt-12">
          <h2 className="text-white text-2xl font-bold mb-4">Top Yield Pools</h2>
          {pools.length === 0 && (
            <p className="text-gray-500 text-sm">Loading pools...</p>
          )}
          <div className="space-y-3">
            {pools.map((pool) => <YieldCard key={pool.address} pool={pool} />)}
          </div>
        </div>
      </div>
    </div>
  )
}
