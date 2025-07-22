<script setup lang="ts">
import Connect from './Connect.vue'
</script>

<template>
  <div class="navbar bg-base-100 shadow-sm">
    <div class="container mx-auto flex items-center">
      <div class="navbar-start">
        <a href="https://polkadot.com" target="_blank" class="btn btn-ghost">
          <span class="icon-[token-branded--polkadot] text-2xl" />
          <span class="text-xl font-bold font-mono text-black tracking-wide ml-1">
            App Name
          </span>
        </a>
      </div>
      <div class="navbar-end">
        <Connect />
      </div>
    </div>
  </div>
</template>
