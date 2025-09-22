import type { MessageBoard } from '../typechain-types'
import process from 'node:process'
import hre from 'hardhat'

async function main() {
  // Get the deployed contract address
  const contractAddress = '0x1fA02b2d6A771842690194Cf62D91bdd92BfE28d'

  // Get the contract factory and attach to deployed contract
  const MessageBoard = await hre.ethers.getContractFactory('MessageBoard')
  const messageBoard = MessageBoard.attach(contractAddress) as MessageBoard

  console.log('MessageBoard contract attached at:', contractAddress)

  console.log('\n=== Testing MessageBoard Contract ===')

  try {
    // Post some messages
    console.log('\n1. Posting messages...')

    console.log('Posting message 1...')
    let tx = await messageBoard.postMessage('Hello, this is the first message!')
    await tx.wait()
    console.log('✓ Message 1 posted')

    console.log('Posting message 2...')
    tx = await messageBoard.postMessage('Hi everyone! This is the second message.')
    await tx.wait()
    console.log('✓ Message 2 posted')

    console.log('Posting message 3...')
    tx = await messageBoard.postMessage('Good morning! This is the third message.')
    await tx.wait()
    console.log('✓ Message 3 posted')

    console.log('Posting message 4...')
    tx = await messageBoard.postMessage('This is the fourth message.')
    await tx.wait()
    console.log('✓ Message 4 posted')

    // Get total messages
    const totalMessages = await messageBoard.getTotalMessages()
    console.log(`\n2. Total messages sent: ${totalMessages}`)

    // Get current message count
    const currentCount = await messageBoard.getCurrentMessageCount()
    console.log(`Current messages stored: ${currentCount}`)

    // Get all messages
    console.log('\n3. All messages (newest first):')
    const allMessages = await messageBoard.getAllMessages()

    for (let i = 0; i < allMessages.length; i++) {
      const msg = allMessages[i]
      if (msg.sender !== '0x0000000000000000000000000000000000000000') {
        const date = new Date(Number(msg.timestamp) * 1000)
        console.log(`[${i + 1}] ${msg.sender}: "${msg.content}" (${date.toLocaleString()})`)
      }
    }

    // Get specific message
    console.log('\n4. Getting specific message (index 0 - newest):')
    const latestMessage = await messageBoard.getMessage(0)
    const date = new Date(Number(latestMessage.timestamp) * 1000)
    console.log(`Sender: ${latestMessage.sender}`)
    console.log(`Content: "${latestMessage.content}"`)
    console.log(`Timestamp: ${date.toLocaleString()}`)

    // Test the 8-message limit by posting more messages
    console.log('\n5. Testing 8-message limit...')
    for (let i = 5; i <= 10; i++) {
      console.log(`Posting test message ${i}...`)
      tx = await messageBoard.postMessage(`Test message ${i}`)
      await tx.wait()
      console.log(`✓ Message ${i} posted`)
    }

    console.log('\n6. After posting 10 total messages:')
    const finalTotal = await messageBoard.getTotalMessages()
    const finalCount = await messageBoard.getCurrentMessageCount()
    console.log(`Total messages sent: ${finalTotal}`)
    console.log(`Current messages stored: ${finalCount}`)

    console.log('\nAll messages after limit test (should show only last 8):')
    const finalMessages = await messageBoard.getAllMessages()

    for (let i = 0; i < finalMessages.length; i++) {
      const msg = finalMessages[i]
      if (msg.sender !== '0x0000000000000000000000000000000000000000') {
        const date = new Date(Number(msg.timestamp) * 1000)
        console.log(`[${i + 1}] ${msg.sender}: "${msg.content}" (${date.toLocaleString()})`)
      }
    }
  }
  catch (error) {
    console.error('Error:', error)
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
