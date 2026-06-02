import { expect } from 'chai'
import { ethers } from 'hardhat'

describe('Lock', () => {
  it('Should set the right unlockTime', async () => {
    const ONE_YEAR_IN_SECS = 365 * 24 * 60 * 60
    const lockedAmount = 1_000_000_000_000_000n

    const latestBlock = await ethers.provider.getBlock('latest')
    const unlockTime = BigInt(latestBlock!.timestamp) + BigInt(ONE_YEAR_IN_SECS)

    const Lock = await ethers.getContractFactory('Lock')
    const lock = await Lock.deploy(unlockTime, { value: lockedAmount })

    expect(await lock.unlockTime()).to.equal(unlockTime)
  })

  it('Should fail if the unlockTime is not in the future', async () => {
    const latestBlock = await ethers.provider.getBlock('latest')
    const unlockTime = BigInt(latestBlock!.timestamp)

    const Lock = await ethers.getContractFactory('Lock')

    await expect(Lock.deploy(unlockTime, { value: 1n })).to.be.revertedWith(
      'Unlock time should be in the future',
    )
  })
})
