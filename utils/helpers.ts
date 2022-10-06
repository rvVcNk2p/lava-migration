const { ethers, upgrades } = require('hardhat')
const { getImplementationAddress } = require('@openzeppelin/upgrades-core')

export const deployProxy = async (
	contractName: string,
	constructorArgs: any[],
) => {
	const factory = await ethers.getContractFactory(contractName)
	const contract = await upgrades.deployProxy(factory, constructorArgs)
	await contract.deployed()

	const implAddress = await getImplementationAddress(
		ethers.provider,
		contract.address,
	)
	console.log('== Deployed upgradeable', contractName, contract.address)
	console.log('== Implementation address:', implAddress)
	return contract
}

export const upgradeProxy = async (
	contractName: string,
	contractAddress: string,
) => {
	const factory = await ethers.getContractFactory(contractName)
	const contract = await upgrades.upgradeProxy(contractAddress, factory)
	await contract.deployed()

	const implAddress = await getImplementationAddress(
		ethers.provider,
		contract.address,
	)
	console.log('== Upgraded', contractName, contract.address)
	console.log('== Implementation address:', implAddress)
	return contract
}
