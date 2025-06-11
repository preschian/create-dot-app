import type { InjectedAccountWithMeta } from '@polkadot/extension-inject/types'
import { onUnmounted, ref } from 'vue'
import {
  $accounts,
  $connectedExtension,
  $error,
  $isConnected,
  $isLoading,
  $selectedAccount,
} from '../utils/wallet'

export function useWallet() {
  // Reactive refs
  const isConnected = ref($isConnected.get())
  const isLoading = ref($isLoading.get())
  const connectedExtension = ref($connectedExtension.get())
  const accounts = ref($accounts.get())
  const selectedAccount = ref<InjectedAccountWithMeta | null>(
    $selectedAccount.get() ? JSON.parse($selectedAccount.get()) : null,
  )
  const error = ref($error.get())

  // Store subscriptions
  const unsubscribeFunctions = [
    $isConnected.listen((connected) => {
      isConnected.value = connected
    }),
    $isLoading.listen((loading) => {
      isLoading.value = loading
    }),
    $connectedExtension.listen((extension) => {
      connectedExtension.value = extension
    }),
    $accounts.listen((accs) => {
      accounts.value = [...accs]
    }),
    $selectedAccount.listen((account) => {
      selectedAccount.value = account ? JSON.parse(account) : null
    }),
    $error.listen((err) => {
      error.value = err
    }),
  ]

  // Auto cleanup on unmount
  onUnmounted(() => {
    unsubscribeFunctions.forEach(unsubscribe => unsubscribe())
  })

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
