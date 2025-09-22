<script setup lang="ts">
import { useBalance } from '@wagmi/vue'

const props = defineProps<{
  address: `0x${string}`
}>()

const balance = useBalance({
  address: props.address,
})
</script>

<template>
  <span v-if="balance.isLoading.value" class="font-mono font-semibold">...</span>
  <span v-else-if="balance.error.value" class="font-mono font-semibold text-red-500">Error</span>
  <span v-else class="font-mono font-semibold">{{ balance.data.value?.formatted || '0' }} PAS</span>
</template>
