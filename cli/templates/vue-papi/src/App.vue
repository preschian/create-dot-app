<script setup lang="ts">
import AccountDashboard from './components/AccountDashboard.vue'
import Footer from './components/Footer.vue'
import Header from './components/Header.vue'
import NetworkStatus from './components/NetworkStatus.vue'
import TokenCollection from './components/TokenCollection.vue'
import TransactionTesting from './components/TransactionTesting.vue'
</script>

<template>
  <div class="min-h-screen bg-gray-100 flex flex-col justify-between">
    <Header />

    <main class="flex-1 container mx-auto px-4 py-8 space-y-8">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <AccountDashboard />
        <TransactionTesting />
      </div>

      <!-- <TokenCollection /> -->
    </main>

    <Footer />

    <!-- Floating Network Status -->
    <NetworkStatus />
  </div>
</template>
