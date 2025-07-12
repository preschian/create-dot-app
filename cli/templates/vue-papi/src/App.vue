<script setup lang="ts">
import Footer from './components/Footer.vue'
import Header from './components/Header.vue'
import NFTCollection from './components/NFTCollection.vue'
import SignTransaction from './components/SignTransaction.vue'
import StatusBar from './components/StatusBar.vue'
</script>

<template>
  <div class="min-h-screen bg-gray-100 pb-12">
    <Header />

    <!-- Main Content -->
    <main>
      <NFTCollection />
    </main>

    <!-- Transaction Testing Section - Above Footer -->
    <section class="bg-white py-16">
      <div class="container mx-auto px-4">
        <div class="max-w-2xl mx-auto">
          <!-- Section Header -->
          <div class="text-center mb-12">
            <h2 class="text-3xl font-light text-black tracking-wide mb-4">
              Transaction Testing
            </h2>
            <p class="text-gray-600 font-light">
              Test blockchain interactions on Asset Hub
            </p>
          </div>

          <!-- Transaction Card with NFTCard styling -->
          <div class="group">
            <div class="bg-white border border-gray-200 overflow-hidden hover:border-black transition-all duration-300 hover:shadow-lg">
              <SignTransaction />
            </div>
          </div>
        </div>
      </div>
    </section>

    <Footer />

    <!-- Sticky Status Bar -->
    <StatusBar />
  </div>
</template>
