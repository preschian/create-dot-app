<script setup lang="ts">
const {
  contractType,
  selectedFramework,
  selectedSdk,
  availableFrameworks,
  availableSdks,
  needsSdkSelection,
  selectFramework,
  selectSdk,
} = useTemplateSelector()

function selectionButtonClass(isSelected: boolean) {
  return {
    'bg-black text-white': isSelected,
    'bg-gray-50': !isSelected,
  }
}
</script>

<template>
  <Transition
    enter-active-class="transition-all duration-300 ease-out"
    enter-from-class="opacity-0 transform -translate-y-4"
    enter-to-class="opacity-100 transform translate-y-0"
    leave-active-class="transition-all duration-200 ease-in"
    leave-from-class="opacity-100 transform translate-y-0"
    leave-to-class="opacity-0 transform -translate-y-4"
  >
    <div v-if="contractType" class="grid gap-8 mb-8" :class="needsSdkSelection ? 'md:grid-cols-2' : 'md:grid-cols-1'">
      <div class="bg-white border border-gray-200 rounded-lg p-6">
        <h3 class="text-lg font-semibold mb-4 text-black text-center">
          [Step 2: Choose Framework]
        </h3>
      <div class="grid grid-cols-2 gap-2">
        <button
          v-for="framework in availableFrameworks"
          :key="framework.id"
          class="flex items-center gap-2 p-3 rounded text-sm transition-colors"
          :class="selectionButtonClass(selectedFramework === framework.id)"
          @click="selectFramework(framework.id)"
        >
          <span
            class="w-5 h-5 flex-shrink-0"
            :class="{
              'icon-[logos--react]': framework.id === 'react',
              'icon-[logos--nextjs-icon]': framework.id === 'next',
              'icon-[logos--vue]': framework.id === 'vue',
              'icon-[logos--nuxt-icon]': framework.id === 'nuxt',
            }"
          />
          <span class="flex-1 text-left">{{ framework.name }}</span>
          <span v-if="selectedFramework === framework.id" class="text-white">✓</span>
          <span v-else class="text-gray-500">○</span>
        </button>
      </div>
    </div>

      <div v-if="needsSdkSelection" class="bg-white border border-gray-200 rounded-lg p-6">
        <h3 class="text-lg font-semibold mb-4 text-black text-center">
          [Step 3: Select SDK]
        </h3>
      <div class="space-y-2">
        <button
          v-for="sdk in availableSdks"
          :key="sdk.id"
          class="w-full flex items-center gap-2 p-3 rounded text-sm transition-colors"
          :class="selectionButtonClass(selectedSdk === sdk.id)"
          @click="selectSdk(sdk.id)"
        >
          <span class="w-5 h-5 flex-shrink-0 icon-[token-branded--polkadot]" />
          <span class="flex-1 text-left">{{ sdk.name }}</span>
          <span v-if="selectedSdk === sdk.id" class="text-white">✓</span>
          <span v-else class="text-gray-500">○</span>
        </button>
      </div>
    </div>
    </div>
  </Transition>
</template>

