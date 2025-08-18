import type { InjectedSigner } from 'dedot/types'
import type { Prefix } from '~/plugins/sdk.client'
import { getWalletBySource } from '@talismn/connect-wallets'

export function getSdk(chainPrefix: Prefix) {
  const { $sdk } = useNuxtApp()
  return $sdk(chainPrefix)
}

export async function polkadotSigner(): Promise<InjectedSigner | undefined> {
  const { connectedWallet } = useConnect()
  const wallet = getWalletBySource(connectedWallet?.value?.extensionName)
  await wallet?.enable('CDA')

  return wallet?.signer
}

export function subscribeToBlocks(
  networkKey: Prefix,
  onBlock: (data: { blockHeight: number, chainName: string }) => void,
) {
  const { api: apiInstance } = getSdk(networkKey)

  apiInstance.then((api) => {
    api.query.system.events(async () => {
      onBlock({
        blockHeight: await api.query.system.number(),
        chainName: await api.chainSpec.chainName(),
      })
    })
  })
}

export async function getBalance(chainPrefix: Prefix, address: string) {
  const { api: apiInstance } = getSdk(chainPrefix)
  const api = await apiInstance

  const balance = await api.query.system.account(address)
  const chainSpec = await api.chainSpec.properties()
  const tokenDecimals = chainSpec.tokenDecimals
  const tokenSymbol = chainSpec.tokenSymbol?.toString() || ''
  const freeBalance = formatPrice(balance.data.free.toString(), Number(tokenDecimals))

  return {
    balance: freeBalance,
    symbol: tokenSymbol,
  }
}

export function createRemarkTransaction(
  chainPrefix: Prefix,
  message: string,
  address = '',
  signer: InjectedSigner,
  callbacks: {
    onTxHash: (hash: string) => void
    onFinalized: () => void
    onError: (error: string) => void
  },
) {
  const { api: apiInstance } = getSdk(chainPrefix)

  apiInstance.then((api) => {
    api.tx.system.remark(message).signAndSend(address, { signer }, (result) => {
      if (result.status.type === 'BestChainBlockIncluded') {
        callbacks.onTxHash(result.status.value.blockHash)
      }

      if (result.status.type === 'Finalized') {
        callbacks.onFinalized()
      }
    }).catch((err) => {
      console.error(err, address)
      callbacks.onError(err.message || 'Unknown error')
    })
  })
}
