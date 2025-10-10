<script setup lang="ts">
import type { Prefix } from '~/utils/sdk'
import { useConnect } from '~/composables/useConnect'
import { useTransaction } from '~/composables/useTransaction'
import { explorerDetail } from '~/utils/formatters'

const props = defineProps<{
  chainKey: Prefix
}>()

const { selectedAccount } = useConnect()
const {
  isProcessing,
  result,
  txHash,
  signRemarkTransaction,
} = useTransaction()

async function signTransaction() {
  if (!selectedAccount.value)
    return

  const message = 'Hello from create-dot-app'

  await signRemarkTransaction(props.chainKey, message)
}
</script>

<template>
  <div>
    <!-- Status -->
    <div v-if="isProcessing" role="alert" class="alert alert-info mb-4">
      <span class="icon-[mdi--loading] animate-spin" />
      <span>
        Processing transaction...
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
      <div class="text-sm text-gray-800 font-mono break-all mb-2 truncate">
        {{ txHash }}
      </div>
      <a
        :href="explorerDetail(txHash)"
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
      class="btn btn-sm btn-neutral w-full uppercase tracking-wider"
      @click="signTransaction"
    >
      <span v-if="isProcessing" class="icon-[mdi--loading] animate-spin" />
      {{ isProcessing ? 'Processing...' : 'Sign Transaction' }}
    </button>

    <div v-else class="flex items-center justify-center gap-2 text-xs text-gray-500">
      <span class="icon-[mdi--wallet-outline]" />
      Connect wallet to sign transactions
    </div>
  </div>
</template>
