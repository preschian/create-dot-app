<template>
  <UHeader :toggle="false">
    <template #left>
      <a href="https://polkadot.com" target="_blank" class="flex items-center">
        <span class="icon-[token-branded--polkadot] text-2xl" />
        <span class="text-xl font-bold font-mono text-black tracking-wide ml-1">
          Dapp
        </span>
      </a>
    </template>

    <template #right>
      <Connect />
    </template>
  </UHeader>
</template>
