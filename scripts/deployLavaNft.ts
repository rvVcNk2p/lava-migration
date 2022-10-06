import { Contract, ContractFactory } from 'ethers'
import { ethers } from 'hardhat'

const main = async (): Promise<any> => {
	const LavaNft: ContractFactory = await ethers.getContractFactory('LavaNft')
	const lavaNft: Contract = await LavaNft.deploy()

	await lavaNft.deployed()
	console.log(`Contract name: Lava Nft, on address: `, lavaNft.address)
}

main()
	.then(() => process.exit(0))
	.catch((error) => {
		console.error(error)
		process.exit(1)
	})
