<script setup lang="ts">
import type { Prefix } from '~/utils/sdk'
import { useCurrentBlock } from '~/composables/useCurrentBlock'
import { buyTokenUrl } from '~/utils/formatters'
import Balance from './Balance.vue'
import ContractData from './ContractData.vue'
import MapAccount from './MapAccount.vue'
import SignTransaction from './SignTransaction.vue'

const props = defineProps<{
  chainKey: Prefix
  address?: string
}>()

const { name, currentBlock, isConnected } = useCurrentBlock(props.chainKey)
</script>

<template>
  <div class="group bg-white border border-gray-200 overflow-hidden hover:border-black transition-all duration-300 hover:shadow-lg">
    <!-- Header -->
    <div class="flex items-center justify-between p-6 border-b border-gray-100">
      <h3 class="text-xl font-light text-black tracking-wide">
        {{ name || '---' }}
      </h3>

      <div
        v-if="isConnected"
        class="text-xs px-3 py-1.5 bg-green-100 text-green-700 border border-green-200 uppercase tracking-wider flex items-center gap-1.5"
      >
        <span class="icon-[mdi--check-circle] text-sm" />
        Live
      </div>
    </div>

    <!-- Two Column Layout -->
    <div class="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-gray-100">
      <!-- Left Column: Chain Info & Balance -->
      <div class="p-6 space-y-6">
        <!-- Chain Info Section -->
        <div>
          <div class="text-xs text-gray-500 uppercase tracking-wider mb-2">
            Current Block
          </div>
          <div :key="currentBlock" class="font-light text-black font-mono text-2xl block-highlight">
            #{{ currentBlock ? currentBlock.toLocaleString() : '---' }}
          </div>
        </div>

        <!-- Balance Section -->
        <div class="border-t border-gray-100 pt-6">
          <div v-if="address">
            <Balance :key="`${address}_${currentBlock}`" :address="address" :chain-key="chainKey" />
          </div>

          <div v-else class="flex flex-col items-center py-6">
            <span class="icon-[mdi--wallet-plus] text-3xl text-gray-300 mb-3" />
            <p class="text-sm text-gray-400">
              Connect wallet for balance
            </p>
          </div>
        </div>
      </div>

      <!-- Right Column: Contract Info & Actions -->
      <div class="p-6">
        <div v-if="address" class="space-y-6">
          <!-- Map Account -->
          <MapAccount :key="address" :chain-key="chainKey" :address="address" />

          <!-- Contract Data -->
          <div :key="currentBlock">
            <ContractData :key="address" :address="address" :chain-key="chainKey" />
          </div>

          <!-- Actions Section -->
          <div class="border-t border-gray-100 pt-6 space-y-3">
            <!-- Transaction Component with Get Tokens -->
            <div v-if="isConnected" class="flex items-center gap-3">
              <div class="flex-1">
                <SignTransaction :chain-key="chainKey" :address="address" />
              </div>
              <div class="tooltip" data-tip="Get Tokens">
                <a :href="buyTokenUrl()" target="_blank" class="btn btn-sm btn-outline btn-neutral btn-square">
                  <span class="icon-[mdi--wallet-plus] text-lg" />
                </a>
              </div>
            </div>

            <!-- Disconnected state -->
            <div v-else class="flex items-center justify-center gap-2 py-4 text-sm text-gray-400">
              <span class="icon-[mdi--link-off]" />
              Chain not connected
            </div>
          </div>
        </div>

        <div v-else class="flex flex-col items-center justify-center h-full py-12">
          <span class="icon-[mdi--file-document-outline] text-4xl text-gray-300 mb-3" />
          <p class="text-sm text-gray-400">
            Connect wallet to interact
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
