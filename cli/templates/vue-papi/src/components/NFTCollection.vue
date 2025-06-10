<script setup lang="ts">
import { onMounted, ref } from 'vue'
import sdk from '../utils/sdk'
import NFTCard from './NFTCard.vue'

const items = ref<{ collection: number, token: number, metadata: string }[]>([])
const owners = ref<Set<string>>(new Set())
const listed = ref<number>(0)

const { api } = sdk('asset_hub')

onMounted(async () => {
  const [queryMetadata, queryOwner, queryPrice] = await Promise.all([
    api.query.Nfts.ItemMetadataOf.getEntries(486),
    api.query.Nfts.Item.getEntries(486),
    api.query.Nfts.ItemPriceOf.getEntries(486),
  ])

  items.value = queryMetadata
    .sort((a, b) => a.keyArgs[1] - b.keyArgs[1])
    .map(item => ({
      collection: item.keyArgs[0],
      token: item.keyArgs[1],
      metadata: item.value.data.asText(),
    }))

  owners.value = new Set(queryOwner.map(item => item.value.owner))
  listed.value = queryPrice.length
})
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
              {{ items.length }}
            </div>
            <div class="text-xs text-gray-500 uppercase tracking-wider">
              Items
            </div>
          </div>
          <div>
            <div class="text-2xl font-light">
              {{ listed }}
            </div>
            <div class="text-xs text-gray-500 uppercase tracking-wider">
              Listed
            </div>
          </div>
          <div>
            <div class="text-2xl font-light">
              {{ owners.size }}
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
          v-for="metadata in items"
          :key="`${metadata.collection}-${metadata.token}`"
          :metadata="metadata.metadata"
          :collection="metadata.collection"
          :token="metadata.token"
        />
      </div>
    </div>
  </div>
</template>
