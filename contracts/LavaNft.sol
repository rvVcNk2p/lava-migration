// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import '@openzeppelin/contracts/utils/Strings.sol';
import '@openzeppelin/contracts/utils/Base64.sol';
import '@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol';
import '@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721EnumerableUpgradeable.sol';
import '@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol';
import '@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol';
import '@openzeppelin/contracts-upgradeable/utils/CountersUpgradeable.sol';

import 'hardhat/console.sol';

contract LavaNft is
	Initializable,
	ERC721Upgradeable,
	ERC721EnumerableUpgradeable,
	AccessControlUpgradeable
{
	using Strings for uint256;
	using CountersUpgradeable for CountersUpgradeable.Counter;

	bytes32 public constant MINTER_ROLE = keccak256('MINTER_ROLE');
	CountersUpgradeable.Counter private _tokenIdCounter;

	uint256 public constant TRADED_TIME = 1666396800; // Saturday, 22 October 2022 00:00:00

	string private constant BASE_IPFS_URL =
		'https://currated-labs.infura-ipfs.io/ipfs/'; // TODO: Change ipfs base url
	string private constant BASE_IMG_IPFS_CID =
		'QmaYdi8vzDGqkU81j2dQpCyrSTiQnVybCkRGt4uT6hCG9y'; // TODO: Change ipfs base image

	mapping(uint256 => uint256) tokenCreationDate;

	/// @custom:oz-upgrades-unsafe-allow constructor
	constructor() {
		_disableInitializers();
	}

	function initialize(
		string memory _name,
		string memory _symbol,
		address _migrationContract
	) public initializer {
		__ERC721_init(_name, _symbol);
		__ERC721Enumerable_init();
		__AccessControl_init();

		_tokenIdCounter.increment();
		_grantRole(MINTER_ROLE, _migrationContract);

		_grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
		_grantRole(MINTER_ROLE, msg.sender);
	}

	function generateDefaultNftImage() public pure returns (string memory) {
		return string(abi.encodePacked(BASE_IPFS_URL, BASE_IMG_IPFS_CID));
	}

	function tokenURI(uint256 tokenId)
		public
		view
		override(ERC721Upgradeable)
		returns (string memory)
	{
		string memory creationDate = Strings.toString(tokenCreationDate[tokenId]);
		string memory accessLevel = Strings.toString(
			getAccessLevel(tokenCreationDate[tokenId])
		);

		bytes memory dataURI = abi.encodePacked( // TODO: Change this
			'{',
			'"name": "Lava Venture Pass #',
			tokenId.toString(),
			'",',
			'"description": "NFT that gives claimable opportunity to LAVA investments.",',
			'"node_created_at": "',
			creationDate,
			'",',
			'"access_level": "',
			accessLevel,
			'",',
			'"image": "',
			generateDefaultNftImage(),
			'"',
			'}'
		);
		return
			string(
				abi.encodePacked(
					'data:application/json;base64,',
					Base64.encode(dataURI)
				)
			);
	}

	function tokenIdsOfOwner(address owner)
		public
		view
		returns (uint256[] memory tokenIds)
	{
		uint256 nftsAmount = this.balanceOf(owner);

		for (uint256 i = 0; i < nftsAmount; i++) {
			tokenIds[i] = this.tokenOfOwnerByIndex(owner, i);
		}
	}

	function mintNft(address minter, uint256 creationDate)
		public
		onlyRole(MINTER_ROLE)
		returns (uint256 tokenId)
	{
		tokenId = _tokenIdCounter.current();
		_tokenIdCounter.increment();
		tokenCreationDate[tokenId] = creationDate;
		console.log('==', tokenId);
		_safeMint(minter, tokenId);
	}

	function mintBatch(address minter, uint256[] memory creationDates)
		public
		onlyRole(MINTER_ROLE)
		returns (uint256[] memory)
	{
		uint256[] memory tokenIds = new uint256[](creationDates.length);
		for (uint256 i = 0; i < creationDates.length; i++) {
			tokenIds[i] = mintNft(minter, creationDates[i]);
		}
		return tokenIds;
	}

	function _burn(uint256 tokenId) internal override(ERC721Upgradeable) {
		super._burn(tokenId);
	}

	function _beforeTokenTransfer(
		address from,
		address to,
		uint256 tokenId
	) internal override(ERC721Upgradeable, ERC721EnumerableUpgradeable) {
		super._beforeTokenTransfer(from, to, tokenId);
	}

	function _beforeConsecutiveTokenTransfer(
		address from,
		address to,
		uint256 first,
		uint96 size
	) internal override(ERC721Upgradeable, ERC721EnumerableUpgradeable) {
		super._beforeConsecutiveTokenTransfer(from, to, first, size);
	}

	function supportsInterface(bytes4 interfaceId)
		public
		view
		override(
			ERC721Upgradeable,
			ERC721EnumerableUpgradeable,
			AccessControlUpgradeable
		)
		returns (bool)
	{
		return super.supportsInterface(interfaceId);
	}

	function _transfer(
		address from,
		address to,
		uint256 tokenId
	) internal override {
		super._transfer(from, to, tokenId);
		tokenCreationDate[tokenId] = TRADED_TIME;
	}

	function getAccessLevel(uint256 creationDate) private pure returns (uint256) {
		// 5/23/22
		// Date and time (GMT): Monday, 23 May 2022 00:00:00
		if (creationDate <= 1653264000) {
			return 6;
			// 5/30/22
			// Date and time (GMT): Monday, 30 May 2022 00:00:00
		} else if (creationDate <= 1653868800) {
			return 5;
			// 6/29/22
			// Date and time (GMT): Wednesday, 29 June 2022 00:00:00
		} else if (creationDate <= 1656460800) {
			return 4;
			// 7/7/22
			// Date and time (GMT): Thursday, 7 July 2022 00:00:00
		} else if (creationDate <= 1657152000) {
			return 3;
			// 7/27/22
			// Date and time (GMT): Wednesday, 27 July 2022 00:00:00
		} else if (creationDate <= 1658880000) {
			return 2;
			// 8/18/22
			// Date and time (GMT): Thursday, 18 August 2022 00:00:00
		} else if (creationDate <= 1660780800) {
			return 1;
			// After 8/18/22
		} else {
			return 0;
		}
	}
}
