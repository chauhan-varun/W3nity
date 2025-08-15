// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title Escrow Contract
 * @dev A simple escrow contract for holding funds between a client and freelancer
 * @notice This contract allows a client to deposit funds that can be released to a freelancer
 */
contract Escrow {
    // === State Variables ===
    address public immutable i_client;
    address public immutable i_freelancer;
    uint256 public immutable i_amount;
    bool public s_isComplete;

    // === Events ===
    event FundsDeposited(address indexed client, address indexed freelancer, uint256 amount);
    event FundsReleased(address indexed freelancer, uint256 amount);
    
    // === Custom Errors ===
    error Escrow__NoEtherSent();
    error Escrow__InvalidFreelancerAddress();
    error Escrow__NotClient();
    error Escrow__FundsAlreadyReleased();
    error Escrow__InsufficientBalance();
    error Escrow__EtherTransferFailed();

    /**
     * @dev Contract constructor
     * @param _freelancer Address of the freelancer who will receive the funds
     */
    constructor(address _freelancer) payable {
        if (msg.value == 0) {
            revert Escrow__NoEtherSent();
        }
        if (_freelancer == address(0)) {
            revert Escrow__InvalidFreelancerAddress();
        }
        
        i_client = msg.sender;
        i_freelancer = _freelancer;
        i_amount = msg.value;
        s_isComplete = false;
        
        emit FundsDeposited(msg.sender, _freelancer, msg.value);
    }

    /**
     * @dev Releases the escrowed funds to the freelancer
     * @notice Can only be called once and only by the client
     */
    function releaseFunds() external {
        // Check
        if (msg.sender != i_client) {
            revert Escrow__NotClient();
        }
        if (s_isComplete) {
            revert Escrow__FundsAlreadyReleased();
        }
        if (address(this).balance < i_amount) {
            revert Escrow__InsufficientBalance();
        }

        // Effect
        s_isComplete = true;

        // Interaction
        (bool sent, ) = payable(i_freelancer).call{value: i_amount}("");
        if (!sent) {
            revert Escrow__EtherTransferFailed();
        }
        
        emit FundsReleased(i_freelancer, i_amount);
    }

    /**
     * @dev Returns the current balance of the contract
     * @return uint256 The contract balance in wei
     */
    function getBalance() external view returns (uint256) {
        return address(this).balance;
    }
}
