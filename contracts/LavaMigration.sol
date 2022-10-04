// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import 'hardhat/console.sol';
import './interfaces/ILavaFinance.sol';

contract LavaMigration {
	string private contractName;

	address private constant LAVA_FINANCE =
		0xDe7E9fd01018C59DEB46bC36316da555Eb889a27;
	address private constant NULL_WALLET =
		0x0000000000000000000000000000000000000000;

	constructor(string memory _contractName) {
		contractName = _contractName;
	}

	function getContractName() public view returns (string memory) {
		return contractName;
	}

	// ✅ TrueROI Remaining ($)
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

	// ❌ Level 1,2,3 Booster NFTs - nftCount

	// ✅ Fuji, Krakatoa, Novarupta remaining nodes - nftCount, trueRoiValue
	function getNodesDistribution() public view returns (uint256, uint256) {
		uint256[] memory nodesList = ILavaFinance(LAVA_FINANCE).getUserNodes(
			msg.sender
		);

		// uint256[] memory nodeTireValues = new uint256[](nodesList.length);

		uint256 nodesTruRoi = 0;

		for (uint256 i = 0; i < nodesList.length; i++) {
			ILavaFinance.NodeData memory nodeData = ILavaFinance(LAVA_FINANCE)
				.getNodeData(nodesList[i]);

			ILavaFinance.Tier memory tier = ILavaFinance(LAVA_FINANCE).tiers(
				nodeData.tier
			);

			nodesTruRoi += tier.cost; // 18 decimal
			// nodeTireValues[i] = tier.cost; // 18 decimal
		}

		uint256 remainingTrueRoi = (nodesTruRoi % 150) * 1e18;
		uint256 claimableNftCount = (nodesTruRoi - remainingTrueRoi) / 500;

		return (claimableNftCount, multiplicateByLavaValue(remainingTrueRoi));
	}

	// ❌ $LAVA in Wallet - trueRoiValue

	// ❌ Unclaimed $LAVA - trueRoiValue
	function getUnclaimedTokens() public view returns (uint256) {
		uint256[] memory emptyArray = new uint256[](0);

		uint256 getClaimAmount = ILavaFinance(LAVA_FINANCE).getClaimAmount(
			msg.sender,
			emptyArray,
			10000,
			NULL_WALLET,
			true
		)[1];

		return getClaimAmount[1];
	}

	function multiplicateByLavaValue(uint256 _amount)
		internal
		pure
		returns (uint256)
	{
		return (_amount * 3) / 10; // $0.30/LAVA
	}
}
