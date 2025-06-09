<script setup lang="ts">
import { ref } from 'vue'
import { nftItems as nftData, type NFTItem } from '../data/nftItems'
import NFTCard from './NFTCard.vue'

const nftItems = ref<NFTItem[]>(nftData)
</script>

<template>
  <div class="min-h-screen bg-white">
    <!-- Subtle Background Pattern -->
    <div class="fixed inset-0 overflow-hidden pointer-events-none">
      <div class="absolute inset-0" style="background-image: radial-gradient(circle at 1px 1px, rgba(0,0,0,0.05) 1px, transparent 0); background-size: 20px 20px;" />
    </div>

    <div class="relative z-10 container mx-auto px-4 py-12">
      <!-- Minimalist Header -->
      <div class="text-center mb-20">
        <div class="inline-flex items-center justify-center w-16 h-16 bg-black rounded-full mb-8">
          <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" />
          </svg>
        </div>
        <h1 class="text-6xl font-light text-black mb-6 tracking-tight">
          NFT Collection
        </h1>
        <div class="w-24 h-px bg-black mx-auto mb-6" />
        <p class="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed font-light">
          Curated digital masterpieces on the Polkadot ecosystem.
          <span class="text-black font-medium">Minimalist. Elegant. Timeless.</span>
        </p>
      </div>

      <!-- Minimalist NFT Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 mb-20">
        <NFTCard
          v-for="nft in nftItems"
          :key="nft.id"
          :nft="nft"
        />
      </div>

      <!-- Minimalist Stats Section -->
      <div class="border-t border-gray-200 pt-16">
        <div class="text-center mb-12">
          <h2 class="text-3xl font-light text-black mb-4 tracking-tight">
            Collection Overview
          </h2>
          <div class="w-16 h-px bg-black mx-auto" />
        </div>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div class="text-center">
            <div class="text-4xl font-light text-black mb-2">
              {{ nftItems.length }}
            </div>
            <div class="text-sm text-gray-600 uppercase tracking-wider">
              Total Items
            </div>
          </div>

          <div class="text-center">
            <div class="text-4xl font-light text-black mb-2">
              {{ nftItems.length }}
            </div>
            <div class="text-sm text-gray-600 uppercase tracking-wider">
              Listed
            </div>
          </div>

          <div class="text-center">
            <div class="text-4xl font-light text-black mb-2">
              {{ new Set(nftItems.map(n => n.creator)).size }}
            </div>
            <div class="text-sm text-gray-600 uppercase tracking-wider">
              Owners
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.container {
  max-width: 1200px;
}
</style>
