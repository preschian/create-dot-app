<template>
  <div class="min-h-screen bg-white relative">
    <!-- Hero Section -->
    <div class="relative border-b-2 border-black">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-24 lg:py-32 border-l-2 border-r-2 border-black">
        <div class="text-center">
          <h1 class="text-4xl sm:text-5xl lg:text-6xl font-bold text-black mb-6 font-mono">
            Create Dot App
          </h1>
          <p class="text-xl sm:text-2xl text-black mb-8 max-w-3xl mx-auto">
            The fastest way to bootstrap Polkadot-based decentralized applications with modern frameworks and best practices
          </p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <UButton
              size="lg"
              icon="i-lucide-rocket"
              label="Get Started"
              class="px-8 py-3 text-lg bg-black text-white border-2 border-black hover:bg-white hover:text-black"
            />
            <UButton
              size="lg"
              variant="outline"
              icon="i-simple-icons-github"
              label="View on GitHub"
              to="https://github.com/polkadot-developers/create-dot-app"
              target="_blank"
              class="px-8 py-3 text-lg bg-white text-black border-2 border-black hover:bg-black hover:text-white"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Templates Section -->
    <div class="relative border-b-2 border-black">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 border-l-2 border-r-2 border-black">
        <div class="text-center mb-16">
          <h2 class="text-3xl sm:text-4xl font-bold text-black mb-4 font-mono">
            Choose Your Template
          </h2>
          <p class="text-lg text-black max-w-2xl mx-auto">
            Pick from our curated collection of templates combining your favorite framework with powerful Polkadot SDKs
          </p>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0 border-2 border-black">
          <!-- React -->
          <div class="bg-white border-r border-b border-black">
            <div class="p-6 border-b-2 border-black">
              <div class="flex items-center gap-3 mb-4">
                <UIcon name="i-logos-react" class="w-10 h-10" />
                <h3 class="text-xl font-bold font-mono">React</h3>
              </div>
              <p class="text-sm text-black mb-4 h-10 flex items-center">Build reactive UIs with the most popular frontend library</p>
            </div>
            <div class="p-4">
              <p class="text-xs font-mono mb-3 font-semibold">CHOOSE SDK:</p>
              <div class="grid grid-cols-2 gap-2">
                <button class="p-3 border-2 border-black font-mono text-sm hover:bg-black hover:text-white transition-all duration-200">
                  PAPI
                </button>
                <button class="p-3 border-2 border-black font-mono text-sm hover:bg-black hover:text-white transition-all duration-200">
                  Dedot
                </button>
              </div>
            </div>
          </div>

          <!-- Vue -->
          <div class="bg-white border-r border-b border-black">
            <div class="p-6 border-b-2 border-black">
              <div class="flex items-center gap-3 mb-4">
                <UIcon name="i-logos-vue" class="w-10 h-10" />
                <h3 class="text-xl font-bold font-mono">Vue</h3>
              </div>
              <p class="text-sm text-black mb-4 h-10 flex items-center">Progressive framework for building modern web interfaces</p>
            </div>
            <div class="p-4">
              <p class="text-xs font-mono mb-3 font-semibold">CHOOSE SDK:</p>
              <div class="grid grid-cols-2 gap-2">
                <button class="p-3 border-2 border-black font-mono text-sm hover:bg-black hover:text-white transition-all duration-200">
                  PAPI
                </button>
                <button class="p-3 border-2 border-black font-mono text-sm hover:bg-black hover:text-white transition-all duration-200">
                  Dedot
                </button>
              </div>
            </div>
          </div>

          <!-- Svelte -->
          <div class="bg-white border-r border-b border-black">
            <div class="p-6 border-b-2 border-black">
              <div class="flex items-center gap-3 mb-4">
                <UIcon name="i-logos-svelte-icon" class="w-10 h-10" />
                <h3 class="text-xl font-bold font-mono">Svelte</h3>
              </div>
              <p class="text-sm text-black mb-4 h-10 flex items-center">Compile-time optimized framework with no virtual DOM</p>
            </div>
            <div class="p-4">
              <p class="text-xs font-mono mb-3 font-semibold">CHOOSE SDK:</p>
              <div class="grid grid-cols-2 gap-2">
                <button class="p-3 border-2 border-black font-mono text-sm hover:bg-black hover:text-white transition-all duration-200">
                  PAPI
                </button>
                <button class="p-3 border-2 border-black font-mono text-sm hover:bg-black hover:text-white transition-all duration-200">
                  Dedot
                </button>
              </div>
            </div>
          </div>

          <!-- Next.js -->
          <div class="bg-white border-r border-b border-black">
            <div class="p-6 border-b-2 border-black">
              <div class="flex items-center gap-3 mb-4">
                <UIcon name="i-logos-nextjs-icon" class="w-10 h-10" />
                <h3 class="text-xl font-bold font-mono">Next.js</h3>
              </div>
              <p class="text-sm text-black mb-4 h-10 flex items-center">Full-stack React framework with SSR and static generation</p>
            </div>
            <div class="p-4">
              <p class="text-xs font-mono mb-3 font-semibold">CHOOSE SDK:</p>
              <div class="grid grid-cols-2 gap-2">
                <button class="p-3 border-2 border-black font-mono text-sm hover:bg-black hover:text-white transition-all duration-200">
                  PAPI
                </button>
                <button class="p-3 border-2 border-black font-mono text-sm hover:bg-black hover:text-white transition-all duration-200">
                  Dedot
                </button>
              </div>
            </div>
          </div>

          <!-- Nuxt -->
          <div class="bg-white border-r border-b border-black">
            <div class="p-6 border-b-2 border-black">
              <div class="flex items-center gap-3 mb-4">
                <UIcon name="i-logos-nuxt-icon" class="w-10 h-10" />
                <h3 class="text-xl font-bold font-mono">Nuxt</h3>
              </div>
              <p class="text-sm text-black mb-4 h-10 flex items-center">Intuitive Vue framework for building full-stack applications</p>
            </div>
            <div class="p-4">
              <p class="text-xs font-mono mb-3 font-semibold">CHOOSE SDK:</p>
              <div class="grid grid-cols-2 gap-2">
                <button class="p-3 border-2 border-black font-mono text-sm hover:bg-black hover:text-white transition-all duration-200">
                  PAPI
                </button>
                <button class="p-3 border-2 border-black font-mono text-sm hover:bg-black hover:text-white transition-all duration-200">
                  Dedot
                </button>
              </div>
            </div>
          </div>

          <!-- SvelteKit -->
          <div class="bg-white border-r border-b border-black">
            <div class="p-6 border-b-2 border-black">
              <div class="flex items-center gap-3 mb-4">
                <UIcon name="i-logos-svelte-kit" class="w-10 h-10" />
                <h3 class="text-xl font-bold font-mono">SvelteKit</h3>
              </div>
              <p class="text-sm text-black mb-4 h-10 flex items-center">Full-stack Svelte framework with file-based routing</p>
            </div>
            <div class="p-4">
              <p class="text-xs font-mono mb-3 font-semibold">CHOOSE SDK:</p>
              <div class="grid grid-cols-2 gap-2">
                <button class="p-3 border-2 border-black font-mono text-sm hover:bg-black hover:text-white transition-all duration-200">
                  PAPI
                </button>
                <button class="p-3 border-2 border-black font-mono text-sm hover:bg-black hover:text-white transition-all duration-200">
                  Dedot
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- CLI Command Section -->
        <div class="mt-16 text-center">
          <div class="bg-white p-8 max-w-3xl mx-auto border-2 border-black">
            <h3 class="text-lg font-semibold mb-6 text-black font-mono border-b-2 border-black pb-4">
              Create your project with a single command:
            </h3>
            <div class="bg-black border-2 border-black p-6 font-mono text-sm">
              <code class="text-white">
                npx create-dot-app my-polkadot-app
              </code>
            </div>
            <p class="text-sm text-black mt-4">
              The CLI will prompt you to choose your framework and SDK interactively
            </p>
            <div class="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div class="bg-black text-white p-3 font-mono text-left">
                <div class="text-green-400 mb-1">$ npx create-dot-app my-app</div>
                <div>? Select framework: React</div>
                <div>? Select SDK: PAPI</div>
                <div class="text-green-400">✓ Created my-app/</div>
              </div>
              <div class="bg-black text-white p-3 font-mono text-left">
                <div class="text-green-400 mb-1">$ npx create-dot-app my-app --template vue-dedot</div>
                <div class="text-green-400">✓ Created my-app/ with Vue + Dedot</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Features Section -->
    <div class="relative border-b-2 border-black">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 border-l-2 border-r-2 border-black">
        <div class="text-center mb-16">
          <h2 class="text-3xl sm:text-4xl font-bold text-black mb-4 font-mono">
            Why Choose Create Dot App?
          </h2>
          <p class="text-lg text-black max-w-2xl mx-auto">
            Built for developers who want to focus on building great dApps without the setup complexity
          </p>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-0 border-2 border-black">
          <div class="p-8 border-r-2 border-black bg-white">
            <div class="flex items-center gap-3 mb-4 pb-4 border-b-2 border-black">
              <div class="p-2 bg-black border-2 border-black">
                <UIcon name="i-lucide-zap" class="w-6 h-6 text-white" />
              </div>
              <h3 class="font-semibold text-lg font-mono">Lightning Fast Setup</h3>
            </div>
            <p class="text-black">
              Get your Polkadot dApp running in minutes with pre-configured templates and best practices built-in.
            </p>
          </div>

          <div class="p-8 border-r-2 border-black bg-white">
            <div class="flex items-center gap-3 mb-4 pb-4 border-b-2 border-black">
              <div class="p-2 bg-black border-2 border-black">
                <UIcon name="i-lucide-layers" class="w-6 h-6 text-white" />
              </div>
              <h3 class="font-semibold text-lg font-mono">Multiple Frameworks</h3>
            </div>
            <p class="text-black">
              Choose from React, Vue, Svelte, Next.js, Nuxt, or SvelteKit - use the framework you love.
            </p>
          </div>

          <div class="p-8 bg-white">
            <div class="flex items-center gap-3 mb-4 pb-4 border-b-2 border-black">
              <div class="p-2 bg-black border-2 border-black">
                <UIcon name="i-lucide-puzzle" class="w-6 h-6 text-white" />
              </div>
              <h3 class="font-semibold text-lg font-mono">Dual SDK Support</h3>
            </div>
            <p class="text-black">
              Integrated support for both PAPI and Dedot SDKs to interact with Polkadot networks seamlessly.
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- SDK Integration Section -->
    <div class="relative border-b-2 border-black">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 border-l-2 border-r-2 border-black">
        <div class="text-center mb-16">
          <h2 class="text-3xl sm:text-4xl font-bold text-black mb-4 font-mono">
            Powerful SDK Integrations
          </h2>
          <p class="text-lg text-black">
            Choose between two excellent SDKs for Polkadot development
          </p>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-0 max-w-4xl mx-auto border-2 border-black">
          <div class="p-8 text-center border-r-2 border-black bg-white">
            <div class="mb-6 border-b-2 border-black pb-6">
              <div class="w-16 h-16 bg-black border-2 border-black flex items-center justify-center mx-auto mb-4">
                <UIcon name="i-lucide-code" class="w-8 h-8 text-white" />
              </div>
              <h3 class="text-xl font-semibold mb-2 font-mono">PAPI</h3>
            </div>
            <p class="text-black mb-6">
              A modern, type-safe SDK for building Polkadot applications with excellent developer experience.
            </p>
            <UButton 
              variant="outline" 
              label="Learn More" 
              to="https://papi.how/" 
              target="_blank"
              class="border-2 border-black text-black hover:bg-black hover:text-white"
            />
          </div>

          <div class="p-8 text-center bg-white">
            <div class="mb-6 border-b-2 border-black pb-6">
              <div class="w-16 h-16 bg-black border-2 border-black flex items-center justify-center mx-auto mb-4">
                <UIcon name="i-lucide-terminal" class="w-8 h-8 text-white" />
              </div>
              <h3 class="text-xl font-semibold mb-2 font-mono">Dedot</h3>
            </div>
            <p class="text-black mb-6">
              A lightweight and flexible SDK providing powerful tools for Polkadot blockchain development.
            </p>
            <UButton 
              variant="outline" 
              label="Learn More" 
              to="https://docs.dedot.dev/" 
              target="_blank"
              class="border-2 border-black text-black hover:bg-black hover:text-white"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Getting Started Section -->
    <div class="relative border-b-2 border-black bg-black text-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 text-center border-l-2 border-r-2 border-white">
        <h2 class="text-3xl sm:text-4xl font-bold text-white mb-4 font-mono">
          Ready to Build Your Polkadot dApp?
        </h2>
        <p class="text-xl text-white mb-8 max-w-2xl mx-auto">
          Get started in seconds with a single command
        </p>
        
        <div class="bg-white border-2 border-white p-8 max-w-2xl mx-auto mb-8">
          <code class="text-black text-lg font-mono">
            npx create-dot-app my-polkadot-dapp
          </code>
        </div>
        
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <UButton
            size="lg"
            icon="i-lucide-download"
            label="Get Started Now"
            class="px-8 py-3 text-lg bg-white text-black border-2 border-white hover:bg-black hover:text-white"
          />
          <UButton
            size="lg"
            variant="outline"
            icon="i-lucide-book-open"
            label="View Documentation"
            to="https://ui.nuxt.com/getting-started/installation/nuxt"
            target="_blank"
            class="px-8 py-3 text-lg bg-black text-white border-2 border-white hover:bg-white hover:text-black"
          />
        </div>
      </div>
    </div>

    <!-- Footer -->
    <footer class="bg-black text-white border-t-2 border-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-l-2 border-r-2 border-white">
        <div class="text-center">
          <h3 class="text-2xl font-bold mb-4 font-mono">Create Dot App</h3>
          <p class="text-white mb-6">
            Empowering developers to build the next generation of Polkadot dApps
          </p>
        </div>
        <div class="flex justify-center space-x-8 pt-8">
          <UButton
            variant="ghost"
            icon="i-simple-icons-github"
            to="https://github.com/polkadot-developers/create-dot-app"
            target="_blank"
            class="border-2 border-white text-white hover:bg-white hover:text-black"
          />
          <UButton
            variant="ghost"
            icon="i-simple-icons-twitter"
            to="https://twitter.com/polkadot"
            target="_blank"
            class="border-2 border-white text-white hover:bg-white hover:text-black"
          />
        </div>
      </div>
    </footer>
  </div>
</template>
