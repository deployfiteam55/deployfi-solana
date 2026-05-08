const STATUS_CONFIG = {
  approving:  { icon: '🔐', text: 'Waiting for wallet approval...', color: 'text-yellow-400', bg: 'border-yellow-500/30' },
  processing: { icon: '⛓️',  text: 'Processing on Solana...',        color: 'text-blue-400',   bg: 'border-blue-500/30' },
  success:    { icon: '✅',  text: 'Transaction confirmed!',          color: 'text-green-400',  bg: 'border-green-500/30' },
  failed:     { icon: '❌',  text: 'Transaction failed. Try again.',  color: 'text-red-400',    bg: 'border-red-500/30' },
}

export default function TxStatus({ status, txId }) {
  if (!status) return null
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.failed
  return (
    <div className={`mt-6 max-w-lg mx-auto bg-white/5 border ${cfg.bg} rounded-xl p-4 text-center`}>
      <span className="text-2xl">{cfg.icon}</span>
      <p className={`${cfg.color} font-bold mt-1`}>{cfg.text}</p>
      {status === 'success' && txId && (
        <a
          href={`https://explorer.solana.com/tx/${txId}?cluster=devnet`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-400 text-xs mt-2 block hover:text-white transition-colors"
        >
          View on Solana Explorer →
        </a>
      )}
    </div>
  )
}