import type { Prefix } from '../utils/sdk'
import { useConnect } from '../hooks/useConnect'
import { useTransaction } from '../hooks/useTransaction'
import { explorerDetail } from '../utils/formatters'

interface SignTransactionProps {
  chainKey: Prefix
}

export default function SignTransaction({ chainKey }: SignTransactionProps) {
  const { selectedAccount } = useConnect()
  const {
    isProcessing,
    result,
    txHash,
    signRemarkTransaction,
  } = useTransaction()

  async function signTransaction() {
    if (!selectedAccount)
      return

    const message = 'Hello from create-dot-app'

    await signRemarkTransaction(chainKey, message)
  }

  return (
    <div>
      {/* Status */}
      {isProcessing && (
        <div role="alert" className="alert alert-info mb-4">
          <span className="icon-[mdi--loading] animate-spin" />
          <span>
            Processing transaction...
          </span>
        </div>
      )}

      {/* Result */}
      {result && (
        <div role="alert" className={`alert mb-4 ${result.includes('Error') ? 'alert-error' : 'alert-success'}`}>
          {result.includes('Error')
            ? (
                <span className="icon-[mdi--alert-circle]" />
              )
            : (
                <span className="icon-[mdi--check-circle]" />
              )}
          <span>{result}</span>
        </div>
      )}

      {/* Transaction Hash Link */}
      {txHash && (
        <div className="mb-4 p-3 border border-gray-200">
          <div className="text-xs text-gray-500 uppercase tracking-wider mb-2">
            Transaction Hash
          </div>
          <div className="text-sm text-gray-800 font-mono break-all mb-2 truncate">
            {txHash}
          </div>
          <a
            href={explorerDetail(chainKey, txHash)}
            target="_blank"
            className="inline-flex items-center gap-1 text-xs text-gray-600 hover:text-black transition-colors uppercase tracking-wider"
          >
            View on Subscan
            {' '}
            <span className="icon-[mdi--open-in-new]" />
          </a>
        </div>
      )}

      {/* Action */}
      {selectedAccount
        ? (
            <button
              type="button"
              disabled={isProcessing}
              className="btn btn-sm btn-neutral w-full uppercase tracking-wider"
              onClick={signTransaction}
            >
              {isProcessing && <span className="icon-[mdi--loading] animate-spin" />}
              {isProcessing ? 'Processing...' : 'Sign Transaction'}
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
