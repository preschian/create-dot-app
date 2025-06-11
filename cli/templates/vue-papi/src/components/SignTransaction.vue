<script setup lang="ts">
import type { InjectedAccountWithMeta } from '@polkadot/extension-inject/types'
import { ref } from 'vue'
import sdk from '../utils/sdk'
import { getSigner } from '../utils/wallet'

const props = defineProps<{
  selectedAccount: InjectedAccountWithMeta | null
}>()

const isSigning = ref(false)
const error = ref('')
const signResult = ref('')

async function handleTestSign() {
  if (!props.selectedAccount || isSigning.value) {
    console.error('Cannot sign: selectedAccount is null or already signing')
    error.value = 'No account selected or already signing'
    return
  }

  // Starting transaction signing

  isSigning.value = true
  error.value = ''
  signResult.value = ''

  try {
    // Get PAPI client and signer
    const { api } = sdk('asset_hub')
    const signer = await getSigner()

    // Create a test transaction - a simple remark transaction using Binary
    const { Binary } = await import('polkadot-api')
    const testRemark = Binary.fromText(`Test transaction from ${props.selectedAccount.address} at ${Date.now()}`)

    // Build the transaction using PAPI
    const tx = api.tx.System.remark({
      remark: testRemark,
    })

    // Sign and submit the transaction with the correct signer format
    const result = await tx.signAndSubmit(signer)

    // Check transaction result
    if (result.ok) {
      const successMsg = `✅ Transaction successful! Hash: ${result.txHash.slice(0, 10)}...Block: ${result.block.number}`
      signResult.value = successMsg
    }
    else {
      error.value = 'Transaction failed - result not ok'
      signResult.value = `❌ Transaction failed`
      console.error('❌ Transaction failed - result not ok:', result)
    }
  }
  catch (err) {
    const errorMsg = err instanceof Error ? err.message : 'Failed to create transaction'
    error.value = errorMsg
    signResult.value = `❌ ${errorMsg}`
    console.error('❌ Transaction error:', err)

    // Additional error details
    if (err instanceof Error) {
      console.error('Error name:', err.name)
      console.error('Error stack:', err.stack)
    }
  }
  finally {
    isSigning.value = false
  }
}
</script>

<template>
  <div class="p-6">
    <!-- Header -->
    <div class="flex items-center justify-between mb-6">
      <h3 class="text-lg font-light text-black tracking-wide">
        Test Remark Transaction
      </h3>
      <div class="flex items-center text-xs text-gray-500 uppercase tracking-wider">
        <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
        Asset Hub
      </div>
    </div>

    <!-- Account Status -->
    <div class="mb-6">
      <div v-if="!selectedAccount" class="flex items-center p-4 bg-gray-50 border border-gray-100">
        <svg class="w-5 h-5 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
        <span class="text-gray-600 text-sm font-light">Please connect your wallet first</span>
      </div>

      <div v-else class="flex items-center p-4 bg-gray-50 border border-gray-100">
        <div class="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center mr-3">
          <span class="text-xs font-medium uppercase">{{ selectedAccount.address.slice(-1) }}</span>
        </div>
        <div>
          <div class="text-sm font-medium text-black">
            {{ selectedAccount.meta?.name || 'Account' }}
          </div>
          <div class="text-xs text-gray-500">
            {{ selectedAccount.address.slice(0, 8) }}...{{ selectedAccount.address.slice(-8) }}
          </div>
        </div>
      </div>
    </div>

    <!-- Status Messages -->
    <div v-if="error || signResult" class="mb-6">
      <!-- Error Message -->
      <div v-if="error" class="flex items-start p-4 bg-gray-50 border border-gray-100">
        <svg class="w-5 h-5 text-gray-400 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <div>
          <h4 class="text-black text-sm font-medium">
            Transaction Failed
          </h4>
          <p class="text-gray-600 text-sm mt-1 font-light">
            {{ error }}
          </p>
        </div>
      </div>

      <!-- Success Message -->
      <div v-else-if="signResult && signResult.includes('✅')" class="flex items-start p-4 bg-gray-50 border border-gray-100">
        <svg class="w-5 h-5 text-gray-400 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <div>
          <h4 class="text-black text-sm font-medium">
            Transaction Successful
          </h4>
          <p class="text-gray-600 text-sm mt-1 font-light">
            {{ signResult.replace('✅ ', '') }}
          </p>
        </div>
      </div>

      <!-- Failed Result -->
      <div v-else-if="signResult && signResult.includes('❌')" class="flex items-start p-4 bg-gray-50 border border-gray-100">
        <svg class="w-5 h-5 text-gray-400 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <div>
          <h4 class="text-black text-sm font-medium">
            Transaction Failed
          </h4>
          <p class="text-gray-600 text-sm mt-1 font-light">
            {{ signResult.replace('❌ ', '') }}
          </p>
        </div>
      </div>
    </div>

    <!-- Action Button -->
    <div class="flex justify-end">
      <button
        v-if="selectedAccount"
        :disabled="isSigning"
        class="bg-black hover:bg-gray-800 text-white px-6 py-3 text-sm font-medium transition-colors duration-200 uppercase tracking-wider disabled:opacity-50 disabled:cursor-not-allowed"
        @click="handleTestSign"
      >
        <span v-if="isSigning" class="flex items-center">
          <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 818-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 714 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          Signing...
        </span>
        <span v-else>Sign Transaction</span>
      </button>
    </div>
  </div>
</template>
