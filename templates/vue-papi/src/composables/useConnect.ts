import type { Wallet, WalletAccount } from '@talismn/connect-wallets'
import { getWallets } from '@talismn/connect-wallets'
import { ref } from 'vue'

const storageWallet = 'dapp:wallet'
const storageAccount = 'dapp:account'

function getStorage(key: string) {
  const value = localStorage.getItem(key)
  return value ? JSON.parse(value) : null
}

function setStorage(key: string, value: any) {
  localStorage.setItem(key, JSON.stringify(value))
}

function removeStorage(key: string) {
  localStorage.removeItem(key)
}

export const selectedAccount = ref<WalletAccount | null>(getStorage(storageAccount))
export const connectedWallet = ref<Wallet | null>(getStorage(storageWallet))
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

      // set connected wallet
      connectedWallet.value = wallet
      setStorage(storageWallet, wallet)

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
      removeStorage(storageWallet)
    }
  }

  function disconnect() {
    selectedAccount.value = null
    connectedWallet.value = null
    listAccounts.value = []
    removeStorage(storageAccount)
    removeStorage(storageWallet)
  }

  function selectAccount(account: WalletAccount) {
    selectedAccount.value = account
    setStorage(storageAccount, account)
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
