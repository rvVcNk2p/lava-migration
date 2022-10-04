// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface ILavaFinance {
	struct Tier {
		uint256 cost; // 18 decimals
		uint256 reward; // 18 decimals
		uint256 fees; // 6 decimals. Amount in usdc.e per month
		bool active;
	}

	struct NodeData {
		string name;
		uint256 tier;
		uint256 lastClaim;
		uint256 mintPrice;
		uint256 amountClaimed;
		uint256 paymentExpiry;
		uint256 creationTime; // 0 for already created, which works
	}

	function investedAmount(address addr) external view returns (uint256);

	function claimedAmount(address addr) external view returns (uint256);

	function bronzeNFT() external view returns (address);

	function silverNFT() external view returns (address);

	function goldNFT() external view returns (address);

	function getClaimAmount(
		address user,
		uint256[] memory tokenIds,
		uint256 compoundPercent,
		address booster,
		bool includePendingRewards
	)
		external
		view
		returns (
			uint256 claimAmount,
			uint256 compoundAmount,
			uint256 pLavaAmount,
			uint256 claimUsdcValue,
			uint256 lavaAmountToSell
		);

	function getNodeData(uint256 nodeId) external view returns (NodeData memory);

	function getUserNodes(address user)
		external
		view
		returns (uint256[] memory nodeIds);

	function oracle() external view returns (address);

	function lpPairAddress() external view returns (address);

	function lpPairRatio() external view returns (uint256);

	function tiers(uint256 tier) external view returns (Tier memory);

	function mint(
		uint256 tier,
		address token,
		uint256 numNodes,
		string memory name
	) external returns (uint256);

	function transferNode(
		address from,
		address to,
		uint256 tokenId
	) external;
}
