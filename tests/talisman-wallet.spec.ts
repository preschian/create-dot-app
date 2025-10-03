import { createWalletTest } from '@avalix/chroma'

// Create a test suite with Talisman wallet
const test = createWalletTest({
  wallets: [{ type: 'talisman' }],
  headless: false,
})

test.setTimeout(30_000 * 2)

test('should import account and connect Talisman wallet', async ({ page, wallets }) => {
  const wallet = wallets.talisman
  const accountName = 'Test Account'

  // Import Ethereum account into Talisman wallet
  await wallet.importEthPrivateKey({
    privateKey: '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80',
    name: accountName,
    password: 'h3llop0lkadot!',
  })

  // Navigate to Polkadot JS Apps
  await page.goto('https://gm-test-2.netlify.app/')
  await page.waitForLoadState('domcontentloaded')

  await page.getByRole('button', { name: 'Connect Wallet' }).click()

  const modalVisible = await page.locator('h2:has-text("CONNECT WALLET")').isVisible()
  if (modalVisible) {
    console.log('✅ Connect wallet modal opened')
    // Click CONNECT button in modal
    await page.getByRole('button', { name: /CONNECT/i }).nth(1).click()
    console.log('🔗 Clicked CONNECT button')
  }
  await wallet.authorize({ accountName })

  try {
    await wallet.approveTx()
  }
  catch {
    console.log('No another popup found, skipping')
  }

  // Test the dApp
  const insertNumber = Math.floor(Math.random() * 10000)
  await page.getByRole('textbox', { name: 'Share your thoughts with the' }).fill(`gm Polkadot! - ${insertNumber}`)
  await page.getByRole('button', { name: 'Post' }).click()

  // Sign transaction
  await wallet.approveTx()

  // Verify transaction
  await page.locator('div').filter({ hasText: new RegExp(`^gm Polkadot! - ${insertNumber}$`) }).waitFor({ state: 'visible' })

  console.log('🎉 Talisman test completed successfully!')
  await page.waitForTimeout(3000)
})
