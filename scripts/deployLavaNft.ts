import { Contract, ContractFactory } from 'ethers'
import { ethers } from 'hardhat'

const main = async (): Promise<any> => {
	const LavaNft: ContractFactory = await ethers.getContractFactory('LavaNft')
	const lavaNft: Contract = await LavaNft.deploy('Lava Venture Pass', 'LVP')

	await lavaNft.deployed()
	console.log(`Contract name: Lava Nft`)
	console.log(`Name: ${await lavaNft.name()}`)
	console.log(`Symbol: ${await lavaNft.symbol()}`)
}

main()
	.then(() => process.exit(0))
	.catch((error) => {
		console.error(error)
		process.exit(1)
	})
