<script setup lang="ts">
const props = defineProps<{
  address?: string
  chainKey: Prefix
}>()

const balance = ref('')
const symbol = ref('')

onMounted(async () => {
  if (!props.address) {
    return
  }

  const freeBalance = await getBalance(props.chainKey, props.address)
  balance.value = freeBalance.balance
  symbol.value = freeBalance.symbol
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
