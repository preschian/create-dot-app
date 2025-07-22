import { useRef, useState } from 'react'
import { useConnect } from '~/hooks/useConnect'
import Avatar from './Avatar'

export default function Connect() {
  const connectModal = useRef<HTMLDialogElement | null>(null)
  const [showOtherWallets, setShowOtherWallets] = useState(false)

  const {
    listAccounts,
    selectedAccount,
    connectedWallet,
    isConnecting,
    installedWallets,
    availableWallets,
    connect,
    disconnect,
    selectAccount,
  } = useConnect()

  function handleSelectAccount(account: any) {
    if (account) {
      selectAccount(account)
      connectModal.current?.close()
    }
  }

  function openConnectModal() {
    connectModal.current?.showModal()
  }

  function closeConnectModal() {
    connectModal.current?.close()
  }

  function toggleOtherWallets() {
    setShowOtherWallets(!showOtherWallets)
  }

  function isWalletConnected(wallet: any) {
    return connectedWallet?.extensionName === wallet?.extensionName
  }

  function isAccountSelected(account: any) {
    return selectedAccount?.address === account?.address
  }

  return (
    <div>
      {/* Connect Button */}
      {!selectedAccount
        ? (
            <button
              className="btn btn-neutral btn-sm uppercase tracking-wider"
              onClick={openConnectModal}
            >
              Connect Wallet
            </button>
          )
        : (
            // Connected Account Display
            <div className="flex items-center justify-between gap-2">
              <div className="hidden sm:block">
                <Avatar
                  name={selectedAccount.name}
                  address={selectedAccount.address}
                  status="online"
                />
              </div>
              <div className="flex gap-2">
                <button
                  className="btn btn-outline btn-sm uppercase tracking-wider hidden sm:block"
                  onClick={openConnectModal}
                >
                  Change
                </button>
                <button
                  className="btn btn-outline btn-sm uppercase tracking-wider"
                  onClick={disconnect}
                >
                  Disconnect
                </button>
              </div>
            </div>
          )}

      {/* Modal using HTML dialog element */}
      <dialog ref={connectModal} className="modal modal-bottom sm:modal-middle">
        <div className="modal-box max-w-2xl">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-medium text-black uppercase tracking-wider">
              CONNECT WALLET
            </h2>
            <button className="btn btn-sm btn-circle btn-ghost" onClick={closeConnectModal}>
              <span className="icon-[mdi--close]" />
            </button>
          </div>

          {/* Account Selection */}
          {listAccounts.length > 0 && (
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
                        <Avatar name={account.name} address={account.address} />
                        {isAccountSelected(account) && (
                          <div className="w-2 h-2 bg-primary rounded-full" />
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Installed */}
          {installedWallets.length > 0 && (
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
                        {isWalletConnected(wallet) && (
                          <div className="absolute -top-1 -right-1 w-4 h-4 bg-success rounded-full flex items-center justify-center">
                            <span className="icon-[mdi--check] w-2 h-2 text-white" />
                          </div>
                        )}
                      </div>
                      <div className="text-xs font-medium text-black">
                        {wallet.title}
                      </div>
                      <button
                        disabled={isConnecting === wallet.extensionName}
                        className="btn btn-neutral btn-sm w-32 uppercase tracking-wider"
                      >
                        {isConnecting === wallet.extensionName && (
                          <span className="icon-[mdi--loading] animate-spin" />
                        )}
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
                        {!isWalletConnected(wallet) && (
                          <span className="icon-[mdi--chevron-right]" />
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Other Wallets */}
          {availableWallets.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs text-gray-500 uppercase tracking-wider">
                  Other wallets
                </h3>
                <button className="btn btn-ghost btn-sm" onClick={toggleOtherWallets}>
                  {showOtherWallets ? 'Hide' : 'Show'}
                  <span
                    className={showOtherWallets ? 'icon-[mdi--chevron-up]' : 'icon-[mdi--chevron-down]'}
                  />
                </button>
              </div>
              {showOtherWallets && (
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
                          className="btn btn-neutral btn-sm w-32 uppercase tracking-wider"
                        >
                          <span>Download</span>
                          <span className="icon-[mdi--download]" />
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </div>
  )
}
