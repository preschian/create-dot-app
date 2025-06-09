<script setup lang="ts">
import NFTCollection from './components/NFTCollection.vue'
</script>

<template>
  <div class="min-h-screen bg-gray-100">
    <!-- Header -->
    <header class="bg-white shadow-sm">
      <div class="max-w-7xl mx-auto px-4 py-6">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-4">
            <div class="flex space-x-4">
              <a href="https://vite.dev" target="_blank" class="block group">
                <img src="/vite.svg" class="h-10 w-10 transition-transform duration-300 group-hover:scale-110" alt="Vite logo">
              </a>
              <a href="https://vuejs.org/" target="_blank" class="block group">
                <img src="./assets/vue.svg" class="h-10 w-10 transition-transform duration-300 group-hover:scale-110" alt="Vue logo">
              </a>
            </div>
            <h1 class="text-2xl font-bold text-gray-800">
              Polkadot NFT Marketplace
            </h1>
          </div>
          <div class="text-sm text-gray-600">
            Built with Vue + Vite + Tailwind CSS v4
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main>
      <NFTCollection />
    </main>
  </div>
</template>
