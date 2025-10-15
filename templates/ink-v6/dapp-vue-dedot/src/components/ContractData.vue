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
  <div class="border-t border-gray-100 pt-3 mt-3">
    <div class="flex items-center justify-between mb-2">
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

    <div v-if="isLoading && contractValue === null" class="flex items-center gap-2 text-sm text-gray-500">
      <span class="icon-[mdi--loading] animate-spin" />
      Loading...
    </div>

    <div v-else-if="error" class="text-sm text-red-600">
      {{ error }}
    </div>

    <div v-else-if="contractValue !== null" class="font-light text-black text-lg">
      <div class="flex items-center gap-2">
        <span v-if="contractValue" class="icon-[mdi--toggle-switch] text-green-600 text-2xl" />
        <span v-else class="icon-[mdi--toggle-switch-off] text-gray-400 text-2xl" />
        <span class="font-mono">{{ contractValue ? 'TRUE' : 'FALSE' }}</span>
      </div>
    </div>

    <div v-else class="text-sm text-gray-400">
      No data
    </div>
  </div>
</template>
