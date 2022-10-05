import { expect } from 'chai'
import { ethers } from 'hardhat'
import { loadFixture } from '@nomicfoundation/hardhat-network-helpers'
import { BigNumber } from 'ethers'
import type { LavaMigration } from '../types/ethers/contracts'
import type { LavaMigration__factory } from '../types/ethers/factories/contracts'
import type { SignerWithAddress } from '@nomiclabs/hardhat-ethers/dist/src/signer-with-address'

import { LAVA_BOOSTED_CONSUMERS, LAVA_CONSUMERS, LavaContracts } from '../utils'

const LAVA_CONSUMER_ADDRESS = ethers.utils.getAddress(LAVA_BOOSTED_CONSUMERS[1])

const deployMigrationFixture = async () => {
	let LavaMigration: LavaMigration__factory
	let lavaMigration: LavaMigration
	let lavaMember: SignerWithAddress

	lavaMember = await ethers.getImpersonatedSigner(LAVA_CONSUMER_ADDRESS)

	LavaMigration = (await ethers.getContractFactory(
		'LavaMigration',
		lavaMember,
	)) as LavaMigration__factory

	lavaMigration = await LavaMigration.deploy(
		LavaContracts.LavaFinance.address,
		LavaContracts.LAVAv2.address,
		LavaContracts.pLAVA.address,
	)
	await lavaMigration.deployed()

	return { lavaMigration }
}

describe('Lava Migration contract', async () => {
	let LavaMigration: LavaMigration__factory
	let lavaMigration: LavaMigration
	let lavaMember: SignerWithAddress

	before(async function () {
		lavaMember = await ethers.getImpersonatedSigner(LAVA_CONSUMER_ADDRESS)

		LavaMigration = (await ethers.getContractFactory(
			'LavaMigration',
			lavaMember,
		)) as LavaMigration__factory

		lavaMigration = await LavaMigration.deploy(
			LavaContracts.LavaFinance.address,
			LavaContracts.LAVAv2.address,
			LavaContracts.pLAVA.address,
		)
		await lavaMigration.deployed()
	})

	// beforeEach(async () => {})

	describe('Test functions one by one', () => {
		it(`Get eligible NFTs and remaining ROI from nodes`, async () => {
			const [_claimableNftCount, _remainingTrueRoi, _test] =
				await lavaMigration.getNodesDistribution()

			const claimableNftCount = ethers.utils
				.formatUnits(_claimableNftCount, 18)
				.toString()
			const remainingTrueRoi = ethers.utils
				.formatUnits(_remainingTrueRoi, 18)
				.toString()

			expect(claimableNftCount).to.equal('26.0')
			expect(remainingTrueRoi).to.equal('120.0')
		})

		it(`getTrueRoi from Migration contract`, async () => {
			const remainingAmount = await lavaMigration.getTrueRoi()
			const parsedRemainingAmount = ethers.utils.formatUnits(remainingAmount, 6)

			expect(parsedRemainingAmount).to.equal('1202.332768')
		})

		it(`Get unclaimed tokens`, async () => {
			const _remainingUnclaimedTokensTrueRoi =
				await lavaMigration.getUnclaimedTokensTrueROI()
			const remainingUnclaimedTokensTrueRoi = ethers.utils.formatUnits(
				_remainingUnclaimedTokensTrueRoi,
				18,
			)
			expect(remainingUnclaimedTokensTrueRoi).to.equal('0.269386772999999982')
		})

		it(`Get $LAVA tokens in wallet`, async () => {
			const _lavaTokensTrueRoi =
				await lavaMigration.getLavaTokensInWallettrueROI()
			const lavaTokensTrueRoi = ethers.utils.formatUnits(_lavaTokensTrueRoi)
			expect(lavaTokensTrueRoi).to.equal('1.290367830411111105')
		})

		it(`Get $pLAVA tokens in wallet`, async () => {
			const _pLavaTokensTrueRoi =
				await lavaMigration.getPLavaTokensInWalletTrueROI()
			const pLavaTokensTrueRoi = ethers.utils.formatUnits(_pLavaTokensTrueRoi)
			expect(pLavaTokensTrueRoi).to.equal('0.564031698385760655')
		})

		it(`Get booster NFTs`, async () => {
			const _nftCountGivenByBoosters = await lavaMigration.getBoostersNft()
			const nftCountGivenByBoosters = ethers.utils.formatUnits(
				_nftCountGivenByBoosters,
			)
			expect(nftCountGivenByBoosters).to.equal('6.0')
		})

		it(`Get overall trueROI value`, async () => {
			const _overallTrueROI = await lavaMigration.getAggregatedTrueRoi()
			const overallTrueROI = ethers.utils.formatUnits(_overallTrueROI)
			expect(overallTrueROI).to.equal('1324.456554301796871742')
		})

		it(`Get maximum payout in USDC`, async () => {
			const _usdcPayoutValue = await lavaMigration.getMaxPayoutInUsdc()
			const usdcPayoutValue = ethers.utils.formatUnits(_usdcPayoutValue)
			expect(usdcPayoutValue).to.equal('278.135876403377343057')
		})

		it(`Get overall NFT count`, async () => {
			const _overallNftCount = await lavaMigration.getAggregatedNftCount()
			const overallNftCount = ethers.utils.formatUnits(_overallNftCount)
			expect(overallNftCount).to.equal('32.0')
		})
	})
})

