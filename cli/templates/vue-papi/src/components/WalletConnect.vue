<script setup lang="ts">
import type { InjectedAccountWithMeta } from '@polkadot/extension-inject/types'
import { computed, onMounted, onUnmounted, ref } from 'vue'
import {
  connectWallet,
  disconnectWallet,
  getAvailableExtensions,
  getExtensionDisplayName,
  selectAccount,
  switchExtension,
  type WalletExtension,
  walletManager,
} from '../utils/wallet'

// State
const walletState = ref(walletManager.getState())
const availableExtensions = ref<WalletExtension[]>([])
const showWalletMenu = ref(false)
const showAccountMenu = ref(false)
const isLoading = ref(false)
const error = ref('')

// Computed
const isConnected = computed(() => walletState.value.isConnected)
const connectedExtension = computed(() => walletState.value.connectedExtension)
const accounts = computed(() => walletState.value.accounts)
const selectedAccount = computed(() => walletState.value.selectedAccount)
const hasExtensions = computed(() => availableExtensions.value.length > 0)

// Utility functions
function formatAddress(address: string, length: number = 8): string {
  if (!address)
    return ''
  if (address.length <= length * 2)
    return address
  return `${address.slice(0, length)}...${address.slice(-length)}`
}

function getAccountDisplay(account: InjectedAccountWithMeta): string {
  return account.meta?.name || formatAddress(account.address)
}

// Methods
function updateState() {
  const newState = walletManager.getState()
  walletState.value = newState
}

async function loadExtensions() {
  try {
    availableExtensions.value = await getAvailableExtensions()
  }
  catch (err) {
    console.error('Failed to load extensions:', err)
  }
}

async function handleConnectWallet(extensionName?: string) {
  if (isLoading.value)
    return

  isLoading.value = true
  error.value = ''
  showWalletMenu.value = false

  try {
    await connectWallet(extensionName)
  }
  catch (err) {
    error.value = err instanceof Error ? err.message : 'Failed to connect wallet'
    console.error('Connection error:', err)
  }
  finally {
    isLoading.value = false
  }
}

function handleDisconnect() {
  disconnectWallet()
  showWalletMenu.value = false
  showAccountMenu.value = false
  error.value = ''
}

async function handleSwitchExtension(extensionName: string) {
  if (isLoading.value)
    return

  isLoading.value = true
  error.value = ''
  showWalletMenu.value = false
  showAccountMenu.value = false

  try {
    await switchExtension(extensionName)
  }
  catch (err) {
    error.value = err instanceof Error ? err.message : 'Failed to switch wallet'
    console.error('Switch error:', err)
  }
  finally {
    isLoading.value = false
  }
}

function handleSelectAccount(account: InjectedAccountWithMeta) {
  try {
    selectAccount(account)
    showAccountMenu.value = false
  }
  catch (err) {
    error.value = err instanceof Error ? err.message : 'Failed to select account'
    console.error('Account selection error:', err)
  }
}

function closeMenus() {
  showWalletMenu.value = false
  showAccountMenu.value = false
}

// Lifecycle
onMounted(async () => {
  // Update state on wallet events
  walletManager.on('wallet:connected', updateState)
  walletManager.on('wallet:disconnected', updateState)
  walletManager.on('wallet:extensionChanged', updateState)
  walletManager.on('wallet:accountChanged', updateState)
  walletManager.on('wallet:accountsChanged', updateState)
  walletManager.on('wallet:loading', (event) => {
    isLoading.value = event.detail
  })
  walletManager.on('wallet:error', (event) => {
    error.value = event.detail
  })

  // Load available extensions
  await loadExtensions()

  // Close menus when clicking outside
  document.addEventListener('click', closeMenus)
})

onUnmounted(() => {
  walletManager.off('wallet:connected', updateState)
  walletManager.off('wallet:disconnected', updateState)
  walletManager.off('wallet:extensionChanged', updateState)
  walletManager.off('wallet:accountChanged', updateState)
  walletManager.off('wallet:accountsChanged', updateState)

  document.removeEventListener('click', closeMenus)
})
</script>

