import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useLivePrice } from '../hooks/useLivePrice'
import { useBestYield } from '../hooks/useBestYield'

const features = [
  { icon: '🪙', title: 'Launch Tokens', desc: 'Create SPL tokens with metadata in one transaction. No code required.', link: '/launch' },
  { icon: '🔄', title: 'One-Click DeFi', desc: 'Swap via Jupiter, stake with Marinade, earn yield on Kamino — all in one click.', link: '/defi' },
  { icon: '📊', title: 'Live Dashboard', desc: 'Track your portfolio, token launches, and active yields in real time.', link: '/dashboard' },
]

export default function Home() {
  const { price }  = useLivePrice()
  const { best }   = useBestYield()

  return (
    <div className="min-h-screen bg-[#0D0818] text-white">
      {/* Hero */}
      <section className="pt-32 pb-20 px-8 text-center relative overflow-hidden">
        {/* Glow blobs */}
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 bg-purple-900/40 border border-purple-700/40 rounded-full px-4 py-1.5 text-sm text-purple-300 mb-6">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            Live on Solana Devnet
          </div>

          <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight">
            Launch · Swap · Deploy<br />
            <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
              On Solana
            </span>
          </h1>

          <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mb-10">
            DeployFi is your all-in-one DeFi launchpad. Create tokens, swap assets via Jupiter,
            earn yield on Kamino, and stake SOL with Marinade all in one click.
          </p>

          <div className="flex gap-4 justify-center flex-wrap">
            <Link
              to="/launch"
              className="bg-gradient-to-r from-purple-600 to-purple-800 rounded-xl px-8 py-4 font-bold text-lg hover:-translate-y-1 transition-transform shadow-lg shadow-purple-500/30"
            >
              🚀 Launch a Token
            </Link>
            <Link
              to="/defi"
              className="border border-purple-700 rounded-xl px-8 py-4 font-bold text-lg hover:bg-purple-900/30 transition-colors"
            >
              ⚡ Try DeFi
            </Link>
          </div>
        </motion.div>

        {/* Live stats bar */}
        <div className="flex gap-8 justify-center mt-16 flex-wrap">
          {[
            { label: 'SOL Price',    value: price ? `$${price.price}` : '...' },
            { label: 'Best APY',     value: best  ? `${best.apy}%`    : '...' },
            { label: 'Network',      value: 'Devnet' },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <p className="text-2xl font-black text-white">{s.value}</p>
              <p className="text-gray-500 text-sm">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="px-8 pb-24 max-w-5xl mx-auto">
        <div className="grid md:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.15 }}
            >
              <Link
                to={f.link}
                className="block bg-white/5 border border-purple-800/30 rounded-2xl p-6
                           hover:border-purple-500/50 hover:-translate-y-1 transition-all duration-200"
              >
                <div className="text-4xl mb-4">{f.icon}</div>
                <h3 className="text-white font-bold text-xl mb-2">{f.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{f.desc}</p>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  )
}
