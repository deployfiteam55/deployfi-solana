import { NFTStorage, File } from 'nft.storage'

// Get your API key from https://nft.storage
const NFT_STORAGE_KEY = import.meta.env.VITE_NFT_STORAGE_KEY || ''

export const uploadTokenToIPFS = async (imageFile, tokenInfo) => {
  if (!NFT_STORAGE_KEY) {
    // Dev fallback — returns a placeholder URI so the UI flow works
    console.warn('VITE_NFT_STORAGE_KEY not set — using placeholder URI')
    return `https://arweave.net/placeholder-${Date.now()}`
  }

  const client = new NFTStorage({ token: NFT_STORAGE_KEY })
  const metadata = await client.store({
    name: tokenInfo.name,
    symbol: tokenInfo.symbol,
    description: tokenInfo.description || `${tokenInfo.name} token on Solana`,
    image: new File([imageFile], 'token.png', { type: 'image/png' }),
    properties: {
      totalSupply: tokenInfo.supply,
      price: tokenInfo.price,
    },
  })
  return metadata.url // ipfs://bafyrei...
}