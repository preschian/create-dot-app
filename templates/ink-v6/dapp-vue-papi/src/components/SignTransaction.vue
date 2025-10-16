<script setup lang="ts">
import type { Prefix } from '~/utils/sdk'
import { ref } from 'vue'
import { useConnect } from '~/composables/useConnect'
import { useContractTransaction } from '~/composables/useContractTransaction'
import { explorerDetail, stripAddress } from '~/utils/formatters'

const props = defineProps<{
  chainKey: Prefix
  address?: string
}>()

const { selectedAccount } = useConnect()
const {
  isProcessing,
  result,
  txHash,
  flipContractValue,
} = useContractTransaction(props.chainKey, props.address)

const showResult = ref(true)
const showTxHash = ref(true)

async function handleFlip() {
  showResult.value = true
  showTxHash.value = true
  await flipContractValue()
}

function closeResult() {
  showResult.value = false
}

function closeTxHash() {
  showTxHash.value = false
}
</script>

<template>
  <div>
    <!-- Floating Toast Notifications -->
    <div class="toast toast-bottom toast-end z-50">
      <!-- Processing State -->
      <div v-if="isProcessing" role="alert" class="alert alert-info shadow-lg">
        <span class="icon-[mdi--loading] animate-spin" />
        <span>Processing transaction...</span>
      </div>

      <!-- Result State -->
      <div v-if="result && !isProcessing && showResult" role="alert" class="alert shadow-lg" :class="result.includes('Error') ? 'alert-error' : 'alert-success'">
        <span v-if="result.includes('Error')" class="icon-[mdi--alert-circle]" />
        <span v-else class="icon-[mdi--check-circle]" />
        <span>{{ result }}</span>
        <button class="btn btn-xs btn-ghost btn-square" @click="closeResult">
          <span class="icon-[mdi--close]" />
        </button>
      </div>

      <!-- Transaction Hash Toast -->
      <div v-if="txHash && showTxHash" role="alert" class="alert alert-neutral shadow-lg">
        <div class="flex items-center gap-2">
          <span class="icon-[mdi--link-variant]" />
          <span class="text-xs uppercase tracking-wider">Transaction Hash</span>
        </div>
        <div class="text-xs font-mono break-all">
          {{ stripAddress(txHash) }}
        </div>
        <a
          :href="explorerDetail(txHash, chainKey)"
          target="_blank"
          class="inline-flex items-center gap-1 text-xs hover:underline"
        >
          View on Explorer <span class="icon-[mdi--open-in-new]" />
        </a>
        <button class="btn btn-xs btn-ghost btn-square" @click="closeTxHash">
          <span class="icon-[mdi--close]" />
        </button>
      </div>
    </div>

    <!-- Action -->
    <button
      v-if="selectedAccount"
      :disabled="isProcessing"
      class="btn btn-sm btn-neutral w-full uppercase tracking-wider"
      @click="handleFlip"
    >
      <span v-if="isProcessing" class="icon-[mdi--loading] animate-spin" />
      <span v-else class="icon-[mdi--toggle-switch]" />
      {{ isProcessing ? 'Processing...' : 'Flip Contract Value' }}
    </button>

    <div v-else class="flex items-center justify-center gap-2 text-xs text-gray-500">
      <span class="icon-[mdi--wallet-outline]" />
      Connect wallet to sign transactions
    </div>
  </div>
</template>
