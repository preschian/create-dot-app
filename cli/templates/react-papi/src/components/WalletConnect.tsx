import type { InjectedAccountWithMeta } from '@polkadot/extension-inject/types'
import { useEffect, useRef, useState } from 'react'
import { useWallet } from '../hooks/useWallet'
import {
  connectWallet,
  disconnectWallet,
  getAvailableExtensions,
  getExtensionDisplayName,
  selectAccount,
  type WalletExtension,
} from '../utils/wallet'

export default function WalletConnect() {
  const {
    isConnected,
    isLoading,
    connectedExtension,
    accounts,
    selectedAccount,
    error,
  } = useWallet()

  // Local state
  const [availableExtensions, setAvailableExtensions] = useState<WalletExtension[]>([])
  const [showWalletMenu, setShowWalletMenu] = useState(false)
  const [showAccountMenu, setShowAccountMenu] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  // Computed
  const hasExtensions = availableExtensions.length > 0

  // Utility functions
  function formatAddress(address: string, length: number = 8): string {
    if (!address)
      return ''
    if (address.length <= length * 2)
      return address
    return `${address.slice(0, length)}...${address.slice(-length)}`
  }

  function getAccountDisplay(account: InjectedAccountWithMeta): string {
    return account.meta?.name || formatAddress(account.address)
  }

  // Methods
  async function loadExtensions() {
    try {
      const extensions = await getAvailableExtensions()
      setAvailableExtensions(extensions)
    }
    catch (err) {
      console.error('Failed to load extensions:', err)
    }
  }

  async function handleConnectWallet(extensionName?: string) {
    if (isLoading)
      return

    setShowWalletMenu(false)

    try {
      await connectWallet(extensionName)
      setShowAccountMenu(true)
    }
    catch (err) {
      console.error('Connection error:', err)
    }
  }

  function handleDisconnect() {
    disconnectWallet()
    setShowWalletMenu(false)
    setShowAccountMenu(false)
  }

  function handleSelectAccount(account: InjectedAccountWithMeta) {
    try {
      selectAccount(account)
      setShowAccountMenu(false)
    }
    catch (err) {
      console.error('Account selection error:', err)
    }
  }

  function closeMenus(event: MouseEvent) {
    if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
      setShowWalletMenu(false)
      setShowAccountMenu(false)
    }
  }

  // Lifecycle
  useEffect(() => {
    // Load available extensions
    loadExtensions()

    // Close menus when clicking outside
    document.addEventListener('click', closeMenus)
    return () => {
      document.removeEventListener('click', closeMenus)
    }
  }, [])

  return (
    <div className="flex items-center space-x-4" ref={menuRef}>
      {/* Error Message */}
      {error && (
        <div className="text-red-600 text-sm max-w-xs truncate">
          {error}
        </div>
      )}

      {/* Connect Wallet Button */}
      {!isConnected && hasExtensions && (
        <div className="relative">
          <button
            type="button"
            disabled={isLoading}
            className="bg-black hover:bg-gray-800 disabled:bg-gray-400 text-white px-6 py-3 font-medium transition-colors duration-200 uppercase tracking-wider text-sm relative h-12"
            onClick={(e: React.MouseEvent) => {
              e.stopPropagation()
              setShowWalletMenu(!showWalletMenu)
            }}
          >
            {isLoading
              ? (
                  <span className="flex items-center space-x-2">
                    <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span>Connecting...</span>
                  </span>
                )
              : (
                  <span>Connect Wallet</span>
                )}
          </button>

          {/* Wallet Selection Menu */}
          {showWalletMenu && !isLoading && (
            <div className="absolute right-0 top-full mt-2 w-64 bg-white border border-gray-200 shadow-lg z-50">
              <div className="p-4">
                <h3 className="text-sm font-medium text-gray-900 mb-3">
                  Select Wallet
                </h3>
                <div className="space-y-2">
                  {availableExtensions.map(extension => (
                    <button
                      type="button"
                      key={extension.name}
                      className="w-full flex items-center justify-between p-3 text-left hover:bg-gray-50 border border-gray-100 transition-colors"
                      onClick={() => handleConnectWallet(extension.name)}
                    >
                      <div>
                        <div className="font-medium text-gray-900">
                          {getExtensionDisplayName(extension.name)}
                        </div>
                        <div className="text-xs text-gray-500">
                          v
                          {extension.version}
                        </div>
                      </div>
                      <div className="w-2 h-2 bg-green-400 rounded-full" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* No Wallets Found */}
      {!isConnected && !hasExtensions && !isLoading && (
        <div>
          <button
            className="bg-gray-400 text-white px-6 py-3 font-medium uppercase tracking-wider text-sm cursor-not-allowed h-12"
            disabled
            onClick={() => loadExtensions()}
          >
            No Wallets Found
          </button>
        </div>
      )}

      {/* Connected Wallet Display */}
      {isConnected && (
        <div className="flex items-center space-x-3">
          <div className="relative">
            {/* Select Account Button (when no account selected) */}
            {!selectedAccount ? (
              <button
                type="button"
                className="flex items-center space-x-3 px-4 py-3 hover:bg-yellow-50 transition-colors border-2 border-yellow-300 bg-yellow-50 h-12 animate-pulse"
                onClick={(e: React.MouseEvent) => {
                  e.stopPropagation()
                  setShowAccountMenu(!showAccountMenu)
                }}
              >
                <div className="flex flex-col items-end">
                  <div className="text-sm font-medium text-yellow-800">
                    Select Account
                  </div>
                  <div className="text-xs text-yellow-600">
                    Choose wallet account
                  </div>
                </div>
                <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
              </button>
            ) : (
              /* Selected Account Display (when account is selected) */
              <div className="flex items-center space-x-3 px-4 py-3 border border-gray-200 h-12 bg-gray-50">
                <div className="flex flex-col items-end">
                  <div className="text-sm font-medium text-gray-900">
                    {getAccountDisplay(selectedAccount)}
                  </div>
                  <div className="text-xs text-gray-500">
                    {formatAddress(selectedAccount.address, 6)}
                  </div>
                </div>
                <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">
                    {selectedAccount.address.slice(0, 2).toUpperCase()}
                  </span>
                </div>
              </div>
            )}

            {/* Account Selection Menu (only when no account selected) */}
            {showAccountMenu && !selectedAccount && (
              <div className="absolute right-0 top-full mt-2 w-80 bg-white border border-gray-200 shadow-lg z-50">
                <div className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-medium text-gray-900">
                      Select Account
                    </h3>
                    <button
                      type="button"
                      className="text-xs text-gray-500 hover:text-gray-700"
                      onClick={(e: React.MouseEvent) => setShowAccountMenu(false)}
                    >
                      ✕
                    </button>
                  </div>

                  <div className="mb-3 p-3 bg-green-50 border border-green-200 rounded-md">
                    <div className="flex items-center space-x-2">
                      <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-sm text-green-800 font-medium">
                        {connectedExtension ? getExtensionDisplayName(connectedExtension) : 'Wallet'}
                        {' '}
                        Connected
                      </span>
                    </div>
                    <p className="text-xs text-green-700 mt-1">
                      Choose an account to continue.
                    </p>
                  </div>

                  {/* Account List */}
                  <div className="space-y-1">
                    {accounts.map(account => (
                      <button
                        type="button"
                        key={account.address}
                        className="w-full flex items-center space-x-3 p-3 text-left hover:bg-gray-50 border border-gray-100 transition-colors"
                        onClick={() => handleSelectAccount(account)}
                      >
                        <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs font-bold">
                            {account.address.slice(0, 2).toUpperCase()}
                          </span>
                        </div>
                        <div className="flex-1">
                          <div className="font-medium text-gray-900">
                            {getAccountDisplay(account)}
                          </div>
                          <div className="text-xs text-gray-500">
                            {formatAddress(account.address, 8)}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Connection Status & Disconnect Button */}
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <div
                className={`w-2 h-2 rounded-full ${
                  selectedAccount ? 'bg-green-400 animate-pulse' : 'bg-yellow-400 animate-bounce'
                }`}
              />
              <span className={`text-xs hidden sm:inline ${
                selectedAccount ? 'text-gray-500' : 'text-yellow-600'
              }`}
              >
                {selectedAccount ? 'Connected' : 'Select Account'}
              </span>
            </div>

            {/* Disconnect Button */}
            {selectedAccount && (
              <button
                type="button"
                className="text-xs text-red-600 hover:text-red-800 font-medium px-2 py-1 hover:bg-red-50 rounded transition-colors"
                onClick={handleDisconnect}
              >
                Disconnect
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
