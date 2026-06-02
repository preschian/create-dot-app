import { useChainId, useChains, useSwitchChain } from 'wagmi'
import { isPolkadotWagmiChain } from '../../lib/chains/polkadot'

export function SwitchChain() {
  const chainId = useChainId()
  const chains = useChains().filter((chain) => isPolkadotWagmiChain(chain.id))
  const { mutate, error } = useSwitchChain()

  return (
    <div>
      <h2>Switch Chain</h2>
      <h3>Connected to {chainId}</h3>
      {chains.map((chain) => (
        <button
          disabled={chainId === chain.id}
          key={chain.id}
          onClick={() => mutate({ chainId: chain.id })}
          type="button"
          className="card"
        >
          {chain.name}
        </button>
      ))}

      {error?.message}
    </div>
  )
}