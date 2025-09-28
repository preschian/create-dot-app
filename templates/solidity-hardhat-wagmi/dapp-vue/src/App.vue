<script setup lang="ts">
import { createAppKit } from '@reown/appkit/vue'
import Content from './components/Content.vue'
import Footer from './components/Footer.vue'
import Header from './components/Header.vue'
import { networks, projectId, wagmiAdapter } from './config/wagmi'

// Initialize AppKit
createAppKit({
  adapters: [wagmiAdapter],
  networks,
  projectId,
  themeMode: 'light',
  features: {
    // connectMethodsOrder: ['social', 'wallet'],
    // at the moment, only wallet is supported
    connectMethodsOrder: ['wallet'],
  },
  featuredWalletIds: [
    'c57ca95b47569778a828d19178114f4db188b89b763c899ba0be274e97267d96', // MetaMask
    'e0c2e199712878ed272e2c170b585baa0ff0eb50b07521ca586ebf7aeeffc598', // Talisman
  ],
  includeWalletIds: [
    'c57ca95b47569778a828d19178114f4db188b89b763c899ba0be274e97267d96', // MetaMask
    'e0c2e199712878ed272e2c170b585baa0ff0eb50b07521ca586ebf7aeeffc598', // Talisman
  ],
})
</script>

<template>
  <Header />

  <Content />

  <Footer />
</template>
