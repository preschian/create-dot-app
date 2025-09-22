<script setup lang="ts">
import { blo } from 'blo'
import { formatTime, shortenAddress } from '../utils/formatters'

// Props
defineProps<{
  message: {
    id: number
    author: string
    content: string
    timestamp: Date
  }
}>()
</script>

<template>
  <div class="card bg-white shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 ease-in-out border border-gray-200 h-full flex flex-col">
    <div class="card-body flex flex-col h-full">
      <!-- Message Header -->
      <div class="flex items-start space-x-3 mb-4">
        <!-- Avatar -->
        <div class="avatar">
          <div class="w-9 rounded">
            <img :src="blo(message.author as `0x${string}`)">
          </div>
        </div>

        <!-- User Info -->
        <div class="flex-1 min-w-0">
          <div class="font-mono text-sm font-medium text-black truncate">
            {{ shortenAddress(message.author) }}
          </div>
          <div class="text-xs text-gray-500">
            {{ formatTime(message.timestamp) }}
          </div>
        </div>
      </div>

      <!-- Message Content -->
      <div class="flex-grow">
        <p class="text-gray-800 leading-relaxed">
          {{ message.content }}
        </p>
      </div>
    </div>
  </div>
</template>
