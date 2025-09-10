import type { InjectedSigner } from 'dedot/types'
import type { Prefix } from './sdk'
import { getWalletBySource } from '@talismn/connect-wallets'
import { connectedWallet } from '../hooks/useConnect'
import sdk from './sdk'
import { name } from '../../package.json'
import { formatBalance } from 'dedot/utils'

export const DAPP_NAME = name

export async function polkadotSigner(): Promise<InjectedSigner | undefined> {
  const wallet = getWalletBySource(connectedWallet.get()?.extensionName)
  await wallet?.enable(DAPP_NAME)

  return wallet?.signer
}

export async function subscribeToBlocks(
  networkKey: Prefix,
  onBlock: (data: { blockHeight: number, chainName: string }) => void,
) {
  const { api: apiInstance } = sdk(networkKey)
  const api = await apiInstance
  const chainName = await api.chainSpec.chainName()

  const unsub = await api.query.system.number(async (blockHeight) => {
    onBlock({ blockHeight, chainName })
  })
  return unsub
}

export async function getBalance(chainPrefix: Prefix, address: string) {
  const { api: apiInstance } = sdk(chainPrefix)
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
  const { api: apiInstance } = sdk(chainPrefix)
  const api = await apiInstance

  const unsub = await api.tx.system.remark(message).signAndSend(address, { signer }, (result) => {
    if (result.status.type === 'BestChainBlockIncluded') {
      callbacks.onTxHash(result.txHash)
    }

    if (result.status.type === 'Finalized') {
      callbacks.onFinalized()
      if (typeof unsub === 'function') unsub()
    }
  }).catch((err) => {
    console.error(err, address)
    callbacks.onError(err.message || 'Unknown error')
  })
}
