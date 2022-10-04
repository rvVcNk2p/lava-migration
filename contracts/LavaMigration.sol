// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import 'hardhat/console.sol';
import './interfaces/ILavaFinance.sol';
import '@openzeppelin/contracts/token/ERC20/IERC20.sol';

contract LavaMigration {
	string private contractName;

	// TODO: Get address from constructor
	address private constant LAVA_FINANCE =
		0xDe7E9fd01018C59DEB46bC36316da555Eb889a27;
	address private constant LAVA_V2 = 0x7c105c37A622EB8586BEAef215d452b3f7Dc9A39;
	address private constant NULL_WALLET =
		0x0000000000000000000000000000000000000000;

	constructor(string memory _contractName) {
		contractName = _contractName;
	}

	function getContractName() public view returns (string memory) {
		return contractName;
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

	// ❌ Level 1,2,3 Booster NFTs - nftCount

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
		uint256 claimableNftCount = (nodesTruRoi - remainingTrueRoi) / 500;

		return (
			claimableNftCount,
			multiplicateByLavaValue(remainingTrueRoi),
			nodeTireValues
		);
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
