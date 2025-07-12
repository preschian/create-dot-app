<script setup lang="ts">
import { ref } from 'vue'
import { useConnect } from '../composables/useConnect'

const showConnectModal = ref(false)
const showOtherWallets = ref(false)

const {
  listAccounts,
  selectedAccount,
  connectedWallet,
  isConnecting,
  installedWallets,
  availableWallets,
  connect,
  disconnect,
  selectAccount,
} = useConnect()

function handleSelectAccount(account: typeof selectedAccount.value) {
  if (account) {
    selectAccount(account)
    showConnectModal.value = false
  }
}

function openConnectModal() {
  showConnectModal.value = true
}

function closeConnectModal() {
  showConnectModal.value = false
}

function toggleOtherWallets() {
  showOtherWallets.value = !showOtherWallets.value
}

function isWalletConnected(wallet: any) {
  return connectedWallet.value?.extensionName === wallet.extensionName
}

function isAccountSelected(account: any) {
  return selectedAccount.value?.address === account.address
}
</script>

<template>
  <div>
    <!-- Connect Button -->
    <div v-if="!selectedAccount">
      <button
        class="px-4 py-1.5 bg-black hover:bg-gray-800 text-white text-xs font-medium transition-colors duration-200 uppercase tracking-wider flex items-center gap-2 hover:cursor-pointer"
        @click="openConnectModal"
      >
        Connect Wallet
      </button>
    </div>

    <!-- Connected Account Display -->
    <div v-else class="">
      <div class="flex items-center justify-between gap-2">
        <div class="flex items-center gap-3">
          <div class="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center">
            <span class="text-xs font-medium uppercase">{{ selectedAccount.name?.charAt(0) || 'A' }}</span>
          </div>
          <div>
            <div class="text-xs text-black font-medium">
              {{ selectedAccount.name }}
            </div>
            <div class="text-xs text-gray-400">
              {{ selectedAccount.address.slice(0, 4) }}...{{ selectedAccount.address.slice(-4) }}
            </div>
          </div>
        </div>
        <div class="flex gap-2">
          <button
            class="px-4 py-1.5 bg-black hover:bg-gray-800 text-white text-xs font-medium transition-colors duration-200 uppercase tracking-wider hover:cursor-pointer"
            @click="openConnectModal"
          >
            Change
          </button>
          <button
            class="px-4 py-1.5 bg-black hover:bg-gray-800 text-white text-xs font-medium transition-colors duration-200 uppercase tracking-wider hover:cursor-pointer"
            @click="disconnect"
          >
            Disconnect
          </button>
        </div>
      </div>
    </div>

    <!-- Modal Overlay -->
    <div v-if="showConnectModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50" @click="closeConnectModal">
      <div class="bg-white border border-gray-200 p-6 max-w-2xl mx-auto" @click.stop>
        <!-- Header -->
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-lg font-medium text-black uppercase tracking-wider">
            CONNECT WALLET
          </h2>
          <button class="text-gray-400 hover:text-black transition-colors duration-200" @click="closeConnectModal">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Account Selection -->
        <div v-if="listAccounts.length" class="mb-6">
          <h3 class="text-xs text-gray-500 uppercase tracking-wider mb-3">
            Select Account
          </h3>
          <div class="space-y-2">
            <div
              v-for="account in listAccounts"
              :key="account.address"
              class="p-4 bg-white hover:bg-gray-50 cursor-pointer transition-colors duration-200"
              :class="isAccountSelected(account) ? 'border-2 border-blue-500' : 'border border-gray-200 hover:border-black'"
              @click="handleSelectAccount(account)"
            >
              <div class="flex items-center gap-3">
                <div class="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center">
                  <span class="text-xs font-medium uppercase">{{ account.name?.charAt(0) || 'A' }}</span>
                </div>
                <div>
                  <div class="text-xs text-black font-medium">
                    {{ account.name }}
                  </div>
                  <div class="text-xs text-gray-400">
                    {{ account.address.slice(0, 4) }}...{{ account.address.slice(-4) }}
                  </div>
                </div>
                <div v-if="isAccountSelected(account)" class="ml-auto">
                  <div class="w-2 h-2 bg-blue-500 rounded-full" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Installed -->
        <div v-if="installedWallets.length" class="mb-6">
          <h3 class="text-xs text-gray-500 uppercase tracking-wider mb-3">
            Installed
          </h3>
          <div class="grid grid-cols-4 gap-3">
            <div
              v-for="wallet in installedWallets"
              :key="wallet.extensionName"
              class="p-4 bg-white hover:bg-gray-50 transition-colors duration-200 cursor-pointer"
              :class="isWalletConnected(wallet) ? 'border-2 border-green-500' : 'border border-gray-200 hover:border-black'"
              @click="connect(wallet)"
            >
              <div class="flex flex-col items-center text-center gap-2">
                <div class="relative">
                  <img
                    :src="wallet.logo.src"
                    :alt="wallet.logo.alt"
                    class="w-12 h-12"
                  >
                  <div v-if="isWalletConnected(wallet)" class="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                    <svg class="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                    </svg>
                  </div>
                </div>
                <div class="text-xs font-medium text-black">
                  {{ wallet.title }}
                </div>
                <button
                  :disabled="isConnecting === wallet.extensionName"
                  class="w-32 py-1.5 text-xs bg-black hover:bg-gray-800 disabled:bg-gray-400 hover:cursor-pointer text-white font-medium transition-colors duration-200 uppercase tracking-wider flex items-center justify-center gap-1"
                >
                  <div v-if="isConnecting === wallet.extensionName" class="animate-spin rounded-full h-3 w-3 border-b-2 border-white" />
                  <span v-if="isWalletConnected(wallet)">Connected</span>
                  <span v-else>{{ isConnecting === wallet.extensionName ? 'Connecting' : 'Connect' }}</span>
                  <svg v-if="!isWalletConnected(wallet)" class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Other Wallets -->
        <div v-if="availableWallets.length">
          <div class="flex items-center justify-between mb-3">
            <h3 class="text-xs text-gray-500 uppercase tracking-wider">
              Other wallets
            </h3>
            <button class="text-xs text-gray-400 hover:text-black transition-colors duration-200 flex items-center gap-1" @click="toggleOtherWallets">
              {{ showOtherWallets ? 'Hide' : 'Show' }}
              <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="showOtherWallets ? 'M19 9l-7 7-7-7' : 'M9 5l7 7-7 7'" />
              </svg>
            </button>
          </div>
          <div v-if="showOtherWallets" class="grid grid-cols-4 gap-3">
            <div
              v-for="wallet in availableWallets"
              :key="wallet.extensionName"
              class="p-4 bg-white hover:bg-gray-50 border border-gray-200 hover:border-black transition-colors duration-200"
            >
              <div class="flex flex-col items-center text-center gap-2">
                <img
                  :src="wallet.logo.src"
                  :alt="wallet.logo.alt"
                  class="w-12 h-12 opacity-60"
                >
                <div class="text-xs font-medium text-black">
                  {{ wallet.title }}
                </div>
                <a
                  :href="wallet.installUrl"
                  target="_blank"
                  class="w-32 py-1.5 text-xs bg-black hover:bg-gray-800 text-white font-medium transition-colors duration-200 uppercase tracking-wider flex items-center justify-center gap-1"
                >
                  <span>Download</span>
                  <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v10a2 2 0 01-2-2H5a2 2 0 01-2-2z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
