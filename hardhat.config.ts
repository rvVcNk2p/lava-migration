import '@nomicfoundation/hardhat-toolbox'
import '@nomiclabs/hardhat-etherscan'
import dotenv from 'dotenv'
dotenv.config()

const SNOWTRACE_API_KEY = process.env.SNOWTRACE_API_KEY
const PRIVATE_KEY = process.env.PRIVATE_KEY
const FUJI_URL = 'https://api.avax-test.network/ext/bc/C/rpc'
const AVALANCH_MAINNET_URL = 'https://api.avax.network/ext/bc/C/rpc'

// To enable forking, turn one of these booleans on, and then run your tasks/scripts using ``--network hardhat``
const FORK_FUJI = false
const FORK_MAINNET = true

const forkingUrl = FORK_FUJI
	? FUJI_URL
	: FORK_MAINNET
	? AVALANCH_MAINNET_URL
	: undefined

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
	solidity: {
		compilers: [
			{
				version: '0.8.0',
			},
			{
				version: '0.8.1',
			},
			{
				version: '0.8.2',
			},
		],
	},
	networks: {
		hardhat: {
			forking: {
				blockNumber: 20681087,
				url: forkingUrl,
			},
			gasPrice: 225000000000,
		},
		fuji: {
			url: FUJI_URL,
			gasPrice: 225000000000,
			chainId: 43113,
			accounts: [PRIVATE_KEY],
		},
		mainnet: {
			url: AVALANCH_MAINNET_URL,
			gasPrice: 225000000000,
			chainId: 43114,
			accounts: [PRIVATE_KEY],
		},
	},
	etherscan: {
		// https://docs.avax.network/dapps/smart-contracts/verify-smart-contract-using-hardhat-and-snowtrace
		apiKey: SNOWTRACE_API_KEY,
	},
	typechain: {
		outDir: 'types/ethers',
		target: 'ethers-v5',
	},
}
