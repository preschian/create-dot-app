import type { Prefix } from './sdk'
import { hexToString } from 'dedot/utils'
import { formatPrice } from './formatters'
import sdk from './sdk'

export async function getIdentity(address: string) {
  const { api: apiInstance } = sdk('people')
  const api = await apiInstance
  const identity = await api.query.identity.identityOf(address)

  if (identity?.info.display.type !== 'Raw')
    return undefined

  const display = identity.info.display.value
  return typeof display === 'string' ? display : hexToString(display)
}

export async function getTokenDetail(collection: number, token: number, metadata: string) {
  const { api: apiInstance } = sdk('asset_hub')
  const api = await apiInstance

  const [getMetadata, queryOwner, queryPrice] = await Promise.all([
    fetch(metadata).then(res => res.json()),
    api.query.nfts.item([collection, token]),
    api.query.nfts.itemPriceOf([collection, token]),
  ])

  let price = queryPrice?.[0]?.toString()

  if (price) {
    const chainSpec = await api.chainSpec.properties()
    const tokenDecimals = Number(chainSpec.tokenDecimals)
    price = formatPrice(price, tokenDecimals)
  }

  return {
    tokenOwner: queryOwner?.owner.raw.toString(),
    tokenPrice: price,
    tokenMetadata: getMetadata,
  }
}

export async function getCollectionDetail(collection: number) {
  const { api: apiInstance } = sdk('asset_hub')
  const api = await apiInstance

  const [queryMetadata, queryOwner, queryPrice, queryCollectionMetadata] = await Promise.all([
    api.query.nfts.itemMetadataOf.entries(collection),
    api.query.nfts.item.entries(collection),
    api.query.nfts.itemPriceOf.entries(collection),
    api.query.nfts.collectionMetadataOf(collection),
  ])

  const collectionItems = queryMetadata
    .sort((a, b) => a[0][1] - b[0][1])
    .map(item => ({
      collection: item[0][0],
      token: item[0][1],
      metadata: hexToString(item[1].data),
    }))

  const collectionOwners = new Set(queryOwner.map(item => item[1].owner.raw.toString()))
  const collectionListed = queryPrice.length

  return {
    collectionItems,
    collectionOwners,
    collectionListed,
    metadataUrl: hexToString(queryCollectionMetadata?.data || ''),
  }
}

export function subscribeToBlocks(
  networkKey: Prefix,
  onBlock: (data: { blockHeight: number, chainName: string }) => void,
) {
  const { api: apiInstance } = sdk(networkKey)

  apiInstance.then((api) => {
    api.query.system.events(async () => {
      onBlock({
        blockHeight: await api.query.system.number(),
        chainName: await api.chainSpec.chainName(),
      })
    })
  })
}

export function createRemarkTransaction(
  chainPrefix: Prefix,
  message: string,
  address: string,
  signer: any,
  callbacks: {
    onTxHash: (hash: string) => void
    onFinalized: () => void
    onError: (error: string) => void
  },
) {
  const { api: apiInstance } = sdk(chainPrefix)

  apiInstance.then((api) => {
    api.tx.system.remark(message).signAndSend(address, { signer }, (result) => {
      if (result.status.type === 'BestChainBlockIncluded') {
        callbacks.onTxHash(result.status.value.blockHash)
      }

      if (result.status.type === 'Finalized') {
        callbacks.onFinalized()
      }
    }).catch((err) => {
      callbacks.onError(err.message || 'Unknown error')
    })
  })
}
