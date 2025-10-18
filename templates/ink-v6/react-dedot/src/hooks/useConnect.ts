import type { Wallet, WalletAccount } from '@talismn/connect-wallets'
import { getWallets } from '@talismn/connect-wallets'
import { useMemo, useState } from 'react'
import { DAPP_NAME } from '~/utils/sdk'
import { useLocalStorage } from './useLocalStorage'

const wallets = getWallets()

export function useConnect() {
  const { value: selectedAccount, setItem: setSelectedAccount, removeItem: removeSelectedAccount } = useLocalStorage<WalletAccount | null>('dapp:account', null)
  const { value: connectedWallet, setItem: setConnectedWallet, removeItem: removeConnectedWallet } = useLocalStorage<Wallet | null>('dapp:wallet', null)
  
  const [listAccounts, setListAccounts] = useState<WalletAccount[]>([])
  const [isConnecting, setIsConnecting] = useState<string | null>(null)

  const installedWallets = useMemo(() => wallets.filter(wallet => wallet.installed), [])
  const availableWallets = useMemo(() => wallets.filter(wallet => !wallet.installed), [])

  async function connect(wallet: Wallet) {
    try {
      setIsConnecting(wallet.extensionName)
      setListAccounts([])

      setConnectedWallet(wallet)
      
      await wallet.enable(DAPP_NAME)
      const accounts = await wallet.getAccounts()

      setListAccounts(accounts ?? [])
      setIsConnecting(null)
    }
    catch (err) {
      console.error(err)
      setIsConnecting(null)
      removeConnectedWallet()
    }
  }

  function disconnect() {
    removeSelectedAccount()
    removeConnectedWallet()
    setListAccounts([])
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
    installedWallets,
    availableWallets,
    connect,
    disconnect,
    selectAccount,
  }
}
