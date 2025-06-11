import type { InjectedAccountWithMeta } from '@polkadot/extension-inject/types'

export interface WalletExtension {
  name: string
  version: string
  enabled: boolean
}

export interface WalletState {
  isConnected: boolean
  isLoading: boolean
  connectedExtension: string | null
  availableExtensions: WalletExtension[]
  accounts: InjectedAccountWithMeta[]
  selectedAccount: InjectedAccountWithMeta | null
  error: string | null
}

export interface WalletEvents {
  'wallet:connected': WalletState
  'wallet:disconnected': WalletState
  'wallet:loading': boolean
  'wallet:error': string
  'wallet:accountChanged': InjectedAccountWithMeta | null
  'wallet:extensionChanged': string | null
  'wallet:accountsChanged': InjectedAccountWithMeta[]
}

// Wallet manager class
class WalletManager extends EventTarget {
  private state: WalletState = {
    isConnected: false,
    isLoading: false,
    connectedExtension: null,
    availableExtensions: [],
    accounts: [],
    selectedAccount: null,
    error: null,
  }

  private unsubscribeAccounts: (() => void) | null = null

  constructor() {
    super()
    this.initializeAutoReconnect()
  }

  // Get current state
  getState(): WalletState {
    return { ...this.state }
  }

  // Get available wallet extensions with details
  async getAvailableExtensions(): Promise<WalletExtension[]> {
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

    this.updateState({ availableExtensions: extensions })
    return extensions
  }

  // Update state and emit events
  private updateState(updates: Partial<WalletState>) {
    const previousState = { ...this.state }
    this.state = { ...this.state, ...updates }

    // Emit specific events
    if (updates.isLoading !== undefined) {
      this.dispatchEvent(new CustomEvent('wallet:loading', { detail: updates.isLoading }))
    }

    if (updates.error !== undefined && updates.error !== null) {
      this.dispatchEvent(new CustomEvent('wallet:error', { detail: updates.error }))
    }

    if (updates.selectedAccount !== undefined) {
      this.dispatchEvent(new CustomEvent('wallet:accountChanged', { detail: updates.selectedAccount }))
    }

    if (updates.connectedExtension !== undefined) {
      this.dispatchEvent(new CustomEvent('wallet:extensionChanged', { detail: updates.connectedExtension }))
    }

    // Emit accounts update event
    if (updates.accounts !== undefined) {
      this.dispatchEvent(new CustomEvent('wallet:accountsChanged', { detail: updates.accounts }))
    }

    if (updates.isConnected !== undefined) {
      if (updates.isConnected && !previousState.isConnected) {
        this.dispatchEvent(new CustomEvent('wallet:connected', { detail: this.state }))
      }
      else if (!updates.isConnected && previousState.isConnected) {
        this.dispatchEvent(new CustomEvent('wallet:disconnected', { detail: this.state }))
      }
    }
  }

  // Connect to wallet extension
  async connect(extensionName?: string): Promise<void> {
    if (this.state.isLoading)
      return

    this.updateState({ isLoading: true, error: null })

    try {
      const { web3Enable, web3Accounts, web3AccountsSubscribe } = await import('@polkadot/extension-dapp')

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
      const sourceMapping = this.getSourceMapping()
      const possibleSources = extensionName ? (sourceMapping[extensionName] || [extensionName]) : []

      if (extensionName) {
        accounts = allAccounts.filter(account => possibleSources.includes(account.meta.source))

        if (accounts.length === 0) {
          throw new Error(`No accounts found for ${extensionName}`)
        }
      }

      // Subscribe to account changes
      this.unsubscribeAccounts = await web3AccountsSubscribe((updatedAccounts: InjectedAccountWithMeta[]) => {
        const filteredAccounts = extensionName
          ? updatedAccounts.filter(account => possibleSources.includes(account.meta.source))
          : updatedAccounts

        // Prevent subscription from interfering immediately after connection
        // Give a small window for the initial selectedAccount to be set
        if (!this.state.selectedAccount && filteredAccounts.length > 0) {
          this.updateState({
            accounts: filteredAccounts,
            selectedAccount: filteredAccounts[0],
          })
          return
        }

        this.updateState({ accounts: filteredAccounts })

        // Update selected account if it's no longer available
        if (this.state.selectedAccount) {
          const stillExists = filteredAccounts.find(
            (acc: InjectedAccountWithMeta) => acc.address === this.state.selectedAccount!.address,
          )
          if (!stillExists && filteredAccounts.length > 0) {
            this.selectAccount(filteredAccounts[0])
          }
          else if (!stillExists) {
            this.updateState({ selectedAccount: null })
          }
        }
      })

      // Update state
      this.updateState({
        isConnected: true,
        connectedExtension: targetExtension,
        accounts,
        selectedAccount: accounts[0], // Auto-select first account
        error: null,
      })

      // Store connection state
      this.saveConnectionState(targetExtension, accounts[0].address)
    }
    catch (error) {
      console.error('Wallet connection error:', error)
      const errorMessage = error instanceof Error ? error.message : 'Failed to connect wallet'
      this.updateState({
        isConnected: false,
        connectedExtension: null,
        error: errorMessage,
      })
      throw error
    }
    finally {
      this.updateState({ isLoading: false })
    }
  }

  // Disconnect wallet
  disconnect(): void {
    // Unsubscribe from account changes
    if (this.unsubscribeAccounts) {
      this.unsubscribeAccounts()
      this.unsubscribeAccounts = null
    }

    this.updateState({
      isConnected: false,
      connectedExtension: null,
      accounts: [],
      selectedAccount: null,
      error: null,
    })

    this.clearConnectionState()
  }

