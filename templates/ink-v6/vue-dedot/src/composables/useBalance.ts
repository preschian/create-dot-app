import type { Prefix } from '~/utils/sdk'
import { formatBalance } from 'dedot/utils'
import { computed, onMounted } from 'vue'
import { getClient } from '~/utils/sdk'
import { useLocalStorage } from './useLocalStorage'

export function useBalance(chainKey: Prefix, address?: string) {
  const { value: balanceData, setItem } = useLocalStorage(`balance_${chainKey}`, { balance: '', symbol: '' })

  const balance = computed(() => balanceData.value.balance)
  const symbol = computed(() => balanceData.value.symbol)

  onMounted(async () => {
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

    setItem({ balance: freeBalance, symbol: tokenSymbol })
  })

  return {
    balance,
    symbol,
  }
}
