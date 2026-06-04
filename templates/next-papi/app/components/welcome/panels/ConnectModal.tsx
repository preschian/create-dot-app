'use client'

// Wallet + account picker for Talisman Connect, styled to match the welcome screen.
// Built on the native <dialog> element (showModal) so focus trapping, Escape, and
// the backdrop come for free. Visibility is driven by the shared `connectModalOpen`
// atom. Wallet logos ship as data: URIs from @talismn/connect-wallets.
import type { Wallet, WalletAccount } from '@talismn/connect-wallets'
import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import { useConnect } from '../../../hooks/use-connect'
import { formatAddress } from '../format'
import { Ic } from '../ui/icons'

export function ConnectModal() {
  const {
    connectModalOpen,
    closeConnectModal,
    listAccounts,
    selectedAccount,
    connectedWallet,
    isConnecting,
    installedWallets,
    availableWallets,
    connect,
    selectAccount,
  } = useConnect()

  const dialogRef = useRef<HTMLDialogElement>(null)
  const [showOthers, setShowOthers] = useState(false)

  // Drive the native dialog from the shared open state. showModal() handles focus
  // trapping, Escape-to-close, and an inert background for us.
  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog)
      return

    if (connectModalOpen && !dialog.open)
      dialog.showModal()
    else if (!connectModalOpen && dialog.open)
      dialog.close()
  }, [connectModalOpen])

  // Dismiss when the backdrop is clicked (a click whose target is the dialog box
  // itself). Attached imperatively rather than as a JSX handler — keyboard users
  // dismiss via Escape (native to showModal) or the Close button.
  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog)
      return

    const onBackdropClick = (e: MouseEvent) => {
      if (e.target === dialog)
        closeConnectModal()
    }
    dialog.addEventListener('click', onBackdropClick)
    return () => dialog.removeEventListener('click', onBackdropClick)
  }, [closeConnectModal])

  // Compare by title, not extensionName: distinct wallets (e.g. Nova Wallet and
  // Polkadot.js) can share an extensionName, so only the one actually picked
  // should read as connected.
  const isWalletActive = (w: Wallet) => connectedWallet?.title === w.title
  const isAccountActive = (a: WalletAccount) => selectedAccount?.address === a.address

  const chooseAccount = (a: WalletAccount) => {
    selectAccount(a)
    closeConnectModal()
  }

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby="connect-wallet-title"
      onClose={closeConnectModal}
      className="m-auto max-h-[88vh] w-full max-w-[520px] overflow-y-auto border border-(--line) bg-(--card) p-0 text-(--ink) shadow-(0_24px_70px_rgba(0,0,0,.3)) [&::backdrop]:bg-black/45 [&::backdrop]:backdrop-blur-[2px]"
    >
      {connectModalOpen && (
        <div className="animate-popover-rise">
          <div className="flex items-center justify-between border-b border-(--line) px-6 py-4">
            <span id="connect-wallet-title" className="font-mono text-[11px] font-semibold tracking-[0.12em] text-(--faint)">CONNECT WALLET</span>
            <button
              type="button"
              onClick={closeConnectModal}
              aria-label="Close"
              className="inline-flex size-7 cursor-pointer items-center justify-center border border-(--line) bg-transparent text-(--dim) transition-[border-color,color] duration-150 hover:border-(--acc) hover:text-(--acc)"
            >
              <Ic.Close className="text-[15px]" />
            </button>
          </div>

          <div className="px-6 py-5">
            {listAccounts.length > 0 && (
              <section className="mb-6">
                <div className="mb-3 font-mono text-[10.5px] font-semibold tracking-[0.12em] text-(--faint)">SELECT ACCOUNT</div>
                <div className="flex flex-col gap-2">
                  {listAccounts.map((a) => {
                    const active = isAccountActive(a)
                    return (
                      <button
                        key={a.address}
                        type="button"
                        onClick={() => chooseAccount(a)}
                        className={`flex items-center justify-between gap-3 border px-4 py-3 text-left transition-[border-color,background] duration-150 hover:border-(--acc) ${
                          active
                            ? 'border-(--acc) bg-(color-mix(in_srgb,var(--acc)_6%,transparent))'
                            : 'border-(--line) bg-transparent'
                        }`}
                      >
                        <span className="min-w-0">
                          <span className="block truncate text-sm font-semibold text-(--ink)">{a.name}</span>
                          <span className="mt-px block font-mono text-[11px] text-(--faint)">{formatAddress(a.address, 8, 6)}</span>
                        </span>
                        {active && <Ic.Check className="shrink-0 text-base text-(--acc)" />}
                      </button>
                    )
                  })}
                </div>
              </section>
            )}

            <section>
              <div className="mb-3 font-mono text-[10.5px] font-semibold tracking-[0.12em] text-(--faint)">
                {listAccounts.length > 0 ? 'WALLET' : 'INSTALLED WALLETS'}
              </div>
              {installedWallets.length > 0
                ? (
                    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                      {installedWallets.map((w) => {
                        const active = isWalletActive(w)
                        const connectingThis = isConnecting === w.title
                        return (
                          <button
                            key={`${w.extensionName}-${w.title}`}
                            type="button"
                            onClick={() => connect(w)}
                            disabled={connectingThis}
                            className={`flex flex-col items-center gap-2 border px-3 py-4 text-center transition-[border-color,background] duration-150 hover:border-(--acc) disabled:cursor-default ${
                              active ? 'border-(--acc)' : 'border-(--line)'
                            }`}
                          >
                            <Image src={w.logo.src} alt={w.logo.alt} width={32} height={32} className="size-8" unoptimized />
                            <span className="text-xs font-semibold text-(--ink)">{w.title}</span>
                            <span className="font-mono text-[10px] text-(--faint)">
                              {connectingThis ? 'connecting…' : active ? 'connected' : 'connect'}
                            </span>
                          </button>
                        )
                      })}
                    </div>
                  )
                : (
                    <p className="m-0 border border-dashed border-(--line) px-4 py-3.5 text-[13px] leading-normal text-(--dim)">
                      No Polkadot wallet detected. Install one below, then reopen this dialog.
                    </p>
                  )}
            </section>

            {availableWallets.length > 0 && (
              <section className="mt-6">
                <div className="flex items-center justify-between">
                  <div className="font-mono text-[10.5px] font-semibold tracking-[0.12em] text-(--faint)">OTHER WALLETS</div>
                  <button
                    type="button"
                    onClick={() => setShowOthers(s => !s)}
                    className="cursor-pointer bg-transparent font-mono text-[11px] font-semibold text-(--acc)"
                  >
                    {showOthers ? 'Hide' : 'Show'}
                  </button>
                </div>
                {showOthers && (
                  <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
                    {availableWallets.map(w => (
                      <a
                        key={`${w.extensionName}-${w.title}`}
                        href={w.installUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex flex-col items-center gap-2 border border-(--line) px-3 py-4 text-center text-(--ink) no-underline transition-[border-color] duration-150 hover:border-(--acc)"
                      >
                        <Image src={w.logo.src} alt={w.logo.alt} width={32} height={32} className="size-8 opacity-60" unoptimized />
                        <span className="text-xs font-semibold">{w.title}</span>
                        <span className="inline-flex items-center gap-1 font-mono text-[10px] text-(--faint)">
                          Install
                          <Ic.Ext className="text-[11px]" />
                        </span>
                      </a>
                    ))}
                  </div>
                )}
              </section>
            )}
          </div>
        </div>
      )}
    </dialog>
  )
}
