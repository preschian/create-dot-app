import { createWalletTest } from '@avalix/chroma';

const POLKADOT_DAPP_URL = 'https://template-next.createdot.app/'

const SEED_PHRASE =
  "test test test test test test test test test test test junk";

const test = createWalletTest({
  wallets: [{ type: "metamask" }],
});

test.setTimeout(60_000); // wait for testnet transaction to complete

test.beforeEach(() => {
  console.log("[spec] running template-next.spec.ts");
});

test.beforeAll(async ({ wallets }) => {
  console.log("[wallet] metamask.importSeedPhrase");
  await wallets.metamask.importSeedPhrase({ seedPhrase: SEED_PHRASE });
});

test('should interact with the template-next dapp', async ({ wallets, page }) => {
  const metamask = wallets.metamask;

  await page.goto(POLKADOT_DAPP_URL);
  await page.bringToFront()
  await page.waitForLoadState('networkidle')

  await page.getByRole('button', { name: 'Connect Wallet' }).click();
  await page.getByRole('button', { name: 'MetaMask Installed arrow' }).click();
  await metamask.approve()
  await metamask.approve() // confirm network
  await page.waitForTimeout(3000); // avoid MetaMask blank error screen when proceeding too quickly
  await metamask.approve() // confirm sign-in
  await page.getByRole('button', { name: 'Account · 0xf39F…' }).waitFor({ state: 'visible' });

  await page.getByRole('button', { name: 'Send extrinsic' }).click();
  await metamask.approve()
  await page.getByText('Finalized').nth(2).waitFor({ state: 'visible' });
});