import { expect } from 'chai'
import { ethers } from 'hardhat'
import { loadFixture } from '@nomicfoundation/hardhat-network-helpers'
import { BigNumber, Contract } from 'ethers'
import type {
	LavaMigration,
	LavaNft,
	LavaDistribution,
} from '../types/ethers/contracts'
import type {
	LavaDistribution__factory,
	LavaMigration__factory,
	LavaNft__factory,
} from '../types/ethers/factories/contracts'
import type { SignerWithAddress } from '@nomiclabs/hardhat-ethers/dist/src/signer-with-address'
import { DependencyContracts } from '../utils/DependecyContracts'

import {
	LAVA_BOOSTED_CONSUMERS,
	LAVA_CONSUMERS,
	LavaContracts,
	LAVA_NFT_NAME,
	LAVA_NFT_SYMBOL,
	deployProxy,
	ParseFloat4E,
} from '../utils'

const NFT_PRICE_IN_USDC = 31.5
const UNIX_TIMESTAMP = 1577836800 // 	Wed Jan 01 2020 00:00:00 GMT+0000

const deployMigrationFixture = async () => {
	let LavaMigration: LavaMigration__factory
	let lavaMigration: LavaMigration
	let lavaNft: LavaNft
	let LavaDistribution: LavaDistribution__factory
	let lavaDistribution: LavaDistribution

	const [deployer] = await ethers.getSigners()

	const lavaMember_1: SignerWithAddress = await ethers.getImpersonatedSigner(
		ethers.utils.getAddress(LAVA_CONSUMERS[2]),
	)
	const lavaMember_2: SignerWithAddress = await ethers.getImpersonatedSigner(
		ethers.utils.getAddress(LAVA_BOOSTED_CONSUMERS[1]),
	)
	const lavaMember_3: SignerWithAddress = await ethers.getImpersonatedSigner(
		ethers.utils.getAddress(LAVA_BOOSTED_CONSUMERS[2]),
	)

	LavaMigration = (await ethers.getContractFactory(
		'LavaMigration',
		deployer,
	)) as LavaMigration__factory

	lavaMigration = await LavaMigration.deploy(
		LavaContracts.LavaFinance.address,
		LavaContracts.LAVAv2.address,
		LavaContracts.pLAVA.address,
		DependencyContracts.erc20.USDCE,
	)
	await lavaMigration.deployed()

	const LavaNft: LavaNft__factory = (await ethers.getContractFactory(
		'LavaNft',
		deployer,
	)) as LavaNft__factory

	lavaNft = await deployProxy('LavaNft', [
		LAVA_NFT_NAME,
		LAVA_NFT_SYMBOL,
		lavaMigration.address,
	])

	LavaDistribution = (await ethers.getContractFactory(
		'LavaDistribution',
		deployer,
	)) as LavaDistribution__factory

	lavaDistribution = await LavaDistribution.deploy(
		lavaNft.address,
		lavaMigration.address,
		LavaContracts.LavaFinance.address,
		DependencyContracts.erc20.USDCE,
	)
	await lavaDistribution.deployed()

	return {
		lavaMigration,
		lavaNft,
		lavaDistribution,
		deployer,
		lavaMember_1,
		lavaMember_2,
		lavaMember_3,
	}
}

