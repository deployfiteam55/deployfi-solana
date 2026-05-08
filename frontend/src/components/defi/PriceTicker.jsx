import { useLivePrice } from '../../hooks/useLivePrice'
import { useBestYield } from '../../hooks/useBestYield'

export default function PriceTicker() {
  const { price } = useLivePrice()
  const { best }  = useBestYield()

  return (
    <div className="bg-purple-900/20 border border-purple-800/30 rounded-xl p-3 mb-8 text-center flex items-center justify-center gap-6 flex-wrap">
      <span className="text-cyan-400 font-bold">
        SOL: ${price?.price ?? '...'} <span className="text-green-400 text-xs">LIVE</span>
      </span>
      <span className="text-gray-600 hidden sm:block">|</span>
      <span className="text-green-400 font-bold">
        Best APY: {best?.apy ?? '...'}% via {best?.name ?? 'Kamino'}
      </span>
      <span className="text-gray-600 hidden sm:block">|</span>
      <span className="text-purple-400 font-bold">
        mSOL Staking: ~7.8% via Marinade
      </span>
    </div>
  )
}