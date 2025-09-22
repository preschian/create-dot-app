import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'

async function main() {
  const contractAddress = '0x1fA02b2d6A771842690194Cf62D91bdd92BfE28d'

  console.log('📋 Manual Verification Information for MessageBoard Contract')
  console.log('='.repeat(60))
  console.log('')
  console.log('🔗 Contract Address:', contractAddress)
  console.log('🌐 Blockscout URL:', `https://blockscout-passet-hub.parity-testnet.parity.io/address/${contractAddress}`)
  console.log('')
  console.log('📝 To manually verify the contract:')
  console.log('1. Visit the Blockscout URL above')
  console.log('2. Click on the "Contract" tab')
  console.log('3. Click "Verify & Publish" button')
  console.log('4. Fill in the following information:')
  console.log('')
  console.log('   Contract Name: MessageBoard')
  console.log('   Compiler Version: v0.8.28')
  console.log('   Optimization: Yes')
  console.log('   Optimization Runs: 200')
  console.log('')
  console.log('5. Copy and paste the contract source code below:')
  console.log('')
  console.log('='.repeat(60))
  console.log('CONTRACT SOURCE CODE:')
  console.log('='.repeat(60))

  try {
    // Read the MessageBoard contract source code
    const contractPath = path.join(__dirname, '../contracts/MessageBoard.sol')
    const sourceCode = fs.readFileSync(contractPath, 'utf8')
    console.log(sourceCode)
    console.log('='.repeat(60))
    console.log('')
    console.log('✅ Copy the source code above and paste it in the Blockscout verification form')
    console.log('🎯 Make sure to set the compiler version to v0.8.28 and optimization to Yes (200 runs)')
    console.log('')
    console.log('📍 After verification, you can view the verified contract at:')
    console.log(`   https://blockscout-passet-hub.parity-testnet.parity.io/address/${contractAddress}`)
  }
  catch (error) {
    console.error('❌ Error reading contract source:', error)
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
