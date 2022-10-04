// SPDX-License-Identifier: MIT
pragma solidity ^0.8.1;

import 'hardhat/console.sol';
import './interfaces/ILavaFinance.sol';
import '@openzeppelin/contracts/token/ERC20/IERC20.sol';

contract LavaMigration {
	address private LAVA_FINANCE;
	address private LAVA_V2;
	address private constant NULL_WALLET =
		0x0000000000000000000000000000000000000000;

	constructor(address lava_finance, address lava_v2) {
		LAVA_FINANCE = lava_finance;
		LAVA_V2 = lava_v2;
	}

	function getAggregatedTrueRoi() public view returns (uint256) {
		(, uint256 nodeDistributionTrueRoi, ) = getNodesDistribution(); // 18 decimal
		uint256 trueRoi = getTrueRoi(); // 6 decimal
		uint256 walletTokenTrueRoi = getLavaTokensInWallet(); // 18 decimal
		uint256 unclaimedTokenTrueRoi = getUnclaimedTokens(); // 18 decimal

		return
			nodeDistributionTrueRoi +
			(trueRoi * 1e12) + // Convert 6 decimal to 18 decimal
			walletTokenTrueRoi +
			unclaimedTokenTrueRoi;
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
	function getLavaTokensInWallet() public view returns (uint256) {
		uint256 lavaBalance = IERC20(LAVA_V2).balanceOf(msg.sender);
		return multiplicateByLavaValue(lavaBalance);
	}

	// ✅ Unclaimed $LAVA - trueRoiValue
	function getUnclaimedTokens() public view returns (uint256) {
		uint256[] memory emptyArray = new uint256[](0);

		(, uint256 compoundAmount, , , ) = ILavaFinance(LAVA_FINANCE)
			.getClaimAmount(msg.sender, emptyArray, 10000, NULL_WALLET, true);

		return multiplicateByLavaValue(compoundAmount);
	}

	function multiplicateByLavaValue(uint256 _amount)
		internal
		pure
		returns (uint256)
	{
		return (_amount * 3) / 10; // $0.30/LAVA
	}
}
