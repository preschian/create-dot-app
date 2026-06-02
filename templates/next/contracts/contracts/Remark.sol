// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

/// @notice On-chain remark — EVM stand-in for `system.remark` in the welcome demo.
contract Remark {
    event Remarked(address indexed sender, string message, uint256 timestamp);

    function remark(string calldata message) external {
        require(bytes(message).length > 0, "Message cannot be empty");
        emit Remarked(msg.sender, message, block.timestamp);
    }
}
