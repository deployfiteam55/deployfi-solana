import { SOL_PRICE_FEED_ID } from '../constants/addresses'

export const getLiveSOLPrice = async () => {
  const res = await fetch(
    `https://hermes.pyth.network/api/latest_price_feeds?ids[]=${SOL_PRICE_FEED_ID}`
  )
  if (!res.ok) throw new Error('Pyth API error')
  const data = await res.json()
  const raw = data[0].price
  return {
    price: (raw.price * Math.pow(10, raw.expo)).toFixed(2),
    conf:  (raw.conf  * Math.pow(10, raw.expo)).toFixed(4),
    timestamp: raw.publish_time,
  }
}