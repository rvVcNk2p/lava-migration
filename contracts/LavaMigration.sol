// SPDX-License-Identifier: MIT
pragma solidity ^0.8.1;

import 'hardhat/console.sol';
import './interfaces/ILavaFinance.sol';
import '@openzeppelin/contracts/token/ERC20/IERC20.sol';

contract LavaMigration {
	address private LAVA_FINANCE;
	address private LAVA_V2;
	address private P_LAVA;
	address private constant NULL_WALLET =
		0x0000000000000000000000000000000000000000;

	struct Migration {
		uint256 nftCount;
		uint256 usdcPayout;
		string migrationType;
		bool isSuccess;
	}

	uint256 migrationIdx = 1;
	Migration[] Migrations;
	mapping(address => uint256) public migrationIdxMapping;

	event SuccessfulMigration(
		address indexed _from,
		uint256 _nft,
		uint256 _payout
	);

	constructor(
		address lava_finance,
		address lava_v2,
		address pLava
	) {
		LAVA_FINANCE = lava_finance;
		LAVA_V2 = lava_v2;
		P_LAVA = pLava;
	}

	function getAggregatedTrueRoi() public view returns (uint256) {
		(, uint256 nodeDistributionTrueRoi, ) = getNodesDistribution(); // 18 decimal
		uint256 trueRoi = getTrueRoi(); // 6 decimal
		uint256 walletTokenTrueRoi = getLavaTokensInWallettrueROI(); // 18 decimal
		uint256 walletPLavaTokenTrueRoi = getPLavaTokensInWalletTrueROI(); // 18 decimal
		uint256 unclaimedTokenTrueRoi = getUnclaimedTokensTrueROI(); // 18 decimal

		return
			nodeDistributionTrueRoi +
			(trueRoi * 1e12) + // Convert 6 decimal to 18 decimal
			walletTokenTrueRoi +
			walletPLavaTokenTrueRoi +
			unclaimedTokenTrueRoi;
	}

	function getMaxPayoutInUsdc() public view returns (uint256) {
		return adjustUsdcPayoutPercentage(getAggregatedTrueRoi());
	}

	function getAggregatedNftCount() public view returns (uint256) {
		(uint256 claimableNftCountFromNodes, , ) = getNodesDistribution(); // 18 decimal
		uint256 claimableNftCountFromBoosters = getBoostersNft(); // 18 decimal

		return claimableNftCountFromNodes + claimableNftCountFromBoosters;
	}

	// ✅ Fuji, Krakatoa, Novarupta remaining nodes - nftCount, trueRoiValue
	function getNodesDistribution()
		public
		view
		returns (
			uint256,
			uint256,
			uint256[] memory
		)
	{
		uint256[] memory nodesList = ILavaFinance(LAVA_FINANCE).getUserNodes(
			msg.sender
		);

		uint256[] memory nodeTireValues = new uint256[](nodesList.length);

		uint256 nodesTruRoi = 0;

		for (uint256 i = 0; i < nodesList.length; i++) {
			ILavaFinance.NodeData memory nodeData = ILavaFinance(LAVA_FINANCE)
				.getNodeData(nodesList[i]);

			ILavaFinance.Tier memory tier = ILavaFinance(LAVA_FINANCE).tiers(
				nodeData.tier
			);

			nodesTruRoi += tier.cost; // 18 decimal
			nodeTireValues[i] = tier.cost; // 18 decimal
		}

		uint256 remainingTrueRoi = (nodesTruRoi % (500 * 1e18));
		uint256 claimableNftCount = ((nodesTruRoi - remainingTrueRoi) / 500);

		return (
			claimableNftCount,
			multiplicateByLavaValue(remainingTrueRoi),
			nodeTireValues
		);
	}

	// ✅ Level 1,2,3 Booster NFTs - nftCount
	function getBoostersNft() public view returns (uint256) {
		uint256 boosterNftsCount = 0;

		address bronzeNFTAddress = ILavaFinance(LAVA_FINANCE).bronzeNFT();
		uint256 bronzeNFTCount = IERC20(bronzeNFTAddress).balanceOf(msg.sender);
		if (bronzeNFTCount > 0) boosterNftsCount += bronzeNFTCount * 2;

		address silverNFTAddress = ILavaFinance(LAVA_FINANCE).silverNFT();
		uint256 silverNFTCount = IERC20(silverNFTAddress).balanceOf(msg.sender);
		if (silverNFTCount > 0) boosterNftsCount += (silverNFTCount * 6);

		address goldNFTAddress = ILavaFinance(LAVA_FINANCE).goldNFT();
		uint256 goldNFTCount = IERC20(goldNFTAddress).balanceOf(msg.sender);
		if (goldNFTCount > 0) boosterNftsCount += goldNFTCount * 14;

		return boosterNftsCount * 1e18;
	}

	// ✅ TrueROI Remaining ($) - trueRoiValue
	function getTrueRoi() public view returns (uint256) {
		// 6 decimal
		uint256 investedAmount = ILavaFinance(LAVA_FINANCE).investedAmount(
			msg.sender
		);
		uint256 claimedAmount = ILavaFinance(LAVA_FINANCE).claimedAmount(
			msg.sender
		);

		if (claimedAmount >= investedAmount) return 0;
		else return investedAmount - claimedAmount;
	}

	// ✅ $LAVA in Wallet - trueRoiValue
	function getLavaTokensInWallettrueROI() public view returns (uint256) {
		uint256 lavaBalance = IERC20(LAVA_V2).balanceOf(msg.sender);
		return multiplicateByLavaValue(lavaBalance);
	}

	// ✅ $pLAVA in Wallet - trueRoiValue
	function getPLavaTokensInWalletTrueROI() public view returns (uint256) {
		uint256 pLavaBalance = IERC20(P_LAVA).balanceOf(msg.sender);
		return multiplicateByLavaValue(pLavaBalance);
	}

	// ✅ Unclaimed $LAVA - trueRoiValue
	function getUnclaimedTokensTrueROI() public view returns (uint256) {
		uint256[] memory emptyArray = new uint256[](0);

		(, uint256 compoundAmount, , , ) = ILavaFinance(LAVA_FINANCE)
			.getClaimAmount(msg.sender, emptyArray, 10000, NULL_WALLET, true);

		return multiplicateByLavaValue(compoundAmount);
	}

	function migrate(uint256 requestedNftCount, uint256 requestedUsdcPayout)
		public
	{
		require(
			migrationIdxMapping[msg.sender] == 0,
			'Migration already completed.'
		);
		require(
			requestedNftCount >= getAggregatedNftCount(),
			'Requested NFT count is lesser than the minimum.'
		);
		require(
			getMaxPayoutInUsdc() >= requestedUsdcPayout,
			'Requested USDC payout exceeded the claimable amount.'
		);

		if (requestedUsdcPayout == getMaxPayoutInUsdc()) {
			// require
			// TODO: 100% USDC option
		} else if (requestedNftCount == getAggregatedNftCount()) {
			// require
			// TODO: 100 NFT option
		} else if (requestedNftCount > getAggregatedNftCount()) {
			// require
			// TODO: Combination option
			// 150
		}
		// TODO: The USDC payout will be send through this the Migration contract

		// TODO: Mint 'requestedNftCount' from the NFT contract.

		migrationIdxMapping[msg.sender] = migrationIdx;
		Migrations.push(
			Migration(
				requestedNftCount,
				requestedUsdcPayout,
				'100_nft--100_usdc--combination', // TODO: Corresponding type selection
				true
			)
		);
		migrationIdx++;

		emit SuccessfulMigration(
			msg.sender,
			requestedNftCount,
			requestedUsdcPayout
		);
	}

	function multiplicateByLavaValue(uint256 _amount)
		internal
		pure
		returns (uint256)
	{
		return (_amount * 3) / 10; // $0.30/LAVA
	}

	function adjustUsdcPayoutPercentage(uint256 _amount)
		internal
		pure
		returns (uint256)
	{
		return (_amount / 100) * 21; // 21%
	}

	function isMigrated() public view returns (bool) {
		return Migrations[migrationIdxMapping[msg.sender] - 1].isSuccess;
	}

	function getMigrationStats()
		public
		view
		returns (
			uint256, // Total amount of users that have migrated
			uint256[] memory, // The distribution between the 3 choices (100% NFT, 100% USDC, Combination)
			uint256, // Total NFTs minted
			uint256 // Total USDC minted
		)
	{
		uint256[] memory distributionArray = new uint256[](3);
		uint256 mintedNfts = 0;
		uint256 mintedUsdc = 0;

		for (uint256 i = 0; i < migrationIdx - 1; i++) {
			uint256 nftCount = Migrations[migrationIdxMapping[msg.sender] - 1]
				.nftCount;
			uint256 usdcPayout = Migrations[migrationIdxMapping[msg.sender] - 1]
				.usdcPayout;
			string memory migrationType = Migrations[
				migrationIdxMapping[msg.sender] - 1
			].migrationType;

			mintedNfts += nftCount;
			mintedUsdc += usdcPayout;

			// TODO: Increment the right index of distributionArray
			console.log('migrationType: ', migrationType);
		}

		return (migrationIdx - 1, distributionArray, mintedNfts, mintedUsdc);
	}
}
