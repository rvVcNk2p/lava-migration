// SPDX-License-Identifier: MIT
pragma solidity ^0.8.1;

import 'hardhat/console.sol';
import './interfaces/ILavaNft.sol';
import './interfaces/ILavaMigration.sol';
import './interfaces/ILavaFinance.sol';
import '@openzeppelin/contracts/token/ERC20/IERC20.sol';

contract LavaDistribution {
	// uint256 constant usdceAmount = 20000 * 1e18;
	// uint256 constant totalLvpNft = 4000;

	address private nftContract;
	address private migrationContract;
	address private lavaFinanceContract;
	address private usdceAddress;

	uint256[] boosterPercentage = [15, 10, 5]; // %

	constructor(
		address _nftContract,
		address _migrationContract,
		address _lavaFinanceContract,
		address _usdceAddress
	) {
		nftContract = _nftContract;
		migrationContract = _migrationContract;
		lavaFinanceContract = _lavaFinanceContract;
		usdceAddress = _usdceAddress;
	}

	function getNonBoosterSharePrice() public view returns (uint256) {
		uint256 totalLvpNft = ILavaNft(nftContract).getMintedNftsCount();
		uint256[] memory numberOfBoostedLvps = ILavaMigration(migrationContract)
			.getNumberOfBoostedLvps();
		uint256 usdceAmount = IERC20(usdceAddress).balanceOf(address(this));

		return
			((usdceAmount) /
				(adjustWithPercentage(
					numberOfBoostedLvps[0] * 1e6,
					boosterPercentage[0]
				) +
					adjustWithPercentage(
						numberOfBoostedLvps[1] * 1e6,
						boosterPercentage[1]
					) +
					adjustWithPercentage(
						numberOfBoostedLvps[2] * 1e6,
						boosterPercentage[2]
					) +
					totalLvpNft *
					1e6)) * 1e18;
	}

	function getConsumerClaimablePayout(address _consumer)
		public
		view
		returns (uint256)
	{
		uint256 customerOwnedNftcount = ILavaNft(nftContract).balanceOf(_consumer);
		uint256 biggestBoosterPercentage = 0;
		uint256 nonBoosterSharePrice = getNonBoosterSharePrice();

		address bronzeNFTAddress = ILavaFinance(lavaFinanceContract).bronzeNFT();
		uint256 bronzeNFTCount = IERC20(bronzeNFTAddress).balanceOf(_consumer);
		if (bronzeNFTCount > 0) biggestBoosterPercentage = boosterPercentage[2];

		address silverNFTAddress = ILavaFinance(lavaFinanceContract).silverNFT();
		uint256 silverNFTCount = IERC20(silverNFTAddress).balanceOf(_consumer);
		if (silverNFTCount > 0) biggestBoosterPercentage = boosterPercentage[1];

		address goldNFTAddress = ILavaFinance(lavaFinanceContract).goldNFT();
		uint256 goldNFTCount = IERC20(goldNFTAddress).balanceOf(_consumer);
		if (goldNFTCount > 0) biggestBoosterPercentage = boosterPercentage[0];

		uint256 distributionValue = 0;

		if (biggestBoosterPercentage == 0) {
			distributionValue = customerOwnedNftcount * nonBoosterSharePrice;
		} else if (biggestBoosterPercentage > 0) {
			if (customerOwnedNftcount > 40) {
				uint256 first40Nft = adjustWithPercentage(
					40 * nonBoosterSharePrice,
					biggestBoosterPercentage
				) + 40 * nonBoosterSharePrice;

				uint256 remainingNftValue = (customerOwnedNftcount - 40) *
					nonBoosterSharePrice;

				distributionValue = first40Nft + remainingNftValue;
			} else {
				distributionValue =
					adjustWithPercentage(
						customerOwnedNftcount * nonBoosterSharePrice,
						biggestBoosterPercentage
					) +
					customerOwnedNftcount *
					nonBoosterSharePrice;
			}
		}

		return distributionValue;
	}

	function performDistribution() public view {
		// TODO
	}

	function adjustWithPercentage(uint256 _amount, uint256 _value)
		internal
		pure
		returns (uint256)
	{
		return (_amount * _value) / 100;
	}
}
