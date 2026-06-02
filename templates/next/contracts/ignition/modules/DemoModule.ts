import { buildModule } from '@nomicfoundation/hardhat-ignition/modules'

export default buildModule('DemoModule', (m) => {
  const flipper = m.contract('Flipper', [false])
  const remark = m.contract('Remark')

  return { flipper, remark }
})
