<script setup lang="ts">
import type { NFTItem } from '../data/nftItems'

interface Props {
  nft: NFTItem
}

defineProps<Props>()
</script>

<template>
  <div class="group">
    <!-- Clean Card -->
    <div class="bg-white border border-gray-200 overflow-hidden hover:border-black transition-all duration-300 hover:shadow-lg">
      <!-- NFT Image -->
      <div class="relative overflow-hidden">
        <img
          :src="nft.image"
          :alt="nft.name"
          class="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-105"
        >
        <!-- Dark Overlay -->
        <div class="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300" />

        <!-- Title & Price Overlay (shown on hover) -->
        <div class="absolute inset-0 flex flex-col justify-between p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div class="space-y-2">
            <h3 class="text-white text-lg font-light tracking-wide leading-tight">
              {{ nft.name }}
            </h3>
            <div>
              <div class="text-xs text-white/80 uppercase tracking-wider">
                Price
              </div>
              <div class="text-base font-medium text-white">
                {{ nft.price }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Card Content -->
      <div class="p-4">
        <!-- Owner & Action -->
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-2">
            <div class="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center">
              <span class="text-xs font-medium">{{ nft.creator.charAt(0) }}</span>
            </div>
            <div>
              <div class="text-xs text-gray-500 uppercase tracking-wider">
                Owner
              </div>
              <div class="text-xs text-black font-medium">
                {{ nft.creator }}
              </div>
            </div>
          </div>
          <button class="bg-black hover:bg-gray-800 text-white px-4 py-1.5 text-xs font-medium transition-colors duration-200 uppercase tracking-wider">
            View
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
