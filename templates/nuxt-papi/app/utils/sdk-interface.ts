import type { PolkadotSigner } from 'polkadot-api'
import type { Prefix } from '~/plugins/sdk.client'
import { Binary } from 'polkadot-api'
import { connectInjectedExtension } from 'polkadot-api/pjs-signer'

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
  const { client } = await getSdk(networkKey)

  client.blocks$.subscribe(async (block) => {
    onBlock({
      blockHeight: block.number,
      chainName: await client.getChainSpecData().then(data => data.name),
    })
  })
}

export async function getBalance(chainPrefix: Prefix, address: string) {
  const { api, client } = await getSdk(chainPrefix)
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

export async function createRemarkTransaction(
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
  const { api } = await getSdk(chainPrefix)

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
