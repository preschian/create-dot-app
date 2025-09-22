import { buildModule } from '@nomicfoundation/hardhat-ignition/modules'

export default buildModule('MessageBoardModule', (m) => {
  const messageBoard = m.contract('MessageBoard')

  return { messageBoard }
})
