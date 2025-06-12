import type { InjectedAccountWithMeta } from '@polkadot/extension-inject/types'
import { useEffect, useState } from 'react'
import {
  $accounts,
  $connectedExtension,
  $error,
  $isConnected,
  $isLoading,
  $selectedAccount,
} from '../utils/wallet'

export function useWallet() {
  // Reactive state using useState
  const [isConnected, setIsConnected] = useState($isConnected.get())
  const [isLoading, setIsLoading] = useState($isLoading.get())
  const [connectedExtension, setConnectedExtension] = useState($connectedExtension.get())
  const [accounts, setAccounts] = useState($accounts.get())
  const [selectedAccount, setSelectedAccount] = useState<InjectedAccountWithMeta | null>(
    $selectedAccount.get() ? JSON.parse($selectedAccount.get()) : null,
  )
  const [error, setError] = useState($error.get())

  // Store subscriptions
  useEffect(() => {
    const unsubscribeFunctions = [
      $isConnected.listen((connected: boolean) => {
        setIsConnected(connected)
      }),
      $isLoading.listen((loading: boolean) => {
        setIsLoading(loading)
      }),
      $connectedExtension.listen((extension: string) => {
        setConnectedExtension(extension)
      }),
      $accounts.listen((accs: readonly InjectedAccountWithMeta[]) => {
        setAccounts([...accs])
      }),
      $selectedAccount.listen((account: string) => {
        setSelectedAccount(account ? JSON.parse(account) : null)
      }),
      $error.listen((err: string | null) => {
        setError(err)
      }),
    ]

    // Cleanup on unmount
    return () => {
      unsubscribeFunctions.forEach(unsubscribe => unsubscribe())
    }
  }, [])

  return {
    // Reactive state
    isConnected,
    isLoading,
    connectedExtension,
    accounts,
    selectedAccount,
    error,
  }
}
