<script setup lang="ts">
import SignTransaction from './SignTransaction.vue'
</script>

<template>
  <div class="bg-white border border-gray-200 overflow-hidden hover:border-black transition-all duration-300 hover:shadow-lg">
    <div class="p-4">
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-lg font-light text-black tracking-wide">
          Transaction Testing
        </h2>
        <div class="text-sm text-gray-500">
          Test blockchain transactions
        </div>
      </div>

      <SignTransaction />
    </div>
  </div>
</template>
