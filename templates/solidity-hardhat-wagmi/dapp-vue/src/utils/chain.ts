import type { Client } from 'viem'
import { addChain, switchChain } from 'viem/actions'
import { passetHub } from '../config/wagmi'

export async function ensurePaseoTestnet(client: Client): Promise<void> {
  try {
    // Try to switch to the chain first
    await switchChain(client, { id: passetHub.id })
  }
  catch (error) {
    // If chain doesn't exist, add it
    if (error instanceof Error && (('code' in error && error.code === 4902) || error.name === 'ChainNotConfiguredError')) {
      await addChain(client, { chain: passetHub })
    }
    else {
      throw error
    }
  }
}
