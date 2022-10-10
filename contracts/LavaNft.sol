// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import '@openzeppelin/contracts/utils/Strings.sol';
import '@openzeppelin/contracts/utils/Base64.sol';
import '@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol';
import '@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721URIStorageUpgradeable.sol';
import '@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol';
import '@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol';
import '@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol';
import '@openzeppelin/contracts-upgradeable/utils/CountersUpgradeable.sol';

import 'hardhat/console.sol';

contract LavaNft is
	Initializable,
	ERC721Upgradeable,
	ERC721URIStorageUpgradeable,
	AccessControlUpgradeable,
	UUPSUpgradeable
{
	using Strings for uint256;
	using CountersUpgradeable for CountersUpgradeable.Counter;

	bytes32 public constant MINTER_ROLE = keccak256('MINTER_ROLE');
	bytes32 public constant UPGRADER_ROLE = keccak256('UPGRADER_ROLE');
	CountersUpgradeable.Counter private _tokenIdCounter;

	address public migrationContract;

	uint256 private constant TRADED_TIME = 1666396800; // Saturday, 22 October 2022 00:00:00

	string private constant BASE_IPFS_URL =
		'https://currated-labs.infura-ipfs.io/ipfs/'; // TODO: Change ipfs base url
	string private constant BASE_IMG_IPFS_CID =
		'QmaYdi8vzDGqkU81j2dQpCyrSTiQnVybCkRGt4uT6hCG9y'; // TODO: Change ipfs base image

	mapping(uint256 => uint256) nodeClaimableDate;
	mapping(uint256 => string) accessLevels;

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
		__ERC721URIStorage_init();
		__AccessControl_init();
		__UUPSUpgradeable_init();

		_tokenIdCounter.increment();
		migrationContract = _migrationContract;
		_grantRole(MINTER_ROLE, migrationContract);

		_grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
		_grantRole(MINTER_ROLE, msg.sender);
		_grantRole(UPGRADER_ROLE, msg.sender);
	}

	event MintEvent(
		address indexed _from,
		uint256 indexed _tokenId,
		uint256 creationDate
	);

	function generateDefaultNftImage() public pure returns (string memory) {
		return string(abi.encodePacked(BASE_IPFS_URL, BASE_IMG_IPFS_CID));
	}

	function getTokenURI(uint256 tokenId) public view returns (string memory) {
		string memory creationDate = Strings.toString(nodeClaimableDate[tokenId]);
		string memory accessLevel = accessLevels[tokenId];

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

	function tokenURI(uint256 tokenId)
		public
		view
		override(ERC721Upgradeable, ERC721URIStorageUpgradeable)
		returns (string memory)
	{
		return super.tokenURI(tokenId);
	}

	function mintNft(address minter, uint256 creationDate)
		public
		onlyRole(MINTER_ROLE)
		returns (uint256)
	{
		uint256 tokenId = _tokenIdCounter.current();
		_tokenIdCounter.increment();
		_safeMint(minter, tokenId);

		nodeClaimableDate[tokenId] = creationDate;
		accessLevels[tokenId] = getAccessLevel(creationDate);
		_setTokenURI(tokenId, getTokenURI(tokenId));
		emit MintEvent(minter, tokenId, creationDate);
		return tokenId;
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

	function _authorizeUpgrade(address newImplementation)
		internal
		override
		onlyRole(UPGRADER_ROLE)
	{}

	function _burn(uint256 tokenId)
		internal
		override(ERC721Upgradeable, ERC721URIStorageUpgradeable)
	{
		super._burn(tokenId);
	}

	function supportsInterface(bytes4 interfaceId)
		public
		view
		override(ERC721Upgradeable, AccessControlUpgradeable)
		returns (bool)
	{
		return super.supportsInterface(interfaceId);
	}

	function safeTransferFrom(
		address from,
		address to,
		uint256 tokenId
	) public override {
		super.safeTransferFrom(from, to, tokenId);
		nodeClaimableDate[tokenId] = TRADED_TIME;
		accessLevels[tokenId] = 'Access Level 0';
	}

	function safeTransferFrom(
		address from,
		address to,
		uint256 tokenId,
		bytes memory _data
	) public override {
		super.safeTransferFrom(from, to, tokenId, _data);
		nodeClaimableDate[tokenId] = TRADED_TIME;
		accessLevels[tokenId] = 'Access Level 0';
	}

	function transferFrom(
		address from,
		address to,
		uint256 tokenId
	) public override {
		super.transferFrom(from, to, tokenId);
		nodeClaimableDate[tokenId] = TRADED_TIME;
		accessLevels[tokenId] = 'Access Level 0';
	}

	function getAccessLevel(uint256 creationDate)
		private
		pure
		returns (string memory)
	{
		// 5/23/22
		// Date and time (GMT): Monday, 23 May 2022 00:00:00
		if (creationDate <= 1653264000) {
			return 'Access Level 6';
			// 5/30/22
			// Date and time (GMT): Monday, 30 May 2022 00:00:00
		} else if (creationDate <= 1653868800) {
			return 'Access Level 5';
			// 6/29/22
			// Date and time (GMT): Wednesday, 29 June 2022 00:00:00
		} else if (creationDate <= 1656460800) {
			return 'Access Level 4';
			// 7/7/22
			// Date and time (GMT): Thursday, 7 July 2022 00:00:00
		} else if (creationDate <= 1657152000) {
			return 'Access Level 3';
			// 7/27/22
			// Date and time (GMT): Wednesday, 27 July 2022 00:00:00
		} else if (creationDate <= 1658880000) {
			return 'Access Level 2';
			// 8/18/22
			// Date and time (GMT): Thursday, 18 August 2022 00:00:00
		} else if (creationDate <= 1660780800) {
			return 'Access Level 1';
			// After 8/18/22
		} else {
			return 'Access Level 0';
		}
	}
}
