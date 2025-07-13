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
        // Set txHash as soon as it's available in any event
        if (event.txHash && !txHash.value) {
          txHash.value = event.txHash
        }

        if (event.type === 'finalized') {
          result.value = 'Transaction successful!'
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
  <div>
    <!-- Chain Selector -->
    <div class="mb-4">
      <label class="block text-xs text-gray-500 uppercase tracking-wider mb-2">Select Chain</label>
      <select
        v-model="selectedChain"
        :disabled="isProcessing"
        class="select select-neutral w-full"
      >
        <option v-for="chain in chainOptions" :key="chain.value" :value="chain.value">
          {{ chain.label }}
        </option>
      </select>
    </div>

    <!-- Status -->
    <div v-if="isProcessing" role="alert" class="alert alert-info mb-4">
      <span class="icon-[mdi--loading] animate-spin" />
      <span>
        Processing transaction on {{ chainOptions.find(c => c.value === selectedChain)?.label }}...
      </span>
    </div>

    <!-- Result -->
    <div v-if="result" role="alert" class="alert mb-4" :class="result.includes('Error') ? 'alert-error' : 'alert-success'">
      <span v-if="result.includes('Error')" class="icon-[mdi--alert-circle]" />
      <span v-else class="icon-[mdi--check-circle]" />
      <span>{{ result }}</span>
    </div>

    <!-- Transaction Hash Link -->
    <div v-if="txHash" class="mb-4 p-3 border border-gray-200">
      <div class="text-xs text-gray-500 uppercase tracking-wider mb-2">
        Transaction Hash
      </div>
      <div class="text-sm text-gray-800 font-mono break-all mb-2">
        {{ txHash }}
      </div>
      <a
        :href="`${getSubscanUrl(selectedChain)}/extrinsic/${txHash}`"
        target="_blank"
        class="inline-flex items-center gap-1 text-xs text-gray-600 hover:text-black transition-colors uppercase tracking-wider"
      >
        View on Subscan <span class="icon-[mdi--open-in-new]" />
      </a>
    </div>

    <!-- Action -->
    <button
      v-if="selectedAccount"
      :disabled="isProcessing"
      class="btn btn-neutral btn-block uppercase tracking-wider"
      @click="signTransaction"
    >
      <span v-if="isProcessing" class="icon-[mdi--loading] animate-spin" />
      {{ isProcessing ? 'Processing...' : 'Sign Transaction' }}
    </button>

    <div v-else role="alert" class="alert alert-warning">
      <span class="icon-[mdi--wallet-outline]" />
      <span>Please connect your wallet first</span>
    </div>
  </div>
</template>
