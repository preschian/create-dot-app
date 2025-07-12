<script setup lang="ts">
import type { Prefix } from '../utils/sdk'
import { Binary } from 'polkadot-api'
import { computed, ref } from 'vue'
import { polkadotSigner, useConnect } from '../composables/useConnect'
import { useStatus } from '../composables/useStatus'
import sdk from '../utils/sdk'

const { selectedAccount } = useConnect()
const { connectedNetworks, getSubscanUrl } = useStatus()

const isProcessing = ref(false)
const result = ref('')
const txHash = ref('')
const selectedChain = ref<Prefix>('asset_hub')

// Generate chain options from connected networks
const chainOptions = computed(() =>
  connectedNetworks.value
    .map(network => ({
      value: network.key,
      label: network.name,
    })),
)

async function signTransaction() {
  if (!selectedAccount.value)
    return

  isProcessing.value = true
  result.value = ''
  txHash.value = ''

  try {
    const { api } = sdk(selectedChain.value)
    const signer = await polkadotSigner()

    if (!signer)
      throw new Error('No signer found')

    const remark = Binary.fromText(`Test from ${selectedAccount.value.address} at ${Date.now()}`)
    const tx = api.tx.System.remark({ remark })

    tx.signSubmitAndWatch(signer).subscribe({
      next: (event) => {
        if (event.type === 'finalized') {
          result.value = 'Transaction successful!'
          txHash.value = event.txHash
          isProcessing.value = false
        }
      },
      error: (err) => {
        result.value = `Error: ${err.message}`
        isProcessing.value = false
      },
    })
  }
  catch (err) {
    result.value = `Error: ${err instanceof Error ? err.message : 'Unknown error'}`
    isProcessing.value = false
  }
}
</script>

<template>
  <div class="p-4">
    <h3 class="text-lg font-light text-black tracking-wide mb-4">
      Test Transaction
    </h3>

    <!-- Chain Selector -->
    <div class="mb-4">
      <label class="block text-xs text-gray-500 uppercase tracking-wider mb-2">Select Chain</label>
      <select
        v-model="selectedChain"
        :disabled="isProcessing"
        class="w-full p-2 border border-gray-200 bg-white text-sm focus:border-black focus:outline-none disabled:opacity-50 transition-colors"
      >
        <option v-for="chain in chainOptions" :key="chain.value" :value="chain.value">
          {{ chain.label }}
        </option>
      </select>
    </div>

    <!-- Status -->
    <div v-if="isProcessing" class="mb-4 p-3 border border-gray-200 rounded">
      <div class="flex items-center gap-2">
        <span class="animate-spin text-gray-600">⟳</span>
        <span class="text-sm text-gray-600">
          Processing transaction on {{ chainOptions.find(c => c.value === selectedChain)?.label }}...
        </span>
      </div>
    </div>

    <!-- Result -->
    <div v-if="result" class="mb-4 p-3 border rounded" :class="result.includes('Error') ? 'border-gray-300 bg-gray-50' : 'border-gray-200'">
      <div class="text-sm" :class="result.includes('Error') ? 'text-gray-700' : 'text-gray-800'">
        {{ result }}
      </div>
      <a
        v-if="txHash"
        :href="`${getSubscanUrl(selectedChain)}/extrinsic/${txHash}`"
        target="_blank"
        class="inline-flex items-center gap-1 mt-2 text-xs text-gray-600 hover:text-black transition-colors uppercase tracking-wider"
      >
        View on Subscan ↗
      </a>
    </div>

    <!-- Action -->
    <button
      v-if="selectedAccount"
      :disabled="isProcessing"
      class="w-full bg-black hover:bg-gray-800 text-white py-2 px-4 text-xs font-medium transition-colors duration-200 uppercase tracking-wider disabled:opacity-50"
      @click="signTransaction"
    >
      {{ isProcessing ? 'Processing...' : 'Sign Transaction' }}
    </button>

    <div v-else class="w-full p-3 border border-gray-200 rounded text-center">
      <div class="text-sm text-gray-600">
        Please connect your wallet first
      </div>
    </div>
  </div>
</template>
