import { useRef } from 'react'
import { useStatus } from '../hooks/useStatus'
import SignTransaction from './SignTransaction'

export default function StatusBar() {
  const { isConnected, connectedNetworks } = useStatus()
  const transactionModal = useRef<HTMLDialogElement | null>(null)

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-lg backdrop-blur-sm">
      <div className="container mx-auto px-4 py-2">
        <div className="flex items-center justify-between text-sm">
          {/* Connection Status */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-4">
              <div className="inline-grid *:[grid-area:1/1]">
                <div className={`status ${isConnected ? 'status-success' : 'status-error'} rounded-full animate-ping`} />
                <div className={`status ${isConnected ? 'status-success' : 'status-error'} rounded-full`} />
              </div>
              <span className="text-black font-medium">
                {isConnected ? 'Live' : 'Connecting...'}
              </span>
            </div>

            {/* Networks Info */}
            <div className="hidden sm:flex items-center space-x-4">
              <div className="flex items-center space-x-2 relative group">
                <span className="text-gray-500 cursor-pointer hover:text-black transition-colors">Networks</span>

                {/* Networks Tooltip */}
                <div className="absolute bottom-full left-0 mb-2 w-100 bg-white border border-gray-200 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                  <div className="p-3">
                    <h4 className="text-sm font-light text-black tracking-wide mb-2">
                      All Networks
                    </h4>
                    <div className="space-y-2">
                      {connectedNetworks.map(network => (
                        <div
                          key={network.key}
                          className={`flex items-center justify-between p-2 rounded border ${
                            network.status === 'connected' ? 'bg-gray-50 border-gray-200' : 'bg-white border-gray-200'
                          }`}
                        >
                          <div className="flex items-center space-x-2">
                            <div className={`status ${network.status === 'connected' ? 'status-success' : 'status-warning'} rounded-full`} />
                            <span className="text-sm font-medium text-black">{network.name}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span
                              className={`text-xs px-2 py-1 rounded-full border ${
                                network.status === 'connected'
                                  ? 'bg-white border-gray-200 text-gray-700'
                                  : 'bg-gray-50 border-gray-200 text-gray-600'
                              }`}
                            >
                              {network.status === 'connected' ? 'Connected' : 'Connecting'}
                            </span>
                            {network.status === 'connected' && network.blockHeight > 0 && (
                              <span className="text-xs font-mono text-gray-600">
                                {network.blockHeight.toLocaleString()}
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Transaction Testing */}
          <div className="flex items-center space-x-4">
            <button
              type="button"
              className="btn btn-outline btn-sm text-xs uppercase tracking-wider"
              onClick={() => transactionModal.current?.showModal()}
            >
              Test Transaction
            </button>
          </div>
        </div>
      </div>

      {/* Transaction Modal */}
      <dialog ref={transactionModal} className="modal">
        <div className="modal-box">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-lg">Test Transaction</h3>
            <button
              type="button"
              className="btn btn-sm btn-circle btn-ghost"
              onClick={() => transactionModal.current?.close()}
            >
              <span className="icon-[mdi--close]" />
            </button>
          </div>
          <SignTransaction />
        </div>
        <form method="dialog" className="modal-backdrop">
          <button type="button">close</button>
        </form>
      </dialog>
    </div>
  )
}
