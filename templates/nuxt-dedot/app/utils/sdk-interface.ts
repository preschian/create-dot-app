import type { InjectedSigner } from 'dedot/types'
import type { Prefix } from '~/plugins/sdk.client'
import { getWalletBySource } from '@talismn/connect-wallets'
import { formatBalance } from 'dedot/utils'
import { name } from '../../package.json'

export const DAPP_NAME = name

export function getSdk(chainPrefix: Prefix) {
  const { $sdk } = useNuxtApp()
  return $sdk(chainPrefix)
}

export async function polkadotSigner(): Promise<InjectedSigner | undefined> {
  const { connectedWallet } = useConnect()
  const wallet = getWalletBySource(connectedWallet?.value?.extensionName)
  await wallet?.enable(DAPP_NAME)

  return wallet?.signer
}

export async function subscribeToBlocks(
  networkKey: Prefix,
  onBlock: (data: { blockHeight: number, chainName: string }) => void,
) {
  const { api: apiInstance } = getSdk(networkKey)
  const api = await apiInstance
  const chainName = await api.chainSpec.chainName()

  const unsub = await api.query.system.number(async (blockHeight) => {
    onBlock({ blockHeight, chainName })
  })
  return unsub
}

export async function getBalance(chainPrefix: Prefix, address: string) {
  const { api: apiInstance } = getSdk(chainPrefix)
  const api = await apiInstance

  const [balance, chainSpec] = await Promise.all([
    api.query.system.account(address),
    api.chainSpec.properties(),
  ])
  const tokenDecimals = chainSpec.tokenDecimals
  const tokenSymbol = chainSpec.tokenSymbol?.toString() || ''
  const freeBalance = formatBalance(balance.data.free.toString(), {
    decimals: Number(tokenDecimals),
    symbol: tokenSymbol,
  })

  return {
    balance: freeBalance,
    symbol: tokenSymbol,
  }
}

export async function createRemarkTransaction(
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
  const api = await apiInstance

  const unsub = await api.tx.system.remark(message).signAndSend(address, { signer }, (result) => {
    if (result.status.type === 'BestChainBlockIncluded') {
      callbacks.onTxHash(result.txHash)
    }

    if (result.status.type === 'Finalized') {
      callbacks.onFinalized()
      typeof unsub === 'function' && unsub()
    }
  }).catch((err) => {
    typeof unsub === 'function' && unsub()
    console.error(err, address)
    callbacks.onError(err.message || 'Unknown error')
  })
}
