<template>
  <footer class="bg-white border-t border-gray-200 mt-16">
    <div class="container mx-auto max-w-6xl px-4 py-12">
      <!-- Main Footer Content -->
      <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
        <!-- Brand & Artist Info -->
        <div class="flex-1">
          <div class="flex items-center space-x-3 mb-4">
            <div class="w-10 h-10 rounded-full bg-black flex items-center justify-center">
              <span class="text-white text-sm font-bold">DOT</span>
            </div>
            <div>
              <h3 class="text-xl font-semibold text-gray-900">
                NFT Showcase
              </h3>
              <p class="text-sm text-gray-600">
                Digital Art Portfolio
              </p>
            </div>
          </div>
          <p class="text-gray-600 text-sm leading-relaxed max-w-md">
            Showcasing unique digital art and NFT collections on the Polkadot ecosystem.
            A beautiful portfolio platform for creators and collectors.
          </p>
        </div>

        <!-- Connect Section -->
        <div class="text-center md:text-right">
          <h4 class="text-sm font-semibold text-gray-900 mb-3">
            Connect
          </h4>
          <div class="flex flex-col space-y-2 text-sm">
            <a href="mailto:artist@example.com" class="text-gray-600 hover:text-gray-900 transition-colors">
              artist@example.com
            </a>
            <div class="flex justify-center md:justify-end space-x-4 mt-3">
              <a href="https://x.com/" target="_blank" class="text-gray-400 hover:text-gray-600 transition-colors">
                <span class="sr-only">Twitter</span>
                <span class="icon-[mdi--twitter] w-5 h-5" />
              </a>
              <a href="https://github.com/" target="_blank" class="text-gray-400 hover:text-gray-600 transition-colors">
                <span class="sr-only">GitHub</span>
                <span class="icon-[mdi--github] w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </div>

      <!-- Bottom Section -->
      <div class="border-t border-gray-200 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center text-sm">
        <div class="flex items-center space-x-6 mb-4 md:mb-0">
          <span class="text-gray-600">© 2025 NFT Showcase</span>
          <span class="text-gray-400">•</span>
          <span class="text-gray-500">Built with love for creators</span>
        </div>

        <div class="flex items-center space-x-3">
          <span class="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
            Polkadot
          </span>
          <span class="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
            PAPI
          </span>
          <span class="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
            Vue.js
          </span>
        </div>
      </div>
    </div>
  </footer>
</template>
