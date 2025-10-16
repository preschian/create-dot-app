<script setup lang="ts">
import type { Prefix } from '~/utils/sdk'
import { computed, onMounted } from 'vue'
import { useLocalStorage } from '~/composables/useLocalStorage'
import { getBalance } from '~/utils/sdk-interface'

const props = defineProps<{
  address?: string
  chainKey: Prefix
}>()

const { value: balanceData, setItem } = useLocalStorage(`balance_${props.chainKey}`, { balance: '', symbol: '' })

const balance = computed(() => balanceData.value.balance)
const symbol = computed(() => balanceData.value.symbol)

onMounted(async () => {
  if (!props.address)
    return

  const freeBalance = await getBalance(props.chainKey, props.address)
  setItem({ balance: freeBalance.balance, symbol: freeBalance.symbol })
})
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
