'use client'

// Top-bar network selector. Click to open a dropdown of the available chains;
// selecting one commits immediately via the parent-owned chain key. Switching
// just points the light client at a different chain — the next chain warp-syncs
// on demand.
import type { Prefix } from '../../../utils/sdk'
import type { NetworkInfo } from '../networks'
import { useRef, useState } from 'react'
import { NETWORKS } from '../networks'
import { Ic, LiveDot } from '../ui/icons'
import { useDismissible } from '../useDismissible'
import { PopoverPanel } from '../ui/PopoverPanel'

interface Props {
  net: NetworkInfo
  onSwitch: (key: Prefix) => void
}

export function NetworkSwitch({ net, onSwitch }: Props) {
  const [open, setOpen] = useState(false)
  const wrapRef = useRef<HTMLSpanElement>(null)
  useDismissible(open, () => setOpen(false), wrapRef)

  const choose = (n: NetworkInfo) => {
    if (n.key !== net.key) {
      onSwitch(n.key)
    }
    setOpen(false)
  }

  return (
    <span ref={wrapRef} className="relative inline-flex min-w-0 overflow-visible welcome-sm:w-full">
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        aria-label="Switch network"
        className="inline-flex min-w-0 cursor-pointer items-center gap-2 border border-(--line) bg-transparent px-3 py-2 font-mono text-[12.5px] font-medium text-(--ink) transition-[border-color,background] duration-150 hover:border-(--acc) welcome-sm:w-full sm:gap-2.25 sm:py-2.25"
      >
        <LiveDot color={net.color} size="md" />
        <span className="min-w-0 truncate sm:whitespace-nowrap">
          <span className="sm:hidden">{net.chain}</span>
          <span className="hidden sm:inline">{net.name}</span>
        </span>
        <svg
          viewBox="0 0 24 24"
          width="13"
          height="13"
          fill="none"
          className={`shrink-0 transition-transform duration-150 ${open ? 'rotate-180' : ''}`}
        >
          <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {open && (
        <PopoverPanel className="sm:left-auto sm:right-0 sm:w-[308px] sm:max-w-[308px]">
          <div className="border-b border-(--line) px-[18px] pt-[13px] pb-[11px]">
            <div className="font-mono text-[10.5px] font-semibold tracking-[0.12em] text-(--faint)">
              SWITCH NETWORK
            </div>
          </div>
          {NETWORKS.map((n, i) => {
            const active = n.key === net.key
            return (
              <button
                key={n.key}
                type="button"
                onClick={() => choose(n)}
                className={`flex w-full cursor-pointer items-center gap-3 px-[18px] py-[13px] text-left transition-[background] duration-150 hover:bg-(color-mix(in_srgb,var(--acc)_8%,transparent)) ${
                  active ? 'bg-(color-mix(in_srgb,var(--acc)_6%,transparent))' : 'bg-transparent'
                } ${i < NETWORKS.length - 1 ? 'border-b border-(--line)' : ''}`}
              >
                <span className="size-2.5 shrink-0 rounded-full" style={{ background: n.color }} />
                <span className="min-w-0 flex-1">
                  <span className="flex items-center gap-2">
                    <span className="text-[14.5px] font-semibold text-(--ink)">{n.name}</span>
                    <span
                      className="rounded-[3px] border px-[5px] py-px font-mono text-[9px] font-semibold tracking-[0.08em]"
                      style={{
                        color: n.color,
                        borderColor: `color-mix(in srgb, ${n.color} 45%, transparent)`,
                      }}
                    >
                      {n.tag}
                    </span>
                  </span>
                  <span className="mt-[3px] block truncate font-mono text-[11px] text-(--faint)">
                    {n.transport}
                  </span>
                </span>
                <span className="inline-flex w-[18px] shrink-0 items-center justify-center">
                  {active ? <Ic.Check className="text-base text-(--acc)" /> : null}
                </span>
              </button>
            )
          })}
        </PopoverPanel>
      )}
    </span>
  )
}
