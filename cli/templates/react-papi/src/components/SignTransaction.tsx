import type { Prefix } from '../utils/sdk'
import { useMemo, useState } from 'react'
import { useConnect } from '../hooks/useConnect'
import { useStatus } from '../hooks/useStatus'
import { useTransaction } from '../hooks/useTransaction'

export default function SignTransaction() {
  const { selectedAccount } = useConnect()
  const { connectedNetworks } = useStatus()
  const {
    isProcessing,
    result,
    txHash,
    signRemarkTransaction,
    getSubscanLink,
  } = useTransaction()

  const [selectedChain, setSelectedChain] = useState<Prefix>('asset_hub')

  const chainOptions = useMemo(
    () =>
      connectedNetworks.map(network => ({
        value: network.key,
        label: network.name,
      })),
    [connectedNetworks],
  )

  async function handleSignTransaction() {
    if (!selectedAccount)
      return

    const message = `Test from ${selectedAccount.address} with ${selectedAccount.wallet?.extensionName}`

    await signRemarkTransaction(selectedChain, message)
  }

  return (
    <div>
      {/* Chain Selector */}
      <div className="mb-4">
        <label className="block text-xs text-gray-500 uppercase tracking-wider mb-2">Select Chain</label>
        <select
          value={selectedChain}
          onChange={e => setSelectedChain(e.target.value as Prefix)}
          disabled={isProcessing}
          className="select select-neutral w-full"
        >
          {chainOptions.map(chain => (
            <option key={chain.value} value={chain.value}>
              {chain.label}
            </option>
          ))}
        </select>
      </div>

      {/* Status */}
      {isProcessing && (
        <div role="alert" className="alert alert-info mb-4">
          <span className="icon-[mdi--loading] animate-spin" />
          <span>
            Processing transaction on
            {' '}
            {chainOptions.find(c => c.value === selectedChain)?.label}
            ...
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
          <div className="text-sm text-gray-800 font-mono break-all mb-2">
            {txHash}
          </div>
          <a
            href={getSubscanLink(selectedChain, txHash)}
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
              disabled={isProcessing}
              className="btn btn-neutral btn-block uppercase tracking-wider"
              onClick={handleSignTransaction}
            >
              {isProcessing && <span className="icon-[mdi--loading] animate-spin" />}
              {isProcessing ? 'Processing...' : 'Sign Transaction'}
            </button>
          )
        : (
            <div role="alert" className="alert alert-warning">
              <span className="icon-[mdi--wallet-outline]" />
              <span>Please connect your wallet first</span>
            </div>
          )}
    </div>
  )
}
