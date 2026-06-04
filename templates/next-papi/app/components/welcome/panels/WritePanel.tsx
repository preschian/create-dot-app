'use client'

import type { NetworkInfo } from '../networks'
import React from 'react'
import { useConnect } from '../../../hooks/use-connect'
import { useTransaction } from '../../../hooks/use-transaction'
import { buyTokenUrl, explorerDetail } from '../../../utils/formatters'
import { formatAddress } from '../format'
import { isTestnet } from '../networks'
import { EYEBROW, LIVE_CELL, REMARK_MESSAGE, WRITE_STEPS } from '../shared'
import { Ic } from '../ui/icons'

interface Props {
  net: NetworkInfo
}

export function WritePanel({ net }: Props) {
  const { selectedAccount, openConnectModal } = useConnect()
  const { stage, txHash, error, pending, reset, signRemark } = useTransaction()

  const connected = !!selectedAccount
  const address = selectedAccount?.address

  const stageIndex
    = stage === 'finalized' ? 3 : stage === 'inBlock' ? 2 : stage === 'broadcasting' ? 1 : -1

  const submit = () => {
    if (pending)
      return
    if (!connected) {
      openConnectModal()
      return
    }
    if (stage === 'finalized')
      reset()
    signRemark(net.key, REMARK_MESSAGE)
  }

  const cta = pending
    ? 'Submitting…'
    : stage === 'finalized'
      ? 'Run again'
      : !connected
        ? 'Connect to send'
        : 'Send extrinsic'

  return (
    <div className={LIVE_CELL}>
      <div className="flex items-center justify-between">
        <span className={EYEBROW}>TRY THE WRITE PATH</span>
        <span className="font-mono text-[11.5px] text-(--faint)">
          signer:
          {' '}
          {connected && address ? formatAddress(address, 8, 4) : 'not connected'}
        </span>
      </div>

      <div className="mt-3.5 flex items-start justify-between gap-5 welcome-sm:flex-col welcome-sm:items-stretch welcome-sm:gap-3.5">
        <div className="min-w-0">
          <div className="text-xl font-semibold tracking-tight text-(--ink)">Submit a sample extrinsic</div>
          <div className="mt-1.5 font-mono text-[12.5px] text-(--dim)">
            system.remark(
            <span className="text-(--acc)">
              &quot;
              {REMARK_MESSAGE}
              &quot;
            </span>
            )
          </div>
        </div>
        <button
          type="button"
          onClick={submit}
          disabled={pending}
          className={`inline-flex min-w-[172px] shrink-0 items-center justify-center gap-2 border-[1.5px] border-(--acc) px-[18px] py-[11px] font-mono text-[13px] font-semibold whitespace-nowrap transition-[transform,background,color] duration-150 welcome-sm:w-full ${
            pending
              ? 'cursor-default bg-transparent text-(--acc) opacity-70'
              : 'cursor-pointer bg-(--acc) text-(--paper) hover:-translate-y-px'
          }`}
        >
          {cta}
          {pending
            ? <Ic.Spinner className="animate-ns-spin text-[15px]" />
            : <Ic.Arrow className="text-[15px]" />}
        </button>
      </div>

      <div className="mt-[18px] flex items-center">
        {WRITE_STEPS.map((labelText, i) => {
          const active = stageIndex >= i
          const pulsing = active && i === stageIndex && pending
          return (
            <React.Fragment key={labelText}>
              <div className="flex items-center gap-1.75">
                <span
                  className={`inline-block size-[11px] shrink-0 rounded-full border-[1.5px] transition-all duration-200 ${
                    active
                      ? 'border-(--acc) bg-(--acc)'
                      : 'border-(--line) bg-transparent'
                  } ${pulsing ? 'shadow-(0_0_0_4px_color-mix(in_srgb,var(--acc)_22%,transparent))' : ''}`}
                />
                <span
                  className={`font-mono text-[11.5px] transition-colors duration-200 ${active ? 'text-(--ink)' : 'text-(--faint)'}`}
                >
                  {labelText}
                </span>
              </div>
              {i < WRITE_STEPS.length - 1 && (
                <div
                  className={`mx-2.25 h-[1.5px] flex-1 transition-[background] duration-200 ${stageIndex > i ? 'bg-(--acc)' : 'bg-(--line)'}`}
                />
              )}
            </React.Fragment>
          )
        })}
      </div>

      <div className="mt-3.5 flex min-h-[22px] flex-col gap-1.5">
        {error
          ? (
              <div className="font-mono text-xs text-(--acc)">{error}</div>
            )
          : stage === 'finalized' && txHash
            ? (
                <div className="flex flex-wrap items-center gap-2.5 font-mono text-xs">
                  <span className="inline-flex items-center gap-1.25 font-semibold text-(--acc)">
                    <Ic.Check className="text-[13px]" />
                    {' '}
                    Finalized
                  </span>
                  <span className="text-(--faint)">system.remark</span>
                  <a
                    href={explorerDetail(net.key, txHash)}
                    target="_blank"
                    rel="noreferrer"
                    title="View transaction on Subscan"
                    className="text-(--dim) no-underline transition-colors duration-150 hover:text-(--acc)"
                  >
                    {formatAddress(txHash, 8, 4)}
                  </a>
                </div>
              )
            : txHash
              ? (
                  <div className="flex flex-wrap items-center gap-2.5 font-mono text-xs text-(--dim)">
                    <span className="text-(--ink)">In a best block…</span>
                    <span className="text-(--faint)">waiting for finalization</span>
                    <span className="text-(--faint)">{formatAddress(txHash, 8, 4)}</span>
                  </div>
                )
              : pending
                ? (
                    <div className="font-mono text-xs text-(--dim)">Broadcasting to the network…</div>
                  )
                : !connected
                    ? (
                        <div className="font-mono text-xs text-(--faint)">
                          Connect a wallet to sign a remark on
                          {' '}
                          {net.name}
                          .
                        </div>
                      )
                    : isTestnet(net)
                      ? (
                          <a
                            href={buyTokenUrl(net.key, address)}
                            target="_blank"
                            rel="noreferrer"
                            className="group inline-flex items-center gap-1.5 font-mono text-xs text-(--faint) no-underline transition-colors duration-150 hover:text-(--acc)"
                          >
                            Need
                            {' '}
                            {net.token}
                            ? Open the faucet
                            <Ic.Ext className="text-[13px] transition-transform duration-150 group-hover:translate-x-[2px]" />
                          </a>
                        )
                      : (
                          <div className="font-mono text-xs text-(--faint)">No extrinsics submitted yet.</div>
                        )}
      </div>
    </div>
  )
}
