import type { Wallet, WalletAccount } from '@talismn/connect-wallets'
import { getWallets } from '@talismn/connect-wallets'
import { connectInjectedExtension } from 'polkadot-api/pjs-signer'
import { computed, ref } from 'vue'

const selectedAccount = ref<WalletAccount | null>(null)
const connectedWallet = ref<Wallet | null>(null)
const listAccounts = ref<WalletAccount[]>([])
const isConnecting = ref<string | null>(null)

export function useConnect() {
  const wallets = computed(() => getWallets())

  const installedWallets = computed(() =>
    wallets.value.filter(wallet => wallet.installed),
  )

  const availableWallets = computed(() =>
    wallets.value.filter(wallet => !wallet.installed),
  )

  async function connect(wallet: Wallet) {
    try {
      isConnecting.value = wallet.extensionName
      listAccounts.value = []
      connectedWallet.value = wallet

      await wallet.enable('CDA')

      const unsubscribe = await wallet.subscribeAccounts((accounts) => {
        if (accounts) {
          accounts.forEach((account) => {
            if (!listAccounts.value.some(a => a.address === account.address)) {
              listAccounts.value.push(account)
            }
          })
        }
      })

      isConnecting.value = null
      return unsubscribe
    }
    catch (err) {
      console.error(err)
      isConnecting.value = null
      connectedWallet.value = null
    }
  }

  function disconnect() {
    selectedAccount.value = null
    connectedWallet.value = null
    listAccounts.value = []
  }

  function selectAccount(account: WalletAccount) {
    selectedAccount.value = account
  }

  return {
    // State
    listAccounts,
    selectedAccount,
    connectedWallet,
    isConnecting,
    wallets,
    installedWallets,
    availableWallets,

    // Actions
    connect,
    disconnect,
    selectAccount,
  }
}

export async function polkadotSigner() {
  const selectedExtension = await connectInjectedExtension(
    connectedWallet.value?.extensionName || '',
  )
  const account = selectedExtension.getAccounts().find(account => account.address === selectedAccount.value?.address)

  return account?.polkadotSigner
}
