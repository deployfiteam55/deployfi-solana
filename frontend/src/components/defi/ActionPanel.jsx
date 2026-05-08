import { useLivePrice } from '../../hooks/useLivePrice'

export default function ActionPanel({ selected, amount, setAmount, onExecute, loading }) {
  const { price } = useLivePrice()
  const usdValue  = price && amount ? (parseFloat(amount) * parseFloat(price.price)).toFixed(2) : '0.00'

  return (
    <div className="max-w-lg mx-auto bg-white/5 border border-purple-800/30 rounded-2xl p-6">
      <h3 className="text-white font-bold mb-4 capitalize">{selected?.replace('_', ' ')} — Enter Amount</h3>
      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="Enter SOL amount"
        min="0"
        step="0.01"
        className="w-full bg-white/10 rounded-xl px-4 py-3 text-white text-xl font-bold
                   outline-none border border-purple-800/40 focus:border-purple-500 mb-2 transition-colors"
      />
      <p className="text-gray-400 text-sm mb-6">≈ ${usdValue} USD</p>

      <button
        onClick={onExecute}
        disabled={loading || !amount || parseFloat(amount) <= 0}
        className="w-full bg-gradient-to-r from-purple-600 to-cyan-500 rounded-xl py-4
                   text-white font-black text-lg hover:-translate-y-1 transition-transform
                   disabled:opacity-50 disabled:cursor-not-allowed disabled:translate-y-0"
      >
        {loading ? '⏳ Processing...' : '⚡ One Click Execute'}
      </button>
    </div>
  )
}