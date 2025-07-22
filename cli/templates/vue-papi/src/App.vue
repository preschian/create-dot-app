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

    <main class="container mx-auto px-4 py-8 space-y-8">
      <AccountDashboard />
      <TransactionTesting />
    </main>

    <Footer />
  </div>

  <!-- Floating Network Status -->
  <NetworkStatus />
</template>
