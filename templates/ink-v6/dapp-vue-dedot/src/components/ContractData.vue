<script setup lang="ts">
import type { Prefix } from '~/utils/sdk'
import { onMounted, watch } from 'vue'
import { useContractQuery } from '~/composables/useContractQuery'

const props = defineProps<{
  chainKey: Prefix
  address?: string
}>()

const { contractValue, isLoading, error, queryContractValue } = useContractQuery(props.chainKey, props.address)

onMounted(() => {
  if (props.address) {
    queryContractValue()
  }
})

watch(() => props.address, (newAddress) => {
  if (newAddress) {
    queryContractValue()
  }
})
</script>

<template>
  <div>
    <div class="flex items-center justify-between mb-3">
      <div class="text-xs text-gray-500 uppercase tracking-wider">
        Contract Value
      </div>
      <button
        v-if="address"
        class="btn btn-xs btn-ghost"
        :disabled="isLoading"
        @click="queryContractValue"
      >
        <span v-if="isLoading" class="icon-[mdi--loading] animate-spin" />
        <span v-else class="icon-[mdi--refresh]" />
      </button>
    </div>

    <div v-if="isLoading && contractValue === null" class="flex items-center gap-2 text-sm text-gray-400 py-2">
      <span class="icon-[mdi--loading] animate-spin" />
      Loading...
    </div>

    <div v-else-if="error" class="text-sm text-red-600 py-2">
      {{ error }}
    </div>

    <div v-else-if="contractValue !== null">
      <div class="flex items-center gap-3">
        <span v-if="contractValue" class="icon-[mdi--toggle-switch] text-green-600 text-3xl" />
        <span v-else class="icon-[mdi--toggle-switch-off] text-gray-400 text-3xl" />
        <span class="font-mono font-light text-black text-xl">{{ contractValue ? 'TRUE' : 'FALSE' }}</span>
      </div>
    </div>

    <div v-else class="text-sm text-gray-400 py-2">
      No data
    </div>
  </div>
</template>
