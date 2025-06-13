<script setup lang="ts">
import { type HexString, hexToString } from 'dedot/utils'
import { onMounted, reactive, ref } from 'vue'
import sdk from '../utils/sdk'
import NFTCard from './NFTCard.vue'

const { api: assetHubApi } = sdk('asset_hub')
const COLLECTION = 486

const items = ref<{ collection: number, token: number, metadata: string }[]>([])
const owners = ref<Set<string>>(new Set())
const listed = ref<number>(0)
const collection = reactive({
  name: 'Loading...',
  description: 'Loading...',
})

onMounted(async () => {
  const api = await assetHubApi

  const [queryMetadata, queryOwner, queryPrice, queryCollectionMetadata] = await Promise.all([
    api.query.nfts.itemMetadataOf.entries(COLLECTION),
    api.query.nfts.item.entries(COLLECTION),
    api.query.nfts.itemPriceOf.entries(COLLECTION),
    api.query.nfts.collectionMetadataOf(COLLECTION),
  ])

  items.value = queryMetadata
    .sort((a, b) => a[0][1] - b[0][1])
    .map(([key, value]) => ({
      collection: key[0],
      token: key[1],
      metadata: hexToString(value.data as HexString),
    }))

  owners.value = new Set(queryOwner.map(([, value]) => value.owner.address()))
  listed.value = queryPrice.length

  const metadataUrl = queryCollectionMetadata?.data ? hexToString(queryCollectionMetadata.data as HexString).replace('ipfs://', 'https://ipfs.io/ipfs/') : null

  if (!metadataUrl) {
    return
  }

  const metadata = await fetch(metadataUrl)
  const metadataJson = await metadata.json()
  collection.name = metadataJson.name
  collection.description = metadataJson.description
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
            {{ collection.name }}
          </h1>
          <p class="text-gray-600 font-light line-clamp-1">
            {{ collection.description }}
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
      <div v-if="items.length" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        <NFTCard
          v-for="metadata in items"
          :key="`${metadata.collection}-${metadata.token}`"
          :metadata="metadata.metadata"
          :collection="metadata.collection"
          :token="metadata.token"
        />
      </div>
      <div v-else class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        <NFTCard
          v-for="n in 32"
          :key="n"
          :collection="COLLECTION"
        />
      </div>
    </div>
  </div>
</template>
