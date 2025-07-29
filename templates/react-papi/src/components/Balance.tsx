import type { Prefix } from '../utils/sdk'
import { useEffect, useState } from 'react'
import { getBalance } from '../utils/sdk-interface'

interface BalanceProps {
  address?: string
  chainKey: Prefix
}

export default function Balance({ address, chainKey }: BalanceProps) {
  const [balance, setBalance] = useState('')
  const [symbol, setSymbol] = useState('')

  useEffect(() => {
    if (!address) {
      return
    }

    const fetchBalance = async () => {
      const { balance, symbol } = await getBalance(chainKey, address)
      setBalance(balance)
      setSymbol(symbol)
    }

    fetchBalance()
  }, [address, chainKey])

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
