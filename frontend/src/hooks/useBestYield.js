import { useState, useEffect } from 'react'
import { getBestYieldPools } from '../utils/kamino'

export const useBestYield = () => {
  const [pools, setPools] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await getBestYieldPools()
        setPools(data)
      } catch (e) {
        console.error('Yield fetch error:', e)
        // fallback mock
        setPools([{ name: 'SOL-USDC', apy: '12.50', token: 'SOL', address: 'mock' }])
      } finally {
        setLoading(false)
      }
    }
    fetch()
  }, [])

  return { pools, loading, best: pools[0] || null }
}