describe('Migrate function - nftCount', async () => {
	let lavaMigration: LavaMigration
	let _maxUsdcPayout: BigNumber
	let _overallNftCount: BigNumber

	before(async () => {
		const { lavaMigration: _lavaMigration } = await loadFixture(
			deployMigrationFixture,
		)
		lavaMigration = _lavaMigration
		_maxUsdcPayout = await lavaMigration.getMaxPayoutInUsdc()
		_overallNftCount = await lavaMigration.getAggregatedNftCount()
	})

	const errorMessage = 'Requested NFT count is lesser than the minimum.'
	it(`[Reverted] ${errorMessage} Minimum amout: 32. Requested amount: 31.`, async () => {
		await expect(
			lavaMigration.migrate(
				BigNumber.from(_overallNftCount).sub(ethers.utils.parseUnits('1')),
				_maxUsdcPayout,
			),
		).to.be.revertedWith(errorMessage)
	})

	it(`[OK] Minimum amout: 32. Requested amount: 32.`, async () => {
		const tx = await lavaMigration.migrate(_overallNftCount, _maxUsdcPayout)
		await tx.wait()

		const isSuccess = await lavaMigration.isMigrated()
		expect(isSuccess).to.equal(true)
	})

	it(`[Reverted] In the previous test, the migration was already done.`, async () => {
		await expect(
			lavaMigration.migrate(_overallNftCount, _maxUsdcPayout),
		).to.be.revertedWith('Migration already completed.')
	})
})

describe('Migrate - trueRoi', async () => {
	let lavaMigration: LavaMigration
	let _maxUsdcPayout: BigNumber
	let _overallNftCount: BigNumber

	before(async () => {
		const { lavaMigration: _lavaMigration } = await loadFixture(
			deployMigrationFixture,
		)
		lavaMigration = _lavaMigration
		_maxUsdcPayout = await lavaMigration.getMaxPayoutInUsdc()
		_overallNftCount = await lavaMigration.getAggregatedNftCount()
	})

	const errorMessage = 'Requested USDC payout exceeded the claimable amount.'
	it(`[Reverted] ${errorMessage} Maximum amout: 1324.45. Requested amount: 1325.45`, async () => {
		const maxAmountPlusOne = BigNumber.from(_maxUsdcPayout).add(
			ethers.utils.parseUnits('1'),
		)

		await expect(
			lavaMigration.migrate(_overallNftCount, maxAmountPlusOne),
		).to.be.revertedWith(errorMessage)
	})

	it(`[OK] Minimum amout: 1324.45. Requested amount: 1324.45.`, async () => {
		await expect(lavaMigration.migrate(_overallNftCount, _maxUsdcPayout))
			.to.emit(lavaMigration, 'SuccessfulMigration')
			.withArgs(LAVA_CONSUMER_ADDRESS, _overallNftCount, _maxUsdcPayout)

		const isSuccess = await lavaMigration.isMigrated()
		expect(isSuccess).to.equal(true)
	})

	it(`[Reverted] In the previous test, the migration was already done.`, async () => {
		await expect(
			lavaMigration.migrate(_overallNftCount, _maxUsdcPayout),
		).to.be.revertedWith('Migration already completed.')
	})
})
