import { useState } from 'react'
import { useWallet } from '../hooks/useWallet'
import sdk from '../utils/sdk'
import { getSigner } from '../utils/wallet'

export default function SignTransaction() {
  const { selectedAccount } = useWallet()

  const [isSigning, setIsSigning] = useState(false)
  const [error, setError] = useState('')
  const [signResult, setSignResult] = useState('')

  async function handleTestSign() {
    if (!selectedAccount || isSigning) {
      console.error('Cannot sign: selectedAccount is null or already signing')
      setError('No account selected or already signing')
      return
    }

    // Starting transaction signing
    setIsSigning(true)
    setError('')
    setSignResult('')

    try {
      // Get PAPI client and signer
      const { api } = sdk('asset_hub')
      const signer = await getSigner()

      // Create a test transaction - a simple remark transaction using Binary
      const { Binary } = await import('polkadot-api')
      const testRemark = Binary.fromText(`Test transaction from ${selectedAccount.address} at ${Date.now()}`)

      // Build the transaction using PAPI
      const tx = api.tx.System.remark({
        remark: testRemark,
      })

      // Sign and submit the transaction with the correct signer format
      const result = await tx.signAndSubmit(signer)

      // Check transaction result
      if (result.ok) {
        const successMsg = `✅ Transaction successful! Hash: ${result.txHash.slice(0, 10)}...Block: ${result.block.number}`
        setSignResult(successMsg)
      } else {
        setError('Transaction failed - result not ok')
        setSignResult(`❌ Transaction failed`)
        console.error('❌ Transaction failed - result not ok:', result)
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to create transaction'
      setError(errorMsg)
      setSignResult(`❌ ${errorMsg}`)
      console.error('❌ Transaction error:', err)

      // Additional error details
      if (err instanceof Error) {
        console.error('Error name:', err.name)
        console.error('Error stack:', err.stack)
      }
    } finally {
      setIsSigning(false)
    }
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-light text-black tracking-wide">
          Test Remark Transaction
        </h3>
        <div className="flex items-center text-xs text-gray-500 uppercase tracking-wider">
          <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          Asset Hub
        </div>
      </div>

      {/* Account Status */}
      <div className="mb-6">
        {!selectedAccount ? (
          <div className="flex items-center p-4 bg-gray-50 border border-gray-100">
            <svg className="w-5 h-5 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <span className="text-gray-600 text-sm font-light">Please connect your wallet first</span>
          </div>
        ) : (
          <div className="flex items-center p-4 bg-gray-50 border border-gray-100">
            <div className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center mr-3">
              <span className="text-xs font-medium uppercase">{selectedAccount.address.slice(-1)}</span>
            </div>
            <div>
              <div className="text-sm font-medium text-black">
                {selectedAccount.meta?.name || 'Account'}
              </div>
              <div className="text-xs text-gray-500">
                {selectedAccount.address.slice(0, 8)}...{selectedAccount.address.slice(-8)}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Status Messages */}
      {(error || signResult) && (
        <div className="mb-6">
          {/* Error Message */}
          {error && (
            <div className="flex items-start p-4 bg-gray-50 border border-gray-100">
              <svg className="w-5 h-5 text-gray-400 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <h4 className="text-black text-sm font-medium">
                  Transaction Failed
                </h4>
                <p className="text-gray-600 text-sm mt-1 font-light">
                  {error}
                </p>
              </div>
            </div>
          )}

          {/* Success Message */}
          {!error && signResult && signResult.includes('✅') && (
            <div className="flex items-start p-4 bg-gray-50 border border-gray-100">
              <svg className="w-5 h-5 text-gray-400 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <h4 className="text-black text-sm font-medium">
                  Transaction Successful
                </h4>
                <p className="text-gray-600 text-sm mt-1 font-light">
                  {signResult.replace('✅ ', '')}
                </p>
              </div>
            </div>
          )}

          {/* Failed Result */}
          {!error && signResult && signResult.includes('❌') && (
            <div className="flex items-start p-4 bg-gray-50 border border-gray-100">
              <svg className="w-5 h-5 text-gray-400 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <h4 className="text-black text-sm font-medium">
                  Transaction Failed
                </h4>
                <p className="text-gray-600 text-sm mt-1 font-light">
                  {signResult.replace('❌ ', '')}
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Action Button */}
      <div className="flex justify-end">
        {selectedAccount && (
          <button
            disabled={isSigning}
            className="bg-black hover:bg-gray-800 text-white px-6 py-3 text-sm font-medium transition-colors duration-200 uppercase tracking-wider disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleTestSign}
          >
            {isSigning ? (
              <span className="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
                  <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 2a10 10 0 0 1 7.38 16.75M12 6v6l4 2M2.5 8.875a10 10 0 0 0-.5 3M2.83 16a10 10 0 0 0 2.43 3.4M4.636 5.235a10 10 0 0 1 .891-.857M8.644 21.42a10 10 0 0 0 7.631-.38" />
                </svg>
                Signing...
              </span>
            ) : (
              <span>Sign Transaction</span>
            )}
          </button>
        )}
      </div>
    </div>
  )
}