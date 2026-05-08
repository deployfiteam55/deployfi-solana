import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import { Link } from 'react-router-dom'
import { useSOLBalance } from '../hooks/useSOLBalance'
import { useLivePrice }  from '../hooks/useLivePrice'
import { useBestYield }  from '../hooks/useBestYield'
import YieldCard         from '../components/defi/YieldCard'
import TokenCard         from '../components/token/TokenCard'
import GlassCard         from '../components/ui/GlassCard'
import useAppStore       from '../store/useAppStore'

export default function Dashboard() {
  const { publicKey }     = useWallet()
  const { balance }       = useSOLBalance()
  const { price }         = useLivePrice()
  const { pools }         = useBestYield()
  const launches          = useAppStore((s) => s.launches)
  const txHistory         = useAppStore((s) => s.txHistory)

  const totalUSD = balance && price
    ? (parseFloat(balance) * parseFloat(price.price)).toFixed(2)
    : null

  if (!publicKey) {
    return (
      <div className="min-h-screen bg-[#0D0818] flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🔌</div>
          <h2 className="text-white text-2xl font-bold mb-2">Connect Your Wallet</h2>
          <p className="text-gray-400">Connect Phantom wallet to view your dashboard.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0D0818] pt-24 pb-16 px-8">
      <div className="max-w-5xl mx-auto">
        {/* Portfolio Hero */}
        <div className="bg-gradient-to-r from-purple-900/60 to-cyan-900/40 rounded-2xl p-8 mb-8 border border-purple-800/30">
          <p className="text-gray-400 mb-2 text-sm uppercase tracking-wider">Total Portfolio Value</p>
          <h1 className="text-5xl font-black text-white">${totalUSD ?? '...'}</h1>
          <p className="text-cyan-400 mt-2 font-bold">◎ {balance ?? '...'} SOL</p>
          <p className="text-gray-500 text-xs mt-1 font-mono">
            {publicKey.toString().slice(0, 8)}...{publicKey.toString().slice(-8)}
          </p>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: 'SOL Price',   value: price  ? `$${price.price}` : '...' },
            { label: 'Launches',    value: launches.length },
            { label: 'Txs Today',   value: txHistory.length },
          ].map((s) => (
            <GlassCard key={s.label} className="p-4 text-center">
              <p className="text-2xl font-black text-white">{s.value}</p>
              <p className="text-gray-500 text-sm">{s.label}</p>
            </GlassCard>
          ))}
        </div>

        {/* Yield Pools */}
        <h2 className="text-white text-2xl font-bold mb-4">Top Yield Opportunities</h2>
        <div className="space-y-3 mb-10">
          {pools.length === 0
            ? <p className="text-gray-500">Loading pools...</p>
            : pools.map((pool) => <YieldCard key={pool.address} pool={pool} />)}
        </div>

        {/* My Launches */}
        <h2 className="text-white text-2xl font-bold mb-4">My Token Launches</h2>
        {launches.length === 0 ? (
          <GlassCard className="p-8 text-center">
            <p className="text-gray-400 mb-4">No tokens launched yet.</p>
            <Link
              to="/launch"
              className="bg-gradient-to-r from-purple-600 to-purple-800 rounded-xl px-6 py-3 text-white font-bold inline-block hover:-translate-y-0.5 transition-transform"
            >
              🚀 Launch Your First Token
            </Link>
          </GlassCard>
        ) : (
          <div className="grid md:grid-cols-2 gap-4 mb-10">
            {launches.map((t, i) => <TokenCard key={i} token={t} />)}
          </div>
        )}

        {/* Tx History */}
        {txHistory.length > 0 && (
          <>
            <h2 className="text-white text-2xl font-bold mb-4">Transaction History</h2>
            <div className="space-y-2">
              {txHistory.slice(0, 10).map((tx, i) => (
                <GlassCard key={i} className="p-4 flex justify-between items-center">
                  <div>
                    <p className="text-white font-bold capitalize">{tx.type}</p>
                    <p className="text-gray-500 text-xs">{new Date(tx.timestamp).toLocaleString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-cyan-400 font-bold">{tx.amount} SOL</p>
                    <a
                      href={`https://explorer.solana.com/tx/${tx.txId}?cluster=devnet`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-500 text-xs hover:text-white"
                    >
                      Explorer →
                    </a>
                  </div>
                </GlassCard>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}