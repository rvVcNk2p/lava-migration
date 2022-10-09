// SPDX-License-Identifier: MIT
pragma solidity ^0.8.1;

import 'hardhat/console.sol';

contract LavaDistribution {
	uint256 constant usdceAmount = 20000 * 1e18;
	uint256 constant totalLvpNft = 4000;

	uint256[] boosterPercentage = [15, 10, 5]; // %
	uint256[] numberOfBoostedLvps = [250, 720, 915]; // Pcs

	constructor() {}

	function getNonBoosterSharePrice() public view returns (uint256) {
		return
			usdceAmount /
			(adjustWithPercentage(numberOfBoostedLvps[0], boosterPercentage[0]) +
				adjustWithPercentage(numberOfBoostedLvps[1], boosterPercentage[1]) +
				adjustWithPercentage(numberOfBoostedLvps[2], boosterPercentage[2]) +
				totalLvpNft);
	}

	function adjustWithPercentage(uint256 _amount, uint256 _value)
		internal
		view
		returns (uint256)
	{
		return (_amount * _value) / 100;
	}
}
