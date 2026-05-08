export default function ProgressBar({ value = 0, max = 100, label }) {
  const pct = Math.min(100, (value / max) * 100).toFixed(1)
  return (
    <div className="w-full">
      {label && (
        <div className="flex justify-between text-sm mb-1">
          <span className="text-gray-400">{label}</span>
          <span className="text-purple-400 font-bold">{pct}%</span>
        </div>
      )}
      <div className="w-full bg-white/10 rounded-full h-2">
        <div
          className="bg-gradient-to-r from-purple-600 to-cyan-500 h-2 rounded-full transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}