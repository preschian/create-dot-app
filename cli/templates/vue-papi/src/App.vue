<script setup lang="ts">
import HelloWorld from './components/HelloWorld.vue'
</script>

<template>
  <div class="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-8">
    <div class="flex space-x-8 mb-8">
      <a href="https://vite.dev" target="_blank" class="block group">
        <img src="/vite.svg" class="h-24 w-24 transition-transform duration-300 group-hover:scale-110 drop-shadow-lg" alt="Vite logo">
      </a>
      <a href="https://vuejs.org/" target="_blank" class="block group">
        <img src="./assets/vue.svg" class="h-24 w-24 transition-transform duration-300 group-hover:scale-110 drop-shadow-lg" alt="Vue logo">
      </a>
    </div>
    <HelloWorld msg="Vite + Vue + Tailwind CSS v4" />

    <!-- Tailwind CSS v4 Demo -->
    <div class="mt-8 p-6 bg-white rounded-lg shadow-lg">
      <h2 class="text-2xl font-bold text-gray-800 mb-4">🎉 Tailwind CSS v4 is working!</h2>
      <p class="text-gray-600 mb-4">Here are some example utility classes:</p>
      <div class="space-y-2">
        <div class="bg-blue-500 text-white px-4 py-2 rounded-md">Blue background</div>
        <div class="bg-green-500 text-white px-4 py-2 rounded-md">Green background</div>
        <div class="bg-purple-500 text-white px-4 py-2 rounded-md">Purple background</div>
      </div>
    </div>
  </div>
</template>
