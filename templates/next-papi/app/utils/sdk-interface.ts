import type { PolkadotSigner } from 'polkadot-api'
import type { Prefix } from '../utils/sdk'
import { formatValue } from '@polkadot-api/react-components'
import { Binary } from 'polkadot-api'
import { connectInjectedExtension } from 'polkadot-api/pjs-signer'
import { name } from '../../package.json'
import { connectedWallet, selectedAccount } from '../hooks/use-connect'
import sdk from '../utils/sdk'

export const DAPP_NAME = name

export interface BlockUpdate {
  blockHeight: number
  blockHash: string
  finalized: number
  chainName: string
  tokenSymbol: string
}

export async function polkadotSigner() {
  const selectedExtension = await connectInjectedExtension(
    connectedWallet.get()?.extensionName || '',
  )
  const account = selectedExtension.getAccounts().find(account => account.address === selectedAccount.get()?.address)

  return account?.polkadotSigner
}

// Watch the chain head through the light client. `blocks$` emits each new best
// block and `finalizedBlock$` the latest finalized one; both are folded into a
// single update so the UI can show the live height alongside the finalized depth.
export async function subscribeToBlocks(
  networkKey: Prefix,
  onBlock: (data: BlockUpdate) => void,
) {
  const { client } = sdk(networkKey)
  const chainSpec = await client.getChainSpecData()
  const chainName = chainSpec.name
  const tokenSymbol = chainSpec.properties.tokenSymbol

  const state = { blockHeight: 0, blockHash: '', finalized: 0 }
  const emit = () => onBlock({ ...state, chainName, tokenSymbol })

  const bestSub = client.blocks$.subscribe((block) => {
    state.blockHeight = block.number
    state.blockHash = block.hash
    emit()
  })
  const finalizedSub = client.finalizedBlock$.subscribe((block) => {
    state.finalized = block.number
    emit()
  })

  return {
    unsubscribe: () => {
      bestSub.unsubscribe()
      finalizedSub.unsubscribe()
    },
  }
}

export async function getBalance(chainPrefix: Prefix, address: string) {
  const { api, client } = sdk(chainPrefix)

  const [balance, chainSpec] = await Promise.all([
    api.query.System.Account.getValue(address),
    client.getChainSpecData(),
  ])
  const tokenDecimals = chainSpec.properties.tokenDecimals
  const tokenSymbol = chainSpec.properties.tokenSymbol
  const freeBalance = formatValue(balance.data.free, tokenDecimals)

  return {
    balance: freeBalance,
    symbol: tokenSymbol,
    chainName: chainSpec.name,
  }
}

export function createRemarkTransaction(
  chainPrefix: Prefix,
  message: string,
  address = '',
  signer: PolkadotSigner,
  callbacks: {
    onTxHash: (hash: string) => void
    onFinalized: () => void
    onError: (error: string) => void
  },
) {
  const { api } = sdk(chainPrefix)

  const remark = Binary.fromText(message)
  const tx = api.tx.System.remark({ remark })

  const unsub = tx.signSubmitAndWatch(signer).subscribe({
    next: (event) => {
      if (event.type === 'txBestBlocksState' && event.found) {
        callbacks.onTxHash(event.txHash)
      }

      if (event.type === 'finalized') {
        callbacks.onFinalized()
        unsub.unsubscribe()
      }
    },
    error: (err) => {
      unsub.unsubscribe()
      console.error(err, address)
      callbacks.onError(err.message || 'Unknown error')
    },
  })
}
