import GlassCard from '../ui/GlassCard'

export default function YieldCard({ pool }) {
  return (
    <GlassCard className="p-4 flex justify-between items-center hover:border-purple-500/40 transition-colors">
      <div>
        <p className="text-white font-bold">{pool.name}</p>
        <p className="text-gray-400 text-sm">{pool.token} Pool</p>
      </div>
      <div className="text-right">
        <p className="text-cyan-400 font-black text-xl">{pool.apy}%</p>
        <p className="text-gray-500 text-xs">APY</p>
      </div>
    </GlassCard>
  )
}