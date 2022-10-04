export const LavaContracts = {
	goldNFT: {
		address: '0xCe1AC1134Ca99f6dDa5E451cB237f8f7c6D8bE43',
	},
	silverNFT: {
		address: '0xb8f075f55e6140b9C9ff7ed5465bf6D064E697Dd',
	},
	bronzeNFT: {
		address: '0x86c989A151b637d3D34b0496761cD7FE946F3C29',
	},
	pLAVA: {
		address: '0x4062E0E875EcEC144Ad0F4a75f53Ecd5EcFd6Ccd',
	},
	aLAVA: {
		address: '0xeCb90e849d6e8517014e1E5efEfCd04841A0F45b',
	},
	gLAVA: {
		address: '0x9469d27bd235916d339C5FB85c232Ef5328bA75b',
	},
	LAVA: {
		address: '0xf53cC73cF2638B330e62B094efeDf0a7d9eE1b53',
		ABI: [
			{
				inputs: [
					{
						internalType: 'uint256',
						name: '_liquidityCooldown',
						type: 'uint256',
					},
					{
						internalType: 'uint256',
						name: '_additionalLiquidityCooldown',
						type: 'uint256',
					},
				],
				stateMutability: 'nonpayable',
				type: 'constructor',
			},
			{
				anonymous: false,
				inputs: [
					{
						indexed: true,
						internalType: 'address',
						name: 'owner',
						type: 'address',
					},
					{
						indexed: true,
						internalType: 'address',
						name: 'spender',
						type: 'address',
					},
					{
						indexed: false,
						internalType: 'uint256',
						name: 'value',
						type: 'uint256',
					},
				],
				name: 'Approval',
				type: 'event',
			},
			{
				anonymous: false,
				inputs: [
					{
						indexed: true,
						internalType: 'address',
						name: 'previousOwner',
						type: 'address',
					},
					{
						indexed: true,
						internalType: 'address',
						name: 'newOwner',
						type: 'address',
					},
				],
				name: 'OwnershipTransferred',
				type: 'event',
			},
			{
				anonymous: false,
				inputs: [
					{
						indexed: false,
						internalType: 'address',
						name: 'account',
						type: 'address',
					},
				],
				name: 'Paused',
				type: 'event',
			},
			{
				anonymous: false,
				inputs: [
					{
						indexed: true,
						internalType: 'address',
						name: 'from',
						type: 'address',
					},
					{
						indexed: true,
						internalType: 'address',
						name: 'to',
						type: 'address',
					},
					{
						indexed: false,
						internalType: 'uint256',
						name: 'value',
						type: 'uint256',
					},
				],
				name: 'Transfer',
				type: 'event',
			},
			{
				anonymous: false,
				inputs: [
					{
						indexed: false,
						internalType: 'address',
						name: 'account',
						type: 'address',
					},
				],
				name: 'Unpaused',
				type: 'event',
			},
			{
				inputs: [
					{
						internalType: 'address',
						name: 'owner',
						type: 'address',
					},
					{
						internalType: 'address',
						name: 'spender',
						type: 'address',
					},
				],
				name: 'allowance',
				outputs: [
					{
						internalType: 'uint256',
						name: '',
						type: 'uint256',
					},
				],
				stateMutability: 'view',
				type: 'function',
			},
			{
				inputs: [
					{
						internalType: 'address',
						name: 'spender',
						type: 'address',
					},
					{
						internalType: 'uint256',
						name: 'amount',
						type: 'uint256',
					},
				],
				name: 'approve',
				outputs: [
					{
						internalType: 'bool',
						name: '',
						type: 'bool',
					},
				],
				stateMutability: 'nonpayable',
				type: 'function',
			},
			{
				inputs: [
					{
						internalType: 'address',
						name: 'account',
						type: 'address',
					},
				],
				name: 'balanceOf',
				outputs: [
					{
						internalType: 'uint256',
						name: '',
						type: 'uint256',
					},
				],
				stateMutability: 'view',
				type: 'function',
			},
			{
				inputs: [],
				name: 'botsCount',
				outputs: [
					{
						internalType: 'uint256',
						name: '',
						type: 'uint256',
					},
				],
				stateMutability: 'view',
				type: 'function',
			},
			{
				inputs: [
					{
						internalType: 'uint256',
						name: 'amount',
						type: 'uint256',
					},
				],
				name: 'burn',
				outputs: [],
				stateMutability: 'nonpayable',
				type: 'function',
			},
			{
				inputs: [],
				name: 'decimals',
				outputs: [
					{
						internalType: 'uint8',
						name: '',
						type: 'uint8',
					},
				],
				stateMutability: 'view',
				type: 'function',
			},
			{
				inputs: [
					{
						internalType: 'address',
						name: 'spender',
						type: 'address',
					},
					{
						internalType: 'uint256',
						name: 'subtractedValue',
						type: 'uint256',
					},
				],
				name: 'decreaseAllowance',
				outputs: [
					{
						internalType: 'bool',
						name: '',
						type: 'bool',
					},
				],
				stateMutability: 'nonpayable',
				type: 'function',
			},
			{
				inputs: [
					{
						internalType: 'address',
						name: 'spender',
						type: 'address',
					},
					{
						internalType: 'uint256',
						name: 'addedValue',
						type: 'uint256',
					},
				],
				name: 'increaseAllowance',
				outputs: [
					{
						internalType: 'bool',
						name: '',
						type: 'bool',
					},
				],
				stateMutability: 'nonpayable',
				type: 'function',
			},
			{
				inputs: [
					{
						internalType: 'address',
						name: 'user',
						type: 'address',
					},
				],
				name: 'isBlacklisted',
				outputs: [
					{
						internalType: 'bool',
						name: '',
						type: 'bool',
					},
				],
				stateMutability: 'view',
				type: 'function',
			},
			{
				inputs: [],
				name: 'lavaFinance',
				outputs: [
					{
						internalType: 'address',
						name: '',
						type: 'address',
					},
				],
				stateMutability: 'view',
				type: 'function',
			},
			{
				inputs: [],
				name: 'liquidityCooldown',
				outputs: [
					{
						internalType: 'uint256',
						name: '',
						type: 'uint256',
					},
				],
				stateMutability: 'view',
				type: 'function',
			},
			{
				inputs: [
					{
						internalType: 'address',
						name: '',
						type: 'address',
					},
				],
				name: 'lpPairs',
				outputs: [
					{
						internalType: 'bool',
						name: '',
						type: 'bool',
					},
				],
				stateMutability: 'view',
				type: 'function',
			},
			{
				inputs: [],
				name: 'lpRouter',
				outputs: [
					{
						internalType: 'address',
						name: '',
						type: 'address',
					},
				],
				stateMutability: 'view',
				type: 'function',
			},
			{
				inputs: [],
				name: 'maxPerWallet',
				outputs: [
					{
						internalType: 'uint256',
						name: '',
						type: 'uint256',
					},
				],
				stateMutability: 'view',
				type: 'function',
			},
			{
				inputs: [],
				name: 'name',
				outputs: [
					{
						internalType: 'string',
						name: '',
						type: 'string',
					},
				],
				stateMutability: 'view',
				type: 'function',
			},
			{
				inputs: [],
				name: 'nodeSalesTax',
				outputs: [
					{
						internalType: 'uint256',
						name: '',
						type: 'uint256',
					},
				],
				stateMutability: 'view',
				type: 'function',
			},
			{
				inputs: [],
				name: 'owner',
				outputs: [
					{
						internalType: 'address',
						name: '',
						type: 'address',
					},
				],
				stateMutability: 'view',
				type: 'function',
			},
			{
				inputs: [],
				name: 'pause',
				outputs: [],
				stateMutability: 'nonpayable',
				type: 'function',
			},
			{
				inputs: [],
				name: 'paused',
				outputs: [
					{
						internalType: 'bool',
						name: '',
						type: 'bool',
					},
				],
				stateMutability: 'view',
				type: 'function',
			},
			{
				inputs: [],
				name: 'renounceOwnership',
				outputs: [],
				stateMutability: 'nonpayable',
				type: 'function',
			},
			{
				inputs: [],
				name: 'rewardPool',
				outputs: [
					{
						internalType: 'address',
						name: '',
						type: 'address',
					},
				],
				stateMutability: 'view',
				type: 'function',
			},
			{
				inputs: [],
				name: 'salesTax',
				outputs: [
					{
						internalType: 'uint256',
						name: '',
						type: 'uint256',
					},
				],
				stateMutability: 'view',
				type: 'function',
			},
			{
				inputs: [
					{
						internalType: 'bool',
						name: '_antiBotEnabled',
						type: 'bool',
					},
				],
				name: 'setAntiBotEnabled',
				outputs: [],
				stateMutability: 'nonpayable',
				type: 'function',
			},
			{
				inputs: [
					{
						internalType: 'address[]',
						name: 'users',
						type: 'address[]',
					},
					{
						internalType: 'bool',
						name: 'status',
						type: 'bool',
					},
				],
				name: 'setBlacklistMultiple',
				outputs: [],
				stateMutability: 'nonpayable',
				type: 'function',
			},
			{
				inputs: [
					{
						internalType: 'address',
						name: '_lavaFinance',
						type: 'address',
					},
				],
				name: 'setLavaFinance',
				outputs: [],
				stateMutability: 'nonpayable',
				type: 'function',
			},
			{
				inputs: [
					{
						internalType: 'uint256',
						name: '_cooldownBlocks',
						type: 'uint256',
					},
				],
				name: 'setLiquidityControl',
				outputs: [],
				stateMutability: 'nonpayable',
				type: 'function',
			},
			{
				inputs: [
					{
						internalType: 'address',
						name: '_lpPair',
						type: 'address',
					},
					{
						internalType: 'bool',
						name: '_status',
						type: 'bool',
					},
				],
				name: 'setLpPair',
				outputs: [],
				stateMutability: 'nonpayable',
				type: 'function',
			},
			{
				inputs: [
					{
						internalType: 'uint256',
						name: '_maxPerWallet',
						type: 'uint256',
					},
				],
				name: 'setMaxPerWallet',
				outputs: [],
				stateMutability: 'nonpayable',
				type: 'function',
			},
			{
				inputs: [
					{
						internalType: 'address',
						name: '_rewardPool',
						type: 'address',
					},
					{
						internalType: 'address',
						name: '_treasury',
						type: 'address',
					},
				],
				name: 'setTaxCollectors',
				outputs: [],
				stateMutability: 'nonpayable',
				type: 'function',
			},
			{
				inputs: [
					{
						internalType: 'uint256',
						name: '_transferTax',
						type: 'uint256',
					},
					{
						internalType: 'uint256',
						name: '_salesTax',
						type: 'uint256',
					},
					{
						internalType: 'uint256',
						name: '_nodeSalesTax',
						type: 'uint256',
					},
				],
				name: 'setTaxes',
				outputs: [],
				stateMutability: 'nonpayable',
				type: 'function',
			},
			{
				inputs: [
					{
						internalType: 'address',
						name: '_usdce',
						type: 'address',
					},
					{
						internalType: 'address',
						name: '_lpRouter',
						type: 'address',
					},
				],
				name: 'setUsdceAndRouter',
				outputs: [],
				stateMutability: 'nonpayable',
				type: 'function',
			},
			{
				inputs: [
					{
						internalType: 'address[]',
						name: 'users',
						type: 'address[]',
					},
					{
						internalType: 'bool',
						name: 'status',
						type: 'bool',
					},
				],
				name: 'setWhitelistMultiple',
				outputs: [],
				stateMutability: 'nonpayable',
				type: 'function',
			},
			{
				inputs: [
					{
						internalType: 'address[]',
						name: 'users',
						type: 'address[]',
					},
					{
						internalType: 'bool',
						name: 'status',
						type: 'bool',
					},
				],
				name: 'setWhitelistTaxMultiple',
				outputs: [],
				stateMutability: 'nonpayable',
				type: 'function',
			},
			{
				inputs: [],
				name: 'symbol',
				outputs: [
					{
						internalType: 'string',
						name: '',
						type: 'string',
					},
				],
				stateMutability: 'view',
				type: 'function',
			},
			{
				inputs: [],
				name: 'totalSupply',
				outputs: [
					{
						internalType: 'uint256',
						name: '',
						type: 'uint256',
					},
				],
				stateMutability: 'view',
				type: 'function',
			},
			{
				inputs: [
					{
						internalType: 'address',
						name: 'to',
						type: 'address',
					},
					{
						internalType: 'uint256',
						name: 'amount',
						type: 'uint256',
					},
				],
				name: 'transfer',
				outputs: [
					{
						internalType: 'bool',
						name: '',
						type: 'bool',
					},
				],
				stateMutability: 'nonpayable',
				type: 'function',
			},
			{
				inputs: [
					{
						internalType: 'address',
						name: 'from',
						type: 'address',
					},
					{
						internalType: 'address',
						name: 'to',
						type: 'address',
					},
					{
						internalType: 'uint256',
						name: 'amount',
						type: 'uint256',
					},
				],
				name: 'transferFrom',
				outputs: [
					{
						internalType: 'bool',
						name: '',
						type: 'bool',
					},
				],
				stateMutability: 'nonpayable',
				type: 'function',
			},
			{
				inputs: [
					{
						internalType: 'address',
						name: 'newOwner',
						type: 'address',
					},
				],
				name: 'transferOwnership',
				outputs: [],
				stateMutability: 'nonpayable',
				type: 'function',
			},
			{
				inputs: [],
				name: 'transferTax',
				outputs: [
					{
						internalType: 'uint256',
						name: '',
						type: 'uint256',
					},
				],
				stateMutability: 'view',
				type: 'function',
			},
			{
				inputs: [],
				name: 'treasury',
				outputs: [
					{
						internalType: 'address',
						name: '',
						type: 'address',
					},
				],
				stateMutability: 'view',
				type: 'function',
			},
			{
				inputs: [],
				name: 'unpause',
				outputs: [],
				stateMutability: 'nonpayable',
				type: 'function',
			},
			{
				inputs: [],
				name: 'usdce',
				outputs: [
					{
						internalType: 'address',
						name: '',
						type: 'address',
					},
				],
				stateMutability: 'view',
				type: 'function',
			},
			{
				inputs: [
					{
						internalType: 'address',
						name: '',
						type: 'address',
					},
				],
				name: 'whitelisted',
				outputs: [
					{
						internalType: 'bool',
						name: '',
						type: 'bool',
					},
				],
				stateMutability: 'view',
				type: 'function',
			},
			{
				inputs: [
					{
						internalType: 'address',
						name: '',
						type: 'address',
					},
				],
				name: 'whitelistedTax',
				outputs: [
					{
						internalType: 'bool',
						name: '',
						type: 'bool',
					},
				],
				stateMutability: 'view',
				type: 'function',
			},
			{
				inputs: [
					{
						internalType: 'address',
						name: 'wallet',
						type: 'address',
					},
				],
				name: 'withdrawFromBlacklisted',
				outputs: [],
				stateMutability: 'nonpayable',
				type: 'function',
			},
		],
	},
	LAVAv2: {
		address: '0x7c105c37A622EB8586BEAef215d452b3f7Dc9A39',
		ABI: [
			{
				anonymous: false,
				inputs: [
					{
						indexed: true,
						internalType: 'address',
						name: 'owner',
						type: 'address',
					},
					{
						indexed: true,
						internalType: 'address',
						name: 'spender',
						type: 'address',
					},
					{
						indexed: false,
						internalType: 'uint256',
						name: 'value',
						type: 'uint256',
					},
				],
				name: 'Approval',
				type: 'event',
			},
			{
				anonymous: false,
				inputs: [
					{
						indexed: true,
						internalType: 'address',
						name: 'previousOwner',
						type: 'address',
					},
					{
						indexed: true,
						internalType: 'address',
						name: 'newOwner',
						type: 'address',
					},
				],
				name: 'OwnershipTransferred',
				type: 'event',
			},
			{
				anonymous: false,
				inputs: [
					{
						indexed: false,
						internalType: 'address',
						name: 'account',
						type: 'address',
					},
				],
				name: 'Paused',
				type: 'event',
			},
			{
				anonymous: false,
				inputs: [
					{
						indexed: true,
						internalType: 'address',
						name: 'from',
						type: 'address',
					},
					{
						indexed: true,
						internalType: 'address',
						name: 'to',
						type: 'address',
					},
					{
						indexed: false,
						internalType: 'uint256',
						name: 'value',
						type: 'uint256',
					},
				],
				name: 'Transfer',
				type: 'event',
			},
			{
				anonymous: false,
				inputs: [
					{
						indexed: false,
						internalType: 'address',
						name: 'account',
						type: 'address',
					},
				],
				name: 'Unpaused',
				type: 'event',
			},
			{
				inputs: [
					{
						internalType: 'address',
						name: 'token',
						type: 'address',
					},
				],
				name: 'adminWithdraw',
				outputs: [],
				stateMutability: 'nonpayable',
				type: 'function',
			},
			{
				inputs: [
					{
						internalType: 'address',
						name: 'owner',
						type: 'address',
					},
					{
						internalType: 'address',
						name: 'spender',
						type: 'address',
					},
				],
				name: 'allowance',
				outputs: [
					{
						internalType: 'uint256',
						name: '',
						type: 'uint256',
					},
				],
				stateMutability: 'view',
				type: 'function',
			},
			{
				inputs: [
					{
						internalType: 'address',
						name: 'spender',
						type: 'address',
					},
					{
						internalType: 'uint256',
						name: 'amount',
						type: 'uint256',
					},
				],
				name: 'approve',
				outputs: [
					{
						internalType: 'bool',
						name: '',
						type: 'bool',
					},
				],
				stateMutability: 'nonpayable',
				type: 'function',
			},
			{
				inputs: [
					{
						internalType: 'address',
						name: 'account',
						type: 'address',
					},
				],
				name: 'balanceOf',
				outputs: [
					{
						internalType: 'uint256',
						name: '',
						type: 'uint256',
					},
				],
				stateMutability: 'view',
				type: 'function',
			},
			{
				inputs: [
					{
						internalType: 'address',
						name: '',
						type: 'address',
					},
				],
				name: 'blacklisted',
				outputs: [
					{
						internalType: 'uint256',
						name: '',
						type: 'uint256',
					},
				],
				stateMutability: 'view',
				type: 'function',
			},
			{
				inputs: [
					{
						internalType: 'uint256',
						name: 'amount',
						type: 'uint256',
					},
				],
				name: 'burn',
				outputs: [],
				stateMutability: 'nonpayable',
				type: 'function',
			},
			{
				inputs: [],
				name: 'decimals',
				outputs: [
					{
						internalType: 'uint8',
						name: '',
						type: 'uint8',
					},
				],
				stateMutability: 'view',
				type: 'function',
			},
			{
				inputs: [
					{
						internalType: 'address',
						name: 'spender',
						type: 'address',
					},
					{
						internalType: 'uint256',
						name: 'subtractedValue',
						type: 'uint256',
					},
				],
				name: 'decreaseAllowance',
				outputs: [
					{
						internalType: 'bool',
						name: '',
						type: 'bool',
					},
				],
				stateMutability: 'nonpayable',
				type: 'function',
			},
			{
				inputs: [
					{
						internalType: 'address',
						name: 'spender',
						type: 'address',
					},
					{
						internalType: 'uint256',
						name: 'addedValue',
						type: 'uint256',
					},
				],
				name: 'increaseAllowance',
				outputs: [
					{
						internalType: 'bool',
						name: '',
						type: 'bool',
					},
				],
				stateMutability: 'nonpayable',
				type: 'function',
			},
			{
				inputs: [
					{
						internalType: 'address',
						name: '_lavaV1',
						type: 'address',
					},
					{
						internalType: 'address',
						name: '_pLava',
						type: 'address',
					},
					{
						internalType: 'address',
						name: '_usdc',
						type: 'address',
					},
					{
						internalType: 'address',
						name: '_lpRouter',
						type: 'address',
					},
					{
						internalType: 'address',
						name: '_lavaFinance',
						type: 'address',
					},
					{
						internalType: 'address',
						name: '_treasury',
						type: 'address',
					},
				],
				name: 'initialize',
				outputs: [],
				stateMutability: 'nonpayable',
				type: 'function',
			},
			{
				inputs: [
					{
						internalType: 'address',
						name: 'user',
						type: 'address',
					},
				],
				name: 'isBlacklisted',
				outputs: [
					{
						internalType: 'bool',
						name: '',
						type: 'bool',
					},
				],
				stateMutability: 'view',
				type: 'function',
			},
			{
				inputs: [],
				name: 'isLavaToPLavaSwapActive',
				outputs: [
					{
						internalType: 'bool',
						name: '',
						type: 'bool',
					},
				],
				stateMutability: 'view',
				type: 'function',
			},
			{
				inputs: [],
				name: 'lavaFinance',
				outputs: [
					{
						internalType: 'address',
						name: '',
						type: 'address',
					},
				],
				stateMutability: 'view',
				type: 'function',
			},
			{
				inputs: [],
				name: 'lavaV1',
				outputs: [
					{
						internalType: 'contract IERC20',
						name: '',
						type: 'address',
					},
				],
				stateMutability: 'view',
				type: 'function',
			},
			{
				inputs: [
					{
						internalType: 'address',
						name: '',
						type: 'address',
					},
				],
				name: 'lpPairs',
				outputs: [
					{
						internalType: 'bool',
						name: '',
						type: 'bool',
					},
				],
				stateMutability: 'view',
				type: 'function',
			},
			{
				inputs: [],
				name: 'lpRouter',
				outputs: [
					{
						internalType: 'address',
						name: '',
						type: 'address',
					},
				],
				stateMutability: 'view',
				type: 'function',
			},
			{
				inputs: [],
				name: 'maxPerWallet',
				outputs: [
					{
						internalType: 'uint256',
						name: '',
						type: 'uint256',
					},
				],
				stateMutability: 'view',
				type: 'function',
			},
			{
				inputs: [],
				name: 'name',
				outputs: [
					{
						internalType: 'string',
						name: '',
						type: 'string',
					},
				],
				stateMutability: 'view',
				type: 'function',
			},
			{
				inputs: [],
				name: 'nodeSalesTax',
				outputs: [
					{
						internalType: 'uint256',
						name: '',
						type: 'uint256',
					},
				],
				stateMutability: 'view',
				type: 'function',
			},
			{
				inputs: [],
				name: 'owner',
				outputs: [
					{
						internalType: 'address',
						name: '',
						type: 'address',
					},
				],
				stateMutability: 'view',
				type: 'function',
			},
			{
				inputs: [],
				name: 'pLava',
				outputs: [
					{
						internalType: 'address',
						name: '',
						type: 'address',
					},
				],
				stateMutability: 'view',
				type: 'function',
			},
			{
				inputs: [],
				name: 'pause',
				outputs: [],
				stateMutability: 'nonpayable',
				type: 'function',
			},
			{
				inputs: [],
				name: 'paused',
				outputs: [
					{
						internalType: 'bool',
						name: '',
						type: 'bool',
					},
				],
				stateMutability: 'view',
				type: 'function',
			},
			{
				inputs: [],
				name: 'renounceOwnership',
				outputs: [],
				stateMutability: 'nonpayable',
				type: 'function',
			},
			{
				inputs: [],
				name: 'rewardPool',
				outputs: [
					{
						internalType: 'address',
						name: '',
						type: 'address',
					},
				],
				stateMutability: 'view',
				type: 'function',
			},
			{
				inputs: [],
				name: 'salesTax',
				outputs: [
					{
						internalType: 'uint256',
						name: '',
						type: 'uint256',
					},
				],
				stateMutability: 'view',
				type: 'function',
			},
			{
				inputs: [
					{
						internalType: 'address[]',
						name: 'users',
						type: 'address[]',
					},
					{
						internalType: 'bool',
						name: 'status',
						type: 'bool',
					},
				],
				name: 'setBlacklistMultiple',
				outputs: [],
				stateMutability: 'nonpayable',
				type: 'function',
			},
			{
				inputs: [
					{
						internalType: 'bool',
						name: '_isLavaToPLavaSwapActive',
						type: 'bool',
					},
				],
				name: 'setIsLavaToPLavaSwapActive',
				outputs: [],
				stateMutability: 'nonpayable',
				type: 'function',
			},
			{
				inputs: [
					{
						internalType: 'address',
						name: '_lavaFinance',
						type: 'address',
					},
				],
				name: 'setLavaFinance',
				outputs: [],
				stateMutability: 'nonpayable',
				type: 'function',
			},
			{
				inputs: [
					{
						internalType: 'address',
						name: '_lpPair',
						type: 'address',
					},
					{
						internalType: 'bool',
						name: '_status',
						type: 'bool',
					},
				],
				name: 'setLpPair',
				outputs: [],
				stateMutability: 'nonpayable',
				type: 'function',
			},
			{
				inputs: [
					{
						internalType: 'uint256',
						name: '_maxPerWallet',
						type: 'uint256',
					},
				],
				name: 'setMaxPerWallet',
				outputs: [],
				stateMutability: 'nonpayable',
				type: 'function',
			},
			{
				inputs: [
					{
						internalType: 'address',
						name: '_rewardPool',
						type: 'address',
					},
					{
						internalType: 'address',
						name: '_treasury',
						type: 'address',
					},
				],
				name: 'setTaxCollectors',
				outputs: [],
				stateMutability: 'nonpayable',
				type: 'function',
			},
			{
				inputs: [
					{
						internalType: 'uint256',
						name: '_transferTax',
						type: 'uint256',
					},
					{
						internalType: 'uint256',
						name: '_salesTax',
						type: 'uint256',
					},
					{
						internalType: 'uint256',
						name: '_nodeSalesTax',
						type: 'uint256',
					},
				],
				name: 'setTaxes',
				outputs: [],
				stateMutability: 'nonpayable',
				type: 'function',
			},
			{
				inputs: [
					{
						internalType: 'address',
						name: '_usdc',
						type: 'address',
					},
					{
						internalType: 'address',
						name: '_lpRouter',
						type: 'address',
					},
				],
				name: 'setUsdceAndRouter',
				outputs: [],
				stateMutability: 'nonpayable',
				type: 'function',
			},
			{
				inputs: [
					{
						internalType: 'address[]',
						name: 'users',
						type: 'address[]',
					},
					{
						internalType: 'bool',
						name: 'status',
						type: 'bool',
					},
				],
				name: 'setWhitelistMultiple',
				outputs: [],
				stateMutability: 'nonpayable',
				type: 'function',
			},
			{
				inputs: [
					{
						internalType: 'address[]',
						name: 'users',
						type: 'address[]',
					},
					{
						internalType: 'bool',
						name: 'status',
						type: 'bool',
					},
				],
				name: 'setWhitelistTaxMultiple',
				outputs: [],
				stateMutability: 'nonpayable',
				type: 'function',
			},
			{
				inputs: [
					{
						internalType: 'address',
						name: 'newToken',
						type: 'address',
					},
				],
				name: 'swapLavaV1',
				outputs: [],
				stateMutability: 'nonpayable',
				type: 'function',
			},
			{
				inputs: [
					{
						internalType: 'uint256',
						name: 'amount',
						type: 'uint256',
					},
				],
				name: 'swapLavaV2ForPLava',
				outputs: [],
				stateMutability: 'nonpayable',
				type: 'function',
			},
			{
				inputs: [],
				name: 'symbol',
				outputs: [
					{
						internalType: 'string',
						name: '',
						type: 'string',
					},
				],
				stateMutability: 'view',
				type: 'function',
			},
			{
				inputs: [],
				name: 'totalSupply',
				outputs: [
					{
						internalType: 'uint256',
						name: '',
						type: 'uint256',
					},
				],
				stateMutability: 'view',
				type: 'function',
			},
			{
				inputs: [
					{
						internalType: 'address',
						name: 'to',
						type: 'address',
					},
					{
						internalType: 'uint256',
						name: 'amount',
						type: 'uint256',
					},
				],
				name: 'transfer',
				outputs: [
					{
						internalType: 'bool',
						name: '',
						type: 'bool',
					},
				],
				stateMutability: 'nonpayable',
				type: 'function',
			},
			{
				inputs: [
					{
						internalType: 'address',
						name: 'from',
						type: 'address',
					},
					{
						internalType: 'address',
						name: 'to',
						type: 'address',
					},
					{
						internalType: 'uint256',
						name: 'amount',
						type: 'uint256',
					},
				],
				name: 'transferFrom',
				outputs: [
					{
						internalType: 'bool',
						name: '',
						type: 'bool',
					},
				],
				stateMutability: 'nonpayable',
				type: 'function',
			},
			{
				inputs: [
					{
						internalType: 'address',
						name: 'newOwner',
						type: 'address',
					},
				],
				name: 'transferOwnership',
				outputs: [],
				stateMutability: 'nonpayable',
				type: 'function',
			},
			{
				inputs: [],
				name: 'transferTax',
				outputs: [
					{
						internalType: 'uint256',
						name: '',
						type: 'uint256',
					},
				],
				stateMutability: 'view',
				type: 'function',
			},
			{
				inputs: [],
				name: 'treasury',
				outputs: [
					{
						internalType: 'address',
						name: '',
						type: 'address',
					},
				],
				stateMutability: 'view',
				type: 'function',
			},
			{
				inputs: [],
				name: 'unpause',
				outputs: [],
				stateMutability: 'nonpayable',
				type: 'function',
			},
			{
				inputs: [],
				name: 'usdc',
				outputs: [
					{
						internalType: 'address',
						name: '',
						type: 'address',
					},
				],
				stateMutability: 'view',
				type: 'function',
			},
			{
				inputs: [
					{
						internalType: 'address',
						name: '',
						type: 'address',
					},
				],
				name: 'whitelisted',
				outputs: [
					{
						internalType: 'bool',
						name: '',
						type: 'bool',
					},
				],
				stateMutability: 'view',
				type: 'function',
			},
			{
				inputs: [
					{
						internalType: 'address',
						name: '',
						type: 'address',
					},
				],
				name: 'whitelistedTax',
				outputs: [
					{
						internalType: 'bool',
						name: '',
						type: 'bool',
					},
				],
				stateMutability: 'view',
				type: 'function',
			},
		],
	},
	LavaFinance: {
		address: '0xDe7E9fd01018C59DEB46bC36316da555Eb889a27',
		ABI: [
			{
				anonymous: false,
				inputs: [
					{
						indexed: true,
						internalType: 'address',
						name: 'owner',
						type: 'address',
					},
					{
						indexed: true,
						internalType: 'address',
						name: 'operator',
						type: 'address',
					},
					{
						indexed: false,
						internalType: 'bool',
						name: 'approved',
						type: 'bool',
					},
				],
				name: 'ApprovalForAll',
				type: 'event',
			},
			{
				anonymous: false,
				inputs: [
					{
						indexed: true,
						internalType: 'address',
						name: 'nftAddress',
						type: 'address',
					},
					{
						indexed: true,
						internalType: 'bool',
						name: 'isActive',
						type: 'bool',
					},
				],
				name: 'BoosterNFTUpdated',
				type: 'event',
			},
			{
				anonymous: false,
				inputs: [
					{
						indexed: false,
						internalType: 'uint256',
						name: 'cooldown',
						type: 'uint256',
					},
				],
				name: 'ClaimCooldownUpdated',
				type: 'event',
			},
			{
				anonymous: false,
				inputs: [
					{
						indexed: false,
						internalType: 'uint256',
						name: 'compoundWeight',
						type: 'uint256',
					},
				],
				name: 'CompoundClaimWeightUpdated',
				type: 'event',
			},
			{
				anonymous: false,
				inputs: [
					{
						indexed: true,
						internalType: 'address',
						name: 'nftAddress',
						type: 'address',
					},
				],
				name: 'FusionNFTUpdated',
				type: 'event',
			},
			{
				anonymous: false,
				inputs: [
					{
						indexed: false,
						internalType: 'uint256',
						name: 'fees',
						type: 'uint256',
					},
					{
						indexed: true,
						internalType: 'bool',
						name: 'isActive',
						type: 'bool',
					},
				],
				name: 'FusionParametersUpdated',
				type: 'event',
			},
			{
				anonymous: false,
				inputs: [
					{
						indexed: false,
						internalType: 'uint256',
						name: 'maxInterval',
						type: 'uint256',
					},
				],
				name: 'MaxClaimIntervalUpdated',
				type: 'event',
			},
			{
				anonymous: false,
				inputs: [
					{
						indexed: false,
						internalType: 'uint256',
						name: 'amount',
						type: 'uint256',
					},
				],
				name: 'MaxNodeLavaUpdated',
				type: 'event',
			},
			{
				anonymous: false,
				inputs: [
					{
						indexed: true,
						internalType: 'address',
						name: 'user',
						type: 'address',
					},
					{
						indexed: false,
						internalType: 'uint256[]',
						name: 'nodeIds',
						type: 'uint256[]',
					},
					{
						indexed: false,
						internalType: 'uint256',
						name: 'newTier',
						type: 'uint256',
					},
				],
				name: 'NodeFusion',
				type: 'event',
			},
			{
				anonymous: false,
				inputs: [
					{
						indexed: true,
						internalType: 'address',
						name: 'user',
						type: 'address',
					},
					{
						indexed: false,
						internalType: 'uint256',
						name: 'tier',
						type: 'uint256',
					},
					{
						indexed: false,
						internalType: 'uint256',
						name: 'nodeId',
						type: 'uint256',
					},
				],
				name: 'NodeMinted',
				type: 'event',
			},
			{
				anonymous: false,
				inputs: [
					{
						indexed: true,
						internalType: 'address',
						name: 'user',
						type: 'address',
					},
					{
						indexed: false,
						internalType: 'uint256',
						name: 'amount',
						type: 'uint256',
					},
				],
				name: 'NodeRewardsClaimed',
				type: 'event',
			},
			{
				anonymous: false,
				inputs: [
					{
						indexed: true,
						internalType: 'address',
						name: 'oracleAddress',
						type: 'address',
					},
				],
				name: 'OracleUpdated',
				type: 'event',
			},
			{
				anonymous: false,
				inputs: [
					{
						indexed: true,
						internalType: 'address',
						name: 'previousOwner',
						type: 'address',
					},
					{
						indexed: true,
						internalType: 'address',
						name: 'newOwner',
						type: 'address',
					},
				],
				name: 'OwnershipTransferred',
				type: 'event',
			},
			{
				anonymous: false,
				inputs: [
					{
						indexed: false,
						internalType: 'address',
						name: 'account',
						type: 'address',
					},
				],
				name: 'Paused',
				type: 'event',
			},
			{
				anonymous: false,
				inputs: [
					{
						indexed: true,
						internalType: 'address',
						name: 'bronze',
						type: 'address',
					},
					{
						indexed: true,
						internalType: 'address',
						name: 'silver',
						type: 'address',
					},
					{
						indexed: true,
						internalType: 'address',
						name: 'gold',
						type: 'address',
					},
				],
				name: 'PermanentNFTUpdated',
				type: 'event',
			},
			{
				anonymous: false,
				inputs: [
					{
						indexed: true,
						internalType: 'uint256',
						name: 'tier',
						type: 'uint256',
					},
					{
						indexed: true,
						internalType: 'uint256',
						name: 'cost',
						type: 'uint256',
					},
					{
						indexed: true,
						internalType: 'uint256',
						name: 'reward',
						type: 'uint256',
					},
				],
				name: 'TierUpdated',
				type: 'event',
			},
			{
				anonymous: false,
				inputs: [
					{
						indexed: false,
						internalType: 'address',
						name: 'account',
						type: 'address',
					},
				],
				name: 'Unpaused',
				type: 'event',
			},
			{
				inputs: [
					{
						internalType: 'uint256',
						name: '',
						type: 'uint256',
					},
					{
						internalType: 'address',
						name: '',
						type: 'address',
					},
				],
				name: 'Ratios',
				outputs: [
					{
						internalType: 'uint256',
						name: '',
						type: 'uint256',
					},
				],
				stateMutability: 'view',
				type: 'function',
			},
			{
				inputs: [
					{
						internalType: 'address',
						name: '_token',
						type: 'address',
					},
					{
						internalType: 'uint256',
						name: '_ratio',
						type: 'uint256',
					},
					{
						internalType: 'address',
						name: '_feed',
						type: 'address',
					},
				],
				name: 'addTokenMultiple',
				outputs: [],
				stateMutability: 'nonpayable',
				type: 'function',
			},
			{
				inputs: [
					{
						internalType: 'address',
						name: 'token',
						type: 'address',
					},
				],
				name: 'adminWithdraw',
				outputs: [],
				stateMutability: 'nonpayable',
				type: 'function',
			},
			{
				inputs: [
					{
						internalType: 'address payable',
						name: 'admin',
						type: 'address',
					},
				],
				name: 'adminWithdrawETH',
				outputs: [],
				stateMutability: 'nonpayable',
				type: 'function',
			},
			{
				inputs: [],
				name: 'applyRewardsMultiplierAt',
				outputs: [
					{
						internalType: 'uint256',
						name: '',
						type: 'uint256',
					},
				],
				stateMutability: 'view',
				type: 'function',
			},
			{
				inputs: [
					{
						internalType: 'address',
						name: '',
						type: 'address',
					},
				],
				name: 'boosters',
				outputs: [
					{
						internalType: 'bool',
						name: '',
						type: 'bool',
					},
				],
				stateMutability: 'view',
				type: 'function',
			},
			{
				inputs: [],
				name: 'bronzeNFT',
				outputs: [
					{
						internalType: 'contract IERC721Upgradeable',
						name: '',
						type: 'address',
					},
				],
				stateMutability: 'view',
				type: 'function',
			},
			{
				inputs: [],
				name: 'burnRatio',
				outputs: [
					{
						internalType: 'uint256',
						name: '',
						type: 'uint256',
					},
				],
				stateMutability: 'view',
				type: 'function',
			},
			{
				inputs: [
					{
						internalType: 'uint256[]',
						name: 'tokenIds',
						type: 'uint256[]',
					},
					{
						internalType: 'uint256',
						name: 'compoundPercent',
						type: 'uint256',
					},
					{
						internalType: 'address',
						name: 'booster',
						type: 'address',
					},
					{
						internalType: 'bool',
						name: 'useLavaFromWallet',
						type: 'bool',
					},
					{
						internalType: 'bool',
						name: 'usePLavaFromWallet',
						type: 'bool',
					},
					{
						internalType: 'uint256',
						name: 'mintNodeTier',
						type: 'uint256',
					},
				],
				name: 'claim',
				outputs: [],
				stateMutability: 'nonpayable',
				type: 'function',
			},
			{
				inputs: [],
				name: 'claimCooldown',
				outputs: [
					{
						internalType: 'uint256',
						name: '',
						type: 'uint256',
					},
				],
				stateMutability: 'view',
				type: 'function',
			},
			{
				inputs: [
					{
						internalType: 'uint256',
						name: '',
						type: 'uint256',
					},
				],
				name: 'claimInfo',
				outputs: [
					{
						internalType: 'uint256',
						name: 'nextUpdate',
						type: 'uint256',
					},
					{
						internalType: 'uint256',
						name: 'times',
						type: 'uint256',
					},
				],
				stateMutability: 'view',
				type: 'function',
			},
			{
				inputs: [],
				name: 'claimTaxIncrease',
				outputs: [
					{
						internalType: 'uint256',
						name: '',
						type: 'uint256',
					},
				],
				stateMutability: 'view',
				type: 'function',
			},
			{
				inputs: [],
				name: 'claimTaxToSell',
				outputs: [
					{
						internalType: 'uint256',
						name: '',
						type: 'uint256',
					},
				],
				stateMutability: 'view',
				type: 'function',
			},
			{
				inputs: [
					{
						internalType: 'address',
						name: '',
						type: 'address',
					},
				],
				name: 'claimedAmount',
				outputs: [
					{
						internalType: 'uint256',
						name: '',
						type: 'uint256',
					},
				],
				stateMutability: 'view',
				type: 'function',
			},
			{
				inputs: [],
				name: 'compoundClaimWeight',
				outputs: [
					{
						internalType: 'uint256',
						name: '',
						type: 'uint256',
					},
				],
				stateMutability: 'view',
				type: 'function',
			},
			{
				inputs: [],
				name: 'decayedFusionWeight',
				outputs: [
					{
						internalType: 'uint256',
						name: '',
						type: 'uint256',
					},
				],
				stateMutability: 'view',
				type: 'function',
			},
			{
				inputs: [],
				name: 'decayedRewardFactor',
				outputs: [
					{
						internalType: 'uint256',
						name: '',
						type: 'uint256',
					},
				],
				stateMutability: 'view',
				type: 'function',
			},
			{
				inputs: [],
				name: 'fusionActive',
				outputs: [
					{
						internalType: 'bool',
						name: '',
						type: 'bool',
					},
				],
				stateMutability: 'view',
				type: 'function',
			},
			{
				inputs: [],
				name: 'fusionFees',
				outputs: [
					{
						internalType: 'uint256',
						name: '',
						type: 'uint256',
					},
				],
				stateMutability: 'view',
				type: 'function',
			},
			{
				inputs: [],
				name: 'fusionNFT',
				outputs: [
					{
						internalType: 'address',
						name: '',
						type: 'address',
					},
				],
				stateMutability: 'view',
				type: 'function',
			},
			{
				inputs: [],
				name: 'gLavaToken',
				outputs: [
					{
						internalType: 'address',
						name: '',
						type: 'address',
					},
				],
				stateMutability: 'view',
				type: 'function',
			},
			{
				inputs: [
					{
						internalType: 'address',
						name: 'user',
						type: 'address',
					},
					{
						internalType: 'address',
						name: 'booster',
						type: 'address',
					},
				],
				name: 'getBoosterBonus',
				outputs: [
					{
						internalType: 'uint256',
						name: 'bonus',
						type: 'uint256',
					},
					{
						internalType: 'bool',
						name: 'boosterUsed',
						type: 'bool',
					},
				],
				stateMutability: 'view',
				type: 'function',
			},
			{
				inputs: [
					{
						internalType: 'address',
						name: 'user',
						type: 'address',
					},
					{
						internalType: 'uint256[]',
						name: 'tokenIds',
						type: 'uint256[]',
					},
					{
						internalType: 'uint256',
						name: 'compoundPercent',
						type: 'uint256',
					},
					{
						internalType: 'address',
						name: 'booster',
						type: 'address',
					},
					{
						internalType: 'bool',
						name: 'includePendingRewards',
						type: 'bool',
					},
				],
				name: 'getClaimAmount',
				outputs: [
					{
						internalType: 'uint256',
						name: 'claimAmount',
						type: 'uint256',
					},
					{
						internalType: 'uint256',
						name: 'compoundAmount',
						type: 'uint256',
					},
					{
						internalType: 'uint256',
						name: 'pLavaAmount',
						type: 'uint256',
					},
					{
						internalType: 'uint256',
						name: 'claimUsdcValue',
						type: 'uint256',
					},
					{
						internalType: 'uint256',
						name: 'lavaAmountToSell',
						type: 'uint256',
					},
				],
				stateMutability: 'view',
				type: 'function',
			},
			{
				inputs: [
					{
						internalType: 'uint256',
						name: 'tierId',
						type: 'uint256',
					},
				],
				name: 'getMaintenanceFeesForTier',
				outputs: [
					{
						internalType: 'uint256',
						name: 'maintenanceFee',
						type: 'uint256',
					},
				],
				stateMutability: 'view',
				type: 'function',
			},
			{
				inputs: [
					{
						internalType: 'uint256',
						name: 'nodeId',
						type: 'uint256',
					},
				],
				name: 'getNodeData',
				outputs: [
					{
						components: [
							{
								internalType: 'string',
								name: 'name',
								type: 'string',
							},
							{
								internalType: 'uint256',
								name: 'tier',
								type: 'uint256',
							},
							{
								internalType: 'uint256',
								name: 'lastClaim',
								type: 'uint256',
							},
							{
								internalType: 'uint256',
								name: 'mintPrice',
								type: 'uint256',
							},
							{
								internalType: 'uint256',
								name: 'amountClaimed',
								type: 'uint256',
							},
							{
								internalType: 'uint256',
								name: 'paymentExpiry',
								type: 'uint256',
							},
							{
								internalType: 'uint256',
								name: 'creationTime',
								type: 'uint256',
							},
							{
								internalType: 'bool',
								name: 'isCompounded',
								type: 'bool',
							},
						],
						internalType: 'struct LavaFinance.NodeData',
						name: '',
						type: 'tuple',
					},
				],
				stateMutability: 'view',
				type: 'function',
			},
			{
				inputs: [
					{
						internalType: 'address',
						name: 'token',
						type: 'address',
					},
					{
						internalType: 'uint256',
						name: 'nodePrice',
						type: 'uint256',
					},
				],
				name: 'getNodePriceInToken',
				outputs: [
					{
						internalType: 'uint256',
						name: '',
						type: 'uint256',
					},
				],
				stateMutability: 'view',
				type: 'function',
			},
			{
				inputs: [
					{
						internalType: 'address',
						name: 'user',
						type: 'address',
					},
					{
						internalType: 'uint256',
						name: 'tokenId',
						type: 'uint256',
					},
					{
						internalType: 'bool',
						name: 'useCooldown',
						type: 'bool',
					},
					{
						internalType: 'uint256',
						name: 'bonus',
						type: 'uint256',
					},
				],
				name: 'getTokenClaim',
				outputs: [
					{
						components: [
							{
								internalType: 'uint256',
								name: 'amount',
								type: 'uint256',
							},
							{
								internalType: 'uint256',
								name: 'pLavaAmount',
								type: 'uint256',
							},
							{
								internalType: 'uint256',
								name: 'claimTimestamp',
								type: 'uint256',
							},
						],
						internalType: 'struct LavaFinance.NodeClaim',
						name: 'nodeClaim',
						type: 'tuple',
					},
				],
				stateMutability: 'view',
				type: 'function',
			},
			{
				inputs: [
					{
						internalType: 'address',
						name: 'user',
						type: 'address',
					},
				],
				name: 'getUserNodes',
				outputs: [
					{
						internalType: 'uint256[]',
						name: 'nodeIds',
						type: 'uint256[]',
					},
				],
				stateMutability: 'view',
				type: 'function',
			},
			{
				inputs: [],
				name: 'goldNFT',
				outputs: [
					{
						internalType: 'contract IERC721Upgradeable',
						name: '',
						type: 'address',
					},
				],
				stateMutability: 'view',
				type: 'function',
			},
			{
				inputs: [
					{
						internalType: 'address',
						name: '_oracle',
						type: 'address',
					},
					{
						internalType: 'address',
						name: '_lavaToken',
						type: 'address',
					},
					{
						internalType: 'address',
						name: '_pLavaToken',
						type: 'address',
					},
					{
						internalType: 'address',
						name: '_gLavaToken',
						type: 'address',
					},
					{
						internalType: 'address',
						name: '_usdce',
						type: 'address',
					},
					{
						internalType: 'address',
						name: '_usdceFeed',
						type: 'address',
					},
					{
						internalType: 'address',
						name: '_lpWallet',
						type: 'address',
					},
					{
						internalType: 'address',
						name: '_treasury',
						type: 'address',
					},
				],
				name: 'initialize',
				outputs: [],
				stateMutability: 'nonpayable',
				type: 'function',
			},
			{
				inputs: [
					{
						internalType: 'address',
						name: '',
						type: 'address',
					},
				],
				name: 'investedAmount',
				outputs: [
					{
						internalType: 'uint256',
						name: '',
						type: 'uint256',
					},
				],
				stateMutability: 'view',
				type: 'function',
			},
			{
				inputs: [
					{
						internalType: 'address',
						name: 'owner',
						type: 'address',
					},
					{
						internalType: 'address',
						name: 'operator',
						type: 'address',
					},
				],
				name: 'isApprovedForAll',
				outputs: [
					{
						internalType: 'bool',
						name: '',
						type: 'bool',
					},
				],
				stateMutability: 'view',
				type: 'function',
			},
			{
				inputs: [
					{
						internalType: 'address',
						name: '',
						type: 'address',
					},
				],
				name: 'lastMicroClaim',
				outputs: [
					{
						internalType: 'uint256',
						name: '',
						type: 'uint256',
					},
				],
				stateMutability: 'view',
				type: 'function',
			},
			{
				inputs: [],
				name: 'lavaToken',
				outputs: [
					{
						internalType: 'address',
						name: '',
						type: 'address',
					},
				],
				stateMutability: 'view',
				type: 'function',
			},
			{
				inputs: [],
				name: 'liquidityManager',
				outputs: [
					{
						internalType: 'contract ILiquidityManager',
						name: '',
						type: 'address',
					},
				],
				stateMutability: 'view',
				type: 'function',
			},
			{
				inputs: [],
				name: 'lpPairAddress',
				outputs: [
					{
						internalType: 'address',
						name: '',
						type: 'address',
					},
				],
				stateMutability: 'view',
				type: 'function',
			},
			{
				inputs: [],
				name: 'lpPairRatio',
				outputs: [
					{
						internalType: 'uint256',
						name: '',
						type: 'uint256',
					},
				],
				stateMutability: 'view',
				type: 'function',
			},
			{
				inputs: [],
				name: 'lpRatio',
				outputs: [
					{
						internalType: 'uint256',
						name: '',
						type: 'uint256',
					},
				],
				stateMutability: 'view',
				type: 'function',
			},
			{
				inputs: [],
				name: 'lpWallet',
				outputs: [
					{
						internalType: 'address',
						name: '',
						type: 'address',
					},
				],
				stateMutability: 'view',
				type: 'function',
			},
			{
				inputs: [],
				name: 'maxClaimInterval',
				outputs: [
					{
						internalType: 'uint256',
						name: '',
						type: 'uint256',
					},
				],
				stateMutability: 'view',
				type: 'function',
			},
			{
				inputs: [],
				name: 'maxNodeLavaAllowed',
				outputs: [
					{
						internalType: 'uint256',
						name: '',
						type: 'uint256',
					},
				],
				stateMutability: 'view',
				type: 'function',
			},
			{
				inputs: [
					{
						internalType: 'address',
						name: '',
						type: 'address',
					},
				],
				name: 'microNodes',
				outputs: [
					{
						internalType: 'uint256',
						name: '',
						type: 'uint256',
					},
				],
				stateMutability: 'view',
				type: 'function',
			},
			{
				inputs: [],
				name: 'microReward',
				outputs: [
					{
						internalType: 'uint256',
						name: '',
						type: 'uint256',
					},
				],
				stateMutability: 'view',
				type: 'function',
			},
			{
				inputs: [
					{
						internalType: 'address',
						name: 'wallet',
						type: 'address',
					},
				],
				name: 'migrateRoiDataFor',
				outputs: [],
				stateMutability: 'nonpayable',
				type: 'function',
			},
			{
				inputs: [
					{
						internalType: 'uint256',
						name: 'tier',
						type: 'uint256',
					},
					{
						internalType: 'address',
						name: 'token',
						type: 'address',
					},
					{
						internalType: 'uint256',
						name: 'numNodes',
						type: 'uint256',
					},
					{
						internalType: 'string',
						name: 'name',
						type: 'string',
					},
				],
				name: 'mint',
				outputs: [
					{
						internalType: 'uint256',
						name: 'cost',
						type: 'uint256',
					},
				],
				stateMutability: 'nonpayable',
				type: 'function',
			},
			{
				inputs: [],
				name: 'nextMinted',
				outputs: [
					{
						internalType: 'uint256',
						name: '',
						type: 'uint256',
					},
				],
				stateMutability: 'view',
				type: 'function',
			},
			{
				inputs: [
					{
						internalType: 'uint256',
						name: '',
						type: 'uint256',
					},
				],
				name: 'nodeData',
				outputs: [
					{
						internalType: 'string',
						name: 'name',
						type: 'string',
					},
					{
						internalType: 'uint256',
						name: 'tier',
						type: 'uint256',
					},
					{
						internalType: 'uint256',
						name: 'lastClaim',
						type: 'uint256',
					},
					{
						internalType: 'uint256',
						name: 'mintPrice',
						type: 'uint256',
					},
					{
						internalType: 'uint256',
						name: 'amountClaimed',
						type: 'uint256',
					},
					{
						internalType: 'uint256',
						name: 'paymentExpiry',
						type: 'uint256',
					},
					{
						internalType: 'uint256',
						name: 'creationTime',
						type: 'uint256',
					},
					{
						internalType: 'bool',
						name: 'isCompounded',
						type: 'bool',
					},
				],
				stateMutability: 'view',
				type: 'function',
			},
			{
				inputs: [],
				name: 'oracle',
				outputs: [
					{
						internalType: 'contract IOracle',
						name: '',
						type: 'address',
					},
				],
				stateMutability: 'view',
				type: 'function',
			},
			{
				inputs: [],
				name: 'owner',
				outputs: [
					{
						internalType: 'address',
						name: '',
						type: 'address',
					},
				],
				stateMutability: 'view',
				type: 'function',
			},
			{
				inputs: [
					{
						internalType: 'uint256',
						name: 'tokenId',
						type: 'uint256',
					},
				],
				name: 'ownerOf',
				outputs: [
					{
						internalType: 'address',
						name: '',
						type: 'address',
					},
				],
				stateMutability: 'view',
				type: 'function',
			},
			{
				inputs: [],
				name: 'pLavaPrice',
				outputs: [
					{
						internalType: 'uint256',
						name: '',
						type: 'uint256',
					},
				],
				stateMutability: 'view',
				type: 'function',
			},
			{
				inputs: [],
				name: 'pLavaRewardsMultiplier',
				outputs: [
					{
						internalType: 'uint256',
						name: '',
						type: 'uint256',
					},
				],
				stateMutability: 'view',
				type: 'function',
			},
			{
				inputs: [],
				name: 'pLavaToken',
				outputs: [
					{
						internalType: 'address',
						name: '',
						type: 'address',
					},
				],
				stateMutability: 'view',
				type: 'function',
			},
			{
				inputs: [],
				name: 'pause',
				outputs: [],
				stateMutability: 'nonpayable',
				type: 'function',
			},
			{
				inputs: [],
				name: 'paused',
				outputs: [
					{
						internalType: 'bool',
						name: '',
						type: 'bool',
					},
				],
				stateMutability: 'view',
				type: 'function',
			},
			{
				inputs: [
					{
						internalType: 'uint256[]',
						name: 'tokenIds',
						type: 'uint256[]',
					},
					{
						internalType: 'uint256[]',
						name: 'numMonths',
						type: 'uint256[]',
					},
				],
				name: 'payMaintenanceFees',
				outputs: [
					{
						internalType: 'uint256',
						name: 'amount',
						type: 'uint256',
					},
				],
				stateMutability: 'nonpayable',
				type: 'function',
			},
			{
				inputs: [
					{
						internalType: 'address',
						name: '',
						type: 'address',
					},
				],
				name: 'pendingMicroRewards',
				outputs: [
					{
						internalType: 'uint256',
						name: '',
						type: 'uint256',
					},
				],
				stateMutability: 'view',
				type: 'function',
			},
			{
				inputs: [
					{
						internalType: 'address',
						name: '',
						type: 'address',
					},
				],
				name: 'pendingRewards',
				outputs: [
					{
						internalType: 'uint256',
						name: '',
						type: 'uint256',
					},
				],
				stateMutability: 'view',
				type: 'function',
			},
			{
				inputs: [],
				name: 'renounceOwnership',
				outputs: [],
				stateMutability: 'nonpayable',
				type: 'function',
			},
			{
				inputs: [],
				name: 'rewardsMultiplier',
				outputs: [
					{
						internalType: 'uint256',
						name: '',
						type: 'uint256',
					},
				],
				stateMutability: 'view',
				type: 'function',
			},
			{
				inputs: [
					{
						internalType: 'address',
						name: 'operator',
						type: 'address',
					},
					{
						internalType: 'bool',
						name: 'approved',
						type: 'bool',
					},
				],
				name: 'setApprovalForAll',
				outputs: [],
				stateMutability: 'nonpayable',
				type: 'function',
			},
			{
				inputs: [
					{
						internalType: 'address',
						name: 'nftAddress',
						type: 'address',
					},
					{
						internalType: 'bool',
						name: 'status',
						type: 'bool',
					},
				],
				name: 'setBoosterNFT',
				outputs: [],
				stateMutability: 'nonpayable',
				type: 'function',
			},
			{
				inputs: [
					{
						internalType: 'uint256',
						name: '_claimTax',
						type: 'uint256',
					},
					{
						internalType: 'uint256',
						name: '_claimTaxToSell',
						type: 'uint256',
					},
				],
				name: 'setClaimTax',
				outputs: [],
				stateMutability: 'nonpayable',
				type: 'function',
			},
			{
				inputs: [
					{
						internalType: 'uint256',
						name: '_compoundClaimWeight',
						type: 'uint256',
					},
				],
				name: 'setCompoundClaimWeight',
				outputs: [],
				stateMutability: 'nonpayable',
				type: 'function',
			},
			{
				inputs: [
					{
						internalType: 'uint256[]',
						name: 'tokenIds',
						type: 'uint256[]',
					},
					{
						internalType: 'bool',
						name: '_isCompounded',
						type: 'bool',
					},
				],
				name: 'setIsNodeCompounded',
				outputs: [],
				stateMutability: 'nonpayable',
				type: 'function',
			},
			{
				inputs: [
					{
						internalType: 'uint256',
						name: '_lpRatio',
						type: 'uint256',
					},
					{
						internalType: 'uint256',
						name: '_burnRatio',
						type: 'uint256',
					},
				],
				name: 'setLPAndBurnRatio',
				outputs: [],
				stateMutability: 'nonpayable',
				type: 'function',
			},
			{
				inputs: [
					{
						internalType: 'address',
						name: '_pair',
						type: 'address',
					},
					{
						internalType: 'uint256',
						name: '_ratio',
						type: 'uint256',
					},
				],
				name: 'setLPToken',
				outputs: [],
				stateMutability: 'nonpayable',
				type: 'function',
			},
			{
				inputs: [
					{
						internalType: 'address',
						name: '_lpRouter',
						type: 'address',
					},
				],
				name: 'setLpRouter',
				outputs: [],
				stateMutability: 'nonpayable',
				type: 'function',
			},
			{
				inputs: [
					{
						internalType: 'uint256',
						name: '_maxNodeLavaAllowed',
						type: 'uint256',
					},
				],
				name: 'setMaxLava',
				outputs: [],
				stateMutability: 'nonpayable',
				type: 'function',
			},
			{
				inputs: [
					{
						internalType: 'uint256',
						name: 'tokenId',
						type: 'uint256',
					},
					{
						internalType: 'string',
						name: 'name',
						type: 'string',
					},
				],
				name: 'setNodeName',
				outputs: [],
				stateMutability: 'nonpayable',
				type: 'function',
			},
			{
				inputs: [
					{
						internalType: 'address',
						name: 'user',
						type: 'address',
					},
					{
						internalType: 'uint256',
						name: 'amount',
						type: 'uint256',
					},
				],
				name: 'setPendingRewards',
				outputs: [],
				stateMutability: 'nonpayable',
				type: 'function',
			},
			{
				inputs: [
					{
						internalType: 'address',
						name: 'wallet',
						type: 'address',
					},
					{
						internalType: 'uint256',
						name: '_investedAmount',
						type: 'uint256',
					},
					{
						internalType: 'uint256',
						name: '_claimedAmount',
						type: 'uint256',
					},
				],
				name: 'setRoiData',
				outputs: [],
				stateMutability: 'nonpayable',
				type: 'function',
			},
			{
				inputs: [
					{
						internalType: 'address',
						name: 'user',
						type: 'address',
					},
					{
						internalType: 'bool',
						name: 'status',
						type: 'bool',
					},
				],
				name: 'setTransferWhitelist',
				outputs: [],
				stateMutability: 'nonpayable',
				type: 'function',
			},
			{
				inputs: [
					{
						internalType: 'address',
						name: '_lpWallet',
						type: 'address',
					},
					{
						internalType: 'address',
						name: '_treasury',
						type: 'address',
					},
				],
				name: 'setWallets',
				outputs: [],
				stateMutability: 'nonpayable',
				type: 'function',
			},
			{
				inputs: [],
				name: 'silverNFT',
				outputs: [
					{
						internalType: 'contract IERC721Upgradeable',
						name: '',
						type: 'address',
					},
				],
				stateMutability: 'view',
				type: 'function',
			},
			{
				inputs: [
					{
						internalType: 'uint256',
						name: '',
						type: 'uint256',
					},
				],
				name: 'tiers',
				outputs: [
					{
						internalType: 'uint256',
						name: 'cost',
						type: 'uint256',
					},
					{
						internalType: 'uint256',
						name: 'reward',
						type: 'uint256',
					},
					{
						internalType: 'uint256',
						name: 'fees',
						type: 'uint256',
					},
					{
						internalType: 'bool',
						name: 'active',
						type: 'bool',
					},
				],
				stateMutability: 'view',
				type: 'function',
			},
			{
				inputs: [
					{
						internalType: 'address',
						name: '',
						type: 'address',
					},
				],
				name: 'tokenFeeds',
				outputs: [
					{
						internalType: 'address',
						name: '',
						type: 'address',
					},
				],
				stateMutability: 'view',
				type: 'function',
			},
			{
				inputs: [
					{
						internalType: 'address',
						name: 'from',
						type: 'address',
					},
					{
						internalType: 'address',
						name: 'to',
						type: 'address',
					},
					{
						internalType: 'uint256',
						name: 'tokenId',
						type: 'uint256',
					},
				],
				name: 'transferNode',
				outputs: [],
				stateMutability: 'nonpayable',
				type: 'function',
			},
			{
				inputs: [
					{
						internalType: 'address',
						name: 'from',
						type: 'address',
					},
					{
						internalType: 'address',
						name: 'to',
						type: 'address',
					},
					{
						internalType: 'uint256',
						name: 'tokenId',
						type: 'uint256',
					},
				],
				name: 'transferNodeByOwner',
				outputs: [],
				stateMutability: 'nonpayable',
				type: 'function',
			},
			{
				inputs: [
					{
						internalType: 'address',
						name: 'newOwner',
						type: 'address',
					},
				],
				name: 'transferOwnership',
				outputs: [],
				stateMutability: 'nonpayable',
				type: 'function',
			},
			{
				inputs: [
					{
						internalType: 'address',
						name: '',
						type: 'address',
					},
				],
				name: 'transferWhitelist',
				outputs: [
					{
						internalType: 'bool',
						name: '',
						type: 'bool',
					},
				],
				stateMutability: 'view',
				type: 'function',
			},
			{
				inputs: [],
				name: 'treasury',
				outputs: [
					{
						internalType: 'address',
						name: '',
						type: 'address',
					},
				],
				stateMutability: 'view',
				type: 'function',
			},
			{
				inputs: [],
				name: 'unpause',
				outputs: [],
				stateMutability: 'nonpayable',
				type: 'function',
			},
			{
				inputs: [],
				name: 'usdce',
				outputs: [
					{
						internalType: 'address',
						name: '',
						type: 'address',
					},
				],
				stateMutability: 'view',
				type: 'function',
			},
			{
				inputs: [
					{
						internalType: 'address',
						name: '',
						type: 'address',
					},
					{
						internalType: 'uint256',
						name: '',
						type: 'uint256',
					},
				],
				name: 'userNodes',
				outputs: [
					{
						internalType: 'uint256',
						name: '',
						type: 'uint256',
					},
				],
				stateMutability: 'view',
				type: 'function',
			},
			{
				inputs: [
					{
						internalType: 'address',
						name: '_address',
						type: 'address',
					},
				],
				name: 'variableAssetPriceInUSD',
				outputs: [
					{
						internalType: 'uint256',
						name: '',
						type: 'uint256',
					},
				],
				stateMutability: 'view',
				type: 'function',
			},
			{
				inputs: [
					{
						internalType: 'address',
						name: '_wallet',
						type: 'address',
					},
				],
				name: 'walletGotROI',
				outputs: [
					{
						internalType: 'bool',
						name: '',
						type: 'bool',
					},
				],
				stateMutability: 'view',
				type: 'function',
			},
		],
	},
}
