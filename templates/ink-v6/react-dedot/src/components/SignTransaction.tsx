import type { Prefix } from '../utils/sdk'
import { useState } from 'react'
import { useConnect } from '../hooks/useConnect'
import { useContractTransaction } from '../hooks/useContractTransaction'
import { explorerDetail, stripAddress } from '../utils/formatters'

interface SignTransactionProps {
  chainKey: Prefix
  address?: string
}

export default function SignTransaction({ chainKey, address }: SignTransactionProps) {
  const { selectedAccount } = useConnect()
  const {
    isProcessing,
    result,
    txHash,
    flipContractValue,
  } = useContractTransaction(chainKey, address)

  const [showResult, setShowResult] = useState(true)
  const [showTxHash, setShowTxHash] = useState(true)

  async function handleFlip() {
    setShowResult(true)
    setShowTxHash(true)
    await flipContractValue()
  }

  function closeResult() {
    setShowResult(false)
  }

  function closeTxHash() {
    setShowTxHash(false)
  }

  return (
    <div>
      {/* Floating Toast Notifications */}
      <div className="toast toast-bottom toast-end z-50">
        {/* Processing State */}
        {isProcessing
          ? (
              <div role="alert" className="alert alert-info shadow-lg">
                <span className="icon-[mdi--loading] animate-spin" />
                <span>Processing transaction...</span>
              </div>
            )
          : null}

        {/* Result State */}
        {result && !isProcessing && showResult
          ? (
              <div role="alert" className={`alert shadow-lg ${result.includes('Error') ? 'alert-error' : 'alert-success'}`}>
                {result.includes('Error')
                  ? (
                      <span className="icon-[mdi--alert-circle]" />
                    )
                  : (
                      <span className="icon-[mdi--check-circle]" />
                    )}
                <span>{result}</span>
                <button type="button" className="btn btn-xs btn-ghost btn-square" onClick={closeResult}>
                  <span className="icon-[mdi--close]" />
                </button>
              </div>
            )
          : null}

        {/* Transaction Hash Toast */}
        {txHash && showTxHash
          ? (
              <div role="alert" className="alert alert-neutral shadow-lg">
                <div className="flex items-center gap-2">
                  <span className="icon-[mdi--link-variant]" />
                  <span className="text-xs uppercase tracking-wider">Transaction Hash</span>
                </div>
                <div className="text-xs font-mono break-all">
                  {stripAddress(txHash)}
                </div>
                <a
                  href={explorerDetail(txHash, chainKey)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs hover:underline"
                >
                  View on Explorer
                  {' '}
                  <span className="icon-[mdi--open-in-new]" />
                </a>
                <button type="button" className="btn btn-xs btn-ghost btn-square" onClick={closeTxHash}>
                  <span className="icon-[mdi--close]" />
                </button>
              </div>
            )
          : null}
      </div>

      {/* Action */}
      {selectedAccount
        ? (
            <button
              type="button"
              disabled={isProcessing}
              className="btn btn-sm btn-neutral w-full uppercase tracking-wider"
              onClick={handleFlip}
            >
              {isProcessing
                ? (
                    <span className="icon-[mdi--loading] animate-spin" />
                  )
                : (
                    <span className="icon-[mdi--toggle-switch]" />
                  )}
              {isProcessing ? 'Processing...' : 'Flip Contract Value'}
            </button>
          )
        : (
            <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
              <span className="icon-[mdi--wallet-outline]" />
              Connect wallet to sign transactions
            </div>
          )}
    </div>
  )
}
