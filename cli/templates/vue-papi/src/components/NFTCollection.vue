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
      <!-- Split Header -->
      <div class="flex items-end justify-between mb-12 pb-8 border-b border-gray-200">
        <div>
          <h1 class="text-5xl font-light text-black tracking-tight mb-2">
            NFT Collection
          </h1>
          <p class="text-gray-600 font-light">
            Curated digital masterpieces on the Polkadot ecosystem
          </p>
        </div>
        <div class="flex gap-6 text-right">
          <div>
            <div class="text-2xl font-light">
              {{ nftItems.length }}
            </div>
            <div class="text-xs text-gray-500 uppercase tracking-wider">
              Items
            </div>
          </div>
          <div>
            <div class="text-2xl font-light">
              {{ nftItems.length }}
            </div>
            <div class="text-xs text-gray-500 uppercase tracking-wider">
              Listed
            </div>
          </div>
          <div>
            <div class="text-2xl font-light">
              {{ new Set(nftItems.map(n => n.creator)).size }}
            </div>
            <div class="text-xs text-gray-500 uppercase tracking-wider">
              Owners
            </div>
          </div>
        </div>
      </div>

      <!-- Minimalist NFT Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        <NFTCard
          v-for="nft in nftItems"
          :key="nft.id"
          :nft="nft"
        />
      </div>
    </div>
  </div>
</template>
