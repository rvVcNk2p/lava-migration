import { expect } from 'chai'
import { ethers } from 'hardhat'
import { loadFixture } from '@nomicfoundation/hardhat-network-helpers'

import type { LavaDistribution } from '../types/ethers/contracts'
import type { LavaDistribution__factory } from '../types/ethers/factories/contracts'
import type { SignerWithAddress } from '@nomiclabs/hardhat-ethers/dist/src/signer-with-address'

import { LAVA_BOOSTED_CONSUMERS } from '../utils'

const LAVA_CONSUMER_ADDRESS = ethers.utils.getAddress(LAVA_BOOSTED_CONSUMERS[1])

const deployDistributionFixture = async () => {
	let LavaDistribution: LavaDistribution__factory
	let lavaDistribution: LavaDistribution
	let lavaMember: SignerWithAddress

	lavaMember = await ethers.getImpersonatedSigner(LAVA_CONSUMER_ADDRESS)

	LavaDistribution = (await ethers.getContractFactory(
		'LavaDistribution',
		lavaMember,
	)) as LavaDistribution__factory

	lavaDistribution = await LavaDistribution.deploy()
	await lavaDistribution.deployed()

	return { lavaDistribution, lavaMember }
}

describe('Distribution contract', async () => {
	let lavaDistribution: LavaDistribution

	before(async () => {
		const { lavaDistribution: _lavaDistribution, lavaMember: _lavaMember } =
			await loadFixture(deployDistributionFixture)

		lavaDistribution = _lavaDistribution
	})

	it('[OK] Get non booster share price [4.81463649494463168]', async () => {
		const nonBoostedNftShare = await lavaDistribution.getNonBoosterSharePrice()
		const priceInNumber = ethers.utils.formatUnits(nonBoostedNftShare)
		expect(priceInNumber).to.equal('4.81463649494463168')
	})
})
