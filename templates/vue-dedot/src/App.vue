<script setup lang="ts">
import Footer from './components/Footer.vue'
import Header from './components/Header.vue'
import StatusBar from './components/StatusBar.vue'
import TokenCollection from './components/TokenCollection.vue'
</script>

<template>
  <div class="min-h-screen bg-gray-100 pb-12">
    <Header />

    <!-- Main Content -->
    <main>
      <TokenCollection />
    </main>

    <Footer />

    <!-- Sticky Status Bar -->
    <StatusBar />
  </div>
</template>
