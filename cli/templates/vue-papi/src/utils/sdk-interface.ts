import type { Prefix } from '~/utils/sdk'
import { Binary, FixedSizeBinary } from 'polkadot-api'
import sdk from '~/utils/sdk'
import { formatPrice } from './formatters'

export async function getIdentity(address: string) {
  const { api } = sdk('people')
  const identity = await api.query.Identity.IdentityOf.getValue(address)

  return identity?.info.display.value instanceof FixedSizeBinary
    ? identity.info.display.value.asText()
    : undefined
}

export async function getTokenDetail(collection: number, token: number, metadata: string) {
  const { api, client } = sdk('asset_hub')
  const [getMetadata, queryOwner, queryPrice] = await Promise.all([
    fetch(metadata).then(res => res.json()),
    api.query.Nfts.Item.getValue(collection, token),
    api.query.Nfts.ItemPriceOf.getValue(collection, token),
  ])

  let price = queryPrice?.[0]?.toString()

  if (price) {
    const chainSpec = await client.getChainSpecData()
    const tokenDecimals = chainSpec.properties.tokenDecimals
    price = formatPrice(price, tokenDecimals)
  }

  return {
    tokenOwner: queryOwner?.owner,
    tokenPrice: price,
    tokenMetadata: getMetadata,
  }
}

export async function getCollectionDetail(collection: number) {
  const { api } = sdk('asset_hub')

  const [queryMetadata, queryOwner, queryPrice, queryCollectionMetadata] = await Promise.all([
    api.query.Nfts.ItemMetadataOf.getEntries(collection),
    api.query.Nfts.Item.getEntries(collection),
    api.query.Nfts.ItemPriceOf.getEntries(collection),
    api.query.Nfts.CollectionMetadataOf.getValue(collection),
  ])

  const collectionItems = queryMetadata
    .sort((a, b) => a.keyArgs[1] - b.keyArgs[1])
    .map(item => ({
      collection: item.keyArgs[0],
      token: item.keyArgs[1],
      metadata: item.value.data.asText(),
    }))

  const collectionOwners = new Set(queryOwner.map(item => item.value.owner))
  const collectionListed = queryPrice.length

  return {
    collectionItems,
    collectionOwners,
    collectionListed,
    metadataUrl: queryCollectionMetadata?.data.asText(),
  }
}

export function subscribeToBlocks(
  networkKey: Prefix,
  onBlock: (data: { blockHeight: number, chainName: string }) => void,
) {
  const { client } = sdk(networkKey)

  client.blocks$.subscribe(async (block) => {
    onBlock({
      blockHeight: block.number,
      chainName: await client.getChainSpecData().then(data => data.name),
    })
  })
}

export function createRemarkTransaction(
  chainPrefix: Prefix,
  message: string,
  signer: any,
  callbacks: {
    onTxHash: (hash: string) => void
    onFinalized: () => void
    onError: (error: string) => void
  },
) {
  const { api } = sdk(chainPrefix)

  const remark = Binary.fromText(message)
  const tx = api.tx.System.remark({ remark })

  tx.signSubmitAndWatch(signer).subscribe({
    next: (event) => {
      if (event.type === 'txBestBlocksState') {
        callbacks.onTxHash(event.txHash)
      }

      if (event.type === 'finalized') {
        callbacks.onFinalized()
      }
    },
    error: (err) => {
      callbacks.onError(err.message || 'Unknown error')
    },
  })
}
