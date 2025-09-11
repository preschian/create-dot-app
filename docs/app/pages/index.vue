<script setup lang="ts">
import { ArrowRight, GitFork, Github, Star, Terminal } from 'lucide-vue-next'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
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
                <span>6</span>
                <GitFork class="h-3 w-3 ml-2" />
                <span>1</span>
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

    <section class="py-16 lg:py-24">
      <div class="container mx-auto px-4 text-center max-w-4xl">
        <Badge variant="outline" class="mb-4 border-gray-300 text-gray-700">
          [v1.0.5] • MIT License
        </Badge>
        <div class="mb-6">
          <div class="text-4xl lg:text-5xl font-bold mb-4 text-black text-center">
            [ CREATE-DOT-APP ]
          </div>
        </div>
        <h1 class="text-2xl lg:text-3xl font-bold mb-4 text-black">
          &gt; Streamline Polkadot dApp Development
        </h1>
        <p class="text-lg text-gray-600 mb-6 max-w-xl mx-auto">
          CLI tool for scaffolding Polkadot-based decentralized applications with React, Vue, PAPI & Dedot support.
        </p>
      </div>
    </section>

    <section class="py-16 bg-gray-50 border-y border-gray-200">
      <div class="container mx-auto px-4">
        <div class="text-center mb-12">
          <h2 class="text-2xl lg:text-3xl font-bold mb-2 text-black">
            &gt; Quick Start
          </h2>
          <p class="text-gray-600">
            From zero to Polkadot dApp in minutes
          </p>
        </div>

        <div class="max-w-4xl mx-auto">
          <!-- Main command showcase -->
          <div class="bg-black text-white p-6 rounded-lg mb-8 relative overflow-hidden">
            <div class="absolute top-0 left-0 right-0 h-8 bg-gray-800 flex items-center px-4">
              <div class="flex space-x-2">
                <div class="w-3 h-3 bg-red-500 rounded-full" />
                <div class="w-3 h-3 bg-yellow-500 rounded-full" />
                <div class="w-3 h-3 bg-green-500 rounded-full" />
              </div>
              <div class="ml-4 text-xs text-gray-400">
                Terminal
              </div>
            </div>
            <div class="mt-8">
              <div class="text-green-400 text-sm mb-2">
                user@polkadot:~$
              </div>
              <div class="text-xl font-mono mb-4">
                <span class="text-white">npx create-dot-app@latest</span>
                <span class="text-green-400 animate-pulse">|</span>
              </div>
              <div class="text-gray-400 text-sm">
                ✓ Creating your Polkadot dApp...
              </div>
            </div>
          </div>

          <!-- Step-by-step process -->
          <div class="grid md:grid-cols-3 gap-6 mb-8">
            <div class="bg-white border border-gray-200 rounded-lg p-6 text-center relative">
              <div class="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <div class="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center text-sm font-bold">
                  1
                </div>
              </div>
              <div class="mt-4">
                <h3 class="text-lg font-semibold mb-3 text-black">
                  [Choose Framework]
                </h3>
                <div class="space-y-2">
                  <div class="flex items-center justify-between p-2 bg-gray-50 rounded text-sm">
                    <span>React.js / Next.js</span>
                    <span class="text-gray-500">○</span>
                  </div>
                  <div class="flex items-center justify-between p-2 bg-gray-50 rounded text-sm">
                    <span>Vue.js / Nuxt.js</span>
                    <span class="text-gray-500">○</span>
                  </div>
                </div>
              </div>
            </div>

            <div class="bg-white border border-gray-200 rounded-lg p-6 text-center relative">
              <div class="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <div class="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center text-sm font-bold">
                  2
                </div>
              </div>
              <div class="mt-4">
                <h3 class="text-lg font-semibold mb-3 text-black">
                  [Select SDK]
                </h3>
                <div class="space-y-2">
                  <div class="flex items-center justify-between p-2 bg-gray-50 rounded text-sm">
                    <span>PAPI</span>
                    <span class="text-gray-500">○</span>
                  </div>
                  <div class="flex items-center justify-between p-2 bg-gray-50 rounded text-sm">
                    <span>Dedot</span>
                    <span class="text-gray-500">○</span>
                  </div>
                </div>
              </div>
            </div>

            <div class="bg-white border border-gray-200 rounded-lg p-6 text-center relative">
              <div class="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <div class="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center text-sm font-bold">
                  3
                </div>
              </div>
              <div class="mt-4">
                <h3 class="text-lg font-semibold mb-3 text-black">
                  [Start Coding]
                </h3>
                <div class="bg-gray-900 text-green-400 p-3 rounded text-xs font-mono text-left">
                  <div>$ cd my-polkadot-app</div>
                  <div>$ npm install</div>
                  <div>$ npm run dev</div>
                  <div class="text-gray-500 mt-2">
                    → Local: http://localhost:3000
                  </div>
                </div>
              </div>
            </div>
          </div>

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
            <div class="flex items-center justify-center gap-4 p-4 bg-gray-50 rounded-lg">
              <div class="flex items-center gap-2">
                <span class="text-gray-400">○</span>
                <span class="text-gray-600">Solidity Smart Contracts</span>
              </div>
              <Badge variant="outline" class="border-gray-300 text-gray-500 bg-gray-100">
                [coming_soon]
              </Badge>
            </div>
            <p class="text-sm text-gray-500 text-center mt-3">
              Pre-configured Solidity contract templates and deployment tools for EVM-compatible parachains
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

    <section class="py-16">
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
