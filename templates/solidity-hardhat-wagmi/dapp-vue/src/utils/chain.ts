import { passetHub } from '../config/wagmi'

declare global {
  interface Window {
    ethereum?: {
      request: (args: { method: string, params?: any[] }) => Promise<any>
    }
  }
}

export async function addPaseoTestnet(): Promise<boolean> {
  if (!window.ethereum) {
    throw new Error('No Ethereum provider found')
  }

  try {
    await window.ethereum.request({
      method: 'wallet_addEthereumChain',
      params: [{
        chainId: `0x${passetHub.id.toString(16)}`,
        chainName: passetHub.name,
        nativeCurrency: passetHub.nativeCurrency,
        rpcUrls: passetHub.rpcUrls.default.http,
        blockExplorerUrls: [passetHub.blockExplorers.default.url],
      }],
    })
    return true
  }
  catch (error) {
    if ((error as any)?.code === 4902) {
      throw error
    }
    else if ((error as any)?.code === -32002) {
      throw new Error('Chain addition request is already pending. Please check your wallet.')
    }
    else {
      throw error
    }
  }
}

export async function ensurePaseoTestnet(): Promise<boolean> {
  if (!window.ethereum) {
    throw new Error('No Ethereum provider found')
  }

  try {
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: `0x${passetHub.id.toString(16)}` }],
    })
    return true
  }
  catch (error) {
    if ((error as any)?.code === 4902) {
      return await addPaseoTestnet()
    }
    throw error
  }
}
