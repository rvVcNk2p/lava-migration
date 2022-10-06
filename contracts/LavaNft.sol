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

	string private constant BASE_IPFS_URL =
		'https://currated-labs.infura-ipfs.io/ipfs/'; // TODO: Change ipfs base url
	string private constant BASE_IMG_IPFS_CID =
		'QmaYdi8vzDGqkU81j2dQpCyrSTiQnVybCkRGt4uT6hCG9y'; // TODO: Change ipfs base image

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

	function getTokenURI(uint256 tokenId, uint256 creationDate)
		public
		pure
		returns (string memory)
	{
		bytes memory dataURI = abi.encodePacked( // TODO: Change this
			'{',
			'"name": "Lava Venture Pass #',
			tokenId.toString(),
			'",',
			'"description": "NFT that gives claimable opportunity to LAVA investments.",',
			'"node_created_at": "',
			creationDate.toString(),
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
		_setTokenURI(tokenId, getTokenURI(tokenId, creationDate));
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
}
