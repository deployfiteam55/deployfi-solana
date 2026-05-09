
import { useState, useEffect } from 'react'
import { getBestYieldPools } from '../utils/kamino'

const FALLBACK = [{ name: 'SOL-USDC', apy: '12.50', token: 'SOL', address: 'mock' }]

export const useBestYield = () => {
  const [pools, setPools] = useState(FALLBACK)  // ← default mein mock
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await getBestYieldPools()
        if (data && data.length > 0) setPools(data)  // ← sirf tab update karo
      } catch (e) {
        console.error('Yield fetch error:', e)
        setPools(FALLBACK)
      } finally {
        setLoading(false)
      }
    }
    fetch()
  }, [])

  return { pools, loading, best: pools[0] || null }
}