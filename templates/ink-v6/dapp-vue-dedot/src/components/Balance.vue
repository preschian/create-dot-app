<script setup lang="ts">
import type { Prefix } from '~/utils/sdk'
import { useBalance } from '~/composables/useBalance'

const props = defineProps<{
  address?: string
  chainKey: Prefix
}>()

const { balance, symbol } = useBalance(props.chainKey, props.address)
</script>

<template>
  <div>
    <div class="text-xs text-gray-500 uppercase tracking-wider mb-1">
      Balance
    </div>
    <div class="flex items-baseline space-x-2 font-mono">
      <div class="font-light text-black text-2xl">
        {{ balance || '---' }}
      </div>
      <div class="text-xs text-gray-500 uppercase tracking-wider">
        {{ symbol }}
      </div>
    </div>
  </div>
</template>
