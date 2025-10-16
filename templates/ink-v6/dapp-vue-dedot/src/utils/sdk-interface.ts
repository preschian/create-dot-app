import type { Wallet } from '@talismn/connect-wallets'
import type { InjectedSigner } from 'dedot/types'
import type { Prefix } from './sdk'
import { getWalletBySource } from '@talismn/connect-wallets'
import { formatBalance } from 'dedot/utils'
import { name } from '../../package.json'
import sdk from './sdk'

export const DAPP_NAME = name

export async function getClient(chainPrefix: Prefix) {
  const { api: apiInstance } = sdk(chainPrefix)
  return await apiInstance
}

export async function polkadotSigner(wallet: Wallet | null): Promise<InjectedSigner | undefined> {
  if (!wallet)
    return undefined

  const selectedWallet = getWalletBySource(wallet.extensionName)
  await selectedWallet?.enable(DAPP_NAME)

  return selectedWallet?.signer
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
