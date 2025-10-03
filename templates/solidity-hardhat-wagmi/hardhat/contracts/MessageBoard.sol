// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract MessageBoard {
    struct Message {
        address sender;
        string content;
        uint256 timestamp;
    }

    Message[] private messages;

    event MessagePosted(
        address indexed sender,
        string content,
        uint256 timestamp,
        uint256 messageIndex
    );

    function postMessage(string memory _content) public {
        require(bytes(_content).length > 0, "Message cannot be empty");
        require(bytes(_content).length <= 280, "Message too long (max 280 characters)");

        messages.push(Message({
            sender: msg.sender,
            content: _content,
            timestamp: block.timestamp
        }));

        emit MessagePosted(msg.sender, _content, block.timestamp, messages.length - 1);
    }

    function getAllMessages() public view returns (Message[] memory) {
        return messages;
    }

    function getMessage(uint256 _index) public view returns (Message memory) {
        require(_index < messages.length, "Message does not exist");
        return messages[_index];
    }

    function getTotalMessages() public view returns (uint256) {
        return messages.length;
    }

    function getMessagesBySender(address _sender) public view returns (Message[] memory) {
        uint256 count = 0;
        
        for (uint256 i = 0; i < messages.length; i++) {
            if (messages[i].sender == _sender) {
                count++;
            }
        }

        Message[] memory result = new Message[](count);
        uint256 resultIndex = 0;
        
        for (uint256 i = 0; i < messages.length; i++) {
            if (messages[i].sender == _sender) {
                result[resultIndex] = messages[i];
                resultIndex++;
            }
        }
        
        return result;
    }

    function getLatestMessages(uint256 _count) public view returns (Message[] memory) {
        require(_count > 0, "Count must be greater than 0");
        
        uint256 totalMessages = messages.length;
        uint256 returnCount = _count > totalMessages ? totalMessages : _count;
        
        Message[] memory result = new Message[](returnCount);
        
        for (uint256 i = 0; i < returnCount; i++) {
            result[i] = messages[totalMessages - 1 - i];
        }
        
        return result;
    }
}
