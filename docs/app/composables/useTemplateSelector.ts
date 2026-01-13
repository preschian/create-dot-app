type ContractType = '' | 'substrate' | 'solidity' | 'ink'

const CONTRACT_TYPES = [
  { id: 'substrate' as const, name: 'Substrate Pallets', description: 'Build with Dedot or PAPI SDK' },
  { id: 'solidity' as const, name: 'Solidity Contracts', description: 'EVM-compatible smart contracts' },
  { id: 'ink' as const, name: 'ink! Contracts', description: 'Rust smart contracts' },
] as const

const FRAMEWORKS = {
  react: { id: 'react', name: 'React.js' },
  next: { id: 'next', name: 'Next.js' },
  vue: { id: 'vue', name: 'Vue.js' },
  nuxt: { id: 'nuxt', name: 'Nuxt.js' },
} as const

const SDKS = {
  dedot: { id: 'dedot', name: 'Dedot' },
  papi: { id: 'papi', name: 'PAPI' },
} as const

const FRAMEWORKS_BY_TYPE = {
  substrate: [FRAMEWORKS.react, FRAMEWORKS.next, FRAMEWORKS.vue, FRAMEWORKS.nuxt],
  solidity: [FRAMEWORKS.react, FRAMEWORKS.vue],
  ink: [FRAMEWORKS.react, FRAMEWORKS.vue],
} as const

const SDKS_BY_TYPE = {
  substrate: [SDKS.dedot, SDKS.papi],
  ink: [SDKS.dedot, SDKS.papi],
} as const

const PLATFORMS = {
  bolt: 'https://bolt.new',
  stackblitz: 'https://stackblitz.com',
  codesandbox: 'https://codesandbox.io/s',
} as const

export function useTemplateSelector() {
  const contractType = useState<ContractType>('contractType', () => '')
  const selectedFramework = useState<string>('selectedFramework', () => '')
  const selectedSdk = useState<string>('selectedSdk', () => '')
  const copied = useState<boolean>('copied', () => false)
  const showValidationMessage = useState<boolean>('showValidationMessage', () => false)
  const validationMessage = useState<string>('validationMessage', () => '')

  const availableFrameworks = computed(() => {
    const type = contractType.value as keyof typeof FRAMEWORKS_BY_TYPE
    return FRAMEWORKS_BY_TYPE[type] || []
  })

  const availableSdks = computed(() => {
    const type = contractType.value as keyof typeof SDKS_BY_TYPE
    return SDKS_BY_TYPE[type] || []
  })

  const needsSdkSelection = computed(() => availableSdks.value.length > 0)

  const templateName = computed(() => {
    if (!contractType.value || !selectedFramework.value)
      return ''

    const framework = selectedFramework.value
    const sdk = selectedSdk.value || 'dedot'

    const templateMap: Record<ContractType, string> = {
      '': '',
      'substrate': `${framework}-${sdk}`,
      'solidity': `solidity-${framework}`,
      'ink': `ink-v6/${framework}-${sdk}`,
    }

    return templateMap[contractType.value]
  })

  const command = computed(() => {
    const base = 'npx create-dot-app@latest'
    return templateName.value ? `${base} --template=${templateName.value}` : base
  })

  const isExportEnabled = computed(() => {
    return contractType.value === 'substrate' && selectedFramework.value && selectedSdk.value
  })

  const isSelectionComplete = computed(() => {
    if (!contractType.value || !selectedFramework.value)
      return false
    if (needsSdkSelection.value && !selectedSdk.value)
      return false
    return true
  })

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

  function selectContractType(type: ContractType) {
    contractType.value = type

    const frameworks = FRAMEWORKS_BY_TYPE[type as keyof typeof FRAMEWORKS_BY_TYPE]
    const sdks = SDKS_BY_TYPE[type as keyof typeof SDKS_BY_TYPE]

    selectedFramework.value = frameworks?.[0]?.id || ''
    selectedSdk.value = sdks?.[0]?.id || ''
  }

  function selectFramework(frameworkId: string) {
    selectedFramework.value = frameworkId

    if (isSelectionComplete.value) {
      copyCommand()
    }
  }

  function selectSdk(sdkId: string) {
    selectedSdk.value = sdkId

    if (isSelectionComplete.value) {
      copyCommand()
    }
  }

  function exportTo(platform: keyof typeof PLATFORMS) {
    if (!isExportEnabled.value) {
      const missingSelections = []
      if (!selectedFramework.value)
        missingSelections.push('framework')
      if (!selectedSdk.value)
        missingSelections.push('SDK')

      validationMessage.value = `Please select a ${missingSelections.join(' and ')} before exporting.`
      showValidationMessage.value = true

      setTimeout(() => {
        showValidationMessage.value = false
      }, 3000)

      return
    }

    const baseUrl = PLATFORMS[platform]
    const url = `${baseUrl}/github/preschian/create-dot-app/tree/main/templates/${templateName.value}`
    const newWindow = window.open(url, '_blank', 'noopener,noreferrer')
    if (newWindow)
      newWindow.opener = null
  }

  return {
    contractType,
    contractTypes: CONTRACT_TYPES,
    selectedFramework,
    selectedSdk,
    copied,
    showValidationMessage,
    validationMessage,
    availableFrameworks,
    availableSdks,
    needsSdkSelection,
    command,
    isExportEnabled,
    buttonClass,
    shouldShowPlatform,
    platforms: PLATFORMS,
    copyCommand,
    selectContractType,
    selectFramework,
    selectSdk,
    exportTo,
  }
}
