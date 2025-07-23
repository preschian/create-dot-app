<script setup lang="ts">
import { ref } from 'vue'
import { useConnect } from '~/composables/useConnect'
import { stripAddress } from '~/utils/formatters'

const connectModal = ref<HTMLDialogElement | null>(null)
const showOtherWallets = ref(false)

const {
  listAccounts,
  selectedAccount,
  connectedWallet,
  isConnecting,
  installedWallets,
  availableWallets,
  connect,
  selectAccount,
  disconnect,
} = useConnect()

function handleSelectAccount(account: typeof selectedAccount.value) {
  if (account) {
    selectAccount(account)
    connectModal.value?.close()
  }
}

function openConnectModal() {
  connectModal.value?.showModal()
}

function closeConnectModal() {
  connectModal.value?.close()
}

function toggleOtherWallets() {
  showOtherWallets.value = !showOtherWallets.value
}

function isWalletConnected(wallet: typeof connectedWallet.value) {
  return connectedWallet.value?.extensionName === wallet?.extensionName
}

function isAccountSelected(account: typeof selectedAccount.value) {
  return selectedAccount.value?.address === account?.address
}
</script>

<template>
  <!-- Connect/Disconnect Buttons -->
  <div class="flex items-center gap-2">
    <button
      class="btn btn-outline btn-sm font-mono"
      @click="openConnectModal"
    >
      <div v-if="!selectedAccount" class="flex items-center gap-2">
        <span class="icon-[mdi--wallet] w-4 h-4" />
        <span>Connect Wallet</span>
      </div>
      <div v-else class="flex items-center gap-2">
        <span class="icon-[mdi--wallet] w-4 h-4" />
        <span class="hidden sm:block">{{ selectedAccount.name }}</span>
        <img
          :src="connectedWallet?.logo.src"
          :alt="connectedWallet?.logo.alt"
          class="w-4 h-4"
        >
      </div>
    </button>

    <!-- Disconnect Button (only shown when connected) -->
    <button
      v-if="selectedAccount"
      class="btn btn-outline btn-sm font-mono"
      @click="disconnect"
    >
      <span class="icon-[mdi--logout] w-4 h-4" />
    </button>
  </div>

  <!-- Modal using HTML dialog element -->
  <dialog ref="connectModal" class="modal modal-bottom sm:modal-middle">
    <div class="modal-box max-w-2xl">
      <!-- Header -->
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-lg font-medium text-black uppercase tracking-wider">
          CONNECT WALLET
        </h2>
        <button class="btn btn-sm btn-circle btn-ghost" @click="closeConnectModal">
          <span class="icon-[mdi--close]" />
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
            class="card card-compact bg-base-100 border cursor-pointer hover:shadow-md transition-shadow"
            :class="isAccountSelected(account) ? 'border-primary' : 'border-base-300 hover:border-primary'"
            @click="handleSelectAccount(account)"
          >
            <div class="card-body">
              <div class="flex items-center justify-between">
                <div class="flex items-center">
                  <div class="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center mr-2">
                    <span class="icon-[mdi--account] text-gray-500" />
                  </div>
                  <div>
                    <p class="text-sm font-medium text-black">
                      {{ account.name }}
                    </p>
                    <p class="text-xs text-gray-500">
                      {{ stripAddress(account.address) }}
                    </p>
                  </div>
                </div>
                <div v-if="isAccountSelected(account)">
                  <div class="w-2 h-2 bg-primary rounded-full" />
                </div>
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
        <div class="grid grid-cols-2 lg:grid-cols-3 gap-3">
          <div
            v-for="wallet in installedWallets"
            :key="wallet.extensionName"
            class="card card-compact bg-base-100 border cursor-pointer hover:shadow-md transition-shadow"
            :class="isWalletConnected(wallet) ? 'border-success' : 'border-base-300 hover:border-primary'"
            @click="connect(wallet)"
          >
            <div class="card-body items-center text-center">
              <div class="relative">
                <img
                  :src="wallet.logo.src"
                  :alt="wallet.logo.alt"
                  class="w-12 h-12"
                >
                <div v-if="isWalletConnected(wallet)" class="absolute -top-1 -right-1 w-4 h-4 bg-success rounded-full flex items-center justify-center">
                  <span class="icon-[mdi--check] w-2 h-2 text-white" />
                </div>
              </div>
              <div class="text-xs font-medium text-black">
                {{ wallet.title }}
              </div>
              <button
                :disabled="isConnecting === wallet.extensionName"
                class="btn btn-neutral btn-sm w-32 uppercase tracking-wider"
              >
                <span v-if="isConnecting === wallet.extensionName" class="icon-[mdi--loading] animate-spin" />
                <span v-if="isWalletConnected(wallet)">Connected</span>
                <span v-else>{{ isConnecting === wallet.extensionName ? 'Connecting' : 'Connect' }}</span>
                <span v-if="!isWalletConnected(wallet)" class="icon-[mdi--chevron-right]" />
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
          <button class="btn btn-ghost btn-sm" @click="toggleOtherWallets">
            {{ showOtherWallets ? 'Hide' : 'Show' }}
            <span :class="showOtherWallets ? 'icon-[mdi--chevron-up]' : 'icon-[mdi--chevron-down]'" />
          </button>
        </div>
        <div v-if="showOtherWallets" class="grid grid-cols-2 lg:grid-cols-3 gap-3">
          <div
            v-for="wallet in availableWallets"
            :key="wallet.extensionName"
            class="card card-compact bg-base-100 border border-base-300 hover:border-primary hover:shadow-md transition-all"
          >
            <div class="card-body items-center text-center">
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
                class="btn btn-neutral btn-sm w-32 uppercase tracking-wider"
              >
                <span>Download</span>
                <span class="icon-[mdi--download]" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
    <form method="dialog" class="modal-backdrop">
      <button>close</button>
    </form>
  </dialog>
</template>
