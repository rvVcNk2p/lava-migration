import { expect } from 'chai'
import { ethers } from 'hardhat'
import { loadFixture } from '@nomicfoundation/hardhat-network-helpers'
import { BigNumber, Contract } from 'ethers'
import type { LavaMigration, LavaNft } from '../types/ethers/contracts'
import type {
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

const LAVA_CONSUMER_ADDRESS = ethers.utils.getAddress(LAVA_BOOSTED_CONSUMERS[1])
const NFT_PRICE_IN_USDC = 31.5
const UNIX_TIMESTAMP = 1577836800 // 	Wed Jan 01 2020 00:00:00 GMT+0000

const deployMigrationFixture = async () => {
	let LavaMigration: LavaMigration__factory
	let lavaMigration: LavaMigration
	let lavaMember: SignerWithAddress
	let lavaNft: LavaNft

	lavaMember = await ethers.getImpersonatedSigner(LAVA_CONSUMER_ADDRESS)

	LavaMigration = (await ethers.getContractFactory(
		'LavaMigration',
		lavaMember,
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
		lavaMember,
	)) as LavaNft__factory

	lavaNft = await deployProxy('LavaNft', [
		LAVA_NFT_NAME,
		LAVA_NFT_SYMBOL,
		lavaMigration.address,
	])

	return { lavaMigration, lavaNft, lavaMember }
}

// describe('Lava Migration contract', async () => {
// 	let LavaMigration: LavaMigration__factory
// 	let lavaMigration: LavaMigration
// 	let lavaMember: SignerWithAddress

// 	before(async function () {
// 		lavaMember = await ethers.getImpersonatedSigner(LAVA_CONSUMER_ADDRESS)

// 		LavaMigration = (await ethers.getContractFactory(
// 			'LavaMigration',
// 			lavaMember,
// 		)) as LavaMigration__factory

// 		lavaMigration = await LavaMigration.deploy(
// 			LavaContracts.LavaFinance.address,
// 			LavaContracts.LAVAv2.address,
// 			LavaContracts.pLAVA.address,
//			DependencyContracts.erc20.USDCE
// 		)

// 		await lavaMigration.deployed()
// 	})

// 	describe('Test functions one by one', () => {
// 		it(`Get eligible NFTs and remaining ROI from nodes`, async () => {
// 			const [_claimableNftCount, _remainingTrueRoi, _, nodeCreationDates] =
// 				await lavaMigration.getNodesDistribution()

// 			const claimableNftCount = ethers.utils
// 				.formatUnits(_claimableNftCount, 18)
// 				.toString()
// 			const remainingTrueRoi = ethers.utils
// 				.formatUnits(_remainingTrueRoi, 18)
// 				.toString()

// 			expect(claimableNftCount).to.equal('26.0')
// 			expect(remainingTrueRoi).to.equal('120.0')
// 		})

// 		it(`getTrueRoi from Migration contract`, async () => {
// 			const remainingAmount = await lavaMigration.getTrueRoi()
// 			const parsedRemainingAmount = ethers.utils.formatUnits(remainingAmount, 6)

// 			expect(parsedRemainingAmount).to.equal('1202.332768')
// 		})

// 		it(`Get unclaimed tokens`, async () => {
// 			const _remainingUnclaimedTokensTrueRoi =
// 				await lavaMigration.getUnclaimedTokensTrueROI()
// 			const remainingUnclaimedTokensTrueRoi = ethers.utils.formatUnits(
// 				_remainingUnclaimedTokensTrueRoi,
// 				18,
// 			)
// 			expect(remainingUnclaimedTokensTrueRoi).to.equal('0.269386772999999982')
// 		})

// 		it(`Get $LAVA tokens in wallet`, async () => {
// 			const _lavaTokensTrueRoi =
// 				await lavaMigration.getLavaTokensInWallettrueROI()
// 			const lavaTokensTrueRoi = ethers.utils.formatUnits(_lavaTokensTrueRoi)
// 			expect(lavaTokensTrueRoi).to.equal('1.290367830411111105')
// 		})

// 		it(`Get $pLAVA tokens in wallet`, async () => {
// 			const _pLavaTokensTrueRoi =
// 				await lavaMigration.getPLavaTokensInWalletTrueROI()
// 			const pLavaTokensTrueRoi = ethers.utils.formatUnits(_pLavaTokensTrueRoi)
// 			expect(pLavaTokensTrueRoi).to.equal('0.564031698385760655')
// 		})

// 		it(`Get booster NFTs`, async () => {
// 			const _nftCountGivenByBoosters = await lavaMigration.getBoostersNft()
// 			const nftCountGivenByBoosters = ethers.utils.formatUnits(
// 				_nftCountGivenByBoosters,
// 			)
// 			expect(nftCountGivenByBoosters).to.equal('6.0')
// 		})

// 		it(`Get overall trueROI value`, async () => {
// 			const _overallTrueROI = await lavaMigration.getAggregatedTrueRoi()
// 			const overallTrueROI = ethers.utils.formatUnits(_overallTrueROI)
// 			expect(overallTrueROI).to.equal('1324.456554301796871742')
// 		})

// 		it(`Get maximum payout in USDC`, async () => {
// 			const _usdcPayoutValue = await lavaMigration.getMaxPayoutInUsdc()
// 			const usdcPayoutValue = ethers.utils.formatUnits(_usdcPayoutValue)
// 			expect(usdcPayoutValue).to.equal('278.135876403377343057')
// 		})

// 		it(`Get overall NFT count`, async () => {
// 			const _overallNftCount = await lavaMigration.getAggregatedNftCount()
// 			const overallNftCount = ethers.utils.formatUnits(_overallNftCount)
// 			expect(overallNftCount).to.equal('32.0')
// 		})
// 	})
// })

// describe('Migrate function - nftCount', async () => {
// 	let lavaMigration: LavaMigration
// 	let lavaNft: LavaNft
// 	let _maxUsdcPayout: BigNumber
// 	let _overallNftCount: BigNumber

// 	before(async () => {
// 		const { lavaMigration: _lavaMigration, lavaNft: _lavaNft } =
// 			await loadFixture(deployMigrationFixture)
// 		lavaMigration = _lavaMigration
// 		lavaNft = _lavaNft
// 		_maxUsdcPayout = await lavaMigration.getMaxPayoutInUsdc()
// 		_overallNftCount = await lavaMigration.getAggregatedNftCount()

// 		await lavaMigration.setNftContractAddress(lavaNft.address)
// 	})

// 	const errorMessage = 'Requested NFT count is lesser than the minimum.'
// 	it(`[Reverted] ${errorMessage} Minimum amout: 32. Requested amount: 31.`, async () => {
// 		const nftCountMinusOne =
// 			parseInt(ethers.utils.formatEther(_overallNftCount)) - 1

// 		await expect(
// 			lavaMigration.migrate(nftCountMinusOne, _maxUsdcPayout),
// 		).to.be.revertedWith(errorMessage)
// 	})

// 	it(`[OK] Minimum amout: 32. Requested amount: 32.`, async () => {
// 		const tx = await lavaMigration.migrate(_overallNftCount, _maxUsdcPayout)
// 		await tx.wait()

// 		const isSuccess = await lavaMigration.isMigrated()
// 		expect(isSuccess).to.equal(true)
// 	})

// 	it(`[Reverted] In the previous test, the migration was already done.`, async () => {
// 		await expect(
// 			lavaMigration.migrate(_overallNftCount, _maxUsdcPayout),
// 		).to.be.revertedWith('Migration already completed.')
// 	})
// })

// describe('Migrate - trueRoi', async () => {
// 	let lavaMigration: LavaMigration
// 	let lavaNft: LavaNft
// 	let _maxUsdcPayout: BigNumber
// 	let _overallNftCount: BigNumber

// 	before(async () => {
// 		const { lavaMigration: _lavaMigration, lavaNft: _lavaNft } =
// 			await loadFixture(deployMigrationFixture)
// 		lavaMigration = _lavaMigration
// 		lavaNft = _lavaNft
// 		_maxUsdcPayout = await lavaMigration.getMaxPayoutInUsdc()
// 		_overallNftCount = await lavaMigration.getAggregatedNftCount()

// 		await lavaMigration.setNftContractAddress(lavaNft.address)
// 	})

// 	const errorMessage = 'Requested USDC payout exceeded the claimable amount.'
// 	it(`[Reverted] ${errorMessage} Maximum amout: 1324.45. Requested amount: 1325.45`, async () => {
// 		const maxAmountPlusOne = BigNumber.from(_maxUsdcPayout).add(
// 			ethers.utils.parseUnits('1'),
// 		)

// 		await expect(
// 			lavaMigration.migrate(_overallNftCount, maxAmountPlusOne),
// 		).to.be.revertedWith(errorMessage)
// 	})

// 	it(`[OK] Minimum amout: 1324.45. Requested amount: 1324.45.`, async () => {
// 		await expect(lavaMigration.migrate(_overallNftCount, _maxUsdcPayout))
// 			.to.emit(lavaMigration, 'SuccessfulMigration')
// 			.withArgs(LAVA_CONSUMER_ADDRESS, _overallNftCount, _maxUsdcPayout, [1])

// 		const isSuccess = await lavaMigration.isMigrated()
// 		expect(isSuccess).to.equal(true)
// 	})

// 	it(`[Reverted] In the previous test, the migration was already done.`, async () => {
// 		await expect(
// 			lavaMigration.migrate(_overallNftCount, _maxUsdcPayout),
// 		).to.be.revertedWith('Migration already completed.')
// 	})
// })

// describe('Migrate - getMigrationStats()', async () => {
// 	let lavaMigration: LavaMigration
// 	let lavaNft: LavaNft

// 	before(async () => {
// 		const { lavaMigration: _lavaMigration, lavaNft: _lavaNft } =
// 			await loadFixture(deployMigrationFixture)
// 		lavaMigration = _lavaMigration
// 		lavaNft = _lavaNft

// 		await lavaMigration.setNftContractAddress(lavaNft.address)
// 	})

// 	it(`Migrate user by address: ${LAVA_CONSUMER_ADDRESS}`, async () => {
// 		const maxUsdcPayout = await lavaMigration.getMaxPayoutInUsdc()
// 		const overallNftCount = await lavaMigration.getAggregatedNftCount()
// 		await expect(lavaMigration.migrate(overallNftCount, maxUsdcPayout))
// 			.to.emit(lavaMigration, 'SuccessfulMigration')
// 			.withArgs(LAVA_CONSUMER_ADDRESS, overallNftCount, maxUsdcPayout, [1])

// 		const isSuccess = await lavaMigration.isMigrated()
// 		expect(isSuccess).to.equal(true)
// 	})

// 	it(`Check the stats after 1 migration.`, async () => {
// 		const [migratedUsersCount, distributionArray, nftCount, usdcPayout] =
// 			await lavaMigration.getMigrationStats()

// 		// TODO: Increment the right index of distributionArray
// 		// console.log('== distributionArray', distributionArray)

// 		expect(migratedUsersCount.toString()).to.equal('1')
// 		expect(ethers.utils.formatUnits(nftCount)).to.equal('32.0')
// 		expect(ethers.utils.formatUnits(usdcPayout)).to.equal(
// 			'278.135876403377343057',
// 		)
// 	})
// })

describe('migrate() - Test out the entire logic.', async () => {
	let lavaMigration: LavaMigration
	let lavaNft: LavaNft
	let lavaMember: any
	let _maxUsdcPayout: BigNumber
	let USDCE: Contract

	beforeEach(async () => {
		const {
			lavaMigration: _lavaMigration,
			lavaNft: _lavaNft,
			lavaMember: _lavaMember,
		} = await loadFixture(deployMigrationFixture)
		lavaMigration = _lavaMigration
		lavaNft = _lavaNft
		lavaMember = _lavaMember
		_maxUsdcPayout = await lavaMigration.getMaxPayoutInUsdc()

		await lavaMigration.setNftContractAddress(lavaNft.address)

		// Send initial fund to contract
		const whaleAddress = '0x055ae96d7766ec1f51f130042f0b6bee3eb71099'
		const usdceWhale = await ethers.getImpersonatedSigner(whaleAddress)

		USDCE = new ethers.Contract(
			DependencyContracts.erc20.USDCE,
			DependencyContracts.erc20.ABI,
			usdceWhale,
		)
		await USDCE.transfer(lavaMigration.address, 10000 * 1e6)
	})

	it(`[OK] Fund Migration contract with: 10.000 USDC.e`, async () => {
		const USDCE = new ethers.Contract(
			DependencyContracts.erc20.USDCE,
			DependencyContracts.erc20.ABI,
			lavaMember,
		)
		const USDEalance = await USDCE.balanceOf(lavaMigration.address)
		expect(USDEalance).to.be.eq(10000 * 1e6)
	})

	it(`[OK] Migration type: '100_usdc'`, async () => {
		const [overallNftCount, nodeCreationDates] =
			await lavaMigration.getAggregatedNftCount()
		const maxNftCount = parseInt(overallNftCount + '')
		const maxUsdcPayout = ParseFloat4E(
			ethers.utils.formatEther(_maxUsdcPayout),
			2,
		)
		// ============================================
		const starterUsdceOnMember = await USDCE.balanceOf(lavaMember.address)
		const starterUsdceOnContract = await USDCE.balanceOf(lavaMigration.address)

		const createdNftIds = Array.from({ length: maxNftCount }, (v, k) => k + 1)

		await expect(
			lavaMigration.migrate(
				maxNftCount,
				maxUsdcPayout,
				'100_usdc',
				nodeCreationDates,
			),
		)
			.to.emit(lavaMigration, 'SuccessfulMigration')
			.withArgs(
				LAVA_CONSUMER_ADDRESS,
				maxNftCount,
				maxUsdcPayout,
				createdNftIds,
			)

		// ==============================================
		// [START] Check the balance of the LAVA_CONSUMER_ADDRESS
		// ==============================================
		const endUsdceOnMember = await USDCE.balanceOf(lavaMember.address)
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

		const isSuccess = await lavaMigration.isMigrated()
		expect(isSuccess).to.equal(true)

		// ==================================
		// [START] Check the migration stats
		// ==================================
		const [migratedUsersCount, distributionArray, mintedNfts, mintedUsdc] =
			await lavaMigration.getMigrationStats()
		expect(migratedUsersCount).to.eq(1)
		expect(distributionArray[0]).to.eq(1)
		expect(mintedNfts).to.eq(maxNftCount)
		expect(mintedUsdc).to.eq(maxUsdcPayout)
		// ==================================
		// [START] Check the migration stats
		// ==================================

		// TODO: Change an NFT nodeClaimableDate in
		// safeTransferFrom(from, to, tokenId)
		// transferFrom(from, to, tokenId)
	})

	it(`[OK] Migration type: '100_nft'`, async () => {
		const [overallNftCount, nodeCreationDates] =
			await lavaMigration.getAggregatedNftCount()

		const extraNftFromTrueROI = Math.ceil(
			parseInt(ethers.utils.formatEther(_maxUsdcPayout)) / NFT_PRICE_IN_USDC,
		)

		const maxNftCount = parseInt(overallNftCount + '') + extraNftFromTrueROI

		const mappedNodeCreationDates = [
			...Array.from({ length: extraNftFromTrueROI }, () => UNIX_TIMESTAMP), // Add extra NFTS
			...nodeCreationDates,
		]

		// ============================================
		const createdNftIds = Array.from({ length: maxNftCount }, (v, k) => k + 1)

		await expect(
			lavaMigration.migrate(maxNftCount, 0, '100_nft', mappedNodeCreationDates),
		)
			.to.emit(lavaMigration, 'SuccessfulMigration')
			.withArgs(LAVA_CONSUMER_ADDRESS, maxNftCount, 0, createdNftIds)

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

		const isSuccess = await lavaMigration.isMigrated()
		expect(isSuccess).to.equal(true)
	})

	it(`[OK] Migration type: 'combination' - 3 extra NFT requested + remaining amount in USDC.e`, async () => {
		const [overallNftCount, nodeCreationDates] =
			await lavaMigration.getAggregatedNftCount()

		const extraNftFromTrueROI = 3
		const maxNftCount = parseInt(overallNftCount + '') + extraNftFromTrueROI

		const mappedNodeCreationDates = [
			...Array.from({ length: extraNftFromTrueROI }, () => UNIX_TIMESTAMP), // Add extra NFTS
			...nodeCreationDates,
		]

		const remainingUsdcAmount = ParseFloat4E(
			parseInt(ethers.utils.formatEther(_maxUsdcPayout)) -
				extraNftFromTrueROI * NFT_PRICE_IN_USDC,
			2,
		)
		// ============================================
		// Check balance before migration
		const balanceOfUsdceBefore = await USDCE.balanceOf(lavaMember.address)
		// ============================================
		const createdNftIds = Array.from({ length: maxNftCount }, (v, k) => k + 1)

		await expect(
			lavaMigration.migrate(
				maxNftCount,
				remainingUsdcAmount,
				'combination',
				mappedNodeCreationDates,
			),
		)
			.to.emit(lavaMigration, 'SuccessfulMigration')
			.withArgs(
				LAVA_CONSUMER_ADDRESS,
				maxNftCount,
				remainingUsdcAmount,
				createdNftIds,
			)

		// ==============================================
		// [START] Check the balance of the LAVA_CONSUMER_ADDRESS
		// ==============================================
		const USDEalanceAfter = await USDCE.balanceOf(lavaMember.address)
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

		const isSuccess = await lavaMigration.isMigrated()
		expect(isSuccess).to.equal(true)
	})
})
