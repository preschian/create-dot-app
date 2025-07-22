<script setup lang="ts">
import { ref } from 'vue'
import { useStatus } from '~/composables/useStatus'

const { connectedNetworks } = useStatus()
const isMinimized = ref(true)

function toggleMinimized() {
  isMinimized.value = !isMinimized.value
}
</script>

<template>
  <div class="fixed bottom-4 right-4 z-50">
    <!-- Minimized: Just server icon button -->
    <button
      v-if="isMinimized"
      class="btn btn-circle btn-neutral shadow-lg hover:shadow-xl"
      @click="toggleMinimized"
    >
      <span class="icon-[mdi--server-network] text-xl" />
    </button>

    <!-- Expanded: Full panel -->
    <div v-else class="bg-white border border-gray-200 shadow overflow-hidden transition-all duration-300 hover:shadow-lg">
      <!-- Header -->
      <div class="flex items-center justify-between p-3 bg-gray-50 border-b border-gray-200">
        <div class="flex items-center space-x-2">
          <span class="text-sm font-light text-black tracking-wide">Networks</span>
          <div class="badge badge-neutral badge-sm">
            {{ connectedNetworks.filter(n => n.status === 'connected').length }}/{{ connectedNetworks.length }}
          </div>
        </div>
        <button
          class="btn btn-ghost btn-sm btn-circle"
          @click="toggleMinimized"
        >
          <span class="icon-[mdi--close]" />
        </button>
      </div>

      <!-- Content -->
      <div class="p-3">
        <div class="space-y-2">
          <div
            v-for="network in connectedNetworks"
            :key="network.key"
            class="flex items-center justify-between text-sm gap-4"
          >
            <div class="flex items-center space-x-2">
              <div :class="network.status === 'connected' ? 'status-success animate-pulse' : 'status-warning'" class="status rounded-full" />
              <span class="font-light text-black tracking-wide">
                {{ network.name || 'Unknown' }}
              </span>
            </div>

            <div class="text-xs font-mono text-gray-500">
              <span
                v-if="network.status === 'connected' && network.blockHeight > 0"
                :key="`${network.key}-${network.blockHeight}`"
                class="block-highlight"
              >
                #{{ network.blockHeight.toLocaleString() }}
              </span>
              <span v-else class="animate-pulse">
                #---
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
