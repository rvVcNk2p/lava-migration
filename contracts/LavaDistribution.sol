// SPDX-License-Identifier: MIT
pragma solidity ^0.8.1;

import 'hardhat/console.sol';
import './interfaces/ILavaNft.sol';
import './interfaces/ILavaMigration.sol';
import './interfaces/ILavaFinance.sol';
import '@openzeppelin/contracts/token/ERC20/IERC20.sol';

contract LavaDistribution {
	address private nftContract;
	address private migrationContract;
	address private lavaFinanceContract;
	address private usdcAddress;

	uint256[] boosterPercentage = [15, 10, 5]; // Percentages
	uint256 public nonBoosterSharePrice = 0;

	mapping(address => uint256) public claimableAmounts;

	constructor(
		address _nftContract,
		address _migrationContract,
		address _lavaFinanceContract,
		address _usdcAddress
	) {
		nftContract = _nftContract;
		migrationContract = _migrationContract;
		lavaFinanceContract = _lavaFinanceContract;
		usdcAddress = _usdcAddress;
	}

	function setNonBoosterSharePrice(uint256 usdceAmount) private {
		uint256 totalLvpNft = ILavaNft(nftContract).totalSupply();
		uint256[] memory numberOfBoostedLvps = ILavaMigration(migrationContract)
			.getNumberOfBoostedLvps();

		nonBoosterSharePrice =
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
					1e6)) *
			1e18;
	}

	function fundWithUSDC(uint256 _amount) public {
		// WARNING: IERC20(usdcAddress).approve() needs to be done before calling this one.
		// TODO: Whitelisted address - require
		IERC20(usdcAddress).transferFrom(msg.sender, address(this), _amount);
		setNonBoosterSharePrice(_amount);
		address[] memory nftHolders = ILavaNft(nftContract).getNftHoldres();
		for (uint256 i = 0; i < nftHolders.length; i++) {
			claimableAmounts[nftHolders[i]] += getConsumerClaimablePayout(
				nftHolders[i]
			);
		}
		nonBoosterSharePrice = 0;
	}

	function getConsumerClaimablePayout(address _consumer)
		private
		view
		returns (uint256)
	{
		uint256 customerOwnedNftcount = ILavaNft(nftContract).balanceOf(_consumer);
		uint256 biggestBoosterPercentage = 0;

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

	function adjustWithPercentage(uint256 _amount, uint256 _value)
		internal
		pure
		returns (uint256)
	{
		return (_amount * _value) / 100;
	}

	function claim() public {
		// TODO: Claim, and remove NFT holder that are not hold any NFTs
		require(claimableAmounts[msg.sender] > 0, 'No more claimable amout.');

		IERC20(usdcAddress).transfer(
			msg.sender,
			claimableAmounts[msg.sender] / 1e12
		);

		claimableAmounts[msg.sender] -= claimableAmounts[msg.sender];
	}
}
