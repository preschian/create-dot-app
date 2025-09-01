<script setup lang="ts">
import { chainKeys } from './plugins/sdk.client'

const { selectedAccount } = useConnect()
// eslint-disable-next-line no-console
console.log(selectedAccount, 'test ci debug')
</script>

<template>
  <div class="min-h-screen flex flex-col justify-between">
    <Header />

    <!-- Hero Section -->
    <section class="bg-white py-16 hidden sm:block">
      <div class="container mx-auto px-4 text-center">
        <h1 class="text-5xl font-bold text-gray-900 mb-4">
          <span>App Starter</span>
        </h1>
        <p class="text-xl text-gray-600 font-mono flex items-center justify-center gap-2">
          <span>Powered by</span>
          <span class="icon-[token-branded--polkadot] animate-spin" style="animation-duration: 16s;" />
        </p>
      </div>
    </section>

    <!-- Account Cards -->
    <main class="container mx-auto py-8 space-y-8">
      <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        <div v-for="chainKey in chainKeys" :key="chainKey">
          <AccountCard
            :chain-key="chainKey"
            :address="selectedAccount?.address ? unifyAddress(selectedAccount.address) : undefined"
          />
        </div>
      </div>
    </main>

    <Footer />
  </div>
</template>
