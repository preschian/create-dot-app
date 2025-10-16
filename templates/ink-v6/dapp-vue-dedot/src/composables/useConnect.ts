import type { Wallet, WalletAccount } from '@talismn/connect-wallets'
import { getWallets } from '@talismn/connect-wallets'
import { computed, ref } from 'vue'
import { DAPP_NAME } from '~/utils/sdk-interface'
import { useLocalStorage } from './useLocalStorage'

const { value: selectedAccount, setItem: setSelectedAccount, removeItem: removeSelectedAccount } = useLocalStorage<WalletAccount | null>('dapp:account', null)
const { value: connectedWallet, setItem: setConnectedWallet, removeItem: removeConnectedWallet } = useLocalStorage<Wallet | null>('dapp:wallet', null)

const listAccounts = ref<WalletAccount[]>([])
const isConnecting = ref<string | null>(null)
const wallets = getWallets()

export function useConnect() {
  async function connect(wallet: Wallet) {
    try {
      isConnecting.value = wallet.extensionName
      listAccounts.value = []

      setConnectedWallet(wallet)
      await wallet.enable(DAPP_NAME)
      const accounts = await wallet.getAccounts()

      listAccounts.value = accounts ?? []
      isConnecting.value = null
    }
    catch (err) {
      console.error(err)
      isConnecting.value = null
      removeConnectedWallet()
    }
  }

  function disconnect() {
    removeSelectedAccount()
    removeConnectedWallet()
    listAccounts.value = []
  }

  function selectAccount(account: WalletAccount) {
    setSelectedAccount(account)
  }

  return {
    listAccounts,
    selectedAccount,
    connectedWallet,
    isConnecting,
    wallets,
    installedWallets: computed(() => wallets.filter(wallet => wallet.installed)),
    availableWallets: computed(() => wallets.filter(wallet => !wallet.installed)),
    connect,
    disconnect,
    selectAccount,
  }
}
