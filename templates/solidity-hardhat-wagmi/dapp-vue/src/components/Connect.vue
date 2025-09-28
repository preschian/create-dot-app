<script setup lang="ts">
import { useAppKit, useAppKitAccount, useDisconnect, useWalletInfo } from '@reown/appkit/vue'
import { shortenAddress } from '../utils/formatters'

const accountData = useAppKitAccount()
const { open } = useAppKit()
const { disconnect } = useDisconnect()
const walletInfo = useWalletInfo()
</script>

<template>
  <div class="flex items-center gap-2">
    <button class="btn btn-outline btn-sm font-mono" @click="open()">
      <div v-if="accountData.isConnected" class="flex items-center gap-2">
        <img :src="walletInfo.walletInfo?.icon" :alt="walletInfo.walletInfo?.name" class="size-4">
        <span v-if="accountData.address">{{ shortenAddress(accountData.address) }}</span>
      </div>
      <div v-else class="flex items-center gap-2">
        <span class="icon-[mdi--wallet] w-4 h-4" />
        <span>Connect</span>
      </div>
    </button>

    <button
      v-if="accountData.isConnected"
      class="btn btn-outline btn-sm font-mono"
      @click="disconnect()"
    >
      <span class="icon-[mdi--logout] w-4 h-4" />
    </button>
  </div>
</template>
