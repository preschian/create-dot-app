import { createWalletTest } from '@avalix/chroma';

const POLKADOT_DAPP_URL = 'https://polkadot-starter-vue-dedot.vercel.app/'

const ACCOUNT_NAME = '// Alice'
const DOT_TEST_MNEMONIC = 'bottom drive obey lake curtain smoke basket hold race lonely fit walk'
const DOT_TEST_PASSWORD = 'secure123!'

const test = createWalletTest({
  headless: false,
})

test.describe.configure({ mode: 'serial' });

test.beforeAll(async ({ wallets }) => {
  const wallet = wallets['polkadot-js']
  await wallet.importMnemonic({
    seed: DOT_TEST_MNEMONIC,
    password: DOT_TEST_PASSWORD,
    name: ACCOUNT_NAME,
  })
})

test(`sign transaction on ${POLKADOT_DAPP_URL}`, async ({ page, wallets }) => {
  console.log(`🧪 Testing ${POLKADOT_DAPP_URL}`)
  
  const wallet = wallets['polkadot-js']

  await page.goto(POLKADOT_DAPP_URL)
  await page.waitForLoadState('networkidle')

  await page.getByRole('button', { name: /Connect Wallet/i }).click()

  const modalVisible = await page.locator('h2:has-text("CONNECT WALLET")').isVisible()
  if (modalVisible) {
    console.log('✅ Connect wallet modal opened')
    // Click CONNECT button in modal
    await page.getByRole('button', { name: /CONNECT/i }).nth(2).click()
    console.log('🔗 Clicked CONNECT button')
  }

  await wallet.authorize()

  await page.getByText(ACCOUNT_NAME).click()

  await page.getByRole('button', { name: 'Sign Transaction' }).nth(3).click()
  
  if (POLKADOT_DAPP_URL.includes('papi')) await page.waitForTimeout(3000)
  await wallet.approveTx({ password: DOT_TEST_PASSWORD })
  await page.getByText('Processing transaction...').waitFor({ state: 'visible' })

  console.log(`🎉 Test completed successfully for ${POLKADOT_DAPP_URL}!`)

  await page.waitForTimeout(3000)
})