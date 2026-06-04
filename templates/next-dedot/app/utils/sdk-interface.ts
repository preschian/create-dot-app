import type { InjectedSigner } from 'dedot/types'
import type { Prefix } from './sdk'
import { getWalletBySource } from '@talismn/connect-wallets'
import { formatBalance } from 'dedot/utils'
import { name } from '../../package.json'
import { connectedWallet } from '../hooks/use-connect'
import sdk from './sdk'

// Identifies this dapp to wallet extensions when requesting the signer. Defined
// here (rather than imported from use-connect) so the hook and the SDK layer
// don't form an import cycle.
const DAPP_NAME = name

export interface BlockUpdate {
  blockHeight: number
  blockHash: string
  finalized: number
  chainName: string
  tokenSymbol: string
}

// dedot types chain properties as `T | T[]` (some chains expose per-asset
// arrays); collapse to the single value the UI displays.
function first<T>(value: T | T[] | undefined): T | undefined {
  return Array.isArray(value) ? value[0] : value
}

export async function polkadotSigner(): Promise<InjectedSigner | undefined> {
  const wallet = getWalletBySource(connectedWallet.get()?.extensionName)
  await wallet?.enable(DAPP_NAME)

  return wallet?.signer
}

// Watch the chain head over the RPC connection. `block.best()` streams each new
// best block and `block.finalized()` the latest finalized one; both are folded
// into a single update so the UI can show the live height alongside the
// finalized depth.
export async function subscribeToBlocks(
  networkKey: Prefix,
  onBlock: (data: BlockUpdate) => void,
) {
  const { api: apiInstance } = sdk(networkKey)
  const api = await apiInstance

  const [chainName, properties] = await Promise.all([
    api.chainSpec.chainName(),
    api.chainSpec.properties(),
  ])
  const tokenSymbol = first(properties.tokenSymbol) ?? ''

  const state = { blockHeight: 0, blockHash: '', finalized: 0 }
  const emit = () => onBlock({ ...state, chainName, tokenSymbol })

  const unsubBest = api.block.best((block) => {
    state.blockHeight = block.number
    state.blockHash = block.hash
    emit()
  })
  const unsubFinalized = api.block.finalized((block) => {
    state.finalized = block.number
    emit()
  })

  return {
    unsubscribe: () => {
      unsubBest()
      unsubFinalized()
    },
  }
}

export async function getBalance(chainPrefix: Prefix, address: string) {
  const { api: apiInstance } = sdk(chainPrefix)
  const api = await apiInstance

  const [account, chainName, properties] = await Promise.all([
    api.query.system.account(address),
    api.chainSpec.chainName(),
    api.chainSpec.properties(),
  ])
  const tokenDecimals = Number(first(properties.tokenDecimals) ?? 0)
  const tokenSymbol = first(properties.tokenSymbol) ?? ''
  const freeBalance = formatBalance(account.data.free, {
    decimals: tokenDecimals,
    symbol: tokenSymbol,
  }).replace(tokenSymbol, '').trim()

  return {
    balance: freeBalance,
    symbol: tokenSymbol,
    chainName,
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
      if (typeof unsub === 'function')
        unsub()
    }
  }).catch((err) => {
    console.error(err, address)
    callbacks.onError(err.message || 'Unknown error')
  })
}