describe('migrate() - Test out the entire logic.', async () => {
	let lavaMigration: LavaMigration
	let lavaNft: LavaNft
	let lavaDistribution: LavaDistribution
	let USDCE: Contract

	let deployer: SignerWithAddress
	let lavaMember_1: SignerWithAddress
	let lavaMember_2: SignerWithAddress
	let lavaMember_3: SignerWithAddress

	before(async () => {
		const {
			lavaMigration: _lavaMigration,
			lavaNft: _lavaNft,
			lavaDistribution: _lavaDistribution,
			deployer: _deployer,
			lavaMember_1: _lavaMember_1,
			lavaMember_2: _lavaMember_2,
			lavaMember_3: _lavaMember_3,
		} = await loadFixture(deployMigrationFixture)

		lavaMigration = _lavaMigration
		lavaNft = _lavaNft
		lavaDistribution = _lavaDistribution

		deployer = _deployer
		lavaMember_1 = _lavaMember_1
		lavaMember_2 = _lavaMember_2
		lavaMember_3 = _lavaMember_3

		await lavaMigration.setNftContractAddress(lavaNft.address)

		// Send initial fund to contract
		const whaleAddress = '0x055ae96d7766ec1f51f130042f0b6bee3eb71099'
		const usdceWhale = await ethers.getImpersonatedSigner(whaleAddress)

		USDCE = new ethers.Contract(
			DependencyContracts.erc20.USDCE,
			DependencyContracts.erc20.ABI,
			usdceWhale,
		)

		await USDCE.transfer(lavaMigration.address, 100000 * 1e6)
		await USDCE.transfer(lavaDistribution.address, 10000 * 1e6)
	})

	it(`[OK] Migration contract funded with: 100.000 USDC.e`, async () => {
		const USDCE = new ethers.Contract(
			DependencyContracts.erc20.USDCE,
			DependencyContracts.erc20.ABI,
			deployer,
		)
		const USDEalance = await USDCE.balanceOf(lavaMigration.address)
		expect(USDEalance).to.be.eq(100000 * 1e6)
	})

	it(`[OK] [lavaMember_1] Migration type: '100_usdc'`, async () => {
		const [overallNftCount, nodeCreationDates] = await lavaMigration
			.connect(lavaMember_1)
			.getAggregatedNftCount()

		const _maxUsdcPayout: BigNumber = await lavaMigration
			.connect(lavaMember_1)
			.getMaxPayoutInUsdc()

		const maxNftCount = parseInt(overallNftCount + '')
		const maxUsdcPayout = ParseFloat4E(
			ethers.utils.formatEther(_maxUsdcPayout),
			2,
		)
		// ============================================
		const starterUsdceOnMember = await USDCE.balanceOf(lavaMember_1.address)
		const starterUsdceOnContract = await USDCE.balanceOf(lavaMigration.address)

		const createdNftIds = Array.from({ length: maxNftCount }, (v, k) => k + 1)

		await expect(
			lavaMigration
				.connect(lavaMember_1)
				.migrate(maxNftCount, maxUsdcPayout, '100_usdc', nodeCreationDates),
		)
			.to.emit(lavaMigration, 'SuccessfulMigration')
			.withArgs(lavaMember_1.address, maxNftCount, maxUsdcPayout, createdNftIds)

		// ==============================================
		// [START] Check the balance of the LAVA_CONSUMER_ADDRESS
		// ==============================================
		const endUsdceOnMember = await USDCE.balanceOf(lavaMember_1.address)
		const givenUsdceAmount = endUsdceOnMember - starterUsdceOnMember
		expect(givenUsdceAmount).to.be.eq(maxUsdcPayout)
		// ==============================================
		// [END] Check the balance of the LAVA_CONSUMER_ADDRESS
		// ==============================================

		// ==============================================
		// [START] Check the USDC.e balance of the LAVA_MIGRATION
		// ==============================================
		const remainingUsdceOnContract = await USDCE.balanceOf(
			lavaMigration.address,
		)
		expect(remainingUsdceOnContract).to.be.equals(
			starterUsdceOnContract - maxUsdcPayout,
		)
		// ==============================================
		// [END] Check the USDC.e balance of the LAVA_MIGRATION
		// ==============================================

		// ==================================
		// [START] Check the Metadata of NFTs
		// ==================================
		const metadataResult: any = []

		const nftsMetadata = await Promise.all(
			createdNftIds.map(async (nftId) => await lavaNft.tokenURI(nftId)),
		)
		nftsMetadata.forEach((nft: any, idx) => {
			const parsedTokenUri = JSON.parse(
				Buffer.from(nft.split(',')[1], 'base64').toString('utf8'),
			)
			metadataResult.push(
				parsedTokenUri.node_created_at == nodeCreationDates[idx],
			)
		})
		expect(metadataResult.every((currVal: any) => currVal)).to.equal(true)
		// ==================================
		// [END] Check the Metadata of NFTs
		// ==================================

		const isSuccess = await lavaMigration.connect(lavaMember_1).isMigrated()
		expect(isSuccess).to.equal(true)

		// ==================================
		// [START] Check the migration stats
		// ==================================
		const [migratedUsersCount, distributionArray, mintedNfts, mintedUsdc] =
			await lavaMigration.connect(lavaMember_1).getMigrationStats()
		expect(migratedUsersCount).to.eq(1)
		expect(distributionArray[0]).to.eq(1)
		expect(mintedNfts).to.eq(maxNftCount)
		expect(mintedUsdc).to.eq(maxUsdcPayout)
		// ==================================
		// [START] Check the migration stats
		// ==================================
	})

	it(`[OK] [lavaMember_2] Migration type: 'combination' - 3 extra NFT requested + remaining amount in USDC.e`, async () => {
		const [overallNftCount, nodeCreationDates] = await lavaMigration
			.connect(lavaMember_2)
			.getAggregatedNftCount()

		const _maxUsdcPayout: BigNumber = await lavaMigration
			.connect(lavaMember_2)
			.getMaxPayoutInUsdc()

		const extraNftFromTrueROI = 3

		const maxNftCount = parseInt(overallNftCount + '') + extraNftFromTrueROI

		const mappedNodeCreationDates = [
			...Array.from({ length: extraNftFromTrueROI }, () => UNIX_TIMESTAMP), // Add extra NFTS
			...nodeCreationDates,
		]
		const remainingUsdcAmount = ParseFloat4E(
			ethers.utils.formatEther(_maxUsdcPayout) -
				extraNftFromTrueROI * NFT_PRICE_IN_USDC,
			2,
		)
		// ============================================
		// Check balance before migration
		const balanceOfUsdceBefore = await USDCE.balanceOf(lavaMember_2.address)
		// ============================================
		const createdNftIds = Array.from({ length: maxNftCount }, (v, k) => k + 11) // 11
		// Lava Memer 1 already minted the Nfts with tokenIds [1..10]

		await expect(
			lavaMigration
				.connect(lavaMember_2)
				.migrate(
					maxNftCount,
					remainingUsdcAmount,
					'combination',
					mappedNodeCreationDates,
				),
		)
			.to.emit(lavaMigration, 'SuccessfulMigration')
			.withArgs(
				lavaMember_2.address,
				maxNftCount,
				remainingUsdcAmount,
				createdNftIds,
			)

		// ==============================================
		// [START] Check the balance of the LAVA_CONSUMER_ADDRESS
		// ==============================================
		const USDEalanceAfter = await USDCE.balanceOf(lavaMember_2.address)
		const givenUsdceAmount = USDEalanceAfter - balanceOfUsdceBefore

		expect(givenUsdceAmount).to.be.eq(remainingUsdcAmount)
		// ==============================================
		// [END] Check the balance of the LAVA_CONSUMER_ADDRESS
		// ==============================================

		// ==================================
		// [Start] Check the Metadata of NFTs
		// ==================================
		const metadataResult: any = []

		const nftsMetadata = await Promise.all(
			createdNftIds.map(async (nftId) => await lavaNft.tokenURI(nftId)),
		)
		nftsMetadata.forEach((nft: any, idx) => {
			const parsedTokenUri = JSON.parse(
				Buffer.from(nft.split(',')[1], 'base64').toString('utf8'),
			)

			metadataResult.push(
				parsedTokenUri.node_created_at == mappedNodeCreationDates[idx],
			)
		})

		expect(metadataResult.every((currVal: any) => currVal)).to.equal(true)
		// ==================================
		// [Start] Check the Metadata of NFTs
		// ==================================

		const isSuccess = await lavaMigration.connect(lavaMember_2).isMigrated()
		expect(isSuccess).to.equal(true)
	})

	it(`[OK] Migration type: '100_nft'`, async () => {
		const [overallNftCount, nodeCreationDates] = await lavaMigration
			.connect(lavaMember_3)
			.getAggregatedNftCount()

		const _maxUsdcPayout: BigNumber = await lavaMigration
			.connect(lavaMember_3)
			.getMaxPayoutInUsdc()

		const extraNftFromTrueROI = Math.ceil(
			parseInt(ethers.utils.formatEther(_maxUsdcPayout)) / NFT_PRICE_IN_USDC,
		)

		const maxNftCount = parseInt(overallNftCount + '') + extraNftFromTrueROI

		const mappedNodeCreationDates = [
			...Array.from({ length: extraNftFromTrueROI }, () => UNIX_TIMESTAMP), // Add extra NFTS
			...nodeCreationDates,
		]

		// ============================================
		const createdNftIds = Array.from({ length: maxNftCount }, (v, k) => k + 46) // 46
		// Lava Memer 1 already minted the Nfts with tokenIds [1..10]
		// Lava Memer 2 already minted the Nfts with tokenIds [11..45]

		await expect(
			lavaMigration
				.connect(lavaMember_3)
				.migrate(maxNftCount, 0, '100_nft', mappedNodeCreationDates),
		)
			.to.emit(lavaMigration, 'SuccessfulMigration')
			.withArgs(lavaMember_3.address, maxNftCount, 0, createdNftIds)

		// ==================================
		// [Start] Check the Metadata of NFTs
		// ==================================
		const metadataResult: any = []

		const nftsMetadata = await Promise.all(
			createdNftIds.map(async (nftId) => await lavaNft.tokenURI(nftId)),
		)
		nftsMetadata.forEach((nft: any, idx) => {
			const parsedTokenUri = JSON.parse(
				Buffer.from(nft.split(',')[1], 'base64').toString('utf8'),
			)

			metadataResult.push(
				parsedTokenUri.node_created_at == mappedNodeCreationDates[idx],
			)
		})
		expect(metadataResult.every((currVal: any) => currVal)).to.equal(true)
		// ==================================
		// [Start] Check the Metadata of NFTs
		// ==================================

		const isSuccess = await lavaMigration.connect(lavaMember_3).isMigrated()
		expect(isSuccess).to.equal(true)
	})

	it(`Check statistics`, async () => {
		// ==================================
		// [START] Check the migration stats
		// ==================================
		const [migratedUsersCount, distributionArray, mintedNfts, mintedUsdc] =
			await lavaMigration.connect(lavaMember_1).getMigrationStats()

		expect(migratedUsersCount).to.eq(3)
		expect(distributionArray[0]).to.eq(1)
		expect(distributionArray[1]).to.eq(1)
		expect(distributionArray[2]).to.eq(1)
		expect(mintedNfts).to.eq(303)
		expect(mintedUsdc).to.eq(321110000) // 321.11
		// ==================================
		// [START] Check the migration stats
		// ==================================
	})

	it(`[OK] Distribution contract funded with: 10.000 USDC.e`, async () => {
		const USDCE = new ethers.Contract(
			DependencyContracts.erc20.USDCE,
			DependencyContracts.erc20.ABI,
			deployer,
		)
		const USDEalance = await USDCE.balanceOf(lavaDistribution.address)
		expect(USDEalance).to.be.eq(10000 * 1e6)
	})

	it('[OK] Get distribution payout by customers.', async () => {
		await lavaDistribution.setNonBoosterSharePrice()

		const lavaMember1Payout = await lavaDistribution.getConsumerClaimablePayout(
			lavaMember_1.address,
		)
		const lavaMember2Payout = await lavaDistribution.getConsumerClaimablePayout(
			lavaMember_2.address,
		)
		const lavaMember3Payout = await lavaDistribution.getConsumerClaimablePayout(
			lavaMember_3.address,
		)

		console.log('== lavaMember1: ', ethers.utils.formatEther(lavaMember1Payout))
		console.log('== lavaMember2: ', ethers.utils.formatEther(lavaMember2Payout))
		console.log('== lavaMember3: ', ethers.utils.formatEther(lavaMember3Payout))

		expect(
			ethers.utils.formatEther(
				lavaMember1Payout.add(lavaMember2Payout).add(lavaMember3Payout),
			),
		).to.equal('10000.0')
	})

	it('Perform distribution.', async () => {
		await lavaDistribution.setNonBoosterSharePrice()

		const starterUsdceOnMember1 = await USDCE.balanceOf(lavaMember_1.address)
		const starterUsdceOnMember2 = await USDCE.balanceOf(lavaMember_2.address)
		const starterUsdceOnMember3 = await USDCE.balanceOf(lavaMember_3.address)

		const calimablePayout1 = await lavaDistribution.getConsumerClaimablePayout(
			ethers.utils.getAddress(lavaMember_1.address),
		)

		const calimablePayout2 = await lavaDistribution.getConsumerClaimablePayout(
			lavaMember_2.address,
		)
		const calimablePayout3 = await lavaDistribution.getConsumerClaimablePayout(
			lavaMember_3.address,
		)

		await lavaDistribution.performDistribution()

		const finalUsdceOnMember1 = await USDCE.balanceOf(lavaMember_1.address)
		const finalUsdceOnMember2 = await USDCE.balanceOf(lavaMember_2.address)
		const finalUsdceOnMember3 = await USDCE.balanceOf(lavaMember_3.address)

		const remainingUsdcOnContract = await USDCE.balanceOf(
			lavaDistribution.address,
		)

		expect(calimablePayout1 / 1e12).to.be.equal(
			finalUsdceOnMember1 - starterUsdceOnMember1,
		)
		expect(calimablePayout2 / 1e12).to.be.equal(
			finalUsdceOnMember2 - starterUsdceOnMember2,
		)
		expect(calimablePayout3 / 1e12).to.be.equal(
			finalUsdceOnMember3 - starterUsdceOnMember3,
		)
		expect(remainingUsdcOnContract).to.be.equal(0)
	})
})
