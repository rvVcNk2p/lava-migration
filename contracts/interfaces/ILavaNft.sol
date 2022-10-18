// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface ILavaNft {
	function mintBatch(address minter, uint256[] memory creationDate)
		external
		returns (uint256[] memory);

	function totalSupply() external view returns (uint256);

	function balanceOf(address consumer) external view returns (uint256);

	function getNumberOfBoostedLvps() external view returns (uint256[] memory);

	function getNftHoldres() external view returns (address[] memory);
}
