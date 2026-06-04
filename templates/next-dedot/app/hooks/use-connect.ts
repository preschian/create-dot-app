'use client'

import type { Wallet, WalletAccount } from '@talismn/connect-wallets'
import type { Atom } from '@xstate/store'
import { getWallets } from '@talismn/connect-wallets'
import { createAtom } from '@xstate/store'
import { useSelector } from '@xstate/store-react'
import { useEffect, useState } from 'react'
import { name } from '../../package.json'

// Identifies this dapp to wallet extensions when requesting access. Defined here
// (rather than imported from sdk-interface) so the hook and the SDK layer don't
// form an import cycle.
const DAPP_NAME = name

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

function openConnectModal() {
  connectModalOpen.set(true)
}

function closeConnectModal() {
  connectModalOpen.set(false)
}

// These actions only read/write module-level atoms and storage, so they live at
// module scope — stable references that never get rebuilt per render.
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

export function useConnect() {
  const [mounted, setMounted] = useState(false)

  // getWallets() reads window.injectedWeb3, so wallet discovery must stay
  // client-only. The first render (server + hydration) shows no wallets; flipping
  // `mounted` after mount re-renders with the discovered list, keeping the server
  // and client markup identical.
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
