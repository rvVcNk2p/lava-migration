import { expect } from 'chai'
import { ethers } from 'hardhat'
import type { LavaMigration } from '../types/ethers/contracts'
import type { LavaMigration__factory } from '../types/ethers/factories/contracts'
import type { SignerWithAddress } from '@nomiclabs/hardhat-ethers/dist/src/signer-with-address'

import { LAVA_BOOSTED_CONSUMERS, LAVA_CONSUMERS } from '../utils'

const LAVA_MIGRATION_CONTRACT_NAME = 'Lava Migration'
const LAVA_CONSUMER_ADDRESS = ethers.utils.getAddress(LAVA_CONSUMERS[5])

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
		lavaMigration = await LavaMigration.deploy(LAVA_MIGRATION_CONTRACT_NAME)
		await lavaMigration.deployed()
	})

	beforeEach(async () => {
		// lavaMigration = await LavaMigration.deploy(LAVA_MIGRATION_CONTRACT_NAME)
		// await lavaMigration.deployed()
	})

	it(`getTrueRoi from Migraition contract`, async () => {
		const remainingAmount = await lavaMigration.getTrueRoi()
		const parsedRemainingAmount = ethers.utils.formatUnits(remainingAmount, 6)

		expect(parsedRemainingAmount).to.equal('2579.364297')
	})

	it(`Get eligible NFTs and remaining ROI from nodes`, async () => {
		const [_claimableNftCount, _remainingTrueRoi] =
			await lavaMigration.getNodesDistribution()

		const claimableNftCount = ethers.utils
			.formatUnits(_claimableNftCount, 18)
			.toString()
		const remainingTrueRoi = ethers.utils
			.formatUnits(_remainingTrueRoi, 18)
			.toString()

		expect(claimableNftCount).to.equal('4.0')
		expect(remainingTrueRoi).to.equal('90.0')
	})

	it(`Get unclaimed tokens`, async () => {
		const _remainingUnclaimedTokensTrueRoi =
			await lavaMigration.getUnclaimedTokens()
		const remainingUnclaimedTokensTrueRoi = ethers.utils.formatUnits(
			_remainingUnclaimedTokensTrueRoi,
			18,
		)
		expect(remainingUnclaimedTokensTrueRoi).to.equal('1.124250893523553236')
	})

	it(`Get $LAVA tokens in wallet`, async () => {
		const _lavaTokensTrueRoi = await lavaMigration.getLavaTokensInWallet()
		const lavaTokensTrueRoi = ethers.utils.formatUnits(_lavaTokensTrueRoi)
		expect(lavaTokensTrueRoi).to.equal('8.210543355727239582')
	})
})
