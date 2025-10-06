<script setup lang="ts">
import { ArrowRight, ExternalLink, GitFork, Github, Star, Terminal } from 'lucide-vue-next'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

const { data } = await useLazyAsyncData('github-star', async () => {
  const [github, npm] = await Promise.all([
    $fetch<{ repo: { stars: number, forks: number } }>('https://ungh.cc/repos/preschian/create-dot-app'),
    $fetch<{ version: string }>('https://registry.npmjs.org/create-dot-app/latest'),
  ])

  return { repo: github.repo, version: npm.version }
})

// Interactive selections
const selectedFramework = ref<string>('')
const selectedSdk = ref<string>('')
const copied = ref(false)
const showValidationMessage = ref(false)
const validationMessage = ref('')

const frameworks = [
  { id: 'react', name: 'React', template: 'react' },
  { id: 'next', name: 'Next.js', template: 'next' },
  { id: 'vue', name: 'Vue.js', template: 'vue' },
  { id: 'nuxt', name: 'Nuxt', template: 'nuxt' },
]

const sdks = [
  { id: 'dedot', name: 'Dedot', template: 'dedot' },
  { id: 'papi', name: 'PAPI', template: 'papi' },
]

// Computed properties for selected items (avoid repeated .find() calls)
const selectedFrameworkData = computed(() =>
  frameworks.find(f => f.id === selectedFramework.value),
)

const selectedSdkData = computed(() =>
  sdks.find(s => s.id === selectedSdk.value),
)

const command = computed(() => {
  let cmd = 'npx create-dot-app@latest my-polkadot-app'

  if (selectedFramework.value || selectedSdk.value) {
    const frameworkTemplate = selectedFrameworkData.value?.template || 'react'
    const sdkTemplate = selectedSdkData.value?.template || 'dedot'

    cmd += ` --template=${frameworkTemplate}-${sdkTemplate}`
  }

  return cmd
})

async function copyCommand() {
  try {
    await navigator.clipboard.writeText(command.value)
    copied.value = true
    setTimeout(() => {
      copied.value = false
    }, 2000)
  }
  catch (err) {
    console.error('Failed to copy: ', err)
  }
}

function selectFramework(frameworkId: string) {
  selectedFramework.value = selectedFramework.value === frameworkId ? '' : frameworkId
}

function selectSdk(sdkId: string) {
  selectedSdk.value = selectedSdk.value === sdkId ? '' : sdkId
}

function getTemplateString() {
  const framework = frameworks.find(f => f.id === selectedFramework.value)
  const sdk = sdks.find(s => s.id === selectedSdk.value)

  const frameworkTemplate = framework?.template || 'react'
  const sdkTemplate = sdk?.template || 'dedot'

  return `${frameworkTemplate}-${sdkTemplate}`
}

function validateAndGetTemplate() {
  // Check if both framework and SDK are selected
  if (!selectedFramework.value || !selectedSdk.value) {
    const missingSelections = []
    if (!selectedFramework.value)
      missingSelections.push('framework')
    if (!selectedSdk.value)
      missingSelections.push('SDK')

    validationMessage.value = `Please select a ${missingSelections.join(' and ')} before exporting.`
    showValidationMessage.value = true

    // Hide message after 3 seconds
    setTimeout(() => {
      showValidationMessage.value = false
    }, 3000)

    return null
  }

  return getTemplateString()
}

const platforms = {
  bolt: 'https://bolt.new',
  stackblitz: 'https://stackblitz.com',
  codesandbox: 'https://codesandbox.io/s',
}

const isExportEnabled = computed(() => selectedFramework.value && selectedSdk.value)

const buttonClass = computed(() => ({
  'border-gray-300 text-gray-700 hover:bg-gray-50 bg-transparent': isExportEnabled.value,
  'border-gray-200 text-gray-400 bg-gray-50 cursor-not-allowed': !isExportEnabled.value,
}))

const shouldShowPlatform = computed(() => (platform: string) => {
  if (platform === 'bolt') {
    return selectedFramework.value === 'react' || selectedFramework.value === 'vue' || !selectedFramework.value
  }
  return true
})

