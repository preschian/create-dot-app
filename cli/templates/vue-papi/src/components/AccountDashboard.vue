<script setup lang="ts">
import { computed } from 'vue'
import { useConnect } from '~/composables/useConnect'
import { useProfile } from '~/composables/useProfile'
import { useStatus } from '~/composables/useStatus'

const { selectedAccount } = useConnect()
const { connectedNetworks } = useStatus()

// Mock data for now - in real implementation this would come from blockchain queries
const mockAccountData = computed(() => {
  if (!selectedAccount.value)
    return []

  // Define the correct order: Polkadot, Kusama, Paseo
  const networkOrder = ['asset_hub', 'people', 'pas_asset_hub']

  const result = []

  for (const networkKey of networkOrder) {
    const network = connectedNetworks.value.find(n => n.key === networkKey)
    if (!network)
      continue

    const getNetworkData = () => {
      switch (network.key) {
        case 'asset_hub':
          return {
            networkName: 'Polkadot',
            tokenSymbol: 'DOT',
            balance: '62.1981',
            nftCount: 1,
            color: 'bg-pink-500',
          }
        case 'people':
          return {
            networkName: 'Kusama',
            tokenSymbol: 'KSM',
            balance: '0.0000',
            nftCount: 0,
            color: 'bg-gray-800',
          }
        case 'pas_asset_hub':
          return {
            networkName: 'Paseo',
            tokenSymbol: 'PAS',
            balance: '0.0000',
            nftCount: 0,
            color: 'bg-green-500',
          }
        default:
          return {
            networkName: network.name || network.key,
            tokenSymbol: 'DOT',
            balance: '0.0000',
            nftCount: 0,
            color: 'bg-gray-500',
          }
      }
    }

    result.push({
      ...network,
      ...getNetworkData(),
      account: selectedAccount.value,
    })
  }

  return result
})

const { displayName, displayAddress } = useProfile({
  name: selectedAccount.value?.name,
  address: selectedAccount.value?.address,
})
</script>

<template>
  <div class="bg-white border border-gray-200 overflow-hidden hover:border-black transition-all duration-300 hover:shadow-lg">
    <div class="p-4">
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-lg font-light text-black tracking-wide">
          Account Dashboard
        </h2>
        <div v-if="selectedAccount" class="text-sm text-gray-500">
          {{ displayName || displayAddress }}
        </div>
      </div>

      <div v-if="!selectedAccount" class="text-center py-8">
        <div class="text-gray-500 mb-4">
          <span class="icon-[mdi--wallet-outline] text-4xl" />
        </div>
        <p class="text-gray-500">
          Please connect your wallet to view account information
        </p>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div
          v-for="networkData in mockAccountData"
          :key="networkData.key"
          class="group bg-white border border-gray-200 overflow-hidden hover:border-black transition-all duration-300 hover:shadow-lg"
        >
          <div class="p-4">
            <!-- Network Header -->
            <div class="flex items-center justify-between mb-4">
              <div class="flex items-center space-x-2">
                <div :class="networkData.color" class="w-3 h-3 rounded-full" />
                <h3 class="font-light text-black tracking-wide">
                  {{ networkData.networkName }}
                </h3>
              </div>
              <div
                v-if="networkData.status === 'connected'"
                class="text-xs px-2 py-1 bg-green-100 text-green-700 border border-green-200 uppercase tracking-wider"
              >
                Live
              </div>
            </div>

            <!-- Account Info -->
            <div class="mb-4">
              <div class="text-xs text-gray-500 uppercase tracking-wider mb-1">
                Account
              </div>
              <div class="text-sm font-mono text-gray-800">
                {{ displayName || displayAddress }}
              </div>
            </div>

            <!-- Stats Grid -->
            <div class="grid grid-cols-2 gap-4">
              <!-- Balance -->
              <div class="border border-gray-200 p-3">
                <div class="text-xs text-gray-500 uppercase tracking-wider mb-1">
                  Balance
                </div>
                <div class="text-lg font-light text-black">
                  {{ networkData.balance }}
                </div>
                <div class="text-xs text-gray-500 uppercase tracking-wider">
                  {{ networkData.tokenSymbol }}
                </div>
              </div>

              <!-- NFTs -->
              <div class="border border-gray-200 p-3">
                <div class="text-xs text-gray-500 uppercase tracking-wider mb-1">
                  NFTs
                </div>
                <div class="text-lg font-light text-black">
                  {{ networkData.nftCount }}
                </div>
                <div class="text-xs text-gray-500 uppercase tracking-wider">
                  Items
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
