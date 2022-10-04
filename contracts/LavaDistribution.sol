// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract LavaDistribution {
	string private contractName;

	constructor(string memory _contractName) {
		contractName = _contractName;
	}

	function getContractName() public view returns (string memory) {
		return contractName;
	}
}
