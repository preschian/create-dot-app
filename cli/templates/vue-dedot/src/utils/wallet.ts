import type { InjectedAccountWithMeta } from '@polkadot/extension-inject/types'
import { persistentAtom } from '@nanostores/persistent'
import { atom } from 'nanostores'

export interface WalletExtension {
  name: string
  version: string
  enabled: boolean
}

// Nanostores for wallet state management
export const walletIsConnected = persistentAtom('wallet:isConnected', false, {
  encode: (value: boolean) => String(value),
  decode: (str: string) => str === 'true',
})
export const walletIsLoading = atom(false)
export const walletConnectedExtension = persistentAtom('wallet:connectedExtension', '', {
  encode: (value: string) => value,
  decode: (str: string) => str,
})
export const walletAvailableExtensions = atom<WalletExtension[]>([])
export const walletAccounts = atom<InjectedAccountWithMeta[]>([])
export const walletSelectedAccount = persistentAtom('wallet:selectedAccount', '', {
  encode: account => account ? JSON.stringify(account) : '',
  decode: str => str ? JSON.parse(str) : null,
})
export const walletError = atom<string | null>(null)

// Comprehensive extension configuration
const EXTENSION_CONFIG = {
  'polkadot-js': {
    displayName: 'Polkadot.js',
  },
  'talisman': {
    displayName: 'Talisman',
  },
  'subwallet-js': {
    displayName: 'SubWallet',
  },
} as const

// Get user-friendly extension name
export function getExtensionDisplayName(extensionName: string): string {
  return EXTENSION_CONFIG[extensionName as keyof typeof EXTENSION_CONFIG]?.displayName || extensionName
}

// Get available wallet extensions with details
export async function getAvailableExtensions(): Promise<WalletExtension[]> {
  if (typeof window === 'undefined')
    return []

  const injectedWeb3 = (window as any).injectedWeb3
  if (!injectedWeb3)
    return []

  const extensions: WalletExtension[] = []

  for (const [name, extension] of Object.entries(injectedWeb3)) {
    try {
      const ext = extension as any
      extensions.push({
        name,
        version: ext.version || 'unknown',
        enabled: false,
      })
    }
    catch (error) {
      console.warn(`Failed to get info for extension ${name}:`, error)
    }
  }

  walletAvailableExtensions.set(extensions)
  return extensions
}

// Connect to wallet extension
export async function connectWallet(extensionName?: string): Promise<void> {
  if (walletIsLoading.get())
    return

  walletIsLoading.set(true)
  walletError.set(null)

  try {
    const { web3Enable, web3Accounts } = await import('@polkadot/extension-dapp')

    const extensions = await web3Enable('Create Dot App')
    if (extensions.length === 0) {
      throw new Error('No wallet extension found or access denied')
    }

    const allAccounts = await web3Accounts()
    if (allAccounts.length === 0) {
      throw new Error('No accounts found')
    }

    // Filter accounts by extension if specified
    let accounts = allAccounts
    const targetExtension = extensionName || 'wallet'

    if (extensionName) {
      accounts = allAccounts.filter((account) => {
        return account.meta.source === extensionName
      })

      if (accounts.length === 0) {
        throw new Error(`No accounts found for ${extensionName}`)
      }
    }

    // Update state
    walletIsConnected.set(true)
    walletConnectedExtension.set(targetExtension)
    walletAccounts.set(accounts)
    walletError.set(null)
  }
  catch (error) {
    console.error('Wallet connection error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Failed to connect wallet'
    walletIsConnected.set(false)
    walletConnectedExtension.set('')
    walletError.set(errorMessage)
    throw error
  }
  finally {
    walletIsLoading.set(false)
  }
}

// Disconnect wallet
export function disconnectWallet(): void {
  walletIsConnected.set(false)
  walletConnectedExtension.set('')
  walletAccounts.set([])
  walletSelectedAccount.set('')
  walletError.set(null)
}

// Select a specific account (must be from the connected extension)
export function selectAccount(account: InjectedAccountWithMeta): void {
  if (!walletIsConnected.get()) {
    throw new Error('No wallet connected')
  }

  const connectedExtension = walletConnectedExtension.get()
  if (!connectedExtension) {
    throw new Error('No extension connected')
  }

  // Ensure account belongs to the connected extension
  if (account.meta.source !== connectedExtension) {
    throw new Error(`Account belongs to ${account.meta.source}, but ${connectedExtension} is connected`)
  }

  const accounts = walletAccounts.get()
  const accountExists = accounts.some(acc => acc.address === account.address)
  if (!accountExists) {
    throw new Error('Account not found in connected extension')
  }

  walletSelectedAccount.set(JSON.stringify(account))
}

// Get signer for transactions
export async function getSigner(address?: string): Promise<any> {
  const isConnected = walletIsConnected.get()
  const connectedExtension = walletConnectedExtension.get()
  const selectedAccountStr = walletSelectedAccount.get()
  const accounts = walletAccounts.get()

  if (!isConnected || !connectedExtension) {
    throw new Error('No wallet connected')
  }

  const selectedAccount = selectedAccountStr ? JSON.parse(selectedAccountStr) : null
  const targetAddress = address || selectedAccount?.address
  if (!targetAddress) {
    throw new Error('No account selected')
  }

  // Ensure the address belongs to connected extension
  const accountExists = accounts.some((acc: InjectedAccountWithMeta) => acc.address === targetAddress)
  if (!accountExists) {
    throw new Error(`Address ${targetAddress} not found in connected extension ${connectedExtension}`)
  }

  try {
    // Get signer directly from extension
    const { web3FromSource } = await import('@polkadot/extension-dapp')

    const injector = await web3FromSource(connectedExtension)
    if (!injector?.signer) {
      throw new Error(`No signer found for extension ${connectedExtension}`)
    }

    // Return the extension's signer directly
    return injector.signer
  }
  catch (error) {
    console.error('Failed to get signer:', error)
    throw new Error(`Failed to get signer for address ${targetAddress}`)
  }
}

// Auto-reconnect on initialization
async function initializeAutoReconnect(): Promise<void> {
  if (typeof window === 'undefined')
    return

  const wasConnected = walletIsConnected.get()
  const savedExtension = walletConnectedExtension.get()
  const savedAccount = walletSelectedAccount.get()

  if (wasConnected && savedExtension) {
    try {
      await connectWallet(savedExtension)

      // Restore selected account if available and still exists
      if (savedAccount && walletAccounts.get().length) {
        const accounts = walletAccounts.get()
        const parsedAccount = JSON.parse(savedAccount)
        const account = accounts.find(acc => acc.address === parsedAccount.address)

        if (account) {
          selectAccount(account)
        }
        else {
          // Clear saved account if it no longer exists
          walletSelectedAccount.set('')
        }
      }
    }
    catch (error) {
      console.error('Auto-reconnect failed:', error)
      disconnectWallet()
    }
  }
}

// Initialize auto-reconnect
initializeAutoReconnect()

// Export stores for direct access
export {
  walletAccounts as $accounts,
  walletAvailableExtensions as $availableExtensions,
  walletConnectedExtension as $connectedExtension,
  walletError as $error,
  walletIsConnected as $isConnected,
  walletIsLoading as $isLoading,
  walletSelectedAccount as $selectedAccount,
}
