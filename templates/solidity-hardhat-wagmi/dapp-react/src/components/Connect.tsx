import { useMemo, useRef } from 'react'
import { useAccount, useChainId, useConnect, useDisconnect } from 'wagmi'
import { shortenAddress } from '../utils/formatters'

// Popular wallets for when no connectors are available
const popularWallets = [
  {
    id: 'metamask',
    name: 'MetaMask',
    downloadUrl: 'https://metamask.io/download/',
  },
  {
    id: 'talisman',
    name: 'Talisman Wallet',
    downloadUrl: 'https://talisman.xyz/',
  },
]

export default function Connect() {
  const connectModalRef = useRef<HTMLDialogElement>(null)
  const chainId = useChainId()
  const { connect, connectors, error, status } = useConnect()
  const { disconnect } = useDisconnect()
  const { address, isConnected, connector } = useAccount()

  // Filter connectors to show only MetaMask and Talisman
  const filteredConnectors = useMemo(() => {
    return connectors.filter((connector) => {
      const name = connector.name.toLowerCase()
      const id = connector.id.toLowerCase()
      return name.includes('metamask')
        || name.includes('talisman')
        || id.includes('metamask')
        || id.includes('talisman')
    })
  }, [connectors])

  function openConnectModal() {
    connectModalRef.current?.showModal()
  }

  function closeConnectModal() {
    connectModalRef.current?.close()
  }

  function handleConnect(connector: any) {
    connect({ connector, chainId })
    closeConnectModal()
  }

  function handleDisconnect() {
    disconnect()
    localStorage.clear()
  }

  return (
    <>
      {/* Connect/Disconnect Buttons */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          className="btn btn-outline btn-sm font-mono"
          onClick={openConnectModal}
        >
          {!isConnected
            ? (
                <div className="flex items-center gap-2">
                  <span className="icon-[mdi--wallet] w-4 h-4" />
                  <span>Connect Wallet</span>
                </div>
              )
            : (
                <div className="flex items-center gap-2">
                  {connector?.icon
                    ? (
                        <img
                          src={connector.icon}
                          alt={connector.name}
                          className="w-4 h-4"
                        />
                      )
                    : (
                        <span className="icon-[mdi--wallet] w-4 h-4" />
                      )}
                  <span className="hidden sm:block">
                    {address ? shortenAddress(address) : ''}
                  </span>
                </div>
              )}
        </button>

        {/* Disconnect Button (only shown when connected) */}
        {isConnected && (
          <button
            type="button"
            className="btn btn-outline btn-sm font-mono"
            onClick={handleDisconnect}
          >
            <span className="icon-[mdi--logout] w-4 h-4" />
          </button>
        )}
      </div>

      {/* Modal */}
      <dialog ref={connectModalRef} className="modal modal-bottom sm:modal-middle">
        <div className="modal-box max-w-md">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-medium text-black uppercase tracking-wider">
              CONNECT WALLET
            </h2>
            <button type="button" className="btn btn-sm btn-circle btn-ghost" onClick={closeConnectModal}>
              <span className="icon-[mdi--close] w-4 h-4" />
            </button>
          </div>

          {/* Available Connectors */}
          {filteredConnectors.length > 0
            ? (
                <div className="mb-6">
                  <h3 className="text-xs text-gray-500 uppercase tracking-wider mb-3">
                    Available Wallets
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {filteredConnectors.map(conn => (
                      <div
                        key={conn.id}
                        className="card card-compact bg-base-100 border border-base-300 hover:border-primary hover:shadow-md transition-all cursor-pointer"
                        onClick={() => handleConnect(conn)}
                      >
                        <div className="card-body items-center text-center">
                          <div className="flex items-center justify-center w-12 h-12 mb-2">
                            {conn.icon
                              ? (
                                  <img
                                    src={conn.icon}
                                    alt={conn.name}
                                    className="w-8 h-8"
                                  />
                                )
                              : (
                                  <span className="icon-[mdi--wallet-outline] w-8 h-8" />
                                )}
                          </div>
                          <div className="text-sm font-medium text-black">
                            {conn.name}
                          </div>
                          <button
                            type="button"
                            disabled={status === 'pending'}
                            className="btn btn-neutral btn-sm w-32 uppercase tracking-wider mt-2"
                          >
                            {status === 'pending'
                              ? (
                                  <>
                                    <span className="icon-[mdi--loading] animate-spin" />
                                    <span>Connecting</span>
                                  </>
                                )
                              : (
                                  <>
                                    <span>Connect</span>
                                    <span className="icon-[mdi--chevron-right]" />
                                  </>
                                )}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )
            : (
          /* No Connectors Available - Show Popular Wallets */
                <div className="space-y-3">
                  <div className="text-center mb-4">
                    <div className="icon-[mdi--wallet-outline] w-16 h-16 mx-auto text-gray-300 mb-2" />
                    <p className="text-sm text-gray-500">
                      No wallet extensions detected
                    </p>
                    <p className="text-xs text-gray-400">
                      Download a wallet to get started
                    </p>
                  </div>

                  <h3 className="text-xs text-gray-500 uppercase tracking-wider mb-3">
                    Popular Wallets
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {popularWallets.map(wallet => (
                      <div
                        key={wallet.id}
                        className="card card-compact bg-base-100 border border-base-300 hover:border-primary hover:shadow-md transition-all"
                      >
                        <div className="card-body items-center text-center">
                          <div className="text-sm font-medium text-black mb-3">
                            {wallet.name}
                          </div>
                          <a
                            href={wallet.downloadUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-neutral btn-sm w-32 uppercase tracking-wider"
                          >
                            <span>Download</span>
                            <span className="icon-[mdi--download] w-4 h-4" />
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

          {/* Error Display */}
          {error && (
            <div className="alert alert-error mt-4">
              <span>{error.message}</span>
            </div>
          )}
        </div>
        <form method="dialog" className="modal-backdrop">
          <button type="button">close</button>
        </form>
      </dialog>
    </>
  )
}
