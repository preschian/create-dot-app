<script setup lang="ts">
const { contractType, contractTypes, selectContractType } = useTemplateSelector()

function selectionButtonClass(isSelected: boolean) {
  return {
    'bg-black text-white border-black': isSelected,
    'bg-white border-gray-200 hover:border-gray-300 hover:shadow-md': !isSelected,
  }
}
</script>

<template>
  <div class="mb-8">
    <h3 class="text-lg font-semibold mb-4 text-black text-center">
      [Step 1: Choose Contract Type]
    </h3>
    <div class="grid md:grid-cols-3 gap-4">
      <button
        v-for="type in contractTypes"
        :key="type.id"
        class="p-6 rounded-lg border-2 text-left transition-all duration-200 transform hover:scale-105"
        :class="selectionButtonClass(contractType === type.id)"
        @click="selectContractType(type.id)"
      >
        <div class="flex items-start justify-between mb-2">
          <h4 class="font-semibold text-base">
            {{ type.name }}
          </h4>
          <span v-if="contractType === type.id" class="text-white">✓</span>
        </div>
        <p class="text-sm" :class="contractType === type.id ? 'text-gray-200' : 'text-gray-600'">
          {{ type.description }}
        </p>
      </button>
    </div>
  </div>
</template>
