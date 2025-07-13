<script setup lang="ts">
import { FixedSizeBinary } from 'polkadot-api'
import { computed, onMounted, ref } from 'vue'
import sdk from '../utils/sdk'

interface Props {
  name?: string
  address?: string
  status?: 'online' | 'offline' | 'none'
}

const props = withDefaults(defineProps<Props>(), {
  status: 'none',
})

const { api: peopleApi } = sdk('people')
const resolvedName = ref<string>()

onMounted(async () => {
  if (props.address && !props.name) {
    try {
      const queryIdentity = await peopleApi.query.Identity.IdentityOf.getValue(props.address)
      resolvedName.value = queryIdentity?.info.display.value instanceof FixedSizeBinary
        ? queryIdentity.info.display.value.asText()
        : undefined
    }
    catch {
      // No identity found, will use address
    }
  }
})

const displayName = computed(() => {
  return props.name || resolvedName.value
})

const displayAddress = computed(() => {
  if (!props.address)
    return undefined
  return `${props.address.slice(0, 4)}...${props.address.slice(-4)}`
})

function getInitials(name?: string): string {
  if (!name)
    return 'A'
  return name.charAt(0).toUpperCase()
}

const avatarClasses = computed(() => {
  const classes = ['avatar', 'avatar-placeholder']

  if (props.status === 'online')
    classes.push('avatar-online')
  if (props.status === 'offline')
    classes.push('avatar-offline')

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
