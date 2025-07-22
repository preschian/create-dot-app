<script setup lang="ts">
import { useStatus } from '~/composables/useStatus'

const { connectedNetworks, getSubscanUrl } = useStatus()
</script>

<template>
  <div class="bg-white border border-gray-200 overflow-hidden hover:border-black transition-all duration-300 hover:shadow-lg">
    <div class="p-4">
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-lg font-light text-black tracking-wide">
          Network Status
        </h2>
        <div class="text-sm text-gray-500">
          {{ connectedNetworks.filter(n => n.status === 'connected').length }} of {{ connectedNetworks.length }} networks connected
        </div>
      </div>

      <div class="space-y-3">
        <div
          v-for="network in connectedNetworks"
          :key="network.key"
          class="group bg-white border border-gray-200 overflow-hidden hover:border-black transition-all duration-300 hover:shadow-lg"
        >
          <div class="p-4">
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-3">
                <div class="inline-grid *:[grid-area:1/1]">
                  <div
                    v-if="network.status === 'connecting'"
                    class="status status-warning rounded-full animate-pulse"
                  />
                  <div
                    :class="network.status === 'connected' ? 'status-success' : 'status-warning'"
                    class="status rounded-full"
                  />
                </div>
                <div>
                  <h3 class="font-light text-black tracking-wide">
                    {{ network.name || network.key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) }}
                  </h3>
                  <p class="text-sm text-gray-500">
                    {{ network.key }}
                  </p>
                </div>
              </div>

              <div class="flex items-center space-x-4">
                <div class="text-right">
                  <div
                    class="text-xs px-2 py-1 border uppercase tracking-wider"
                    :class="network.status === 'connected' ? 'bg-white border-gray-200 text-gray-700' : 'bg-gray-100 border-gray-300 text-gray-600'"
                  >
                    {{ network.status === 'connected' ? 'Connected' : 'Connecting' }}
                  </div>
                  <div v-if="network.status === 'connected' && network.blockHeight > 0" class="text-xs font-mono text-gray-500 mt-1">
                    Block #{{ network.blockHeight.toLocaleString() }}
                  </div>
                </div>

                <a
                  v-if="network.status === 'connected'"
                  :href="getSubscanUrl(network.key)"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="btn btn-neutral btn-sm uppercase tracking-wider"
                  title="View on Subscan"
                >
                  View
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
