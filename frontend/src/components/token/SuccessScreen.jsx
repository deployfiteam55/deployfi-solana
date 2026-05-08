import { Link } from 'react-router-dom'

export default function SuccessScreen({ txId, mintAddress, onReset }) {
  return (
    <div className="min-h-screen bg-[#0D0818] flex items-center justify-center px-8">
      <div className="text-center max-w-lg">
        <div className="text-7xl mb-6 animate-bounce">🎉</div>
        <h1 className="text-4xl font-black text-white mb-3">Token Launched!</h1>
        <p className="text-gray-400 mb-8">Your token is live on Solana devnet.</p>

        {txId && (
          <div className="bg-white/5 border border-green-500/30 rounded-xl p-4 mb-4 text-left">
            <p className="text-gray-400 text-xs mb-1">Transaction ID</p>
            <a
              href={`https://explorer.solana.com/tx/${txId}?cluster=devnet`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-green-400 text-sm font-mono break-all hover:underline"
            >
              {txId}
            </a>
          </div>
        )}

        {mintAddress && (
          <div className="bg-white/5 border border-purple-500/30 rounded-xl p-4 mb-8 text-left">
            <p className="text-gray-400 text-xs mb-1">Mint Address</p>
            <a
              href={`https://explorer.solana.com/address/${mintAddress}?cluster=devnet`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-purple-400 text-sm font-mono break-all hover:underline"
            >
              {mintAddress}
            </a>
          </div>
        )}

        <div className="flex gap-4 justify-center">
          <button
            onClick={onReset}
            className="bg-white/10 hover:bg-white/20 text-white rounded-xl px-6 py-3 font-bold transition-colors"
          >
            Launch Another
          </button>
          <Link
            to="/dashboard"
            className="bg-gradient-to-r from-purple-600 to-cyan-500 text-white rounded-xl px-6 py-3 font-bold"
          >
            View Dashboard
          </Link>
        </div>
      </div>
    </div>
  )
}