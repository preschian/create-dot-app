import type { Prefix } from '~/utils/sdk'
import { formatValue } from '@polkadot-api/react-components'
import { useEffect, useMemo } from 'react'
import sdk, { CHAIN_CONFIG } from '~/utils/sdk'
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

      const { client } = sdk(chainKey)
      const typedApi = client.getTypedApi(CHAIN_CONFIG[chainKey].descriptor)

      const [balance, chainSpec] = await Promise.all([
        typedApi.query.System.Account.getValue(address),
        client.getChainSpecData(),
      ])

      const tokenDecimals = chainSpec.properties.tokenDecimals
      const tokenSymbol = chainSpec.properties.tokenSymbol
      const freeBalance = formatValue(balance.data.free, tokenDecimals)

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
