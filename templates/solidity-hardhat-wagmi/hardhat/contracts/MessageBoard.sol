// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract MessageBoard {
    // Struct to store message data
    struct Message {
        address sender;
        string content;
        uint256 timestamp;
    }

    // Array to store the last 8 messages
    Message[8] private messages;
    
    // Counter to track the next message position (circular buffer)
    uint256 private nextIndex;
    
    // Counter to track total messages ever sent
    uint256 private totalMessages;

    // Event emitted when a new message is posted
    event MessagePosted(
        address indexed sender,
        string content,
        uint256 timestamp,
        uint256 messageIndex
    );

    // Function to post a new message
    function postMessage(string memory _content) public {
        require(bytes(_content).length > 0, "Message cannot be empty");
        require(bytes(_content).length <= 280, "Message too long (max 280 characters)");

        // Store message at nextIndex position
        messages[nextIndex] = Message({
            sender: msg.sender,
            content: _content,
            timestamp: block.timestamp
        });

        // Emit event
        emit MessagePosted(msg.sender, _content, block.timestamp, totalMessages);

        // Update counters
        totalMessages++;
        nextIndex = (nextIndex + 1) % 8; // Circular buffer
    }

    // Function to get all messages (last 8)
    function getAllMessages() public view returns (Message[] memory) {
        Message[] memory result = new Message[](8);
        
        // If total messages is less than 8, return only existing messages
        uint256 messageCount = totalMessages < 8 ? totalMessages : 8;
        
        for (uint256 i = 0; i < messageCount; i++) {
            // Calculate index from newest to oldest
            uint256 index;
            if (totalMessages < 8) {
                // If not full yet, get from index 0
                index = (messageCount - 1 - i) % 8;
            } else {
                // If full, get from nextIndex backwards
                // Use safe arithmetic to avoid underflow
                index = (nextIndex + 8 - 1 - i) % 8;
            }
            result[i] = messages[index];
        }
        
        return result;
    }

    // Function to get message by index (0 = newest)
    function getMessage(uint256 _index) public view returns (Message memory) {
        require(_index < 8, "Index out of bounds");
        
        uint256 messageCount = totalMessages < 8 ? totalMessages : 8;
        require(_index < messageCount, "Message does not exist");

        uint256 actualIndex;
        if (totalMessages < 8) {
            actualIndex = (messageCount - 1 - _index) % 8;
        } else {
            // Use safe arithmetic to avoid underflow
            actualIndex = (nextIndex + 8 - 1 - _index) % 8;
        }
        
        return messages[actualIndex];
    }

    // Function to get total messages ever sent
    function getTotalMessages() public view returns (uint256) {
        return totalMessages;
    }

    // Function to get current number of messages stored
    function getCurrentMessageCount() public view returns (uint256) {
        return totalMessages < 8 ? totalMessages : 8;
    }

    // Function to get messages from a specific sender
    function getMessagesBySender(address _sender) public view returns (Message[] memory) {
        // Count how many messages are from this sender
        uint256 count = 0;
        uint256 messageCount = totalMessages < 8 ? totalMessages : 8;
        
        for (uint256 i = 0; i < messageCount; i++) {
            uint256 index;
            if (totalMessages < 8) {
                index = i;
            } else {
                // Use safe arithmetic to avoid underflow
                index = (nextIndex + 8 - messageCount + i) % 8;
            }
            if (messages[index].sender == _sender) {
                count++;
            }
        }

        // Create result array
        Message[] memory result = new Message[](count);
        uint256 resultIndex = 0;
        
        for (uint256 i = 0; i < messageCount; i++) {
            uint256 index;
            if (totalMessages < 8) {
                index = (messageCount - 1 - i) % 8;
            } else {
                // Use safe arithmetic to avoid underflow
                index = (nextIndex + 8 - 1 - i) % 8;
            }
            if (messages[index].sender == _sender) {
                result[resultIndex] = messages[index];
                resultIndex++;
            }
        }
        
        return result;
    }
}
