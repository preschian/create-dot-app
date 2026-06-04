'use client'

import type { NetworkInfo } from '../networks'
import { useCurrentBlock } from '../../../hooks/use-current-block'
import { EYEBROW, LIVE_CELL } from '../shared'
import { LiveDot } from '../ui/icons'

interface Props {
  net: NetworkInfo
}

export function BlockPanel({ net }: Props) {
  const { name, token, currentBlock, blockHash, finalized, isConnected } = useCurrentBlock(net.key)

  const reconnecting = !isConnected
  const chainLabel = name || net.name
  const tokenLabel = token || net.token

  return (
    <div
      className={`border-r border-(--line) ${LIVE_CELL} welcome-md:border-r-0 welcome-md:border-b`}
    >
      <div className="flex items-center justify-between">
        <span className={EYEBROW}>NETWORK</span>
        <span
          className={`inline-flex items-center gap-2 font-mono text-[11.5px] ${reconnecting ? 'text-(--faint)' : 'text-(--dim)'}`}
        >
          <LiveDot color={reconnecting ? 'var(--faint)' : net.color} />
          {reconnecting ? 'syncing…' : 'connected'}
        </span>
      </div>

      <div className="mt-[18px] flex items-baseline gap-2.5">
        <span className="font-mono text-[15px] font-semibold text-(--acc)">#</span>
        <span className="inline-block font-mono text-[clamp(36px,5.2vw,52px)] leading-none font-semibold tracking-tight text-(--ink) tabular-nums welcome-sm:text-[clamp(34px,11vw,52px)]">
          {currentBlock > 0
            ? currentBlock
                .toLocaleString('en-US')
                .split('')
                .map((ch, i) => (
                  <span key={`${i}-${ch}`} className="inline-block animate-block-bump">
                    {ch}
                  </span>
                ))
            : '—'}
        </span>
      </div>
      <div className="mt-2 font-mono text-xs text-(--faint)">
        {blockHash ? `${blockHash.slice(0, 10)}…` : '0x…'}
        {' · '}
        {net.transport}
      </div>

      <div className="mt-5 flex flex-wrap gap-x-7 gap-y-3.5">
        {[
          ['Finalized', finalized > 0 ? `#${finalized.toLocaleString('en-US')}` : '—'],
          ['Chain', chainLabel],
          ['Token', tokenLabel],
        ].map(([k, v]) => (
          <div key={k}>
            <div className="font-mono text-[10.5px] tracking-widest text-(--faint)">{k.toUpperCase()}</div>
            <div className="mt-1 font-mono text-sm text-(--ink)">{v}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
