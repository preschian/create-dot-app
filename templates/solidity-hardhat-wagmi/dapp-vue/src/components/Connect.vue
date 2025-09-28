<script setup lang="ts">
import type { Connector } from '@wagmi/vue'
import { useAccount, useChainId, useConnect, useDisconnect } from '@wagmi/vue'
import { computed, ref } from 'vue'
import { ensurePaseoTestnet } from '../utils/chain'
import { shortenAddress } from '../utils/formatters'

// Popular wallets for when no connectors are available
const popularWallets = [
  {
    id: 'metamask',
    name: 'MetaMask',
    downloadUrl: 'https://metamask.io/download/',
  },
  {
    id: 'talisman',
    name: 'Talisman Wallet',
    downloadUrl: 'https://talisman.xyz/',
  },
]

const connectModal = ref<HTMLDialogElement | null>(null)
const chainId = useChainId()
const { connect, connectors, error, status } = useConnect()
const { disconnect } = useDisconnect()
const { address, isConnected, connector } = useAccount()

// Filter connectors to show only MetaMask and Talisman
const filteredConnectors = computed(() => {
  return connectors.filter((connector) => {
    const name = connector.name.toLowerCase()
    const id = connector.id.toLowerCase()
    return name.includes('metamask')
      || name.includes('talisman')
      || id.includes('metamask')
      || id.includes('talisman')
  })
})

function openConnectModal() {
  connectModal.value?.showModal()
}

function closeConnectModal() {
  connectModal.value?.close()
}

async function handleConnect(connector: Connector) {
  try {
    // First ensure the Paseo testnet is added to the wallet
    await ensurePaseoTestnet()
    // Then connect with the specific chain
    connect({ connector, chainId: chainId.value })
    closeConnectModal()
  }
  catch (err) {
    console.error('Failed to add Paseo testnet or connect:', err)
    // Still try to connect even if adding the chain fails
    connect({ connector, chainId: chainId.value })
    closeConnectModal()
  }
}

function handleDisconnect() {
  disconnect()
  localStorage.clear()
}
</script>

<template>
  <!-- Connect/Disconnect Buttons -->
  <div class="flex items-center gap-2">
    <button
      class="btn btn-outline btn-sm font-mono"
      @click="openConnectModal"
    >
      <div v-if="!isConnected" class="flex items-center gap-2">
        <span class="icon-[mdi--wallet] w-4 h-4" />
        <span>Connect Wallet</span>
      </div>
      <div v-else class="flex items-center gap-2">
        <img
          v-if="connector?.icon"
          :src="connector.icon"
          :alt="connector.name"
          class="w-4 h-4"
        >
        <span v-else class="icon-[mdi--wallet] w-4 h-4" />
        <span class="hidden sm:block">{{ address ? shortenAddress(address) : '' }}</span>
      </div>
    </button>

    <!-- Disconnect Button (only shown when connected) -->
    <button
      v-if="isConnected"
      class="btn btn-outline btn-sm font-mono"
      @click="handleDisconnect"
    >
      <span class="icon-[mdi--logout] w-4 h-4" />
    </button>
  </div>

  <!-- Modal -->
  <dialog ref="connectModal" class="modal modal-bottom sm:modal-middle">
    <div class="modal-box max-w-md">
      <!-- Header -->
      <div class="flex items-center justify-between mb-6">
        <div>
          <h2 class="text-lg font-medium text-black uppercase tracking-wider">
            CONNECT WALLET
          </h2>
          <p class="text-xs text-gray-500 mt-1">
            Network: Paseo Testnet (Passet Hub)
          </p>
        </div>
        <button class="btn btn-sm btn-circle btn-ghost" @click="closeConnectModal">
          <span class="icon-[mdi--close] w-4 h-4" />
        </button>
      </div>

      <!-- Available Connectors -->
      <div v-if="filteredConnectors.length" class="mb-6">
        <h3 class="text-xs text-gray-500 uppercase tracking-wider mb-3">
          Available Wallets
        </h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div
            v-for="conn in filteredConnectors"
            :key="conn.id"
            class="card card-compact bg-base-100 border border-base-300 hover:border-primary hover:shadow-md transition-all cursor-pointer"
            @click="handleConnect(conn)"
          >
            <div class="card-body items-center text-center">
              <div class="flex items-center justify-center w-12 h-12 mb-2">
                <img
                  v-if="conn.icon"
                  :src="conn.icon"
                  :alt="conn.name"
                  class="w-8 h-8"
                >
                <span v-else class="icon-[mdi--wallet-outline] w-8 h-8" />
              </div>
              <div class="text-sm font-medium text-black">
                {{ conn.name }}
              </div>
              <button
                :disabled="status === 'pending'"
                class="btn btn-neutral btn-sm w-32 uppercase tracking-wider mt-2"
              >
                <span v-if="status === 'pending'" class="icon-[mdi--loading] animate-spin" />
                <span v-if="status === 'pending'">Connecting</span>
                <span v-else>Connect</span>
                <span v-if="status !== 'pending'" class="icon-[mdi--chevron-right]" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- No Connectors Available - Show Popular Wallets -->
      <div v-else class="space-y-3">
        <div class="text-center mb-4">
          <div class="icon-[mdi--wallet-outline] w-16 h-16 mx-auto text-gray-300 mb-2" />
          <p class="text-sm text-gray-500">
            No wallet extensions detected
          </p>
          <p class="text-xs text-gray-400">
            Download a wallet to get started
          </p>
        </div>

        <h3 class="text-xs text-gray-500 uppercase tracking-wider mb-3">
          Popular Wallets
        </h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div
            v-for="wallet in popularWallets"
            :key="wallet.id"
            class="card card-compact bg-base-100 border border-base-300 hover:border-primary hover:shadow-md transition-all"
          >
            <div class="card-body items-center text-center">
              <div class="text-sm font-medium text-black mb-3">
                {{ wallet.name }}
              </div>
              <a
                :href="wallet.downloadUrl"
                target="_blank"
                class="btn btn-neutral btn-sm w-32 uppercase tracking-wider"
              >
                <span>Download</span>
                <span class="icon-[mdi--download] w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </div>

      <!-- Error Display -->
      <div v-if="error" class="alert alert-error mt-4">
        <span>{{ error.message }}</span>
      </div>
    </div>
    <form method="dialog" class="modal-backdrop">
      <button>close</button>
    </form>
  </dialog>
</template>
