<script setup lang="ts">
import { ref } from 'vue'
import { useStatus } from '~/composables/useStatus'
import SignTransaction from './SignTransaction.vue'

const { isConnected, connectedNetworks } = useStatus()
const transactionModal = ref<HTMLDialogElement | null>(null)
</script>

<template>
  <div class="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-lg backdrop-blur-sm">
    <div class="container mx-auto px-4 py-2">
      <div class="flex items-center justify-between text-sm">
        <!-- Connection Status -->
        <div class="flex items-center space-x-4">
          <div class="flex items-center space-x-4">
            <div class="inline-grid *:[grid-area:1/1]">
              <div :class="isConnected ? 'status-success' : 'status-error'" class="status rounded-full animate-ping" />
              <div :class="isConnected ? 'status-success' : 'status-error'" class="status rounded-full" />
            </div>
            <span class="text-black font-medium">
              {{ isConnected ? 'Live' : 'Connecting...' }}
            </span>
          </div>

          <!-- Networks Info -->
          <div class="hidden sm:flex items-center space-x-4">
            <div class="flex items-center space-x-2 relative group">
              <span class="text-gray-500 cursor-pointer hover:text-black transition-colors">Networks</span>

              <!-- Networks Tooltip -->
              <div class="absolute bottom-full left-0 mb-2 w-100 bg-white border border-gray-200 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                <div class="p-3">
                  <h4 class="text-sm font-light text-black tracking-wide mb-2">
                    All Networks
                  </h4>
                  <div class="space-y-2">
                    <div
                      v-for="network in connectedNetworks"
                      :key="network.name"
                      class="flex items-center justify-between p-2 rounded border"
                      :class="network.status === 'connected' ? 'bg-gray-50 border-gray-200' : 'bg-white border-gray-200'"
                    >
                      <div class="flex items-center space-x-2">
                        <div v-if="network.status === 'connected'" class="status status-success rounded-full" />
                        <div v-else class="status status-warning rounded-full" />
                        <span class="text-sm font-medium text-black">{{ network.name }}</span>
                      </div>
                      <div class="flex items-center space-x-2">
                        <span
                          class="text-xs px-2 py-1 rounded-full border"
                          :class="network.status === 'connected' ? 'bg-white border-gray-200 text-gray-700' : 'bg-gray-50 border-gray-200 text-gray-600'"
                        >
                          {{ network.status === 'connected' ? 'Connected' : 'Connecting' }}
                        </span>
                        <span v-if="network.status === 'connected' && network.blockHeight > 0" class="text-xs font-mono text-gray-600">
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

        <!-- Transaction Testing -->
        <div class="flex items-center space-x-4">
          <button
            class="btn btn-outline btn-sm text-xs uppercase tracking-wider"
            @click="transactionModal?.showModal()"
          >
            Test Transaction
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- Transaction Modal -->
  <dialog ref="transactionModal" class="modal">
    <div class="modal-box">
      <div class="flex justify-between items-center mb-4">
        <h3 class="font-bold text-lg">
          Test Transaction
        </h3>
        <button
          class="btn btn-sm btn-circle btn-ghost"
          @click="transactionModal?.close()"
        >
          <span class="icon-[mdi--close]" />
        </button>
      </div>

      <SignTransaction />
    </div>
    <form method="dialog" class="modal-backdrop">
      <button>close</button>
    </form>
  </dialog>
</template>
