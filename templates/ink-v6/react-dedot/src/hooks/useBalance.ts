import type { Prefix } from '~/utils/sdk'
import { formatBalance } from 'dedot/utils'
import { useEffect, useMemo } from 'react'
import { getClient } from '~/utils/sdk'
import { useLocalStorage } from './useLocalStorage'

export function useBalance(chainKey: Prefix, address?: string) {
  const { value: balanceData, setItem } = useLocalStorage(`balance_${chainKey}`, { balance: '', symbol: '' })

  const balance = useMemo(() => balanceData.balance, [balanceData.balance])
  const symbol = useMemo(() => balanceData.symbol, [balanceData.symbol])

  useEffect(() => {
    if (!address)
      return

    let ignore = false

    async function fetchBalance() {
      if (!address)
        return

      const api = await getClient(chainKey)
      const [accountData, chainSpec] = await Promise.all([
        api.query.system.account(address),
        api.chainSpec.properties(),
      ])

      const tokenDecimals = chainSpec.tokenDecimals
      const tokenSymbol = chainSpec.tokenSymbol?.toString() || ''
      const freeBalance = formatBalance(accountData.data.free.toString(), {
        decimals: Number(tokenDecimals),
        symbol: tokenSymbol,
      }).replace(tokenSymbol, '')

      if (!ignore) {
        setItem({ balance: freeBalance, symbol: tokenSymbol })
      }
    }

    fetchBalance()

    return () => {
      ignore = true
    }
  }, [chainKey, address, setItem])

  return {
    balance,
    symbol,
  }
}
