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
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a href="https://github.com/" target="_blank" class="text-gray-400 hover:text-gray-600 transition-colors">
                <span class="sr-only">GitHub</span>
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0C5.374 0 0 5.373 0 12 0 17.302 3.438 21.8 8.207 23.387c.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
                </svg>
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
