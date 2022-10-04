import { expect } from 'chai'
import { ethers } from 'hardhat'
import type { LavaMigration } from '../types/ethers/contracts'
import type { LavaMigration__factory } from '../types/ethers/factories/contracts'
import type { SignerWithAddress } from '@nomiclabs/hardhat-ethers/dist/src/signer-with-address'

import { LAVA_CONSUMERS } from '../utils'

const LAVA_MIGRATION_CONTRACT_NAME = 'Lava Migration'
const LAVA_CONSUMER_ADDRESS = ethers.utils.getAddress(LAVA_CONSUMERS[1])

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
	})

	beforeEach(async function () {
		lavaMigration = await LavaMigration.deploy(LAVA_MIGRATION_CONTRACT_NAME)
		await lavaMigration.deployed()
	})

	// it(`After a successfull deployment the 'getContractName()' should return '${LAVA_MIGRATION_CONTRACT_NAME}'`, async function () {
	// 	expect(await lavaMigration.getContractName()).to.equal(
	// 		LAVA_MIGRATION_CONTRACT_NAME,
	// 	)
	// })

	it(`getTrueRoi from Migraition contract`, async function () {
		const remainingAmount = await lavaMigration.getTrueRoi()
		const parsedRemainingAmount = ethers.utils.formatUnits(remainingAmount, 6)

		expect(parsedRemainingAmount).to.equal('2007.523253')
	})

	it(`Get eligible NFTs and remaining ROI from nodes`, async function () {
		const [_claimableNftCount, _remainingTrueRoi] =
			await lavaMigration.getNodesDistribution()

		const claimableNftCount = ethers.utils
			.formatUnits(_claimableNftCount, 18)
			.toString()
		const remainingTrueRoi = ethers.utils
			.formatUnits(_remainingTrueRoi, 18)
			.toString()

		expect(claimableNftCount).to.equal('3.0')
		expect(remainingTrueRoi).to.equal('30.0')
	})
})
