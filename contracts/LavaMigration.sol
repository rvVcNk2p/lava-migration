// SPDX-License-Identifier: MIT
pragma solidity ^0.8.1;

import 'hardhat/console.sol';
import './interfaces/ILavaFinance.sol';
import './interfaces/ILavaNft.sol';
import '@openzeppelin/contracts/token/ERC20/IERC20.sol';

function quickSort(
	uint256[] memory arr,
	int256 left,
	int256 right
) pure {
	int256 i = left;
	int256 j = right;
	if (i == j) return;
	uint256 pivot = arr[uint256(left + (right - left) / 2)];
	while (i <= j) {
		while (arr[uint256(i)] < pivot) i++;
		while (pivot < arr[uint256(j)]) j--;
		if (i <= j) {
			(arr[uint256(i)], arr[uint256(j)]) = (arr[uint256(j)], arr[uint256(i)]);
			i++;
			j--;
		}
	}
	if (left < j) quickSort(arr, left, j);
	if (i < right) quickSort(arr, i, right);
}

contract LavaMigration {
	address private LAVA_FINANCE;
	address private LAVA_V2;
	address private P_LAVA;
	address private constant NULL_WALLET =
		0x0000000000000000000000000000000000000000;
	// 	Wed Jan 01 2020 00:00:00 GMT+0000 - Stored in seconds
	uint256 private constant UNIX_TIMESTAMP = 1577836800;
	address public NFT_CONTRAT_ADDRESS = NULL_WALLET;
	address public USDCE_TOKEN_ADDRESS = NULL_WALLET;
	address public OWNER;
	uint256 private constant nftPriceInUsdc = 31500000; // 6 decimal

	struct Migration {
		address customerAddress;
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
		uint256 _payout,
		uint256[] _tokenIds
	);

	constructor(
		address lava_finance,
		address lava_v2,
		address pLava,
		address usdce
	) {
		LAVA_FINANCE = lava_finance;
		LAVA_V2 = lava_v2;
		P_LAVA = pLava;
		USDCE_TOKEN_ADDRESS = usdce;
		OWNER = msg.sender;
	}

	function getAggregatedTrueRoi() public view returns (uint256) {
		(, uint256 nodeDistributionTrueRoi, , ) = getNodesDistribution(); // 18 decimal
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

	function getAggregatedNftCount()
		public
		view
		returns (uint256, uint256[] memory)
	{
		(, , , uint256[] memory nodeCreationDates) = getNodesDistribution(); // 18 decimal
		uint256 claimableNftCountFromBoosters = getBoostersNft() / 1e18; // 18 decimal

		uint256[] memory boosterNodeCreationDates = new uint256[](
			claimableNftCountFromBoosters
		);

		for (uint256 i = 0; i < claimableNftCountFromBoosters; i++) {
			boosterNodeCreationDates[i] = UNIX_TIMESTAMP;
		}

		return (
			claimableNftCountFromBoosters + nodeCreationDates.length,
			concatArrays(boosterNodeCreationDates, nodeCreationDates)
		);
	}

	// ✅ Fuji, Krakatoa, Novarupta remaining nodes - nftCount, trueRoiValue
	function getNodesDistribution()
		public
		view
		returns (
			uint256,
			uint256,
			uint256[] memory,
			uint256[] memory
		)
	{
		uint256[] memory nodesList = ILavaFinance(LAVA_FINANCE).getUserNodes(
			msg.sender
		);

		uint256[] memory nodeTireValues = new uint256[](nodesList.length);
		uint256[] memory nodeCreationDates = new uint256[](nodesList.length);

		uint256 nodesTruRoi = 0;

		for (uint256 i = 0; i < nodesList.length; i++) {
			ILavaFinance.NodeData memory nodeData = ILavaFinance(LAVA_FINANCE)
				.getNodeData(nodesList[i]);

			ILavaFinance.Tier memory tier = ILavaFinance(LAVA_FINANCE).tiers(
				nodeData.tier
			);

			if (nodeData.creationTime == 0) {
				nodeCreationDates[i] = UNIX_TIMESTAMP;
			} else {
				nodeCreationDates[i] = nodeData.creationTime;
			}

			nodesTruRoi += tier.cost; // 18 decimal
			nodeTireValues[i] = tier.cost; // 18 decimal
		}

		uint256 remainingTrueRoi = (nodesTruRoi % (500 * 1e18));
		uint256 claimableNftCount = ((nodesTruRoi - remainingTrueRoi) / 500);

		return (
			claimableNftCount,
			multiplicateByLavaValue(remainingTrueRoi),
			nodeTireValues,
			sliceArray(sort(nodeCreationDates), claimableNftCount)
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

	function migrate(
		uint256 requestedNftCount,
		uint256 requestedUsdcPayout,
		string memory migrationType,
		uint256[] memory nodeCreationDates
	) public {
		require(
			USDCE_TOKEN_ADDRESS != NULL_WALLET,
			"USDC.e contract address isn't set yet."
		);
		require(
			NFT_CONTRAT_ADDRESS != NULL_WALLET,
			"Nft contract address isn't set yet."
		);
		require(
			migrationIdxMapping[msg.sender] == 0,
			'Migration already completed.'
		);
		(uint256 minNftCount, ) = getAggregatedNftCount();
		require(
			requestedNftCount >= minNftCount,
			'Requested NFT count is lesser than the minimum.'
		);
		require(
			getMaxPayoutInUsdc() >= requestedUsdcPayout,
			'Requested USDC payout exceeded the claimable amount.'
		);

		uint256 sentUsdcAmount = 0;
		uint256 mintedNft = 0;

		if (compareStringsbyBytes(migrationType, '100_usdc')) {
			require(
				requestedNftCount == minNftCount,
				'Only the min. amount of NFT allowed.'
			);
			sentUsdcAmount = requestedUsdcPayout;
			mintedNft = requestedNftCount;
			IERC20(USDCE_TOKEN_ADDRESS).transfer(msg.sender, sentUsdcAmount);
		} else if (compareStringsbyBytes(migrationType, '100_nft')) {
			require(
				requestedUsdcPayout == 0,
				'Only 0 USDC payout allowed with this option.'
			);
			mintedNft = requestedNftCount;
			sentUsdcAmount = 0;
		} else if (compareStringsbyBytes(migrationType, 'combination')) {
			uint256 extraNftsPrice = ((requestedNftCount - minNftCount) *
				nftPriceInUsdc); // 6 decimal
			require(
				(extraNftsPrice + requestedUsdcPayout) <= getMaxPayoutInUsdc() / 1e12,
				'Requested usdc amout exceeded the limit.'
			);

			mintedNft = requestedNftCount;
			sentUsdcAmount = requestedUsdcPayout;
			IERC20(USDCE_TOKEN_ADDRESS).transfer(msg.sender, sentUsdcAmount); // TODO: requestedNftCount
		}

		uint256[] memory tokenIds = ILavaNft(NFT_CONTRAT_ADDRESS).mintBatch(
			msg.sender,
			nodeCreationDates
		);

		migrationIdxMapping[msg.sender] = migrationIdx;

		Migrations.push(
			Migration(msg.sender, mintedNft, sentUsdcAmount, migrationType, true)
		);
		migrationIdx++;

		emit SuccessfulMigration(msg.sender, mintedNft, sentUsdcAmount, tokenIds);
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
		return (_amount * 21) / 100; // 21%
	}

	function isMigrated() public view returns (bool) {
		if (migrationIdxMapping[msg.sender] > 0)
			return Migrations[migrationIdxMapping[msg.sender] - 1].isSuccess;
		else return false;
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
			uint256 nftCount = Migrations[i].nftCount;
			uint256 usdcPayout = Migrations[i].usdcPayout;
			string memory migrationType = Migrations[i].migrationType;

			mintedNfts += nftCount;
			mintedUsdc += usdcPayout;

			if (compareStringsbyBytes(migrationType, '100_usdc')) {
				distributionArray[0] += 1;
			} else if (compareStringsbyBytes(migrationType, '100_nft')) {
				distributionArray[1] += 1;
			} else if (compareStringsbyBytes(migrationType, 'combination')) {
				distributionArray[2] += 1;
			}
		}

		return (migrationIdx - 1, distributionArray, mintedNfts, mintedUsdc);
	}

	function getBiggestBoostersNft(address _customer)
		public
		view
		returns (uint256)
	{
		address goldNFTAddress = ILavaFinance(LAVA_FINANCE).goldNFT();
		uint256 goldNFTCount = IERC20(goldNFTAddress).balanceOf(_customer);
		if (goldNFTCount > 0) return 3;

		address silverNFTAddress = ILavaFinance(LAVA_FINANCE).silverNFT();
		uint256 silverNFTCount = IERC20(silverNFTAddress).balanceOf(_customer);
		if (silverNFTCount > 0) return 2;

		address bronzeNFTAddress = ILavaFinance(LAVA_FINANCE).bronzeNFT();
		uint256 bronzeNFTCount = IERC20(bronzeNFTAddress).balanceOf(_customer);
		if (bronzeNFTCount > 0) return 1;

		return 0;
	}

	function getNumberOfBoostedLvps() public view returns (uint256[] memory) {
		// [BRONZ, SILVER, GOLD]
		uint256[] memory numberOfBoostedLvps = new uint256[](3);

		for (uint256 i = 0; i < migrationIdx - 1; i++) {
			uint256 biggestBosster = getBiggestBoostersNft(
				Migrations[i].customerAddress
			);
			if (biggestBosster > 0) {
				uint256 nftCount = ILavaNft(NFT_CONTRAT_ADDRESS).balanceOf(
					Migrations[i].customerAddress
				);
				if (nftCount >= 40) {
					numberOfBoostedLvps[biggestBosster - 1] += 40;
				} else numberOfBoostedLvps[biggestBosster - 1] += nftCount;
			}
		}

		return numberOfBoostedLvps;
	}

	function getMigratedAddresses() public view returns (address[] memory) {
		address[] memory migratedAddresses = new address[](migrationIdx - 1);
		for (uint256 i = 0; i < migrationIdx - 1; i++) {
			migratedAddresses[i] = Migrations[i].customerAddress;
		}
		return migratedAddresses;
	}

	function setContractOwner(address newAddress) public {
		require(msg.sender == OWNER, 'Permission denied.');
		OWNER = newAddress;
	}

	function setNftContractAddress(address newAddress) public {
		require(msg.sender == OWNER, 'Permission denied.');
		NFT_CONTRAT_ADDRESS = newAddress;
	}

	function sort(uint256[] memory data) private pure returns (uint256[] memory) {
		quickSort(data, int256(0), int256(data.length - 1));
		return data;
	}

	function compareStringsbyBytes(string memory s1, string memory s2)
		private
		pure
		returns (bool)
	{
		return keccak256(abi.encodePacked(s1)) == keccak256(abi.encodePacked(s2));
	}

	function sliceArray(uint256[] memory _array, uint256 size)
		private
		pure
		returns (uint256[] memory)
	{
		// The nodeCreationDates length need to match with maximum claimable nft count from nodes
		uint256[] memory slicedArray = new uint256[](size / 1e18);
		for (uint256 i = 0; i < size / 1e18; i++) {
			slicedArray[i] = _array[i];
		}
		return slicedArray;
	}

	function concatArrays(uint256[] memory arr1, uint256[] memory arr2)
		internal
		pure
		returns (uint256[] memory)
	{
		uint256[] memory concatenatedArrays = new uint256[](
			arr1.length + arr2.length
		);

		uint256 i = 0;

		for (; i < arr1.length; i++) {
			concatenatedArrays[i] = arr1[i];
		}
		for (uint256 j = 0; j < arr2.length; j++) {
			concatenatedArrays[i + j] = arr2[j];
		}

		return concatenatedArrays;
	}
}
