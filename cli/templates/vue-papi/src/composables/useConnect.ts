import type { Wallet, WalletAccount } from '@talismn/connect-wallets'
import { getWallets } from '@talismn/connect-wallets'
import { connectInjectedExtension } from 'polkadot-api/pjs-signer'
import { ref } from 'vue'

const selectedAccount = ref<WalletAccount | null>(null)
const connectedWallet = ref<Wallet | null>(null)
const listAccounts = ref<WalletAccount[]>([])
const isConnecting = ref<string | null>(null)

export function useConnect() {
  const wallets = getWallets()
  const installedWallets = wallets.filter(wallet => wallet.installed)
  const availableWallets = wallets.filter(wallet => !wallet.installed)

  async function connect(wallet: Wallet) {
    try {
      isConnecting.value = wallet.extensionName
      listAccounts.value = []
      connectedWallet.value = wallet

      await wallet.enable('CDA')
      const accounts = await wallet.getAccounts()

      if (accounts) {
        listAccounts.value = accounts
      }

      isConnecting.value = null
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
