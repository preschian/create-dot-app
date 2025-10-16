import type { Prefix } from '~/utils/sdk'
import { formatBalance } from '@polkadot/util'
import { computed, onMounted } from 'vue'
import sdk, { CHAIN_CONFIG } from '~/utils/sdk'
import { useLocalStorage } from './useLocalStorage'

export function useBalance(chainKey: Prefix, address?: string) {
  const { value: balanceData, setItem } = useLocalStorage(`balance_${chainKey}`, { balance: '', symbol: '' })

  const balance = computed(() => balanceData.value.balance)
  const symbol = computed(() => balanceData.value.symbol)

  onMounted(async () => {
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
    const freeBalance = formatBalance(balance.data.free.toString(), {
      decimals: tokenDecimals,
      withUnit: false,
      forceUnit: '-',
    })

    setItem({ balance: freeBalance, symbol: tokenSymbol })
  })

  return {
    balance,
    symbol,
  }
}
