import { useCallback, useEffect, useMemo, useState } from 'react'
import { useAccount, useReadContract, useWaitForTransactionReceipt, useWriteContract } from 'wagmi'
import { MESSAGE_BOARD_ADDRESS, MessageBoardABI } from '../config/contracts'
import { shortenAddress } from '../utils/formatters'
import { config } from '../wagmi'
import Balance from './Balance'
import MessageCard from './MessageCard'

// Get chain data from wagmi config
const passetHub = config.chains[0] // First chain in config

export default function Content() {
  // Account and contract hooks
  const { address, isConnected } = useAccount()
  const { writeContract, data: writeData, isPending: isWritePending, error: writeError } = useWriteContract()

  // Common contract config
  const contractConfig = {
    abi: MessageBoardABI,
    address: MESSAGE_BOARD_ADDRESS as `0x${string}`,
  }

  // Contract read operations
  const { data: allMessagesData, isLoading: isLoadingMessages, refetch: refetchMessages } = useReadContract({
    ...contractConfig,
    functionName: 'getAllMessages',
  })

  // Wait for transaction confirmation
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash: writeData,
  })

  // Transform contract data to UI format
  const messages = useMemo(() => {
    if (!allMessagesData || !Array.isArray(allMessagesData))
      return []

    return (allMessagesData as any[]).map((msg: any, index: number) => ({
      id: index + 1,
      author: msg.sender,
      content: msg.content,
      timestamp: new Date(Number(msg.timestamp) * 1000), // Convert from Unix timestamp
    }))
  }, [allMessagesData])

  const [newMessage, setNewMessage] = useState('')
  const [toastMessage, setToastMessage] = useState('')
  const [showToast, setShowToast] = useState(false)

  // Posting state - combines write pending and confirmation
  const isPosting = isWritePending || isConfirming

  // Sort messages by timestamp (newest first)
  const sortedMessages = useMemo(() =>
    [...messages].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()), [messages])

  // Account display helpers
  const displayAddress = address ? shortenAddress(address) : 'Not connected'

  // Toast notification utility
  const showToastNotification = useCallback((message: string) => {
    setToastMessage(message)
    setShowToast(true)
    setTimeout(() => {
      setShowToast(false)
    }, 3000)
  }, [])

  // Handle copying address to clipboard
  function copyAddress() {
    if (address) {
      navigator.clipboard.writeText(address)
      showToastNotification('Address copied to clipboard!')
    }
  }

  // Handle posting new message
  async function handlePostMessage() {
    if (!newMessage.trim() || !isConnected)
      return

    try {
      writeContract({
        ...contractConfig,
        functionName: 'postMessage',
        args: [newMessage.trim()],
      })
      // Clear the message immediately after submitting
      setNewMessage('')
    }
    catch (error) {
      console.error('Error posting message:', error)
    }
  }

  // Watch for successful transaction and refresh data
  useEffect(() => {
    if (isConfirmed) {
      refetchMessages()
      showToastNotification('Message posted successfully!')
    }
  }, [isConfirmed, refetchMessages, showToastNotification])

  return (
    <div className="bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-mono font-bold text-black mb-2 tracking-wide">
            MESSAGE BOARD
          </h1>
          <p className="text-xl text-gray-600 font-mono flex items-center justify-center gap-2">
            <span>Share your thoughts on the decentralized web</span>
            <span className="icon-[token-branded--polkadot] animate-spin" style={{ animationDuration: '8s' }} />
          </p>
        </div>

        {/* Post New Message Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Create Message Form */}
          <div className="card bg-white shadow-lg border border-gray-200 h-fit lg:h-full">
            <div className="card-body flex flex-col h-full">
              <h2 className="card-title text-black mb-4 flex items-center">
                <span className="icon-[mdi--message-plus] w-5 h-5 mr-2" />
                Create New Message
              </h2>

              {/* Connection Warning (when not connected) */}
              {!isConnected
                ? (
                    <div className="flex flex-col items-center justify-center flex-grow py-8">
                      <div className="alert alert-warning max-w-md">
                        <span className="icon-[mdi--wallet-outline] w-6 h-6" />
                        <div className="text-center">
                          <div className="font-semibold">
                            Wallet Not Connected
                          </div>
                          <div className="text-sm mt-1">
                            Please connect your wallet to post messages
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                : (
              /* Message Form (when connected) */
                    <div className="flex flex-col flex-grow">
                      <div className="form-control flex-grow">
                        <textarea
                          value={newMessage}
                          onChange={e => setNewMessage(e.target.value)}
                          className="textarea textarea-bordered w-full h-full min-h-[120px] resize-none focus:border-primary scrollbar-thin scrollbar-track-slate-100 scrollbar-thumb-slate-300 hover:scrollbar-thumb-slate-400"
                          placeholder="Share your thoughts with the community..."
                          disabled={isPosting}
                        />
                      </div>

                      <div className="flex justify-between items-center mt-4">
                        <div className="text-sm text-gray-500">
                          {newMessage.length}
                          /280
                        </div>
                        <button
                          type="button"
                          className="btn btn-primary px-6 uppercase tracking-wider hover:-translate-y-px transition-transform"
                          disabled={!newMessage.trim() || isPosting || newMessage.length > 280}
                          onClick={handlePostMessage}
                        >
                          {isPosting
                            ? (
                                <>
                                  <span className="icon-[mdi--loading] animate-spin w-4 h-4 mr-2" />
                                  {isConfirming ? 'Confirming...' : 'Posting...'}
                                </>
                              )
                            : (
                                <>
                                  <span className="icon-[mdi--send] w-4 h-4 mr-2" />
                                  Post
                                </>
                              )}
                        </button>
                      </div>

                      {/* Error Display */}
                      {writeError && (
                        <div className="alert alert-error mt-4">
                          <span className="icon-[mdi--alert-circle] w-4 h-4" />
                          <span>{writeError.message}</span>
                        </div>
                      )}
                    </div>
                  )}
            </div>
          </div>

          {/* User Info Panel */}
          <div className="card bg-white shadow-lg border border-gray-200 h-fit lg:h-full">
            <div className="card-body">
              <h2 className="card-title text-black mb-4 flex items-center">
                <span className="icon-[mdi--account-circle] w-5 h-5 mr-2" />
                Account Info
              </h2>

              {/* Wallet Address */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-600">Wallet Address</span>
                  <button
                    type="button"
                    className="btn btn-ghost btn-xs hover:-translate-y-px transition-transform"
                    disabled={!address}
                    onClick={copyAddress}
                  >
                    <span className="icon-[mdi--content-copy] w-3 h-3" />
                  </button>
                </div>
                <div className="font-mono text-sm bg-gray-50 p-2 rounded border">
                  {displayAddress}
                </div>
              </div>

              {/* Network & Balance Grid */}
              <div className="grid grid-cols-2 gap-4">
                {/* Network Info */}
                <div>
                  <div className="text-sm font-medium text-gray-600 mb-2">
                    Network
                  </div>
                  <div className="text-sm text-gray-800">
                    {passetHub.name}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    Chain ID:
                    {' '}
                    {passetHub.id}
                  </div>
                </div>

                {/* Balance Info */}
                <div>
                  <div className="text-sm font-medium text-gray-600 mb-2">
                    Balance
                  </div>
                  <div className="flex items-center space-x-1 mb-1">
                    {address ? <Balance address={address} /> : <span className="font-mono font-semibold">0 PAS</span>}
                  </div>
                  <a
                    href="https://faucet.polkadot.io/?parachain=1111"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-blue-600 hover:text-blue-800 flex items-center space-x-1"
                  >
                    <span className="icon-[mdi--water] w-3 h-3" />
                    <span>Get Testnet PAS</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Messages Feed */}
        <div className="space-y-6">
          {/* Stats Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-black flex items-center">
              <span className="icon-[mdi--message-text] w-6 h-6 mr-2" />
              Recent Messages
            </h2>
          </div>

          {/* Loading State */}
          {isLoadingMessages
            ? (
                <div className="flex justify-center items-center py-16">
                  <div className="flex flex-col items-center space-y-4">
                    <span className="icon-[mdi--loading] animate-spin w-8 h-8 text-primary" />
                    <span className="text-gray-500">Loading messages...</span>
                  </div>
                </div>
              )
            : (
          /* Message Cards Grid */
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-start">
                  {sortedMessages.map(message => (
                    <MessageCard key={message.id} message={message} />
                  ))}
                </div>
              )}
        </div>

        {/* Empty State (when no messages) */}
        {messages.length === 0 && (
          <div className="text-center py-16">
            <div className="icon-[mdi--message-text-outline] w-24 h-24 mx-auto text-gray-300 mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              No messages yet
            </h3>
            <p className="text-gray-500">
              Be the first to share your thoughts with the community!
            </p>
          </div>
        )}
      </div>

      {/* Toast Notification */}
      {showToast && (
        <div className="toast toast-top toast-end">
          <div className="alert alert-success">
            <span className="icon-[mdi--check-circle] w-4 h-4" />
            <span>{toastMessage}</span>
          </div>
        </div>
      )}
    </div>
  )
}
