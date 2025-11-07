import type { PolkadotSigner } from 'polkadot-api'
import type { Prefix } from '~/plugins/sdk.client'
import { formatValue } from '@polkadot-api/react-components'
import { Binary } from 'polkadot-api'
import { connectInjectedExtension } from 'polkadot-api/pjs-signer'
import { name } from '../../package.json'

export const DAPP_NAME = name

export function getSdk(chainPrefix: Prefix) {
  const { $sdk } = useNuxtApp()
  return $sdk(chainPrefix)
}

export async function polkadotSigner() {
  const { connectedWallet, selectedAccount } = useConnect()
  const selectedExtension = await connectInjectedExtension(
    connectedWallet?.value?.extensionName || '',
  )
  const account = selectedExtension.getAccounts().find(account => account.address === selectedAccount?.value?.address)

  return account?.polkadotSigner
}

export async function subscribeToBlocks(
  networkKey: Prefix,
  onBlock: (data: { blockHeight: number, chainName: string }) => void,
) {
  const { client } = getSdk(networkKey)
  const chainName = await client.getChainSpecData().then(data => data.name)

  return client.blocks$.subscribe(async (block) => {
    onBlock({ blockHeight: block.number, chainName })
  })
}

export async function getBalance(chainPrefix: Prefix, address: string) {
  const { api, client } = getSdk(chainPrefix)

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
  const { api } = getSdk(chainPrefix)

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
