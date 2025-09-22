import { VueQueryPlugin } from '@tanstack/vue-query'
import { WagmiPlugin } from '@wagmi/vue'
import { createApp } from 'vue'

import App from './App.vue'
import { config } from './wagmi'
import './style.css'

const app = createApp(App)

app.use(WagmiPlugin, { config }).use(VueQueryPlugin, {})

app.mount('#app')