// Optimized status message
const statusMessage = computed(() => {
  if (!selectedFramework.value && !selectedSdk.value) {
    return '✓ Creating your Polkadot dApp...'
  }

  const framework = selectedFrameworkData.value?.name || ''
  const sdk = selectedSdkData.value?.name || ''

  if (framework && !sdk)
    return `✓ Creating ${framework} dApp...`
  if (!framework && sdk)
    return `✓ Creating dApp with ${sdk}...`
  if (framework && sdk)
    return `✓ Creating ${framework} dApp with ${sdk}...`

  return '✓ Creating your Polkadot dApp...'
})

// Reusable selection button class
function selectionButtonClass(isSelected: boolean) {
  return {
    'bg-black text-white': isSelected,
    'bg-gray-50': !isSelected,
  }
}

function exportTo(platform: keyof typeof platforms) {
  const template = validateAndGetTemplate()
  if (!template)
    return

  const baseUrl = platforms[platform]
  const url = `${baseUrl}/github/preschian/create-dot-app/tree/main/templates/${template}`
  const newWindow = window.open(url, '_blank', 'noopener,noreferrer')
  if (newWindow)
    newWindow.opener = null
}
</script>

<template>
  <div class="min-h-screen bg-white text-black font-mono">
    <header class="border-b border-gray-200 sticky top-0 z-50 bg-white">
      <div class="container mx-auto px-4">
        <div class="flex h-16 items-center justify-between">
          <div class="flex items-center space-x-2">
            <Terminal class="h-6 w-6 text-black" />
            <span class="text-lg font-bold text-black">$ create-dot-app</span>
          </div>

          <div class="flex items-center gap-4">
            <!-- <NuxtLink to="/showcase" class="text-sm text-gray-600 hover:text-black transition-colors">
              [showcase]
            </NuxtLink> -->
            <div class="flex items-center gap-2">
              <div class="flex items-center gap-1 text-sm text-gray-600">
                <Star class="h-3 w-3" />
                <span>{{ data?.repo.stars }}</span>
                <GitFork class="h-3 w-3 ml-2" />
                <span>{{ data?.repo.forks }}</span>
              </div>

              <Button
                variant="outline"
                size="sm"
                class="border-gray-300 text-gray-700 hover:bg-gray-50 bg-transparent"
                as-child
              >
                <a href="https://github.com/preschian/create-dot-app" target="_blank" rel="noopener noreferrer">
                  <Github class="h-4 w-4 mr-2" />
                  [github]
                </a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </header>

    <section class="py-16 lg:py-24 bg-gray-50 border-b border-gray-200">
      <div class="container mx-auto px-4">
        <div class="text-center mb-8">
          <Badge variant="outline" class="mb-4 border-gray-300 text-gray-700">
            [v{{ data?.version }}] • MIT License
          </Badge>
          <div class="text-4xl lg:text-5xl font-bold mb-4 text-black">
            [ CREATE-DOT-APP ]
          </div>
          <h1 class="text-2xl lg:text-3xl font-bold mb-4 text-black">
            &gt; Streamline Polkadot dApp Development
          </h1>
          <p class="text-lg text-gray-600 mb-8 max-w-xl mx-auto">
            CLI tool for scaffolding Polkadot-based decentralized applications with React, Vue, PAPI & Dedot support.
          </p>
        </div>

        <div class="max-w-4xl mx-auto mb-12">
          <!-- Main command showcase -->
          <div class="bg-black text-white p-6 rounded-lg mb-8 relative overflow-hidden">
            <div class="absolute top-0 left-0 right-0 h-8 bg-gray-800 flex items-center px-4 justify-between">
              <div class="flex items-center">
                <div class="flex space-x-2">
                  <div class="w-3 h-3 bg-red-500 rounded-full" />
                  <div class="w-3 h-3 bg-yellow-500 rounded-full" />
                  <div class="w-3 h-3 bg-green-500 rounded-full" />
                </div>
                <div class="ml-4 text-xs text-gray-400">
                  Terminal
                </div>
              </div>
              <button
                class="text-xs text-gray-400 hover:text-white transition-colors flex items-center gap-1"
                :class="{ 'text-green-400': copied }"
                @click="copyCommand"
              >
                <span v-if="!copied" class="icon-[mdi--content-copy]" />
                <span v-else class="icon-[mdi--check]" />
                <span>{{ copied ? 'Copied!' : 'Copy' }}</span>
              </button>
            </div>
            <div class="mt-8">
              <div class="text-green-400 text-sm mb-2">
                user@polkadot:~$
              </div>
              <div class="text-2xl lg:text-3xl font-mono mb-4">
                <span class="text-white">{{ command }}</span>
                <span class="text-green-400 animate-pulse">|</span>
              </div>
              <div class="text-gray-400 text-sm">
                {{ statusMessage }}
              </div>
            </div>
          </div>

          <div class="grid md:grid-cols-2 gap-8 mb-8">
            <div class="bg-white border border-gray-200 rounded-lg p-6">
              <h3 class="text-lg font-semibold mb-4 text-black text-center">
                [Choose Framework]
              </h3>
              <div class="grid grid-cols-2 gap-2">
                <button
                  v-for="framework in frameworks"
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

            <div class="bg-white border border-gray-200 rounded-lg p-6">
              <h3 class="text-lg font-semibold mb-4 text-black text-center">
                [Select SDK]
              </h3>
              <div class="space-y-2">
                <button
                  v-for="sdk in sdks"
                  :key="sdk.id"
                  class="w-full flex items-center gap-2 p-3 rounded text-sm transition-colors"
                  :class="selectionButtonClass(selectedSdk === sdk.id)"
                  @click="selectSdk(sdk.id)"
                >
                  <span
                    class="w-5 h-5 flex-shrink-0 icon-[token-branded--polkadot]"
                  />
                  <span class="flex-1 text-left">{{ sdk.name }}</span>
                  <span v-if="selectedSdk === sdk.id" class="text-white">✓</span>
                  <span v-else class="text-gray-500">○</span>
                </button>
              </div>
            </div>
          </div>

          <div class="bg-white border border-gray-200 rounded-lg p-6 text-center">
            <h3 class="text-lg font-semibold mb-4 text-black">
              [Try Online]
            </h3>
            <p class="text-sm text-gray-600 mb-4">
              Start coding immediately with your selected configuration
            </p>
            <div class="flex flex-wrap justify-center gap-2 sm:gap-4">
              <Button
                v-for="(url, platform) in platforms"
                v-show="shouldShowPlatform(platform)"
                :key="platform"
                variant="outline"
                :class="buttonClass"
                class="flex items-center gap-2 min-w-0 flex-shrink-0"
                @click="exportTo(platform as keyof typeof platforms)"
              >
                <ExternalLink class="h-4 w-4 flex-shrink-0" />
                <span class="whitespace-nowrap">[{{ platform }}]</span>
              </Button>
            </div>
            <div v-if="showValidationMessage" class="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-center">
              <p class="text-sm text-red-600">
                {{ validationMessage }}
              </p>
            </div>
            <p v-else-if="!isExportEnabled" class="text-xs text-gray-500 text-center mt-2">
              Select both framework and SDK to enable export
            </p>
          </div>
        </div>
      </div>
    </section>

    <section class="py-16">
      <div class="container mx-auto px-4">
        <div class="max-w-4xl mx-auto">
          <!-- Features highlight -->
          <div class="bg-white border border-gray-200 rounded-lg p-6 mb-8">
            <h3 class="text-lg font-semibold mb-4 text-black text-center">
              [What You Get]
            </h3>
            <div class="grid md:grid-cols-2 gap-4 text-sm">
              <div class="space-y-2">
                <div class="flex items-center gap-2">
                  <span class="text-green-600">✓</span>
                  <span>Pre-configured Polkadot connection</span>
                </div>
                <div class="flex items-center gap-2">
                  <span class="text-green-600">✓</span>
                  <span>TypeScript support out of the box</span>
                </div>
                <div class="flex items-center gap-2">
                  <span class="text-green-600">✓</span>
                  <span>Modern development tooling</span>
                </div>
              </div>
              <div class="space-y-2">
                <div class="flex items-center gap-2">
                  <span class="text-green-600">✓</span>
                  <span>Example components & hooks</span>
                </div>
                <div class="flex items-center gap-2">
                  <span class="text-green-600">✓</span>
                  <span>Hot reload & fast refresh</span>
                </div>
                <div class="flex items-center gap-2">
                  <span class="text-green-600">✓</span>
                  <span>Production-ready build setup</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Smart Contracts Integration -->
          <div class="bg-white border border-gray-200 rounded-lg p-6 mb-8">
            <h3 class="text-lg font-semibold mb-4 text-black text-center">
              [Smart Contracts Integration]
            </h3>
            <div class="space-y-3">
              <div class="flex items-center justify-center gap-4 p-4 bg-gray-50 rounded-lg">
                <div class="flex items-center gap-2">
                  <span class="text-gray-400">○</span>
                  <span class="text-gray-600">Solidity Smart Contracts</span>
                </div>
                <Badge variant="outline" class="border-gray-300 text-gray-500 bg-gray-100">
                  [coming_soon]
                </Badge>
              </div>

              <div class="flex items-center justify-center gap-4 p-4 bg-gray-50 rounded-lg">
                <div class="flex items-center gap-2">
                  <span class="text-gray-400">○</span>
                  <span class="text-gray-600">ink! Smart Contracts</span>
                </div>
                <Badge variant="outline" class="border-gray-300 text-gray-500 bg-gray-100">
                  [coming_soon]
                </Badge>
              </div>
            </div>
            <p class="text-sm text-gray-500 text-center mt-3">
              Pre-configured contract templates and deployment tools for both EVM-compatible parachains (Solidity) and native Polkadot contracts (ink!)
            </p>
          </div>
        </div>

        <!-- <div class="text-center mt-12">
          <p class="text-gray-600 mb-4">
            See what others have built with create-dot-app
          </p>
          <Button variant="outline" class="border-gray-300 text-gray-700 hover:bg-gray-50 bg-transparent" as-child>
            <NuxtLink to="/showcase">
              [view_showcase]
              <ArrowRight class="h-4 w-4 ml-2" />
            </NuxtLink>
          </Button>
        </div> -->
      </div>
    </section>

    <section class="py-16 bg-gray-50 border-y border-gray-200">
      <div class="container mx-auto px-4">
        <div class="text-center mb-12">
          <h2 class="text-2xl lg:text-3xl font-bold mb-2 text-black">
            &gt; Why create-dot-app?
          </h2>
          <p class="text-gray-600">
            Built by developers, for developers
          </p>
        </div>

        <div class="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <div class="p-6 bg-white border border-gray-200 rounded text-center">
            <div class="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Terminal class="h-6 w-6 text-black" />
            </div>
            <h3 class="font-semibold mb-2 text-black">
              [Zero Configuration]
            </h3>
            <p class="text-sm text-gray-600">
              No complex setup. One command gets you a fully configured Polkadot development environment.
            </p>
          </div>

          <div class="p-6 bg-white border border-gray-200 rounded text-center">
            <div class="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <ArrowRight class="h-6 w-6 text-black" />
            </div>
            <h3 class="font-semibold mb-2 text-black">
              [Best Practices]
            </h3>
            <p class="text-sm text-gray-600">
              Pre-configured with TypeScript, modern tooling, and Polkadot ecosystem best practices.
            </p>
          </div>

          <div class="p-6 bg-white border border-gray-200 rounded text-center">
            <div class="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Github class="h-6 w-6 text-black" />
            </div>
            <h3 class="font-semibold mb-2 text-black">
              [Open Source]
            </h3>
            <p class="text-sm text-gray-600">
              MIT licensed, community-driven, and continuously updated with the latest Polkadot features.
            </p>
          </div>
        </div>
      </div>
    </section>

    <section class="py-16 bg-black text-white">
      <div class="container mx-auto px-4 text-center">
        <h2 class="text-2xl lg:text-3xl font-bold mb-4 text-white">
          &gt; Ready to build on Polkadot?
        </h2>
        <p class="text-lg text-gray-300 mb-6">
          Join developers building the future of Web3
        </p>
        <Button variant="secondary">
          <Terminal class="h-4 w-4 mr-2" />
          [START_BUILDING_NOW]
        </Button>
      </div>
    </section>

    <footer class="border-t border-gray-200 py-8 bg-white">
      <div class="container mx-auto px-4 text-center">
        <div class="flex items-center justify-center space-x-2 mb-2">
          <Terminal class="h-5 w-5 text-black" />
          <span class="font-bold text-black">$ create-dot-app</span>
        </div>
        <p class="text-sm text-gray-600">
          Built for the Polkadot ecosystem
        </p>
      </div>
    </footer>
  </div>
</template>
