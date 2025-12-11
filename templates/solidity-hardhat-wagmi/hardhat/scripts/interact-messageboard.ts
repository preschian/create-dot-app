import type { MessageBoard } from '../typechain-types'
import process from 'node:process'
import hre from 'hardhat'

async function main() {
  // Put the deployed contract address here
  const contractAddress = '0x2B8F5e69C35c1Aff4CCc71458CA26c2F313c3ed3'

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

    // Get all messages
    console.log('\n3. All messages:')
    const allMessages = await messageBoard.getAllMessages()

    for (let i = 0; i < allMessages.length; i++) {
      const msg = allMessages[i]
      const date = new Date(Number(msg.timestamp) * 1000)
      console.log(`[${i + 1}] ${msg.sender}: "${msg.content}" (${date.toLocaleString()})`)
    }

    // Get specific message
    console.log('\n4. Getting specific message (index 0):')
    const firstMessage = await messageBoard.getMessage(0)
    const date = new Date(Number(firstMessage.timestamp) * 1000)
    console.log(`Sender: ${firstMessage.sender}`)
    console.log(`Content: "${firstMessage.content}"`)
    console.log(`Timestamp: ${date.toLocaleString()}`)

    // Test posting more messages
    console.log('\n5. Posting more messages...')
    for (let i = 5; i <= 8; i++) {
      console.log(`Posting test message ${i}...`)
      tx = await messageBoard.postMessage(`Test message ${i}`)
      await tx.wait()
      console.log(`✓ Message ${i} posted`)
    }

    console.log('\n6. After posting 8 total messages:')
    const finalTotal = await messageBoard.getTotalMessages()
    console.log(`Total messages sent: ${finalTotal}`)

    // Test getLatestMessages function
    console.log('\n7. Testing getLatestMessages function:')
    console.log('\nLatest 3 messages:')
    const latest3 = await messageBoard.getLatestMessages(3)

    for (let i = 0; i < latest3.length; i++) {
      const msg = latest3[i]
      const date = new Date(Number(msg.timestamp) * 1000)
      console.log(`[${i + 1}] ${msg.sender}: "${msg.content}" (${date.toLocaleString()})`)
    }

    console.log('\nLatest 5 messages:')
    const latest5 = await messageBoard.getLatestMessages(5)

    for (let i = 0; i < latest5.length; i++) {
      const msg = latest5[i]
      const date = new Date(Number(msg.timestamp) * 1000)
      console.log(`[${i + 1}] ${msg.sender}: "${msg.content}" (${date.toLocaleString()})`)
    }

    console.log('\nAll messages (using getAllMessages):')
    const finalMessages = await messageBoard.getAllMessages()

    for (let i = 0; i < finalMessages.length; i++) {
      const msg = finalMessages[i]
      const date = new Date(Number(msg.timestamp) * 1000)
      console.log(`[${i + 1}] ${msg.sender}: "${msg.content}" (${date.toLocaleString()})`)
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
