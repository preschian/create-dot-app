<script setup lang="ts">
import type { Prefix } from '~/plugins/sdk.client'

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
  if (!selectedAccount?.value)
    return

  const message = 'Hello from create-dot-app'

  await signRemarkTransaction(props.chainKey, message)
}
</script>

<template>
  <div>
    <!-- Status -->
    <UAlert
      v-if="isProcessing"
      class="mb-4"
      variant="soft"
      color="info"
      icon="i-mdi-loading"
      icon-class="animate-spin"
      description="Processing transaction..."
    />

    <!-- Result -->
    <UAlert
      v-if="result"
      class="mb-4"
      variant="soft"
      :color="result.includes('Error') ? 'error' : 'success'"
      :icon="result.includes('Error') ? 'i-mdi-alert-circle' : 'i-mdi-check-circle'"
      :description="result"
    />

    <!-- Transaction Hash Link -->
    <div v-if="txHash" class="mb-4 p-3 border border-gray-200">
      <div class="text-xs text-gray-500 uppercase tracking-wider mb-2">
        Transaction Hash
      </div>
      <div class="text-sm text-gray-800 font-mono break-all mb-2 truncate">
        {{ txHash }}
      </div>
      <a
        :href="explorerDetail(chainKey, txHash)"
        target="_blank"
        class="inline-flex items-center gap-1 text-xs text-gray-600 hover:text-black transition-colors uppercase tracking-wider"
      >
        View on Subscan <span class="icon-[mdi--open-in-new]" />
      </a>
    </div>

    <!-- Action -->
    <UButton
      v-if="selectedAccount"
      :disabled="isProcessing"
      block
      size="sm"
      color="neutral"
      variant="solid"
      class="uppercase"
      @click="signTransaction"
    >
      <span v-if="isProcessing" class="icon-[mdi--loading] animate-spin" />
      {{ isProcessing ? 'Processing...' : 'Sign Transaction' }}
    </UButton>

    <div v-else class="flex items-center justify-center gap-2 text-xs text-gray-500">
      <UIcon name="i-mdi-wallet-outline" />
      Connect wallet to sign transactions
    </div>
  </div>
</template>