  // Switch to a different wallet extension
  async switchExtension(extensionName: string): Promise<void> {
    if (this.state.connectedExtension === extensionName) {
      return // Already connected to this extension
    }

    // Disconnect current extension and connect to new one
    this.disconnect()
    await this.connect(extensionName)
  }

  // Select a specific account (must be from the connected extension)
  selectAccount(account: InjectedAccountWithMeta): void {
    if (!this.state.isConnected) {
      throw new Error('No wallet connected')
    }

    if (!this.state.connectedExtension) {
      throw new Error('No extension connected')
    }

    // Get possible source identifiers for the connected extension
    const sourceMapping = this.getSourceMapping()
    const possibleSources = sourceMapping[this.state.connectedExtension] || [this.state.connectedExtension]

    // Ensure account belongs to the connected extension
    if (!possibleSources.includes(account.meta.source)) {
      throw new Error(`Account belongs to ${account.meta.source}, but ${this.state.connectedExtension} is connected`)
    }

    const accountExists = this.state.accounts.some(acc => acc.address === account.address)
    if (!accountExists) {
      throw new Error('Account not found in connected extension')
    }

    this.updateState({ selectedAccount: account })
    localStorage.setItem('wallet-selected-account', account.address)
  }

  // Get signer for transactions
  async getSigner(address?: string): Promise<any> {
    if (!this.state.isConnected || !this.state.connectedExtension) {
      throw new Error('No wallet connected')
    }

    const targetAddress = address || this.state.selectedAccount?.address
    if (!targetAddress) {
      throw new Error('No account selected')
    }

    // Ensure the address belongs to connected extension
    const accountExists = this.state.accounts.some(acc => acc.address === targetAddress)
    if (!accountExists) {
      throw new Error(`Address ${targetAddress} not found in connected extension ${this.state.connectedExtension}`)
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

      const papiExtensionName = extensionNameMap[this.state.connectedExtension] || this.state.connectedExtension
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

  // Private: Save connection state to localStorage
  private saveConnectionState(extensionName: string, selectedAddress: string): void {
    localStorage.setItem('wallet-connected', 'true')
    localStorage.setItem('wallet-extension', extensionName)
    localStorage.setItem('wallet-selected-account', selectedAddress)
  }

  // Private: Clear connection state from localStorage
  private clearConnectionState(): void {
    localStorage.removeItem('wallet-connected')
    localStorage.removeItem('wallet-extension')
    localStorage.removeItem('wallet-selected-account')
  }

  // Private: Auto-reconnect on initialization
  private async initializeAutoReconnect(): Promise<void> {
    if (typeof window === 'undefined')
      return

    const init = async () => {
      const wasConnected = localStorage.getItem('wallet-connected') === 'true'
      const savedExtension = localStorage.getItem('wallet-extension')
      const savedAccount = localStorage.getItem('wallet-selected-account')

      if (wasConnected && savedExtension) {
        try {
          await this.connect(savedExtension)

          // Restore selected account if available
          if (savedAccount && this.state.accounts.length > 0) {
            const account = this.state.accounts.find(acc => acc.address === savedAccount)
            if (account) {
              this.selectAccount(account)
            }
          }
        }
        catch (error) {
          console.error('Auto-reconnect failed:', error)
          this.disconnect()
        }
      }
    }

    // Wait for page to load
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', init)
    }
    else {
      setTimeout(init, 100)
    }
  }

  // Event listener helpers
  on<K extends keyof WalletEvents>(
    event: K,
    listener: (event: CustomEvent<WalletEvents[K]>) => void,
  ): void {
    this.addEventListener(event, listener as EventListener)
  }

  off<K extends keyof WalletEvents>(
    event: K,
    listener: (event: CustomEvent<WalletEvents[K]>) => void,
  ): void {
    this.removeEventListener(event, listener as EventListener)
  }

  // Extension configuration with sources and display names
  private getExtensionConfig(): Record<string, { sources: string[], displayName: string }> {
    return {
      'polkadot-js': { sources: ['polkadot-js'], displayName: 'Polkadot.js' },
      'talisman': { sources: ['talisman', 'Talisman'], displayName: 'Talisman' },
      'subwallet-js': { sources: ['subwallet-js', 'SubWallet'], displayName: 'SubWallet' },
    }
  }

  // Get source mappings for extension filtering
  private getSourceMapping(): Record<string, string[]> {
    const config = this.getExtensionConfig()
    const mapping: Record<string, string[]> = {}
    for (const [key, value] of Object.entries(config)) {
      mapping[key] = value.sources
    }
    return mapping
  }

  // Get user-friendly extension name
  getExtensionDisplayName(extensionName: string): string {
    const config = this.getExtensionConfig()
    return config[extensionName]?.displayName || extensionName
  }
}

// Create singleton instance
export const walletManager = new WalletManager()

// Export convenience functions for direct usage
export const connectWallet = (extensionName?: string) => walletManager.connect(extensionName)
export const disconnectWallet = () => walletManager.disconnect()
export const switchExtension = (extensionName: string) => walletManager.switchExtension(extensionName)
export const selectAccount = (account: InjectedAccountWithMeta) => walletManager.selectAccount(account)
export const getWalletState = () => walletManager.getState()
export const getSigner = (address?: string) => walletManager.getSigner(address)
export const getAvailableExtensions = () => walletManager.getAvailableExtensions()
export const getExtensionDisplayName = (extensionName: string) => walletManager.getExtensionDisplayName(extensionName)
