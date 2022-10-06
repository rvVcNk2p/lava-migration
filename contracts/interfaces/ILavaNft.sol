// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface ILavaNft {
	function mintBatch(address minter, uint256[] memory creationDate)
		external
		returns (uint256[] memory);
}
