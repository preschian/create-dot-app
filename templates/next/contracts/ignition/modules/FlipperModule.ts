import { buildModule } from '@nomicfoundation/hardhat-ignition/modules'

export default buildModule('FlipperModule', (m) => {
  const flipper = m.contract('Flipper', [false])

  return { flipper }
})
