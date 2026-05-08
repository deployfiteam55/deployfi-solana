import GlassCard from '../ui/GlassCard'
import ProgressBar from '../ui/ProgressBar'

export default function TokenCard({ token }) {
  const { name, symbol, supply, sold = 0, price, image } = token
  return (
    <GlassCard className="p-5 hover:border-purple-500/50 transition-colors">
      <div className="flex gap-4 items-center mb-4">
        {image
          ? <img src={image} alt={name} className="w-14 h-14 rounded-xl object-cover" />
          : <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-600 to-cyan-500 flex items-center justify-center text-white font-black text-lg">{symbol?.[0]}</div>
        }
        <div>
          <h3 className="text-white font-black text-lg">{name}</h3>
          <p className="text-gray-400 text-sm">${symbol}</p>
        </div>
      </div>
      <ProgressBar value={sold} max={supply} label="Sold" />
      <div className="flex justify-between mt-3 text-sm">
        <span className="text-gray-400">Price</span>
        <span className="text-cyan-400 font-bold">{price} SOL</span>
      </div>
    </GlassCard>
  )
}