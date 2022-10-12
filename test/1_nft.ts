import { expect } from 'chai'
import { ethers } from 'hardhat'
import { loadFixture } from '@nomicfoundation/hardhat-network-helpers'
import { DependencyContracts, deployProxy } from '../utils'

import type { LavaNft, LavaMigration } from '../types/ethers/contracts'
import type {
	LavaNft__factory,
	LavaMigration__factory,
} from '../types/ethers/factories/contracts'
import type { SignerWithAddress } from '@nomiclabs/hardhat-ethers/dist/src/signer-with-address'

import { LAVA_BOOSTED_CONSUMERS, LAVA_CONSUMERS, LavaContracts } from '../utils'
import { Contract } from 'ethers'

const LAVA_CONSUMER_ADDRESS = ethers.utils.getAddress(LAVA_BOOSTED_CONSUMERS[1])

const LAVA_NFT_NAME = 'Lava Venture Pass - Test'
const LAVA_NFT_SYMBOL = 'LVP'

const deployMigrationFixture = async () => {
	let LavaNft: any
	let lavaNft: LavaNft

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
		DependencyContracts.erc20.USDCE,
	)
	await lavaMigration.deployed()

	LavaNft = (await ethers.getContractFactory(
		'LavaNft',
		lavaMember,
	)) as LavaNft__factory
	lavaNft = await deployProxy('LavaNft', [
		LAVA_NFT_NAME,
		LAVA_NFT_SYMBOL,
		lavaMigration.address,
	])

	return { lavaNft, lavaMigration, lavaMember }
}

describe('Nft - getMigrationStats()', async () => {
	let lavaNft: LavaNft
	let lavaMigration: LavaMigration
	let lavaMember: any
	let USDCE: Contract

	before(async () => {
		const {
			lavaNft: _lavaNft,
			lavaMigration: _lavaMigration,
			lavaMember: _lavaMember,
		} = await loadFixture(deployMigrationFixture)
		lavaNft = _lavaNft
		lavaMigration = _lavaMigration
		lavaMember = _lavaMember

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

	it(`NFT contract setup. Everything is has been initialized correctly.`, async () => {
		const nftName = await lavaNft.name()
		const nftSymbol = await lavaNft.symbol()

		expect(nftName).to.equal(LAVA_NFT_NAME)
		expect(nftSymbol).to.equal(LAVA_NFT_SYMBOL)
	})

	it(`Mint first NFT from contract.`, async () => {
		const creationDate = 1638352800
		const nftIdx = 1

		await lavaNft.mintNft(lavaMember.address, creationDate)

		const balance = await lavaNft.balanceOf(lavaMember.address)
		expect(balance).to.equal('1')

		const owner = await lavaNft.ownerOf(nftIdx)
		expect(owner).to.equal(lavaMember.address)
	})

	it(`Check the creation date of the first minted NFT.`, async () => {
		const nftTokenUribase64: any = await lavaNft.tokenURI(1)

		const parsedTokenUri = JSON.parse(
			Buffer.from(nftTokenUribase64.split(',')[1], 'base64').toString('utf8'),
		)

		expect(parsedTokenUri.node_created_at).to.equal('1638352800')
	})

	it(`Set NFT contract address on Migration contract.`, async () => {
		const setNftAddressTx = await lavaMigration.setNftContractAddress(
			lavaNft.address,
		)
		setNftAddressTx.wait()
		expect(await lavaMigration.NFT_CONTRAT_ADDRESS()).to.equal(lavaNft.address)
	})

	it(`Mint nft with Migration contract.`, async () => {
		await lavaMigration.migrate(32, 100, '100_usdc', [
			...Array.from({ length: 31 }, () => 1665272623),
		])

		const balance = await lavaNft.balanceOf(lavaMember.address)
		expect(balance).to.equal('32')
	})

	it(`[2x] Mint nft with Migration contract.`, async () => {
		const errorMessage = 'Migration already completed.'
		await expect(
			lavaMigration.migrate(32, 100, '100_nft', []),
		).to.be.revertedWith(errorMessage)
	})
})
