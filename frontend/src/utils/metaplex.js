import { Metaplex, walletAdapterIdentity } from '@metaplex-foundation/js'

// Attach on-chain metadata to a minted token using Metaplex
export const attachMetadata = async (connection, wallet, mintAddress, metadataUri, tokenName) => {
  const metaplex = Metaplex.make(connection).use(walletAdapterIdentity(wallet))

  const { nft } = await metaplex.nfts().create({
    uri: metadataUri,
    name: tokenName,
    sellerFeeBasisPoints: 0,
    useExistingMint: mintAddress,
  })

  return nft
}