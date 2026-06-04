'use client'

// Wallet + account picker for Talisman Connect, styled to match the welcome screen.
// Visibility is driven by the shared `connectModalOpen` atom, so any control can
// open it. Wallet logos ship as data: URIs from @talismn/connect-wallets.
import type { Wallet, WalletAccount } from '@talismn/connect-wallets'
import Image from 'next/image'
import { useEffect, useState } from 'react'
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

  const [showOthers, setShowOthers] = useState(false)

  useEffect(() => {
    if (!connectModalOpen)
      return

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape')
        closeConnectModal()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [connectModalOpen, closeConnectModal])

  if (!connectModalOpen)
    return null

  const isWalletActive = (w: Wallet) => connectedWallet?.extensionName === w.extensionName
  const isAccountActive = (a: WalletAccount) => selectedAccount?.address === a.address

  const chooseAccount = (a: WalletAccount) => {
    selectAccount(a)
    closeConnectModal()
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/45 backdrop-blur-[2px] sm:items-center sm:p-4"
      onMouseDown={closeConnectModal}
    >
      <div
        className="animate-popover-rise max-h-[88vh] w-full max-w-[520px] overflow-y-auto border border-(--line) bg-(--card) shadow-(0_24px_70px_rgba(0,0,0,.3))"
        onMouseDown={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-(--line) px-6 py-4">
          <span className="font-mono text-[11px] font-semibold tracking-[0.12em] text-(--faint)">CONNECT WALLET</span>
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
                      const connectingThis = isConnecting === w.extensionName
                      return (
                        <button
                          key={w.extensionName}
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
                      key={w.extensionName}
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
    </div>
  )
}
