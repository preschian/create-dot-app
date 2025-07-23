<script setup lang="ts">
import Connect from './Connect.vue'
</script>

<template>
  <div class="navbar bg-base-100 border-b border-gray-200">
    <div class="container mx-auto flex items-center">
      <div class="navbar-start">
        <a href="https://polkadot.com" target="_blank" class="flex items-center">
          <span class="icon-[token-branded--polkadot] text-2xl" />
          <span class="text-xl font-bold font-mono text-black tracking-wide ml-1">
            Dapp
          </span>
        </a>
      </div>
      <div class="navbar-end">
        <Connect />
      </div>
    </div>
  </div>
</template>
