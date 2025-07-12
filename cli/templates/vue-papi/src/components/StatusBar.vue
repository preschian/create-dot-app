<script setup lang="ts">
import { useStatus } from '../composables/useStatus'

const { isConnected, connectedNetworks } = useStatus()
</script>

<template>
  <div class="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-lg backdrop-blur-sm">
    <div class="container mx-auto px-4 py-2">
      <div class="flex items-center justify-between text-sm">
        <!-- Connection Status -->
        <div class="flex items-center space-x-4">
          <div class="flex items-center space-x-2">
            <div class="flex items-center space-x-1">
              <div
                class="w-2 h-2 rounded-full transition-colors"
                :class="isConnected ? 'bg-green-500' : 'bg-red-500'"
              />
              <span class="text-gray-700 font-medium">
                {{ isConnected ? 'Live' : 'Connecting...' }}
              </span>
            </div>
          </div>

          <!-- Networks Info -->
          <div class="hidden sm:flex items-center space-x-4">
            <div class="flex items-center space-x-2 relative group">
              <span class="text-gray-500 cursor-pointer">Networks</span>

              <!-- Networks Tooltip -->
              <div class="absolute bottom-full left-0 mb-2 w-100 bg-white border border-gray-200 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                <div class="p-3">
                  <h4 class="text-sm font-medium text-gray-900 mb-2">
                    All Networks
                  </h4>
                  <div class="space-y-2">
                    <div
                      v-for="network in connectedNetworks"
                      :key="network.name"
                      class="flex items-center justify-between p-2 rounded border"
                      :class="network.status === 'connected' ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'"
                    >
                      <div class="flex items-center space-x-2">
                        <div
                          class="w-2 h-2 rounded-full"
                          :class="network.status === 'connected' ? 'bg-green-500' : 'bg-gray-400'"
                        />
                        <span class="text-sm font-medium text-gray-900">{{ network.name }}</span>
                      </div>
                      <div class="flex items-center space-x-2">
                        <span
                          class="text-xs px-2 py-1 rounded-full"
                          :class="network.status === 'connected' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'"
                        >
                          {{ network.status === 'connected' ? 'Connected' : 'Connecting' }}
                        </span>
                        <span v-if="network.status === 'connected' && network.blockHeight > 0" class="text-xs font-mono text-gray-700">
                          {{ network.blockHeight.toLocaleString() }}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
