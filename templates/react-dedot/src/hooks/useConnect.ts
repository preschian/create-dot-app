import type { Wallet, WalletAccount } from '@talismn/connect-wallets'
import type { Atom } from '@xstate/store'
import { getWallets } from '@talismn/connect-wallets'
import { createAtom } from '@xstate/store'
import { useAtom } from '@xstate/store/react'

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

export const selectedAccount: Atom<WalletAccount | null> = createAtom(getStorage(storageAccount))
export const connectedWallet: Atom<Wallet | null> = createAtom(getStorage(storageWallet))
const listAccounts: Atom<WalletAccount[]> = createAtom([])
const isConnecting: Atom<string | null> = createAtom(null)

export function useConnect() {
  const wallets = getWallets()
  const installedWallets = wallets.filter(wallet => wallet.installed)
  const availableWallets = wallets.filter(wallet => !wallet.installed)

  async function connect(wallet: Wallet) {
    try {
      isConnecting.set(wallet.extensionName)
      listAccounts.set([])

      // set the connected wallet
      connectedWallet.set(wallet)
      setStorage(storageWallet, wallet)

      await wallet.enable('CDA')
      const accounts = await wallet.getAccounts()

      if (accounts) {
        listAccounts.set(accounts)
      }

      isConnecting.set(null)
    }
    catch (err) {
      console.error(err)
      isConnecting.set(null)
      connectedWallet.set(null)
      removeStorage(storageWallet)
    }
  }

  function disconnect() {
    selectedAccount.set(null)
    connectedWallet.set(null)
    listAccounts.set([])
    removeStorage(storageAccount)
    removeStorage(storageWallet)
  }

  function selectAccount(account: WalletAccount) {
    selectedAccount.set(account)
    setStorage(storageAccount, account)
  }

  return {
    // State
    listAccounts: useAtom(listAccounts),
    selectedAccount: useAtom(selectedAccount),
    connectedWallet: useAtom(connectedWallet),
    isConnecting: useAtom(isConnecting),
    wallets,
    installedWallets,
    availableWallets,

    // Actions
    connect,
    disconnect,
    selectAccount,
  }
}
