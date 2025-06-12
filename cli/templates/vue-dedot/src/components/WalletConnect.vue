<script setup lang="ts">
import type { InjectedAccountWithMeta } from '@polkadot/extension-inject/types'
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useWallet } from '../composables/useWallet'
import {
  connectWallet,
  disconnectWallet,
  getAvailableExtensions,
  getExtensionDisplayName,
  selectAccount,
  type WalletExtension,
} from '../utils/wallet'

const {
  isConnected,
  isLoading,
  connectedExtension,
  accounts,
  selectedAccount,
  error,
} = useWallet()

// Local state
const availableExtensions = ref<WalletExtension[]>([])
const showWalletMenu = ref(false)
const showAccountMenu = ref(false)

// Computed
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

  showWalletMenu.value = false

  try {
    await connectWallet(extensionName)
    showAccountMenu.value = true
  }
  catch (err) {
    console.error('Connection error:', err)
  }
}

function handleDisconnect() {
  disconnectWallet()
  showWalletMenu.value = false
  showAccountMenu.value = false
}

function handleSelectAccount(account: InjectedAccountWithMeta) {
  try {
    selectAccount(account)
    showAccountMenu.value = false
  }
  catch (err) {
    console.error('Account selection error:', err)
  }
}

function closeMenus() {
  showWalletMenu.value = false
  showAccountMenu.value = false
}

// Lifecycle
onMounted(async () => {
  // Load available extensions
  await loadExtensions()

  // Close menus when clicking outside
  document.addEventListener('click', closeMenus)
})

onUnmounted(() => {
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
        <!-- Select Account Button (when no account selected) -->
        <button
          v-if="!selectedAccount"
          class="flex items-center space-x-3 px-4 py-3 hover:bg-yellow-50 transition-colors border-2 border-yellow-300 bg-yellow-50 h-12 animate-pulse"
          @click.stop="showAccountMenu = !showAccountMenu"
        >
          <div class="flex flex-col items-end">
            <div class="text-sm font-medium text-yellow-800">
              Select Account
            </div>
            <div class="text-xs text-yellow-600">
              Choose wallet account
            </div>
          </div>
          <div class="w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
            <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
        </button>

        <!-- Selected Account Display (when account is selected) -->
        <div
          v-else
          class="flex items-center space-x-3 px-4 py-3 border border-gray-200 h-12 bg-gray-50"
        >
          <div class="flex flex-col items-end">
            <div class="text-sm font-medium text-gray-900">
              {{ getAccountDisplay(selectedAccount) }}
            </div>
            <div class="text-xs text-gray-500">
              {{ formatAddress(selectedAccount.address, 6) }}
            </div>
          </div>
          <div class="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
            <span class="text-white text-xs font-bold">
              {{ selectedAccount.address.slice(0, 2).toUpperCase() }}
            </span>
          </div>
        </div>

        <!-- Account Selection Menu (only when no account selected) -->
        <div
          v-if="showAccountMenu && !selectedAccount"
          class="absolute right-0 top-full mt-2 w-80 bg-white border border-gray-200 shadow-lg z-50"
        >
          <div class="p-4">
            <div class="flex items-center justify-between mb-3">
              <h3 class="text-sm font-medium text-gray-900">
                Select Account
              </h3>
              <button
                class="text-xs text-gray-500 hover:text-gray-700"
                @click="showAccountMenu = false"
              >
                ✕
              </button>
            </div>

            <div class="mb-3 p-3 bg-green-50 border border-green-200 rounded-md">
              <div class="flex items-center space-x-2">
                <svg class="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                <span class="text-sm text-green-800 font-medium">{{ connectedExtension ? getExtensionDisplayName(connectedExtension) : 'Wallet' }} Connected</span>
              </div>
              <p class="text-xs text-green-700 mt-1">
                Choose an account to continue.
              </p>
            </div>

            <!-- Account List -->
            <div class="space-y-1">
              <button
                v-for="account in accounts"
                :key="account.address"
                class="w-full flex items-center space-x-3 p-3 text-left hover:bg-gray-50 border border-gray-100 transition-colors"
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
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Connection Status & Disconnect Button -->
      <div class="flex items-center space-x-3">
        <div class="flex items-center space-x-2">
          <div
            class="w-2 h-2 rounded-full"
            :class="selectedAccount ? 'bg-green-400 animate-pulse' : 'bg-yellow-400 animate-bounce'"
          />
          <span class="text-xs hidden sm:inline" :class="selectedAccount ? 'text-gray-500' : 'text-yellow-600'">
            {{ selectedAccount ? 'Connected' : 'Select Account' }}
          </span>
        </div>

        <!-- Disconnect Button -->
        <button
          v-if="selectedAccount"
          class="text-xs text-red-600 hover:text-red-800 font-medium px-2 py-1 hover:bg-red-50 rounded transition-colors"
          @click="handleDisconnect"
        >
          Disconnect
        </button>
      </div>
    </div>
  </div>
</template>
