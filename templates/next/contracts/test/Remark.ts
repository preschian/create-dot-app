import { expect } from 'chai'
import { ethers } from 'hardhat'

describe('Remark', () => {
  it('emits Remarked when remark is called', async () => {
    const [sender] = await ethers.getSigners()
    const Remark = await ethers.getContractFactory('Remark')
    const remark = await Remark.deploy()

    await expect(remark.remark('gm from create-dot-app'))
      .to.emit(remark, 'Remarked')
      .withArgs(sender.address, 'gm from create-dot-app', (timestamp: bigint) => timestamp > 0n)
  })

  it('rejects an empty message', async () => {
    const Remark = await ethers.getContractFactory('Remark')
    const remark = await Remark.deploy()

    await expect(remark.remark('')).to.be.revertedWith('Message cannot be empty')
  })
})
