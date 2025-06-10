<script setup lang="ts">
import { FixedSizeBinary } from 'polkadot-api'
import { onMounted, ref } from 'vue'
import sdk from '../utils/sdk'

const props = defineProps<{
  metadata: string
  collection: number
  token: number
}>()

const metadata = ref<{
  name: string
  image: string
}>()

const { api, client } = sdk('asset_hub')
const { api: peopleApi } = sdk('people')

const price = ref<string>()
const owner = ref<string>()

onMounted(async () => {
  const [getMetadata, queryOwner, queryPrice] = await Promise.all([
    fetch(props.metadata).then(res => res.json()),
    api.query.Nfts.Item.getValue(props.collection, props.token),
    api.query.Nfts.ItemPriceOf.getValue(props.collection, props.token),
  ])

  metadata.value = getMetadata
  price.value = queryPrice?.[0].toString()

  if (price.value) {
    const chainSpec = await client.getChainSpecData()
    const tokenDecimals = chainSpec.properties.tokenDecimals
    price.value = (Number(price.value) / 10 ** tokenDecimals).toFixed()
  }

  if (queryOwner?.owner) {
    const queryIdentity = await peopleApi.query.Identity.IdentityOf.getValue(queryOwner.owner)
    owner.value = queryIdentity?.info.display.value instanceof FixedSizeBinary
      ? queryIdentity.info.display.value.asText()
      : `${queryOwner?.owner.slice(0, 4)}...${queryOwner?.owner.slice(-4)}`
  }
})
</script>

<template>
  <div class="group">
    <!-- Clean Card -->
    <div class="bg-white border border-gray-200 overflow-hidden hover:border-black transition-all duration-300 hover:shadow-lg">
      <!-- NFT Image -->
      <div class="relative overflow-hidden">
        <img
          :src="metadata?.image"
          :alt="metadata?.name"
          class="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-105"
        >
        <!-- Dark Overlay -->
        <div class="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300" />

        <!-- Title & Price Overlay (shown on hover) -->
        <div class="absolute inset-0 flex flex-col justify-between p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
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
        <!-- Owner & Action -->
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-2">
            <div class="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center">
              <span class="text-xs font-medium uppercase">{{ owner?.charAt(owner.length - 1) }}</span>
            </div>
            <div>
              <div class="text-xs text-gray-500 uppercase tracking-wider">
                Owner
              </div>
              <div class="text-xs text-black font-medium">
                {{ owner }}
              </div>
            </div>
          </div>
          <a :href="`https://koda.art/ahp/gallery/${collection}-${token}`" target="_blank" class="bg-black hover:bg-gray-800 text-white px-4 py-1.5 text-xs font-medium transition-colors duration-200 uppercase tracking-wider hover:cursor-pointer">
            View
          </a>
        </div>
      </div>
    </div>
  </div>
</template>
