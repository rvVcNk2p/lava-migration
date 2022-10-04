import { expect } from 'chai'
import { ethers } from 'hardhat'
import type { LavaMigration } from '../types/ethers/contracts'
import type { LavaMigration__factory } from '../types/ethers/factories/contracts'
import type { SignerWithAddress } from '@nomiclabs/hardhat-ethers/dist/src/signer-with-address'

import { LAVA_BOOSTED_CONSUMERS, LAVA_CONSUMERS, LavaContracts } from '../utils'

const LAVA_CONSUMER_ADDRESS = ethers.utils.getAddress(LAVA_BOOSTED_CONSUMERS[1])

describe('Lava Migration contract', function () {
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
		)
		await lavaMigration.deployed()
	})

	beforeEach(async () => {
		// lavaMigration = await LavaMigration.deploy(LAVA_MIGRATION_CONTRACT_NAME)
		// await lavaMigration.deployed()
	})

	it(`Get eligible NFTs and remaining ROI from nodes`, async () => {
		const [_claimableNftCount, _remainingTrueRoi, _test] =
			await lavaMigration.getNodesDistribution()

		const claimableNftCount = ethers.utils
			.formatUnits(_claimableNftCount, 18)
			.toString()
		const remainingTrueRoi = ethers.utils
			.formatUnits(_remainingTrueRoi, 18)
			.toString()

		expect(claimableNftCount).to.equal('21.0')
		expect(remainingTrueRoi).to.equal('120.0')
	})

	it(`getTrueRoi from Migration contract`, async () => {
		const remainingAmount = await lavaMigration.getTrueRoi()
		const parsedRemainingAmount = ethers.utils.formatUnits(remainingAmount, 6)

		expect(parsedRemainingAmount).to.equal('3193.174964')
	})

	it(`Get unclaimed tokens`, async () => {
		const _remainingUnclaimedTokensTrueRoi =
			await lavaMigration.getUnclaimedTokens()
		const remainingUnclaimedTokensTrueRoi = ethers.utils.formatUnits(
			_remainingUnclaimedTokensTrueRoi,
			18,
		)
		expect(remainingUnclaimedTokensTrueRoi).to.equal('0.0')
	})

	it(`Get $LAVA tokens in wallet`, async () => {
		const _lavaTokensTrueRoi = await lavaMigration.getLavaTokensInWallet()
		const lavaTokensTrueRoi = ethers.utils.formatUnits(_lavaTokensTrueRoi)
		expect(lavaTokensTrueRoi).to.equal('33.796708662054333327')
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
		expect(overallTrueROI).to.equal('3346.971672662054333327')
	})

	it(`Get overall NFT count`, async () => {
		const _overallTrueROI = await lavaMigration.getAggregatedNftCount()
		const overallTrueROI = ethers.utils.formatUnits(_overallTrueROI)
		expect(overallTrueROI).to.equal('27.0')
	})
})
