import process from 'node:process'
import hre from 'hardhat'

async function main() {
  // Contract address yang sudah di-deploy
  const contractAddress = '0x1fA02b2d6A771842690194Cf62D91bdd92BfE28d'

  console.log('Verifying MessageBoard contract...')
  console.log('Contract Address:', contractAddress)
  console.log('Network:', hre.network.name)

  try {
    // Verify contract di Blockscout
    await hre.run('verify:verify', {
      address: contractAddress,
      constructorArguments: [], // MessageBoard tidak memiliki constructor arguments
    })

    console.log('✅ Contract verification successful!')
    console.log(`📍 View on Blockscout: https://blockscout-passet-hub.parity-testnet.parity.io/address/${contractAddress}`)
  }
  catch (error: any) {
    if (error.message.toLowerCase().includes('already verified')) {
      console.log('✅ Contract is already verified!')
      console.log(`📍 View on Blockscout: https://blockscout-passet-hub.parity-testnet.parity.io/address/${contractAddress}`)
    }
    else {
      console.error('❌ Verification failed:', error.message)
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
