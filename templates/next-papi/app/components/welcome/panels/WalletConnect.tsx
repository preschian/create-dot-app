'use client'

// Connect Wallet control. Not connected → opens the shared connect modal. Connected
// → an account button with a dropdown showing the balance on the active chain (read
// through the light client) plus switch-account / disconnect.
import type { NetworkInfo } from '../networks'
import { useEffect, useRef, useState } from 'react'
import { useConnect } from '../../../hooks/use-connect'
import { unifyAddress } from '../../../utils/formatters'
import { getBalance } from '../../../utils/sdk-interface'
import { formatAddress } from '../format'
import { Ic } from '../ui/icons'
import { useDismissible } from '../useDismissible'
import { PopoverPanel } from '../ui/PopoverPanel'

interface Props {
  net: NetworkInfo
}

export function WalletConnect({ net }: Props) {
  const { selectedAccount, connectedWallet, disconnect, openConnectModal } = useConnect()

  const [menu, setMenu] = useState(false)
  const wrapRef = useRef<HTMLSpanElement>(null)
  useDismissible(menu, () => setMenu(false), wrapRef)

  const connected = !!selectedAccount
  const address = selectedAccount?.address
  const label = selectedAccount?.name || 'Account'

  const [balance, setBalance] = useState<{ key: string, value: string, symbol: string } | null>(null)
  const balanceKey = `${net.key}:${address ?? ''}`

  useEffect(() => {
    if (!menu || !address)
      return

    let ignore = false
    const key = `${net.key}:${address}`
    getBalance(net.key, unifyAddress(address))
      .then(({ balance, symbol }) => {
        if (!ignore)
          setBalance({ key, value: balance, symbol })
      })
      .catch(() => {})

    return () => {
      ignore = true
    }
  }, [menu, net.key, address])

  // Only show the cached balance when it belongs to the active chain + account, so
  // a stale figure never flashes after switching networks.
  const shownBalance = balance && balance.key === balanceKey ? balance : null

  if (!connected || !address) {
    return (
      <button
        type="button"
        onClick={openConnectModal}
        className="inline-flex shrink-0 cursor-pointer items-center gap-2 border-[1.5px] border-(--ink) bg-transparent px-3 py-2 font-mono text-xs font-medium whitespace-nowrap text-(--ink) transition-[transform,background,color] duration-150 hover:-translate-y-px sm:px-4 sm:py-2.5 sm:text-[13px]"
      >
        <Ic.Wallet className="text-[15px]" />
        <span className="sm:hidden">Connect</span>
        <span className="hidden sm:inline">Connect Wallet</span>
      </button>
    )
  }

  return (
    <span ref={wrapRef} className="relative inline-flex">
      <button
        type="button"
        onClick={() => setMenu(m => !m)}
        className="inline-flex max-w-full min-w-0 cursor-pointer items-center gap-2 border-[1.5px] border-(--acc) bg-transparent px-3 py-2 font-mono text-xs font-medium text-(--ink) transition-[transform,background,color] duration-150 hover:-translate-y-px sm:max-w-none sm:px-4 sm:py-2.5 sm:text-[13px]"
      >
        <span className="inline-block size-2 shrink-0 rounded-full bg-(--acc) sm:size-2.25" />
        <span className="truncate">
          <span className="hidden sm:inline">
            {label}
            {' · '}
          </span>
          {formatAddress(address)}
        </span>
      </button>

      {menu && (
        <PopoverPanel className="right-0 z-30 w-72 welcome-sm:right-0">
          <div className="border-b border-(--line) px-[18px] py-4">
            <div className="flex items-center gap-2.5">
              <span className="inline-flex size-[30px] shrink-0 items-center justify-center rounded-full bg-(--acc) font-mono text-[13px] font-semibold text-white">
                {label[0]?.toUpperCase()}
              </span>
              <div className="min-w-0">
                <div className="truncate text-[15px] font-semibold text-(--ink)">{label}</div>
                <div className="font-mono text-[11px] text-(--faint)">
                  via
                  {' '}
                  {connectedWallet?.title ?? 'wallet'}
                </div>
              </div>
            </div>
            <div className="mt-3.25 flex items-baseline justify-between">
              <span className="font-mono text-[10.5px] tracking-widest text-(--faint)">BALANCE</span>
              <span className="font-mono text-[15px] tabular-nums text-(--ink)">
                {shownBalance ? shownBalance.value : '…'}
                {' '}
                <span className="text-xs text-(--dim)">{shownBalance?.symbol ?? net.token}</span>
              </span>
            </div>
            <div className="mt-1 break-all font-mono text-[11px] text-(--dim)">{formatAddress(address, 10, 8)}</div>
          </div>
          <button
            type="button"
            onClick={() => {
              setMenu(false)
              openConnectModal()
            }}
            className="block w-full cursor-pointer border-b border-(--line) bg-transparent px-[18px] py-3 text-left text-[13.5px] text-(--ink) transition-[background] duration-150 hover:bg-(color-mix(in_srgb,var(--acc)_8%,transparent))"
          >
            Switch account
          </button>
          <button
            type="button"
            onClick={() => {
              setMenu(false)
              disconnect()
            }}
            className="block w-full cursor-pointer bg-transparent px-[18px] py-3 text-left text-[13.5px] text-(--acc) transition-[background] duration-150 hover:bg-(color-mix(in_srgb,var(--acc)_8%,transparent))"
          >
            Disconnect
          </button>
        </PopoverPanel>
      )}
    </span>
  )
}
