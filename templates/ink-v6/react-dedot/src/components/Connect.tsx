import { useRef, useState } from 'react'
import { useConnect } from '../hooks/useConnect'
import { stripAddress } from '../utils/formatters'

export default function Connect() {
  const modalRef = useRef<HTMLDialogElement>(null)
  const [showOtherWallets, setShowOtherWallets] = useState(false)

  const {
    listAccounts,
    selectedAccount,
    connectedWallet,
    isConnecting,
    installedWallets,
    availableWallets,
    connect,
    selectAccount,
    disconnect,
  } = useConnect()

  function handleSelectAccount(account: typeof selectedAccount) {
    if (account) {
      selectAccount(account)
      modalRef.current?.close()
    }
  }

  function openConnectModal() {
    modalRef.current?.showModal()
  }

  function closeConnectModal() {
    modalRef.current?.close()
  }

  function toggleOtherWallets() {
    setShowOtherWallets(!showOtherWallets)
  }

  function isWalletConnected(wallet: typeof connectedWallet) {
    return connectedWallet?.extensionName === wallet?.extensionName
  }

  function isAccountSelected(account: typeof selectedAccount) {
    return selectedAccount?.address === account?.address
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
          {!selectedAccount
            ? (
                <div className="flex items-center gap-2">
                  <span className="icon-[mdi--wallet] w-4 h-4" />
                  <span>Connect Wallet</span>
                </div>
              )
            : (
                <div className="flex items-center gap-2">
                  <span className="icon-[mdi--wallet] w-4 h-4" />
                  <span className="hidden sm:block">{selectedAccount.name}</span>
                  <img
                    src={connectedWallet?.logo.src}
                    alt={connectedWallet?.logo.alt}
                    className="w-4 h-4"
                  />
                </div>
              )}
        </button>

        {/* Disconnect Button (only shown when connected) */}
        {selectedAccount
          ? (
              <button
                type="button"
                className="btn btn-outline btn-sm font-mono"
                onClick={disconnect}
              >
                <span className="icon-[mdi--logout] w-4 h-4" />
              </button>
            )
          : null}
      </div>

      {/* Modal using HTML dialog element */}
      <dialog ref={modalRef} className="modal modal-bottom sm:modal-middle">
        <div className="modal-box max-w-2xl">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-medium text-black uppercase tracking-wider">
              CONNECT WALLET
            </h2>
            <button type="button" className="btn btn-sm btn-circle btn-ghost" onClick={closeConnectModal}>
              <span className="icon-[mdi--close]" />
            </button>
          </div>

          {/* Account Selection */}
          {listAccounts.length > 0
            ? (
                <div className="mb-6">
                  <h3 className="text-xs text-gray-500 uppercase tracking-wider mb-3">
                    Select Account
                  </h3>
                  <div className="space-y-2">
                    {listAccounts.map(account => (
                      <div
                        key={account.address}
                        className={`card card-compact bg-base-100 border cursor-pointer hover:shadow-md transition-shadow ${
                          isAccountSelected(account)
                            ? 'border-primary'
                            : 'border-base-300 hover:border-primary'
                        }`}
                        onClick={() => handleSelectAccount(account)}
                      >
                        <div className="card-body">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center mr-2">
                                <span className="icon-[mdi--account] text-gray-500" />
                              </div>
                              <div>
                                <p className="text-sm font-medium text-black">
                                  {account.name}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {stripAddress(account.address)}
                                </p>
                              </div>
                            </div>
                            {isAccountSelected(account)
                              ? (
                                  <div className="w-2 h-2 bg-primary rounded-full" />
                                )
                              : null}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )
            : null}

          {/* Installed */}
          {installedWallets.length > 0
            ? (
                <div className="mb-6">
                  <h3 className="text-xs text-gray-500 uppercase tracking-wider mb-3">
                    Installed
                  </h3>
                  <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                    {installedWallets.map(wallet => (
                      <div
                        key={wallet.installUrl}
                        className={`card card-compact bg-base-100 border cursor-pointer hover:shadow-md transition-shadow ${
                          isWalletConnected(wallet)
                            ? 'border-success'
                            : 'border-base-300 hover:border-primary'
                        }`}
                        onClick={() => connect(wallet)}
                      >
                        <div className="card-body items-center text-center">
                          <div className="relative">
                            <img
                              src={wallet.logo.src}
                              alt={wallet.logo.alt}
                              className="w-12 h-12"
                            />
                            {isWalletConnected(wallet)
                              ? (
                                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-success rounded-full flex items-center justify-center">
                                    <span className="icon-[mdi--check] w-2 h-2 text-white" />
                                  </div>
                                )
                              : null}
                          </div>
                          <div className="text-xs font-medium text-black">
                            {wallet.title}
                          </div>
                          <button
                            type="button"
                            disabled={isConnecting === wallet.extensionName}
                            className="btn btn-neutral btn-sm w-32 uppercase tracking-wider"
                          >
                            {isConnecting === wallet.extensionName
                              ? (
                                  <span className="icon-[mdi--loading] animate-spin" />
                                )
                              : null}
                            {isWalletConnected(wallet)
                              ? (
                                  'Connected'
                                )
                              : isConnecting === wallet.extensionName
                                ? (
                                    'Connecting'
                                  )
                                : (
                                    'Connect'
                                  )}
                            {!isWalletConnected(wallet)
                              ? (
                                  <span className="icon-[mdi--chevron-right]" />
                                )
                              : null}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )
            : null}

          {/* Other Wallets */}
          {availableWallets.length > 0
            ? (
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xs text-gray-500 uppercase tracking-wider">
                      Other wallets
                    </h3>
                    <button type="button" className="btn btn-ghost btn-sm" onClick={toggleOtherWallets}>
                      {showOtherWallets ? 'Hide' : 'Show'}
                      <span
                        className={showOtherWallets ? 'icon-[mdi--chevron-up]' : 'icon-[mdi--chevron-down]'}
                      />
                    </button>
                  </div>
                  {showOtherWallets
                    ? (
                        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                          {availableWallets.map(wallet => (
                            <div
                              key={wallet.installUrl}
                              className="card card-compact bg-base-100 border border-base-300 hover:border-primary hover:shadow-md transition-all"
                            >
                              <div className="card-body items-center text-center">
                                <img
                                  src={wallet.logo.src}
                                  alt={wallet.logo.alt}
                                  className="w-12 h-12 opacity-60"
                                />
                                <div className="text-xs font-medium text-black">
                                  {wallet.title}
                                </div>
                                <a
                                  href={wallet.installUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="btn btn-neutral btn-sm w-32 uppercase tracking-wider"
                                >
                                  <span>Download</span>
                                  <span className="icon-[mdi--download]" />
                                </a>
                              </div>
                            </div>
                          ))}
                        </div>
                      )
                    : null}
                </div>
              )
            : null}
        </div>
        <form method="dialog" className="modal-backdrop">
          <button type="button">close</button>
        </form>
      </dialog>
    </>
  )
}
