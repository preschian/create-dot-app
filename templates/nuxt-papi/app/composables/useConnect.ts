import type { Wallet, WalletAccount } from '@talismn/connect-wallets'
import { getWallets } from '@talismn/connect-wallets'

const storageWallet = 'dapp:wallet'
const storageAccount = 'dapp:account'

export function useConnect() {
  const selectedAccount = useCookie<WalletAccount | null>(storageAccount, {
    default: () => null,
    secure: true,
    sameSite: 'strict',
  })

  const connectedWallet = useCookie<Wallet | null>(storageWallet, {
    default: () => null,
    secure: true,
    sameSite: 'strict',
  })

  const listAccounts = ref<WalletAccount[]>([])
  const isConnecting = ref<string | null>(null)

  const wallets = getWallets()
  const installedWallets = wallets.filter(wallet => wallet.installed)
  const availableWallets = wallets.filter(wallet => !wallet.installed)

  async function connect(wallet: Wallet) {
    try {
      isConnecting.value = wallet.extensionName
      listAccounts.value = []

      // Set connected wallet (automatically syncs with cookie)
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
