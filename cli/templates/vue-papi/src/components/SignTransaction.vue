<script setup lang="ts">
import { Binary } from 'polkadot-api'
import { ref } from 'vue'
import { polkadotSigner, useConnect } from '../composables/useConnect'
import sdk from '../utils/sdk'

const { selectedAccount } = useConnect()

const isProcessing = ref(false)
const result = ref('')
const txHash = ref('')
const selectedChain = ref<'asset_hub' | 'pas_asset_hub'>('asset_hub')

const chainOptions = [
  { value: 'asset_hub', label: 'Polkadot Asset Hub' },
  { value: 'pas_asset_hub', label: 'Paseo Asset Hub' },
]

async function signTransaction() {
  if (!selectedAccount.value)
    return

  isProcessing.value = true
  result.value = ''
  txHash.value = ''

  try {
    const { api } = selectedChain.value === 'asset_hub'
      ? sdk('asset_hub')
      : sdk('pas_asset_hub')
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
  <div class="p-4 max-w-md mx-auto">
    <h3 class="text-lg font-medium mb-4">
      Test Transaction
    </h3>

    <!-- Chain Selector -->
    <div class="mb-4">
      <label class="block text-sm font-medium mb-2">Select Chain</label>
      <select
        v-model="selectedChain"
        :disabled="isProcessing"
        class="w-full p-2 border border-gray-300 rounded bg-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
      >
        <option v-for="chain in chainOptions" :key="chain.value" :value="chain.value">
          {{ chain.label }}
        </option>
      </select>
    </div>

    <!-- Account -->
    <div v-if="selectedAccount" class="mb-4 p-3 bg-gray-50 rounded">
      <div class="text-sm font-medium">
        {{ selectedAccount.name }}
      </div>
      <div class="text-xs text-gray-500">
        {{ selectedAccount.address.slice(0, 8) }}...{{ selectedAccount.address.slice(-8) }}
      </div>
    </div>

    <div v-else class="mb-4 p-3 bg-gray-50 rounded text-sm text-gray-600">
      Please connect your wallet first
    </div>

    <!-- Status -->
    <div v-if="isProcessing" class="mb-4 p-3 bg-blue-50 rounded text-sm">
      <div class="flex items-center gap-2">
        <span class="animate-spin">⟳</span>
        Processing transaction on {{ chainOptions.find(c => c.value === selectedChain)?.label }}...
      </div>
    </div>

    <!-- Result -->
    <div v-if="result" class="mb-4 p-3 rounded text-sm" :class="result.includes('Error') ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'">
      <div>{{ result }}</div>
      <a
        v-if="txHash"
        :href="`https://${selectedChain === 'asset_hub' ? 'assethub-polkadot' : 'assethub-paseo'}.subscan.io/extrinsic/${txHash}`"
        target="_blank"
        class="inline-flex items-center gap-1 mt-2 text-xs underline hover:no-underline"
      >
        View on Subscan ↗
      </a>
    </div>

    <!-- Action -->
    <button
      v-if="selectedAccount"
      :disabled="isProcessing"
      class="w-full bg-black hover:bg-gray-800 text-white py-2 px-4 rounded font-medium transition-colors disabled:opacity-50"
      @click="signTransaction"
    >
      {{ isProcessing ? 'Processing...' : `Sign Transaction on ${chainOptions.find(c => c.value === selectedChain)?.label}` }}
    </button>
  </div>
</template>
