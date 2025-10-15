import type { InjectedSigner } from 'dedot/types'
import type { Prefix } from './sdk'
import { getWalletBySource } from '@talismn/connect-wallets'
import { formatBalance } from 'dedot/utils'
import { connectedWallet } from '~/composables/useConnect'
import { name } from '../../package.json'
import sdk from './sdk'

export const DAPP_NAME = name

export async function getClient(chainPrefix: Prefix) {
  const { api: apiInstance } = sdk(chainPrefix)
  return await apiInstance
}

export async function polkadotSigner(): Promise<InjectedSigner | undefined> {
  const wallet = getWalletBySource(connectedWallet.value?.extensionName)
  await wallet?.enable(DAPP_NAME)

  return wallet?.signer
}

export async function subscribeToBlocks(
  networkKey: Prefix,
  onBlock: (data: { blockHeight: number, chainName: string }) => void,
) {
  const api = await getClient(networkKey)
  const chainName = await api.chainSpec.chainName()

  const unsub = await api.query.system.number(async (blockHeight) => {
    onBlock({ blockHeight, chainName })
  })

  return unsub
}

export async function getBalance(chainPrefix: Prefix, address: string) {
  const api = await getClient(chainPrefix)

  const [balance, chainSpec] = await Promise.all([
    api.query.system.account(address),
    api.chainSpec.properties(),
  ])
  const tokenDecimals = chainSpec.tokenDecimals
  const tokenSymbol = chainSpec.tokenSymbol?.toString() || ''
  const freeBalance = formatBalance(balance.data.free.toString(), {
    decimals: Number(tokenDecimals),
    symbol: tokenSymbol,
  }).replace(tokenSymbol, '')

  return {
    balance: freeBalance,
    symbol: tokenSymbol,
  }
}
