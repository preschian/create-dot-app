<script setup lang="ts">
import type { Prefix } from '~/utils/sdk'
import { ref } from 'vue'
import { useMapAccount } from '~/composables/useMapAccount'

const props = defineProps<{
  chainKey: Prefix
  address: string
}>()

const { isMapped, mapAccount } = useMapAccount(props.chainKey, props.address)
const isMapping = ref(false)
const error = ref<string>()

async function handleMapAccount() {
  try {
    isMapping.value = true
    error.value = undefined
    await mapAccount()
  }
  catch (err) {
    error.value = err instanceof Error ? err.message : 'Failed to map account'
    console.error('Error mapping account:', err)
  }
  finally {
    isMapping.value = false
  }
}
</script>

<template>
  <div class="mb-6">
    <div class="text-xs text-gray-500 uppercase tracking-wider mb-2">
      Account Mapping
    </div>

    <div v-if="isMapped" class="flex items-center gap-2 text-sm text-green-700 bg-green-50 border border-green-200 px-3 py-2">
      <span class="icon-[mdi--check-circle] text-base" />
      <span>Account mapped to EVM</span>
    </div>

    <div v-else class="space-y-2">
      <div class="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 border border-gray-200 px-3 py-2">
        <span class="icon-[mdi--alert-circle-outline] text-base" />
        <span>Account not mapped yet</span>
      </div>

      <button
        type="button"
        :disabled="isMapping"
        class="btn btn-sm btn-neutral w-full uppercase tracking-wider"
        @click="handleMapAccount"
      >
        <span v-if="isMapping" class="icon-[mdi--loading] animate-spin" />
        <span v-else class="icon-[mdi--map-marker-plus]" />
        {{ isMapping ? 'Mapping...' : 'Map Account to EVM' }}
      </button>

      <div v-if="error" role="alert" class="alert alert-error alert-sm">
        <span class="icon-[mdi--alert-circle]" />
        <span class="text-xs">{{ error }}</span>
      </div>
    </div>
  </div>
</template>
