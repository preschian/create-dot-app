<script setup lang="ts">
import { computed } from 'vue'
import { useProfile } from '../composables/useProfile'

interface Props {
  name?: string
  address?: string
  status?: 'online' | 'none'
}

const props = withDefaults(defineProps<Props>(), {
  status: 'none',
})

const { displayName, displayAddress, getInitials } = useProfile(props)

const avatarClasses = computed(() => {
  const classes = ['avatar', 'avatar-placeholder']

  if (props.status === 'online')
    classes.push('avatar-online')

  return classes.join(' ')
})
</script>

<template>
  <div class="flex items-center gap-3">
    <div :class="avatarClasses">
      <div class="w-8 bg-neutral text-neutral-content rounded-full">
        <span class="text-xs flex items-center justify-center h-full">
          {{ getInitials(displayName || displayAddress) }}
        </span>
      </div>
    </div>
    <div>
      <div v-if="displayName" class="text-xs text-black font-medium">
        {{ displayName }}
      </div>
      <div v-if="displayAddress" class="text-xs text-gray-400">
        {{ displayAddress }}
      </div>
    </div>
  </div>
</template>
