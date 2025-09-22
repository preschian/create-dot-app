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

  return (
    <span className="font-mono font-semibold">
      {balance?.formatted || '0'}
      {' '}
      PAS
    </span>
  )
}
