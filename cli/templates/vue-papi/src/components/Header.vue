<script setup lang="ts">
import WalletConnect from './WalletConnect.vue'
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
        <WalletConnect />
      </div>
    </div>
  </header>
</template>

<style scoped>
.overflow-y-auto::-webkit-scrollbar {
  width: 4px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: #f1f1f1;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 2px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: #a1a1a1;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
