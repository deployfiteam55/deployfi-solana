import { useBestYield } from '../../hooks/useBestYield'

const GOALS = (bestApy) => [
  { id: 'yield',     icon: '🌾', title: 'Earn Yield',   sub: `${bestApy ?? '...'}% APY via Kamino` },
  { id: 'swap',      icon: '🔄', title: 'Swap Tokens',  sub: 'Best rate via Jupiter' },
  { id: 'stake',     icon: '🔒', title: 'Stake SOL',    sub: '~7.8% APY via Marinade' },
  { id: 'diversify', icon: '📊', title: 'Diversify',    sub: 'Split portfolio auto' },
]

export default function GoalPicker({ selected, onSelect }) {
  const { best } = useBestYield()
  const goals = GOALS(best?.apy)

  return (
    <div className="grid grid-cols-2 gap-4 max-w-2xl mx-auto mb-8">
      {goals.map((goal) => (
        <div
          key={goal.id}
          onClick={() => onSelect(goal.id)}
          className={`cursor-pointer rounded-2xl p-6 border-2 transition-all duration-200
            ${selected === goal.id
              ? 'border-purple-500 bg-purple-900/30 scale-105 shadow-lg shadow-purple-500/20'
              : 'border-white/10 bg-white/5 hover:border-purple-800'}`}
        >
          <div className="text-4xl mb-3">{goal.icon}</div>
          <h3 className="text-white font-bold text-lg">{goal.title}</h3>
          <p className="text-gray-400 text-sm">{goal.sub}</p>
        </div>
      ))}
    </div>
  )
}