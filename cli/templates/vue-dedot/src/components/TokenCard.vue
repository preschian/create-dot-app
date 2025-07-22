<script setup lang="ts">
import { useToken } from '~/composables/useToken'
import Avatar from './Avatar.vue'

const props = defineProps<{
  metadata?: string
  collection: number
  token?: number
}>()

const { metadata, price, owner, loading } = useToken(props)
</script>

<template>
  <div class="group">
    <!-- Clean Card -->
    <div class="bg-white border border-gray-200 overflow-hidden hover:border-black transition-all duration-300 hover:shadow-lg">
      <!-- NFT Image -->
      <div class="relative overflow-hidden">
        <!-- Loading Skeleton -->
        <div v-if="loading" class="w-full h-64 bg-gray-100">
          <div class="w-full h-full animate-pulse bg-gray-200" />
        </div>

        <!-- NFT Image -->
        <img
          v-else-if="metadata?.image"
          :src="`https://wsrv.nl/?url=${metadata?.image}&w=256&h=256`"
          :alt="metadata?.name"
          class="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-105"
        >

        <!-- Dark Overlay -->
        <div v-if="!loading" class="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300" />

        <!-- Title & Price Overlay (shown on hover) -->
        <div v-if="!loading" class="absolute inset-0 flex flex-col justify-between p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div class="space-y-2">
            <h3 class="text-white text-lg font-light tracking-wide leading-tight">
              {{ metadata?.name }}
            </h3>
            <div v-if="price">
              <div class="text-xs text-white/80 uppercase tracking-wider">
                Price
              </div>
              <div class="text-base font-medium text-white">
                {{ price }} DOT
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Card Content -->
      <div class="p-4">
        <!-- Loading Skeleton for Card Content -->
        <div v-if="loading" class="flex items-center justify-between">
          <div class="flex items-center space-x-2">
            <div class="w-8 h-8 bg-gray-200 animate-pulse rounded-full" />
            <div class="space-y-1">
              <div class="h-3 w-12 bg-gray-200 animate-pulse" />
              <div class="h-3 w-20 bg-gray-200 animate-pulse" />
            </div>
          </div>
          <div class="h-7 w-14 bg-gray-200 animate-pulse" />
        </div>

        <!-- Owner & Action -->
        <div v-else class="flex items-center justify-between">
          <Avatar
            :address="owner"
          />
          <a
            :href="`https://koda.art/ahp/gallery/${collection}-${token}`"
            target="_blank"
            class="btn btn-neutral btn-sm uppercase tracking-wider"
          >
            View
          </a>
        </div>
      </div>
    </div>
  </div>
</template>
