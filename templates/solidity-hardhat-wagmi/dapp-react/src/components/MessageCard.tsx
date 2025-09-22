import { blo } from 'blo'
import { formatTime, shortenAddress } from '../utils/formatters'

interface Message {
  id: number
  author: string
  content: string
  timestamp: Date
}

interface MessageCardProps {
  message: Message
}

export default function MessageCard({ message }: MessageCardProps) {
  return (
    <div className="card bg-white shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 ease-in-out border border-gray-200 h-full flex flex-col">
      <div className="card-body flex flex-col h-full">
        {/* Message Header */}
        <div className="flex items-start space-x-3 mb-4">
          {/* Avatar */}
          <div className="avatar">
            <div className="w-9 rounded">
              <img src={blo(message.author as `0x${string}`)} alt="Avatar" />
            </div>
          </div>

          {/* User Info */}
          <div className="flex-1 min-w-0">
            <div className="font-mono text-sm font-medium text-black truncate">
              {shortenAddress(message.author)}
            </div>
            <div className="text-xs text-gray-500">
              {formatTime(message.timestamp)}
            </div>
          </div>
        </div>

        {/* Message Content */}
        <div className="flex-grow">
          <p className="text-gray-800 leading-relaxed">
            {message.content}
          </p>
        </div>
      </div>
    </div>
  )
}
