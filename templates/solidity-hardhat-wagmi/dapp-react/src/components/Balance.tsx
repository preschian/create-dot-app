import { formatUnits } from 'viem'
import { useBalance } from 'wagmi'

interface BalanceProps {
  address: `0x${string}`
}

export default function Balance({ address }: BalanceProps) {
  const { data: balance, isLoading, error } = useBalance({
    address,
  })

  if (isLoading) {
    return <span className="font-mono font-semibold">...</span>
  }

  if (error) {
    return <span className="font-mono font-semibold text-red-500">Error</span>
  }

  const balanceValue = Number(formatUnits(balance?.value || 0n, 18))
  const formattedBalance = `${balanceValue.toLocaleString()} ${balance?.symbol}`

  return <span className="font-mono font-semibold">{formattedBalance}</span>
}
