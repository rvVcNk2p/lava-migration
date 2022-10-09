export const DependencyContracts = {
	erc20: {
		AVAX: '0xb31f66aa3c1e785363f0875a1b74e27b85fd66c7',
		USDC: '0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E',
		USDCE: '0xa7d7079b0fead91f3e65f86e8915cb59c1a4c664',
		ABI: [
			{
				constant: false,
				inputs: [
					{ internalType: 'address', name: 'spender', type: 'address' },
					{ internalType: 'uint256', name: 'subtractedValue', type: 'uint256' },
				],
				name: 'decreaseAllowance',
				outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
				payable: false,
				stateMutability: 'nonpayable',
				type: 'function',
			},
			{
				constant: true,
				inputs: [],
				name: 'name',
				outputs: [
					{
						name: '',
						type: 'string',
					},
				],
				payable: false,
				type: 'function',
			},
			{
				constant: false,
				inputs: [
					{
						name: '_spender',
						type: 'address',
					},
					{
						name: '_value',
						type: 'uint256',
					},
				],
				name: 'approve',
				outputs: [
					{
						name: 'success',
						type: 'bool',
					},
				],
				payable: false,
				type: 'function',
			},
			{
				constant: true,
				inputs: [],
				name: 'totalSupply',
				outputs: [
					{
						name: '',
						type: 'uint256',
					},
				],
				payable: false,
				type: 'function',
			},
			{
				constant: false,
				inputs: [
					{
						name: '_from',
						type: 'address',
					},
					{
						name: '_to',
						type: 'address',
					},
					{
						name: '_value',
						type: 'uint256',
					},
				],
				name: 'transferFrom',
				outputs: [
					{
						name: 'success',
						type: 'bool',
					},
				],
				payable: false,
				type: 'function',
			},
			{
				constant: true,
				inputs: [],
				name: 'decimals',
				outputs: [
					{
						name: '',
						type: 'uint256',
					},
				],
				payable: false,
				type: 'function',
			},
			{
				constant: true,
				inputs: [],
				name: 'version',
				outputs: [
					{
						name: '',
						type: 'string',
					},
				],
				payable: false,
				type: 'function',
			},
			{
				constant: true,
				inputs: [
					{
						name: '_owner',
						type: 'address',
					},
				],
				name: 'balanceOf',
				outputs: [
					{
						name: 'balance',
						type: 'uint256',
					},
				],
				payable: false,
				type: 'function',
			},
			{
				constant: true,
				inputs: [],
				name: 'symbol',
				outputs: [
					{
						name: '',
						type: 'string',
					},
				],
				payable: false,
				type: 'function',
			},
			{
				constant: false,
				inputs: [
					{
						name: '_to',
						type: 'address',
					},
					{
						name: '_value',
						type: 'uint256',
					},
				],
				name: 'transfer',
				outputs: [
					{
						name: 'success',
						type: 'bool',
					},
				],
				payable: false,
				type: 'function',
			},
			{
				constant: false,
				inputs: [
					{
						name: '_spender',
						type: 'address',
					},
					{
						name: '_value',
						type: 'uint256',
					},
					{
						name: '_extraData',
						type: 'bytes',
					},
				],
				name: 'approveAndCall',
				outputs: [
					{
						name: 'success',
						type: 'bool',
					},
				],
				payable: false,
				type: 'function',
			},
			{
				constant: true,
				inputs: [
					{
						name: '_owner',
						type: 'address',
					},
					{
						name: '_spender',
						type: 'address',
					},
				],
				name: 'allowance',
				outputs: [
					{
						name: 'remaining',
						type: 'uint256',
					},
				],
				payable: false,
				type: 'function',
			},
			{
				inputs: [
					{
						name: '_initialAmount',
						type: 'uint256',
					},
					{
						name: '_tokenName',
						type: 'string',
					},
					{
						name: '_decimalUnits',
						type: 'uint8',
					},
					{
						name: '_tokenSymbol',
						type: 'string',
					},
				],
				type: 'constructor',
			},
			{
				payable: false,
				type: 'fallback',
			},
			{
				anonymous: false,
				inputs: [
					{
						indexed: true,
						name: '_from',
						type: 'address',
					},
					{
						indexed: true,
						name: '_to',
						type: 'address',
					},
					{
						indexed: false,
						name: '_value',
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
						indexed: true,
						name: '_owner',
						type: 'address',
					},
					{
						indexed: true,
						name: '_spender',
						type: 'address',
					},
					{
						indexed: false,
						name: '_value',
						type: 'uint256',
					},
				],
				name: 'Approval',
				type: 'event',
			},
			{
				constant: false,
				inputs: [
					{ internalType: 'address', name: '_to', type: 'address' },
					{
						internalType: 'uint256',
						name: '_amount',
						type: 'uint256',
					},
				],
				name: 'mint',
				outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
				payable: false,
				stateMutability: 'nonpayable',
				type: 'function',
			},
		],
	},
}
