import type { Wallet, WalletAccount } from '@talismn/connect-wallets'
import type { Atom } from '@xstate/store'
import { getWallets } from '@talismn/connect-wallets'
import { createAtom } from '@xstate/store'
import { useAtom } from '@xstate/store/react'
import { connectInjectedExtension } from 'polkadot-api/pjs-signer'

const selectedAccount: Atom<WalletAccount | null> = createAtom(null)
const connectedWallet: Atom<Wallet | null> = createAtom(null)
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
      connectedWallet.set(wallet)

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
    }
  }

  function disconnect() {
    selectedAccount.set(null)
    connectedWallet.set(null)
    listAccounts.set([])
  }

  function selectAccount(account: WalletAccount) {
    selectedAccount.set(account)
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

export async function polkadotSigner() {
  const selectedExtension = await connectInjectedExtension(
    connectedWallet.get()?.extensionName || '',
  )
  const account = selectedExtension.getAccounts().find(account =>
    account.address === selectedAccount.get()?.address,
  )

  return account?.polkadotSigner
}
