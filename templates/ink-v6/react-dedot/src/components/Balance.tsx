import type { Prefix } from '../utils/sdk'
import { useBalance } from '~/hooks/useBalance'

interface BalanceProps {
  address?: string
  chainKey: Prefix
}

export default function Balance({ address, chainKey }: BalanceProps) {
  const { balance, symbol } = useBalance(chainKey, address)

  return (
    <div>
      <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">
        Balance
      </div>
      <div className="flex items-baseline space-x-2 font-mono">
        <div className="font-light text-black text-2xl">
          {balance || '---'}
        </div>
        <div className="text-xs text-gray-500 uppercase tracking-wider">
          {symbol}
        </div>
      </div>
    </div>
  )
}
