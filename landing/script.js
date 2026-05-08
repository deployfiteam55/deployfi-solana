// Fetch live SOL price from Pyth
const SOL_FEED = '0xef0d8b6fda2ceba41da15d4095d1da392a0d2f8ed0c6c7bc0f4cfac8c280b56d'

async function updateSOLPrice() {
  try {
    const res  = await fetch(`https://hermes.pyth.network/api/latest_price_feeds?ids[]=${SOL_FEED}`)
    const data = await res.json()
    const raw  = data[0].price
    const price = (raw.price * Math.pow(10, raw.expo)).toFixed(2)
    document.getElementById('sol-price').textContent = `$${price}`
  } catch {
    document.getElementById('sol-price').textContent = '—'
  }
}

updateSOLPrice()
setInterval(updateSOLPrice, 30000)

// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach((a) => {
  a.addEventListener('click', (e) => {
    const target = document.querySelector(a.getAttribute('href'))
    if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth' }) }
  })
})