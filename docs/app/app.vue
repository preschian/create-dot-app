<script setup lang="ts">
// Global SEO Configuration
useHead({
  title: 'create-dot-app - Streamline Polkadot dApp Development',
  meta: [
    {
      name: 'description',
      content: 'CLI tool for scaffolding Polkadot-based decentralized applications with React, Vue, PAPI & Dedot support. Zero configuration, TypeScript ready, production-ready build setup.',
    },
    {
      name: 'keywords',
      content: 'polkadot, dapp, cli, react, vue, typescript, papi, dedot, web3, blockchain, scaffold, development, create-dot-app',
    },
    {
      name: 'author',
      content: 'create-dot-app',
    },
    {
      name: 'robots',
      content: 'index, follow',
    },
    {
      name: 'viewport',
      content: 'width=device-width, initial-scale=1',
    },

    // Open Graph
    {
      property: 'og:type',
      content: 'website',
    },
    {
      property: 'og:title',
      content: 'create-dot-app - Streamline Polkadot dApp Development',
    },
    {
      property: 'og:description',
      content: 'CLI tool for scaffolding Polkadot-based decentralized applications with React, Vue, PAPI & Dedot support. From zero to Polkadot dApp in minutes.',
    },
    // {
    //   property: 'og:url',
    //   content: 'https://create-dot-app.dev',
    // },
    {
      property: 'og:site_name',
      content: 'create-dot-app',
    },
    {
      property: 'og:locale',
      content: 'en_US',
    },

    // Twitter Card
    {
      name: 'twitter:card',
      content: 'summary_large_image',
    },
    {
      name: 'twitter:title',
      content: 'create-dot-app - Streamline Polkadot dApp Development',
    },
    {
      name: 'twitter:description',
      content: 'CLI tool for scaffolding Polkadot-based decentralized applications with React, Vue, PAPI & Dedot support.',
    },
    {
      name: 'twitter:creator',
      content: '@0xPresc',
    },

    // Additional SEO
    {
      name: 'theme-color',
      content: '#000000',
    },
    {
      name: 'msapplication-TileColor',
      content: '#000000',
    },
  ],
  link: [
    // {
    //   rel: 'canonical',
    //   href: 'https://create-dot-app.dev',
    // },
    {
      rel: 'icon',
      type: 'image/x-icon',
      href: '/favicon.ico',
    },
  ],
})
</script>

<template>
  <NuxtPage />
</template>
