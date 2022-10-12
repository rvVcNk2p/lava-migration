// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface ILavaMigration {
	function getNumberOfBoostedLvps() external view returns (uint256[] memory);
}
