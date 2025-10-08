<script setup lang="ts">
import type { Wallet, WalletAccount } from '@talismn/connect-wallets'

const open = ref(false)
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

function handleSelectAccount(account: WalletAccount | null) {
  if (account && selectAccount) {
    selectAccount(account)
    open.value = false
  }
}

function toggleOtherWallets() {
  showOtherWallets.value = !showOtherWallets.value
}

function isWalletConnected(wallet: Wallet | null) {
  return connectedWallet?.value?.extensionName === wallet?.extensionName
}

function isAccountSelected(account: WalletAccount | null) {
  return selectedAccount?.value?.address === account?.address
}
</script>

<template>
  <UModal v-model:open="open" title="CONNECT WALLET">
    <UButton label="Connect Wallet" icon="i-mdi-wallet" color="neutral" variant="outline">
      <div v-if="!selectedAccount" class="flex items-center gap-2">
        <span>Connect Wallet</span>
      </div>
      <div v-else class="flex items-center gap-2">
        <span class="hidden sm:block">{{ selectedAccount.name }}</span>
        <img
          :src="connectedWallet?.logo.src"
          :alt="connectedWallet?.logo.alt"
          class="size-4"
        >
      </div>
    </UButton>

    <UButton
      v-if="selectedAccount"
      color="neutral"
      variant="outline"
      icon="i-mdi-logout"
      @click="disconnect"
    />

    <template #body>
      <!-- Account Selection -->
      <div v-if="listAccounts?.length" class="mb-6">
        <h3 class="text-xs text-gray-500 uppercase tracking-wider mb-3">
          Select Account
        </h3>
        <div class="space-y-2">
          <div
            v-for="account in listAccounts"
            :key="account.address"
            class="p-6 flex bg-base-100 border cursor-pointer hover:shadow-md transition-shadow"
            :class="isAccountSelected(account) ? 'border-primary' : 'border-neutral-300 hover:border-primary'"
            @click="handleSelectAccount(account)"
          >
            <div class="w-full flex items-center justify-between">
              <div class="flex items-center">
                <div class="size-8 bg-gray-200 flex items-center justify-center mr-2 rounded-full">
                  <UIcon name="i-mdi-account" class="text-gray-500" />
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

      <!-- Installed -->
      <div v-if="installedWallets?.length" class="mb-6">
        <h3 class="text-xs text-gray-500 uppercase tracking-wider mb-3">
          Installed
        </h3>
        <div class="grid grid-cols-2 lg:grid-cols-3 gap-3">
          <div
            v-for="wallet in installedWallets"
            :key="wallet.extensionName"
            class="p-6 space-y-2 flex flex-col items-center justify-center bg-base-100 border cursor-pointer hover:shadow-md transition-shadow"
            :class="isWalletConnected(wallet) ? 'border-success' : 'border-neutral-300 hover:border-primary'"
            @click="connect?.(wallet)"
          >
            <UAvatar
              :src="wallet.logo.src"
              :alt="wallet.logo.alt"
              size="3xl"
              :chip="{
                inset: isWalletConnected(wallet),
              }"
            />
            <div class="text-xs font-medium text-black">
              {{ wallet.title }}
            </div>
            <UButton
              color="neutral"
              :disabled="isConnecting === wallet.extensionName"
              class="uppercase block"
            >
              <span v-if="isConnecting === wallet.extensionName" class="icon-[mdi--loading] animate-spin" />
              <span v-if="isWalletConnected(wallet)">Connected</span>
              <span v-else>{{ isConnecting === wallet.extensionName ? 'Connecting' : 'Connect' }}</span>
              <span v-if="!isWalletConnected(wallet)" class="icon-[mdi--chevron-right]" />
            </UButton>
          </div>
        </div>
      </div>

      <!-- Other Wallets -->
      <div v-if="availableWallets?.length">
        <div class="flex items-center justify-between mb-3">
          <h3 class="text-xs text-gray-500 uppercase tracking-wider">
            Other wallets
          </h3>
          <UButton variant="ghost" color="neutral" size="sm" @click="toggleOtherWallets">
            {{ showOtherWallets ? 'Hide' : 'Show' }}
            <span :class="showOtherWallets ? 'icon-[mdi--chevron-up]' : 'icon-[mdi--chevron-down]'" />
          </UButton>
        </div>
        <div v-if="showOtherWallets" class="grid grid-cols-2 lg:grid-cols-3 gap-3">
          <div
            v-for="wallet in availableWallets"
            :key="wallet.extensionName"
            class="p-6 space-y-2 flex flex-col items-center justify-center bg-base-100 border border-neutral-300 cursor-pointer hover:shadow-md transition-all"
          >
            <img
              :src="wallet.logo.src"
              :alt="wallet.logo.alt"
              class="w-12 h-12 opacity-60"
            >
            <div class="text-xs font-medium text-black">
              {{ wallet.title }}
            </div>
            <UButton
              :href="wallet.installUrl"
              target="_blank"
              color="neutral"
              class="uppercase"
              trailing-icon="i-mdi-download"
              label="Download"
              size="sm"
            />
          </div>
        </div>
      </div>
    </template>
  </UModal>
</template>
