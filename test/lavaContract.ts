// Only works in test.. https://hardhat.org/hardhat-network/docs/guides/forking-other-networks#impersonating-accounts

import { expect } from 'chai'
import { ethers } from 'hardhat'
import type { SignerWithAddress } from '@nomiclabs/hardhat-ethers/dist/src/signer-with-address'
import type { LavaFinance } from '../types/ethers'
import {
	LAVA_CONSUMERS,
	LavaContracts,
	DependencyContracts,
	NULL_WALLET,
} from '../utils'

///////////////////////////////////////////////////////////
// SEE https://hardhat.org/tutorial/testing-contracts.html
// FOR HELP WRITING TESTS
// USE https://github.com/gnosis/mock-contract FOR HELP
// WITH MOCK CONTRACT
///////////////////////////////////////////////////////////

const LAVA_CONSUMER_ADDRESS = ethers.utils.getAddress(LAVA_CONSUMERS[1])

describe('LavaFinance Contract', function () {
	let lavaFinance: LavaFinance
	let lavaMember: SignerWithAddress

	before(async function () {
		lavaMember = await ethers.getImpersonatedSigner(LAVA_CONSUMER_ADDRESS)

		lavaFinance = new ethers.Contract(
			LavaContracts.LavaFinance.address,
			LavaContracts.LavaFinance.ABI,
			lavaMember,
		) as LavaFinance
	})

	// beforeEach(async function () {})

	it(`Nodes count of ${LAVA_CONSUMER_ADDRESS} needs to be 6.`, async () => {
		const userNodes = await lavaFinance.getUserNodes(lavaMember.address)
		// console.log(
		// 	'User Nodes: ',
		// 	userNodes.map((node) => node.toString()),
		// )

		lavaFinance.claim

		expect(userNodes.length).to.equal(6)
	})

	describe('TrueROI Remaining ($)', () => {
		let investedAmount: string
		let claimedAmount: string
		it(`investedAmount => 2339.65613 USD`, async () => {
			const _investedAmount = await lavaFinance.investedAmount(
				lavaMember.address,
			)
			investedAmount = ethers.utils.formatUnits(_investedAmount, 6)
			expect(investedAmount).to.equal('2339.65613')
		})

		it(`claimedAmount => 332.132877 USD`, async () => {
			const _claimedAmount = await lavaFinance.claimedAmount(lavaMember.address)
			claimedAmount = ethers.utils.formatUnits(_claimedAmount, 6)
			expect(claimedAmount).to.equal('332.132877')
		})

		it(`Remaining amount => 2007.523253`, () => {
			const remainingAmount = ethers.utils
				.parseEther(investedAmount)
				.sub(ethers.utils.parseEther(claimedAmount))

			const parsedRemainingAmount = ethers.utils.formatUnits(
				remainingAmount,
				18,
			)

			expect(parsedRemainingAmount).to.equal('2007.523253')
		})
	})

	it(`Unclaimed $LAVA / Pending rewards => 46.3011`, async () => {
		const getClaimAmount = await lavaFinance.getClaimAmount(
			lavaMember.address,
			[],
			10000,
			NULL_WALLET,
			true,
		)

		const pendingRewards = ethers.utils.formatUnits(getClaimAmount[1], 18)
		expect(pendingRewards).to.equal('46.301122427047629063')
	})

	it(`[${LAVA_CONSUMER_ADDRESS}] - Level 1 Booster NFT (Bronz) count === 0`, async () => {
		const bronzNFTContract = new ethers.Contract(
			LavaContracts.bronzeNFT.address,
			DependencyContracts.erc20.ABI,
			lavaMember,
		)
		const goltNftCount = await bronzNFTContract.balanceOf(lavaMember.address)

		expect(goltNftCount.toString()).to.equal('0')
	})

	it(`[${LAVA_CONSUMER_ADDRESS}] - Level 2 Booster NFT (Silver) count === 0`, async () => {
		const silverNFTContract = new ethers.Contract(
			LavaContracts.silverNFT.address,
			DependencyContracts.erc20.ABI,
			lavaMember,
		)
		const goltNftCount = await silverNFTContract.balanceOf(lavaMember.address)

		expect(goltNftCount.toString()).to.equal('0')
	})

	it(`[${LAVA_CONSUMER_ADDRESS}] - Level 3 Booster NFT (Gold) count === 0`, async () => {
		const goldNFTContract = new ethers.Contract(
			LavaContracts.goldNFT.address,
			DependencyContracts.erc20.ABI,
			lavaMember,
		)
		const goltNftCount = await goldNFTContract.balanceOf(lavaMember.address)

		expect(goltNftCount.toString()).to.equal('0')
	})
})
