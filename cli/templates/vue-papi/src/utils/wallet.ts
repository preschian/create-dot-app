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

// Extension configuration with sources and display names
function getExtensionConfig(): Record<string, { sources: string[], displayName: string }> {
  return {
    'polkadot-js': { sources: ['polkadot-js'], displayName: 'Polkadot.js' },
    'talisman': { sources: ['talisman', 'Talisman'], displayName: 'Talisman' },
    'subwallet-js': { sources: ['subwallet-js', 'SubWallet'], displayName: 'SubWallet' },
  }
}

// Get source mappings for extension filtering
function getSourceMapping(): Record<string, string[]> {
  const config = getExtensionConfig()
  const mapping: Record<string, string[]> = {}
  for (const [key, value] of Object.entries(config)) {
    mapping[key] = value.sources
  }
  return mapping
}

// Get user-friendly extension name
export function getExtensionDisplayName(extensionName: string): string {
  const config = getExtensionConfig()
  return config[extensionName]?.displayName || extensionName
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
    const sourceMapping = getSourceMapping()
    const possibleSources = extensionName ? (sourceMapping[extensionName] || [extensionName]) : []

    if (extensionName) {
      accounts = allAccounts.filter(account => possibleSources.includes(account.meta.source))

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

  // Get possible source identifiers for the connected extension
  const sourceMapping = getSourceMapping()
  const possibleSources = sourceMapping[connectedExtension] || [connectedExtension]

  // Ensure account belongs to the connected extension
  if (!possibleSources.includes(account.meta.source)) {
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
    // For PAPI, we need to use the proper signer format
    const { connectInjectedExtension } = await import('polkadot-api/pjs-signer')

    // Map our internal extension names to the names expected by PAPI
    const extensionNameMap: Record<string, string> = {
      'polkadot-js': 'polkadot-js',
      'talisman': 'talisman',
      'subwallet-js': 'subwallet-js',
    }

    const papiExtensionName = extensionNameMap[connectedExtension] || connectedExtension
    const extension = await connectInjectedExtension(papiExtensionName)
    const accounts = extension.getAccounts()

    // Find the account that matches our target address
    const account = accounts.find(acc => acc.address === targetAddress)
    if (!account) {
      throw new Error(`Account ${targetAddress} not found in extension`)
    }

    // Return the PAPI-compatible signer
    return account.polkadotSigner
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
