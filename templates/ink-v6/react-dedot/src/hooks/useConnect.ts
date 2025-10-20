import type { Wallet, WalletAccount } from '@talismn/connect-wallets'
import { getWallets } from '@talismn/connect-wallets'
import { createStore } from '@xstate/store'
import { useSelector } from '@xstate/store/react'
import { useMemo } from 'react'
import { DAPP_NAME } from '~/utils/sdk'

const STORAGE_ACCOUNT = 'dapp:account'
const STORAGE_WALLET = 'dapp:wallet'

function getStoredValue<T>(key: string): T | null {
  const stored = localStorage.getItem(key)
  return stored ? JSON.parse(stored) : null
}

function setStoredValue<T>(key: string, value: T | null) {
  if (value === null) {
    localStorage.removeItem(key)
  }
  else {
    localStorage.setItem(key, JSON.stringify(value))
  }
}

const wallets = getWallets()

const walletStore = createStore({
  context: {
    selectedAccount: getStoredValue<WalletAccount>(STORAGE_ACCOUNT),
    connectedWallet: getStoredValue<Wallet>(STORAGE_WALLET),
    listAccounts: [] as WalletAccount[],
    isConnecting: null as string | null,
  },
  on: {
    setSelectedAccount: (context, event: { account: WalletAccount | null }) => {
      setStoredValue(STORAGE_ACCOUNT, event.account)
      return {
        ...context,
        selectedAccount: event.account,
      }
    },
    setConnectedWallet: (context, event: { wallet: Wallet | null }) => {
      setStoredValue(STORAGE_WALLET, event.wallet)
      return {
        ...context,
        connectedWallet: event.wallet,
      }
    },
    setListAccounts: (context, event: { accounts: WalletAccount[] }) => ({
      ...context,
      listAccounts: event.accounts,
    }),
    setIsConnecting: (context, event: { walletName: string | null }) => ({
      ...context,
      isConnecting: event.walletName,
    }),
    reset: () => {
      setStoredValue(STORAGE_ACCOUNT, null)
      setStoredValue(STORAGE_WALLET, null)
      return {
        selectedAccount: null,
        connectedWallet: null,
        listAccounts: [],
        isConnecting: null,
      }
    },
  },
})

export function useConnect() {
  const selectedAccount = useSelector(walletStore, state => state.context.selectedAccount)
  const connectedWallet = useSelector(walletStore, state => state.context.connectedWallet)
  const listAccounts = useSelector(walletStore, state => state.context.listAccounts)
  const isConnecting = useSelector(walletStore, state => state.context.isConnecting)

  const installedWallets = useMemo(() => wallets.filter(wallet => wallet.installed), [])
  const availableWallets = useMemo(() => wallets.filter(wallet => !wallet.installed), [])

  async function connect(wallet: Wallet) {
    try {
      walletStore.send({ type: 'setIsConnecting', walletName: wallet.extensionName })
      walletStore.send({ type: 'setListAccounts', accounts: [] })
      walletStore.send({ type: 'setConnectedWallet', wallet })

      await wallet.enable(DAPP_NAME)
      const accounts = await wallet.getAccounts()

      walletStore.send({ type: 'setListAccounts', accounts: accounts ?? [] })
      walletStore.send({ type: 'setIsConnecting', walletName: null })
    }
    catch (err) {
      console.error(err)
      walletStore.send({ type: 'setIsConnecting', walletName: null })
      walletStore.send({ type: 'setConnectedWallet', wallet: null })
    }
  }

  function disconnect() {
    walletStore.send({ type: 'reset' })
  }

  function selectAccount(account: WalletAccount) {
    walletStore.send({ type: 'setSelectedAccount', account })
  }

  return {
    listAccounts,
    selectedAccount,
    connectedWallet,
    isConnecting,
    wallets,
    installedWallets,
    availableWallets,
    connect,
    disconnect,
    selectAccount,
  }
}
