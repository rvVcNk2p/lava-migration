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
	LavaMigration__factory,
	LavaNft__factory,
	LavaDistribution__factory,
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
		DependencyContracts.erc20.USDC,
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
		DependencyContracts.erc20.USDC,
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
	let USDC: Contract

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
		const whaleAddress = '0x9f8c163cba728e99993abe7495f06c0a3c8ac8b9'
		const usdcWhale = await ethers.getImpersonatedSigner(whaleAddress)

		USDC = new ethers.Contract(
			DependencyContracts.erc20.USDC,
			DependencyContracts.erc20.ABI,
			usdcWhale,
		)

		await USDC.transfer(lavaMigration.address, 100000 * 1e6)
		await USDC.approve(lavaDistribution.address, 3 * 10000 * 1e6)
	})

	describe('Perform migration', async () => {
		it(`[OK] Migration contract funded with: 100.000 USDC`, async () => {
			const USDC = new ethers.Contract(
				DependencyContracts.erc20.USDC,
				DependencyContracts.erc20.ABI,
				deployer,
			)
			const USDEalance = await USDC.balanceOf(lavaMigration.address)
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
			const starterUsdcOnMember = await USDC.balanceOf(lavaMember_1.address)
			const starterUsdcOnContract = await USDC.balanceOf(lavaMigration.address)

			const createdNftIds = Array.from({ length: maxNftCount }, (v, k) => k + 1)

			await expect(
				lavaMigration
					.connect(lavaMember_1)
					.migrate(maxNftCount, maxUsdcPayout, '100_usdc', nodeCreationDates),
			)
				.to.emit(lavaMigration, 'SuccessfulMigration')
				.withArgs(
					lavaMember_1.address,
					maxNftCount,
					maxUsdcPayout,
					createdNftIds,
				)

			// ==============================================
			// [START] Check the balance of the LAVA_CONSUMER_ADDRESS
			// ==============================================
			const endUsdcOnMember = await USDC.balanceOf(lavaMember_1.address)
			const givenUsdcAmount = endUsdcOnMember - starterUsdcOnMember
			expect(givenUsdcAmount).to.be.eq(maxUsdcPayout)
			// ==============================================
			// [END] Check the balance of the LAVA_CONSUMER_ADDRESS
			// ==============================================

			// ==============================================
			// [START] Check the USDC balance of the LAVA_MIGRATION
			// ==============================================
			const remainingUsdcOnContract = await USDC.balanceOf(
				lavaMigration.address,
			)
			expect(remainingUsdcOnContract).to.be.equals(
				starterUsdcOnContract - maxUsdcPayout,
			)
			// ==============================================
			// [END] Check the USDC balance of the LAVA_MIGRATION
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

		it(`[OK] [lavaMember_2] Migration type: 'combination' - 3 extra NFT requested + remaining amount in USDC`, async () => {
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
			const balanceOfUsdcBefore = await USDC.balanceOf(lavaMember_2.address)
			// ============================================
			const createdNftIds = Array.from(
				{ length: maxNftCount },
				(v, k) => k + 11,
			) // 11
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
			const USDEalanceAfter = await USDC.balanceOf(lavaMember_2.address)
			const givenUsdcAmount = USDEalanceAfter - balanceOfUsdcBefore

			expect(givenUsdcAmount).to.be.eq(remainingUsdcAmount)
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
			const createdNftIds = Array.from(
				{ length: maxNftCount },
				(v, k) => k + 46,
			) // 46
			// Lava Memer 1 already minted the Nfts with tokenIds [1..10]
			// Lava Memer 2 already minted the Nfts with tokenIds [11..45]

			await expect(
				lavaMigration
					.connect(lavaMember_3)
					.migrate(maxNftCount, 0, '100_nft', mappedNodeCreationDates),
			).to.emit(lavaMigration, 'SuccessfulMigration')

			//==================================================================
			//==================================================================

			const [, , , , , remainingMintabeNFt] = await lavaMigration
				.connect(lavaMember_3)
				.getMigrationMember()
			const remainingMintabeNFtInt = parseInt(remainingMintabeNFt + '')

			const iterations = Array(Math.ceil(remainingMintabeNFtInt / 100)).fill(
				null,
			)
			const promises = iterations.map(async (_, i) => {
				const isLast = iterations.length - 1 === i
				const from = (i + 1) * 100
				const to = isLast ? mappedNodeCreationDates.length : (i + 1) * 100 + 100

				return await lavaMigration
					.connect(lavaMember_3)
					.mintRemainingNfts(mappedNodeCreationDates.slice(from, to))
			})
			await Promise.all(promises)

			const [, , , , , _remainingMintabeNFt] = await lavaMigration
				.connect(lavaMember_3)
				.getMigrationMember()
			expect(parseInt(_remainingMintabeNFt + '')).to.be.equal(0)
			//==================================================================
			//==================================================================

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

		it(`[OK] Check NFT holders count.`, async () => {
			const nftHoldersArr = await lavaNft.getNftHoldres()
			expect(nftHoldersArr.length).to.be.equal(3)
		})
	})

	describe('First distribution check - All claimed - No traded NFT.', async () => {
		it(`[OK] Distribution contract funded with: 10.000 USDC`, async () => {
			const whaleAddress = '0x9f8c163cba728e99993abe7495f06c0a3c8ac8b9'
			const usdcWhale = await ethers.getImpersonatedSigner(whaleAddress)

			await lavaDistribution.connect(usdcWhale).fundWithUSDC(10000 * 1e6)

			const USDC = new ethers.Contract(
				DependencyContracts.erc20.USDC,
				DependencyContracts.erc20.ABI,
				deployer,
			)
			const USDCbalance = await USDC.balanceOf(lavaDistribution.address)
			expect(USDCbalance).to.be.eq(10000 * 1e6)
		})

		it('[OK] Get distribution payout by customers.', async () => {
			const lavaMember1Payout = await lavaDistribution.claimableAmounts(
				lavaMember_1.address,
			)
			const lavaMember2Payout = await lavaDistribution.claimableAmounts(
				lavaMember_2.address,
			)
			const lavaMember3Payout = await lavaDistribution.claimableAmounts(
				lavaMember_3.address,
			)

			console.log(
				'== lavaMember1: ',
				ethers.utils.formatEther(lavaMember1Payout),
			)
			console.log(
				'== lavaMember2: ',
				ethers.utils.formatEther(lavaMember2Payout),
			)
			console.log(
				'== lavaMember3: ',
				ethers.utils.formatEther(lavaMember3Payout),
			)

			expect(
				ethers.utils.formatEther(
					lavaMember1Payout.add(lavaMember2Payout).add(lavaMember3Payout),
				),
			).to.equal('10000.0')
		})

		it('Perform distribution.', async () => {
			const starterUsdcOnMember1 = await USDC.balanceOf(lavaMember_1.address)
			const starterUsdcOnMember2 = await USDC.balanceOf(lavaMember_2.address)
			const starterUsdcOnMember3 = await USDC.balanceOf(lavaMember_3.address)

			const calimablePayout1 = await lavaDistribution.claimableAmounts(
				lavaMember_1.address,
			)
			await lavaDistribution.connect(lavaMember_1).claim()
			const calimablePayout2 = await lavaDistribution.claimableAmounts(
				lavaMember_2.address,
			)
			await lavaDistribution.connect(lavaMember_2).claim()
			const calimablePayout3 = await lavaDistribution.claimableAmounts(
				lavaMember_3.address,
			)
			await lavaDistribution.connect(lavaMember_3).claim()

			const finalUsdcOnMember1 = await USDC.balanceOf(lavaMember_1.address)
			const finalUsdcOnMember2 = await USDC.balanceOf(lavaMember_2.address)
			const finalUsdcOnMember3 = await USDC.balanceOf(lavaMember_3.address)

			const remainingUsdcOnContract = await USDC.balanceOf(
				lavaDistribution.address,
			)

			expect(calimablePayout1 / 1e12).to.be.equal(
				finalUsdcOnMember1 - starterUsdcOnMember1,
			)
			expect(calimablePayout2 / 1e12).to.be.equal(
				finalUsdcOnMember2 - starterUsdcOnMember2,
			)
			expect(calimablePayout3 / 1e12).to.be.equal(
				finalUsdcOnMember3 - starterUsdcOnMember3,
			)
			expect(remainingUsdcOnContract).to.be.equal(0)
		})
	})

	describe('Second distribution check - No traded NFT.', async () => {
		it(`[OK] Distribution contract funded with: 10.000 USDC`, async () => {
			const whaleAddress = '0x9f8c163cba728e99993abe7495f06c0a3c8ac8b9'
			const usdcWhale = await ethers.getImpersonatedSigner(whaleAddress)

			await lavaDistribution.connect(usdcWhale).fundWithUSDC(10000 * 1e6)

			const USDC = new ethers.Contract(
				DependencyContracts.erc20.USDC,
				DependencyContracts.erc20.ABI,
				deployer,
			)
			const USDCbalance = await USDC.balanceOf(lavaDistribution.address)
			expect(USDCbalance).to.be.eq(10000 * 1e6)
		})

		it('[OK] Get distribution payout by customers.', async () => {
			const lavaMember1Payout = await lavaDistribution.claimableAmounts(
				lavaMember_1.address,
			)
			const lavaMember2Payout = await lavaDistribution.claimableAmounts(
				lavaMember_2.address,
			)
			const lavaMember3Payout = await lavaDistribution.claimableAmounts(
				lavaMember_3.address,
			)

			expect(
				ethers.utils.formatEther(
					lavaMember1Payout.add(lavaMember2Payout).add(lavaMember3Payout),
				),
			).to.equal('10000.0')
		})

		it('[OK] Perform distribution - Only the 3. memeber claim their part.', async () => {
			const starterUsdcOnMember3 = await USDC.balanceOf(lavaMember_3.address)
			const starterUsdcOnContract = await USDC.balanceOf(
				lavaDistribution.address,
			)

			const calimablePayout1 = await lavaDistribution.claimableAmounts(
				lavaMember_1.address,
			)

			const calimablePayout2 = await lavaDistribution.claimableAmounts(
				lavaMember_2.address,
			)

			const calimablePayout3 = await lavaDistribution.claimableAmounts(
				lavaMember_3.address,
			)
			await lavaDistribution.connect(lavaMember_3).claim()

			console.log(
				'== lavaMember1: ',
				ethers.utils.formatEther(calimablePayout1),
			)
			console.log(
				'== lavaMember2: ',
				ethers.utils.formatEther(calimablePayout2),
			)

			const finalUsdcOnMember3 = await USDC.balanceOf(lavaMember_3.address)

			const remainingUsdcOnContract = await USDC.balanceOf(
				lavaDistribution.address,
			)

			const calimablePayoutAfterClaim3 =
				await lavaDistribution.claimableAmounts(lavaMember_3.address)

			console.log(
				'== lavaMember3: ',
				ethers.utils.formatEther(calimablePayoutAfterClaim3),
			)

			expect(calimablePayout3 / 1e12).to.be.equal(
				finalUsdcOnMember3 - starterUsdcOnMember3,
			)

			expect(remainingUsdcOnContract).to.be.equal(
				starterUsdcOnContract - calimablePayout3 / 1e12,
			)
		})

		it(`[OK] Distribution contract funded with: 10.000 USDC`, async () => {
			const whaleAddress = '0x9f8c163cba728e99993abe7495f06c0a3c8ac8b9'
			const usdcWhale = await ethers.getImpersonatedSigner(whaleAddress)

			await lavaDistribution.connect(usdcWhale).fundWithUSDC(10000 * 1e6)

			const USDC = new ethers.Contract(
				DependencyContracts.erc20.USDC,
				DependencyContracts.erc20.ABI,
				deployer,
			)
			const USDCbalance = await USDC.balanceOf(lavaDistribution.address)
			expect(USDCbalance).to.be.eq(11552000000) // 2 * 10000 * 1e6 - calimablePayout3 / 1e12
		})

		it('[OK] Get distribution payout by customers.', async () => {
			const lavaMember1Payout = await lavaDistribution.claimableAmounts(
				lavaMember_1.address,
			)
			const lavaMember2Payout = await lavaDistribution.claimableAmounts(
				lavaMember_2.address,
			)
			const lavaMember3Payout = await lavaDistribution.claimableAmounts(
				lavaMember_3.address,
			)

			console.log(
				'== lavaMember1: ',
				ethers.utils.formatEther(lavaMember1Payout),
			)
			console.log(
				'== lavaMember2: ',
				ethers.utils.formatEther(lavaMember2Payout),
			)
			console.log(
				'== lavaMember3: ',
				ethers.utils.formatEther(lavaMember3Payout),
			)

			expect(
				ethers.utils.formatEther(
					lavaMember1Payout.add(lavaMember2Payout).add(lavaMember3Payout),
				),
			).to.equal('11552.0') // 20000.0 - calimablePayout3 / 1e12
		})

		it('Perform distribution - Only the 2. memeber claim their part.', async () => {
			const starterUsdcOnMember2 = await USDC.balanceOf(lavaMember_2.address)

			const calimablePayout1 = await lavaDistribution.claimableAmounts(
				lavaMember_1.address,
			)
			const calimablePayout2 = await lavaDistribution.claimableAmounts(
				lavaMember_2.address,
			)
			await lavaDistribution.connect(lavaMember_2).claim()
			const calimablePayout3 = await lavaDistribution.claimableAmounts(
				lavaMember_3.address,
			)

			const finalUsdcOnMember2 = await USDC.balanceOf(lavaMember_2.address)

			const remainingUsdcOnContract = await USDC.balanceOf(
				lavaDistribution.address,
			)

			const calimablePayoutAfter2 = await lavaDistribution.claimableAmounts(
				lavaMember_2.address,
			)

			console.log(
				'== lavaMember1: ',
				ethers.utils.formatEther(calimablePayout1),
			)
			console.log(
				'== lavaMember2: ',
				ethers.utils.formatEther(calimablePayoutAfter2),
			)
			console.log(
				'== lavaMember3: ',
				ethers.utils.formatEther(calimablePayout3),
			)

			expect(calimablePayout2 / 1e12).to.be.equal(
				finalUsdcOnMember2 - starterUsdcOnMember2,
			)

			expect(remainingUsdcOnContract).to.be.equal(9088000000)
			// 20.000 - calimablePayout3 / 1e12 (8.448) - calimablePayout2 / 1e12 (2.464)
			// 9.088
		})
	})
})
