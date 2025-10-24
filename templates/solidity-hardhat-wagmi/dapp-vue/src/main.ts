import { VueQueryPlugin } from '@tanstack/vue-query'
import { WagmiPlugin } from '@wagmi/vue'
import { createApp } from 'vue'

import App from './App.vue'
import { wagmiAdapter } from './config/wagmi'
import './style.css'

const app = createApp(App)

app
  .use(WagmiPlugin, { config: wagmiAdapter.wagmiConfig })
  .use(VueQueryPlugin, {})

app.mount('#app')
