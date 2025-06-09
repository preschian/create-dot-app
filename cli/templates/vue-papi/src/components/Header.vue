<script setup lang="ts">
// Header component logic can be added here later
</script>

<template>
  <header class="bg-white shadow-sm">
    <div class="container mx-auto px-4 py-6">
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-4">
          <a href="https://polkadot.network" target="_blank" class="block group">
            <div class="w-10 h-10 bg-black rounded-full flex items-center justify-center group-hover:bg-gray-800 transition-colors">
              <span class="text-white font-bold text-sm">DOT</span>
            </div>
          </a>
          <h1 class="text-2xl font-light text-black tracking-wide">
            NFT Showcase
          </h1>
        </div>
        <button class="bg-black hover:bg-gray-800 text-white px-6 py-2.5 font-medium transition-colors duration-200 uppercase tracking-wider text-sm">
          Connect Wallet
        </button>
      </div>
    </div>
  </header>
</template>
