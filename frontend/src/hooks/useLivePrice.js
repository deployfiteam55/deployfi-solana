import { useState, useEffect } from 'react'
import { getLiveSOLPrice } from '../utils/pyth'

export const useLivePrice = () => {
  const [price, setPrice] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await getLiveSOLPrice()
        setPrice(data)
      } catch (e) {
        console.error('Price fetch error:', e)
      } finally {
        setLoading(false)
      }
    }

    fetch()
    const interval = setInterval(fetch, 30000) // refresh every 30s
    return () => clearInterval(interval)
  }, [])

  return { price, loading }
}