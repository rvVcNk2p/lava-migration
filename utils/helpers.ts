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

export const getHigherGas = async (addGweiToGas = 0) => {
	const [deployer] = await ethers.getSigners()
	const avgGasPrice = await deployer.getGasPrice()

	if (!addGweiToGas) {
		// increase gas by 8%
		addGweiToGas = ethers.utils.formatUnits(avgGasPrice.mul(8).div(100), 'gwei')
	}
	return avgGasPrice.add(
		ethers.utils.parseUnits(addGweiToGas.toString(), 'gwei'),
	)
}

export const getOverrideWithHigherGas = async (addGweiToGas = 0) => {
	return {
		gasPrice: await getHigherGas(addGweiToGas),
	}
}
