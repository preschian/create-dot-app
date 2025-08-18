<script setup lang="ts">
import type { Prefix } from '~/plugins/sdk.client'

const props = defineProps<{
  chainKey: Prefix
  address?: string
}>()

const { name, currentBlock, isConnected } = useCurrentBlock(props.chainKey)
</script>

<template>
  <div class="group bg-white border border-gray-200 overflow-hidden hover:border-black transition-all duration-300 hover:shadow-lg p-4">
    <!-- Header -->
    <div class="flex items-center justify-between mb-4">
      <div class="flex items-center space-x-2">
        <h3 class="font-light text-black tracking-wide">
          {{ name || '---' }}
        </h3>
      </div>

      <div
        v-if="isConnected"
        class="text-xs px-2 py-1 bg-green-100 text-green-700 border border-green-200 uppercase tracking-wider flex items-center gap-1"
      >
        <span class="icon-[mdi--check-circle] text-xs" />
        Live
      </div>
    </div>

    <!-- Chain Info Section -->
    <div class="mb-4">
      <div class="text-xs text-gray-500 uppercase tracking-wider mb-1">
        Current Block
      </div>
      <div :key="currentBlock" class="font-light text-black font-mono text-lg block-highlight">
        #{{ currentBlock ? currentBlock.toLocaleString() : '---' }}
      </div>
    </div>

    <!-- Account Section -->
    <div class="border-t border-gray-100 pt-4">
      <!-- Balance (when address exists) -->
      <div v-if="address">
        <Balance :key="address" :address="address" :chain-key="chainKey" />
      </div>

      <!-- Connect Wallet Message (when no address) -->
      <div v-else class="flex flex-col items-center py-3">
        <span class="icon-[mdi--wallet-plus] text-2xl text-gray-400 mb-2" />
        <p class="text-xs text-gray-500">
          Connect wallet for balance
        </p>
      </div>
    </div>

    <!-- Actions Section -->
    <div v-if="address" class="mt-4">
      <!-- Quick Actions Row -->
      <div class="pt-3 border-t border-gray-100">
        <div class="grid grid-cols-2 gap-2 mb-3">
          <a :href="buyTokenUrl(chainKey, address)" target="_blank" class="btn btn-xs btn-outline btn-neutral uppercase tracking-wider">
            Funds Token
          </a>
          <a :href="explorerAccount(chainKey, address)" target="_blank" class="btn btn-xs btn-outline btn-neutral uppercase tracking-wider">
            <span class="icon-[mdi--open-in-new]" />
            Explorer
          </a>
        </div>

        <!-- Transaction Component -->
        <div v-if="isConnected">
          <SignTransaction :chain-key="chainKey" />
        </div>

        <!-- Disconnected state -->
        <div v-else>
          <div class="flex items-center justify-center gap-2 text-xs text-gray-500">
            <span class="icon-[mdi--link-off]" />
            Chain not connected
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
