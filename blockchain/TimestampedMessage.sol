// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

/**
 * @title TimestampedMessage
 * @dev Stores messages with an optimized timestamp
 */
contract TimestampedMessage {
    event MessageStored(address indexed sender, string message, uint256 timestamp, uint256 optimizedTimestamp);
    
    struct MessageData {
        address sender;
        string message;
        uint256 timestamp;
        uint256 optimizedTimestamp;
    }
    
    // Array to store all messages
    MessageData[] public messages;
    
    // Mapping from address to their message count
    mapping(address => uint256) public userMessageCount;
    
    /**
     * @dev Store a message with an optimized timestamp
     * @param message The message to store
     * @param optimizedTimestamp A timestamp calculated off-chain
     */
    function storeMessage(string memory message, uint256 optimizedTimestamp) public {
        // Store message with the current block timestamp and the optimized timestamp
        messages.push(MessageData({
            sender: msg.sender,
            message: message,
            timestamp: block.timestamp,
            optimizedTimestamp: optimizedTimestamp
        }));
        
        // Increment message count for the sender
        userMessageCount[msg.sender]++;
        
        // Emit event
        emit MessageStored(msg.sender, message, block.timestamp, optimizedTimestamp);
    }
    
    /**
     * @dev Get the count of all messages
     */
    function getMessageCount() public view returns (uint256) {
        return messages.length;
    }
    
    /**
     * @dev Get a message by index
     */
    function getMessage(uint256 index) public view returns (
        address sender,
        string memory message,
        uint256 timestamp,
        uint256 optimizedTimestamp
    ) {
        require(index < messages.length, "Index out of bounds");
        MessageData memory data = messages[index];
        return (data.sender, data.message, data.timestamp, data.optimizedTimestamp);
    }
    
    /**
     * @dev Get all messages from a specific sender
     */
    function getMessagesBySender(address sender) public view returns (
        string[] memory messageTexts,
        uint256[] memory timestamps,
        uint256[] memory optimizedTimestamps
    ) {
        uint256 count = userMessageCount[sender];
        
        messageTexts = new string[](count);
        timestamps = new uint256[](count);
        optimizedTimestamps = new uint256[](count);
        
        uint256 currentIndex = 0;
        
        for (uint256 i = 0; i < messages.length; i++) {
            if (messages[i].sender == sender) {
                messageTexts[currentIndex] = messages[i].message;
                timestamps[currentIndex] = messages[i].timestamp;
                optimizedTimestamps[currentIndex] = messages[i].optimizedTimestamp;
                currentIndex++;
            }
        }
        
        return (messageTexts, timestamps, optimizedTimestamps);
    }
}