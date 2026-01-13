<script setup lang="ts">
import { useBalance } from '@wagmi/vue'
import { formatUnits } from 'viem'
import { computed } from 'vue'

const props = defineProps<{
  address: `0x${string}`
}>()

const balance = useBalance({
  address: props.address,
})

const formattedBalance = computed(() => {
  const balanceValue = Number(formatUnits(balance.data.value?.value || 0n, 18))
  return `${balanceValue.toLocaleString()} ${balance.data.value?.symbol}`
})
</script>

<template>
  <span v-if="balance.isLoading.value" class="font-mono font-semibold">...</span>
  <span v-else-if="balance.error.value" class="font-mono font-semibold text-red-500">Error</span>
  <span v-else class="font-mono font-semibold">{{ formattedBalance }}</span>
</template>
