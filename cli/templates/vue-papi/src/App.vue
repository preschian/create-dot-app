<script setup lang="ts">
import Footer from './components/Footer.vue'
import Header from './components/Header.vue'
import NFTCollection from './components/NFTCollection.vue'
</script>

<template>
  <div class="min-h-screen bg-gray-100">
    <Header />

    <!-- Main Content -->
    <main>
      <NFTCollection />
    </main>

    <Footer />
  </div>
</template>
