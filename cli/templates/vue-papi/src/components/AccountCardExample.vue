<script setup lang="ts">
import type { Prefix } from '~/utils/sdk'
import { useConnect } from '~/composables/useConnect'
import AccountCard from './AccountCard.vue'

const { selectedAccount } = useConnect()

const list: { chainKey: Prefix, chainColor: string }[] = [
  {
    chainKey: 'dot',
    chainColor: 'bg-pink-600',
  },
  {
    chainKey: 'dot_asset_hub',
    chainColor: 'bg-pink-500',
  },
  {
    chainKey: 'pas',
    chainColor: 'bg-green-600',
  },
  {
    chainKey: 'pas_asset_hub',
    chainColor: 'bg-green-500',
  },
]
</script>

<template>
  <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-8">
    <div v-for="account in list" :key="account.chainKey">
      <AccountCard
        :chain-key="account.chainKey"
        :chain-color="account.chainColor"
        :address="selectedAccount?.address"
      />
    </div>
  </div>
</template>
