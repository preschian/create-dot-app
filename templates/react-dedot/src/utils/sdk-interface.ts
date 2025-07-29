import type { Prefix } from '../utils/sdk'
import { Binary } from 'polkadot-api'
import { connectInjectedExtension } from 'polkadot-api/pjs-signer'
import { connectedWallet, selectedAccount } from '../hooks/useConnect' // Adjusted for React
import sdk from '../utils/sdk'
import { formatPrice } from './formatters'

export async function polkadotSigner() {
  const selectedExtension = await connectInjectedExtension(
    connectedWallet.get()?.extensionName || '',
  )
  const account = selectedExtension.getAccounts().find(account => account.address === selectedAccount.get()?.address)

  return account?.polkadotSigner
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

export async function getBalance(chainPrefix: Prefix, address: string) {
  const { api, client } = sdk(chainPrefix)
  const balance = await api.query.System.Account.getValue(address)
  const chainSpec = await client.getChainSpecData()
  const tokenDecimals = chainSpec.properties.tokenDecimals
  const tokenSymbol = chainSpec.properties.tokenSymbol
  const freeBalance = formatPrice(balance.data.free.toString(), tokenDecimals)

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
      if (event.type === 'txBestBlocksState' && event.found) {
        callbacks.onTxHash(event.block.hash.toString())
      }

      if (event.type === 'finalized') {
        callbacks.onFinalized()
      }
    },
    error: (err) => {
      console.error(err, address)
      callbacks.onError(err.message || 'Unknown error')
    },
  })
}
