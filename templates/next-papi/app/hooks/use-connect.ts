'use client'

import type { Wallet, WalletAccount } from '@talismn/connect-wallets'
import type { Atom } from '@xstate/store'
import { getWallets } from '@talismn/connect-wallets'
import { createAtom } from '@xstate/store'
import { useSelector } from '@xstate/store-react'
import { useEffect, useState } from 'react'
import { DAPP_NAME } from '../utils/sdk-interface'

const storageWallet = 'dapp:wallet'
const storageAccount = 'dapp:account'

function getStorage(key: string) {
  if (typeof window === 'undefined')
    return null
  const value = localStorage.getItem(key)
  return value ? JSON.parse(value) : null
}

function setStorage(key: string, value: unknown) {
  if (typeof window === 'undefined')
    return
  localStorage.setItem(key, JSON.stringify(value))
}

function removeStorage(key: string) {
  if (typeof window === 'undefined')
    return
  localStorage.removeItem(key)
}

export const selectedAccount: Atom<WalletAccount | null> = createAtom(null)
export const connectedWallet: Atom<Wallet | null> = createAtom(null)
const listAccounts: Atom<WalletAccount[]> = createAtom([])
const isConnecting: Atom<string | null> = createAtom(null)

// Shared connect-modal visibility so any control (header button, write panel) can
// prompt the user to connect without threading callbacks through the tree.
const connectModalOpen: Atom<boolean> = createAtom(false)

export function openConnectModal() {
  connectModalOpen.set(true)
}

export function closeConnectModal() {
  connectModalOpen.set(false)
}

export function useConnect() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    let ignore = false

    async function initialize() {
      if (!ignore) {
        setMounted(true)
        // Initialize from storage on client side
        if (selectedAccount.get() === null) {
          selectedAccount.set(getStorage(storageAccount))
          connectedWallet.set(getStorage(storageWallet))
        }
      }
    }

    initialize()

    return () => {
      ignore = true
    }
  }, [])

  const wallets = mounted ? getWallets() : []
  const installedWallets = wallets.filter(wallet => wallet.installed)
  const availableWallets = wallets.filter(wallet => !wallet.installed)

  async function connect(wallet: Wallet) {
    try {
      // Track the in-progress connection by title so the spinner shows on the
      // exact wallet picked — distinct wallets can share an extensionName.
      isConnecting.set(wallet.title)
      listAccounts.set([])

      // set the connected wallet
      connectedWallet.set(wallet)
      setStorage(storageWallet, wallet)

      await wallet.enable(DAPP_NAME)
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
    listAccounts: useSelector(listAccounts),
    selectedAccount: useSelector(selectedAccount),
    connectedWallet: useSelector(connectedWallet),
    isConnecting: useSelector(isConnecting),
    connectModalOpen: useSelector(connectModalOpen),
    wallets,
    installedWallets,
    availableWallets,

    // Actions
    connect,
    disconnect,
    selectAccount,
    openConnectModal,
    closeConnectModal,
  }
}
