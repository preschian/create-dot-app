<script setup lang="ts">
import Footer from './components/Footer.vue'
import Header from './components/Header.vue'
import NFTCollection from './components/NFTCollection.vue'
import StatusBar from './components/StatusBar.vue'
</script>

<template>
  <div class="min-h-screen bg-gray-100 pb-12">
    <Header />

    <!-- Main Content -->
    <main>
      <NFTCollection />
    </main>

    <Footer />

    <!-- Sticky Status Bar -->
    <StatusBar />
  </div>
</template>