<template>
  <div class="flex items-center space-x-4">
    <!-- Error Message -->
    <div v-if="error" class="text-red-600 text-sm max-w-xs truncate">
      {{ error }}
    </div>

    <!-- Connect Wallet Button -->
    <div v-if="!isConnected && hasExtensions" class="relative">
      <button
        :disabled="isLoading"
        class="bg-black hover:bg-gray-800 disabled:bg-gray-400 text-white px-6 py-3 font-medium transition-colors duration-200 uppercase tracking-wider text-sm relative h-12"
        @click.stop="showWalletMenu = !showWalletMenu"
      >
        <span v-if="isLoading" class="flex items-center space-x-2">
          <svg class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <span>Connecting...</span>
        </span>

        <span v-else>Connect Wallet</span>
      </button>

      <!-- Wallet Selection Menu -->
      <div
        v-if="showWalletMenu && !isLoading"
        class="absolute right-0 top-full mt-2 w-64 bg-white border border-gray-200 shadow-lg z-50"
      >
        <div class="p-4">
          <h3 class="text-sm font-medium text-gray-900 mb-3">
            Select Wallet
          </h3>
          <div class="space-y-2">
            <button
              v-for="extension in availableExtensions"
              :key="extension.name"
              class="w-full flex items-center justify-between p-3 text-left hover:bg-gray-50 border border-gray-100 transition-colors"
              @click="handleConnectWallet(extension.name)"
            >
              <div>
                <div class="font-medium text-gray-900">
                  {{ getExtensionDisplayName(extension.name) }}
                </div>
                <div class="text-xs text-gray-500">
                  v{{ extension.version }}
                </div>
              </div>
              <div class="w-2 h-2 bg-green-400 rounded-full" />
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- No Wallets Found -->
    <div v-else-if="!isConnected && !hasExtensions && !isLoading">
      <button
        class="bg-gray-400 text-white px-6 py-3 font-medium uppercase tracking-wider text-sm cursor-not-allowed h-12"
        disabled
        @click="loadExtensions"
      >
        No Wallets Found
      </button>
    </div>

    <!-- Connected Wallet Display -->
    <div v-if="isConnected" class="flex items-center space-x-3">
      <div class="relative">
        <button
          class="flex items-center space-x-3 px-4 py-3 hover:bg-gray-50 transition-colors border border-gray-200 h-12"
          @click.stop="showAccountMenu = !showAccountMenu"
        >
          <div class="flex flex-col items-end">
            <div class="text-sm font-medium text-gray-900">
              {{ selectedAccount ? getAccountDisplay(selectedAccount) : 'No Account' }}
            </div>
            <div class="text-xs text-gray-500">
              {{ selectedAccount ? formatAddress(selectedAccount.address, 6) : '' }}
            </div>
          </div>
          <div class="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
            <span class="text-white text-xs font-bold">
              {{ selectedAccount ? selectedAccount.address.slice(0, 2).toUpperCase() : '?' }}
            </span>
          </div>
        </button>

        <!-- Account Menu -->
        <div
          v-if="showAccountMenu"
          class="absolute right-0 top-full mt-2 w-80 bg-white border border-gray-200 shadow-lg z-50"
        >
          <div class="p-4">
            <div class="flex items-center justify-between mb-3">
              <h3 class="text-sm font-medium text-gray-900">
                {{ connectedExtension ? getExtensionDisplayName(connectedExtension) : 'Unknown' }}
              </h3>
              <button
                class="text-xs text-red-600 hover:text-red-800"
                @click="handleDisconnect"
              >
                Disconnect
              </button>
            </div>

            <!-- Account List -->
            <div class="space-y-1 mb-4">
              <button
                v-for="account in accounts"
                :key="account.address"
                class="w-full flex items-center space-x-3 p-3 text-left hover:bg-gray-50 transition-colors"
                :class="[
                  selectedAccount?.address === account.address
                    ? 'bg-blue-50 border border-blue-200'
                    : 'border border-gray-100',
                ]"
                @click="handleSelectAccount(account)"
              >
                <div class="w-8 h-8 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                  <span class="text-white text-xs font-bold">
                    {{ account.address.slice(0, 2).toUpperCase() }}
                  </span>
                </div>
                <div class="flex-1">
                  <div class="font-medium text-gray-900">
                    {{ getAccountDisplay(account) }}
                  </div>
                  <div class="text-xs text-gray-500">
                    {{ formatAddress(account.address, 8) }}
                  </div>
                </div>
                <div v-if="selectedAccount?.address === account.address" class="w-2 h-2 bg-blue-500 rounded-full" />
              </button>
            </div>

            <!-- Switch Wallet Section -->
            <div v-if="availableExtensions.length > 1" class="border-t border-gray-100 pt-3">
              <h4 class="text-xs font-medium text-gray-700 mb-2">
                Switch Wallet
              </h4>
              <div class="space-y-1">
                <button
                  v-for="extension in availableExtensions.filter(ext => ext.name !== connectedExtension)"
                  :key="extension.name"
                  :disabled="isLoading"
                  class="w-full flex items-center justify-between p-2 text-left hover:bg-gray-50 disabled:opacity-50 transition-colors text-sm"
                  @click="handleSwitchExtension(extension.name)"
                >
                  <span>{{ getExtensionDisplayName(extension.name) }}</span>
                  <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5-5 5M6 12h12" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Connection Status -->
      <div class="flex items-center space-x-2">
        <div class="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
        <span class="text-xs text-gray-500 hidden sm:inline">Connected</span>
      </div>
    </div>
  </div>
</template>
