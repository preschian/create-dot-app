import { buildModule } from '@nomicfoundation/hardhat-ignition/modules'

const ONE_YEAR_IN_SECS = 365 * 24 * 60 * 60

export default buildModule('LockModule', (m) => {
  const unlockTime = m.getParameter('unlockTime', ONE_YEAR_IN_SECS)
  const lockedAmount = m.getParameter('lockedAmount', 1_000_000_000_000_000n)

  const lock = m.contract('Lock', [unlockTime], {
    value: lockedAmount,
  })

  return { lock }
})
