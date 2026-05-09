
// Kamino Finance — Yield Aggregator
export const getBestYieldPools = async () => {
  const res = await fetch('https://api.kamino.finance/strategies?status=LIVE')
  if (!res.ok) throw new Error('Kamino API error')
  const data = await res.json()
  
  return data
    .filter((pool) => pool.apy && parseFloat(pool.apy) > 0)
    .sort((a, b) => parseFloat(b.apy) - parseFloat(a.apy))
    .slice(0, 5)
    .map((pool) => ({
      name: pool.strategyName || pool.address?.slice(0, 8) + '...',
      apy:  parseFloat(pool.apy || 0).toFixed(2),
      token: pool.tokenAMint?.slice(0, 6) || 'SOL',
      address: pool.address,
    }))
}

// Deposit into Kamino strategy
export const depositToKamino = async (connection, wallet, strategyAddress, amount) => {
  console.log('Depositing', amount, 'to strategy', strategyAddress)
  throw new Error('Kamino deposit requires full SDK integration — see https://docs.kamino.finance')
}