// Kamino Finance — Yield Aggregator
export const getBestYieldPools = async () => {
  const res = await fetch('https://api.kamino.finance/strategies?status=LIVE')
  if (!res.ok) throw new Error('Kamino API error')
  const data = await res.json()
  return data
    .filter((pool) => pool.tokenA === 'USDC' || pool.tokenA === 'SOL')
    .sort((a, b) => b.apy - a.apy)
    .slice(0, 5)
    .map((pool) => ({
      name: pool.strategyName,
      apy: parseFloat(pool.apy).toFixed(2),
      token: pool.tokenA,
      address: pool.strategy,
    }))
}

// Deposit into Kamino strategy
export const depositToKamino = async (connection, wallet, strategyAddress, amount) => {
  // Kamino SDK deposit — requires @kamino-finance/klend-sdk in full integration
  // For now returns a mock tx until SDK is fully integrated
  console.log('Depositing', amount, 'to strategy', strategyAddress)
  throw new Error('Kamino deposit requires full SDK integration — see https://docs.kamino.finance')
}