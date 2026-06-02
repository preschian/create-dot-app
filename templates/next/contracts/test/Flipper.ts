import { expect } from 'chai'
import { ethers } from 'hardhat'

describe('Flipper', () => {
  it('starts with the constructor value and toggles on flip', async () => {
    const Flipper = await ethers.getContractFactory('Flipper')
    const flipper = await Flipper.deploy(true)

    expect(await flipper.get()).to.equal(true)

    await flipper.flip()
    expect(await flipper.get()).to.equal(false)

    await flipper.flip()
    expect(await flipper.get()).to.equal(true)
  })
})
