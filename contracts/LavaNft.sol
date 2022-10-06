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

	address private migrationContract;

	string private constant BASE_IPFS_URL =
		'https://currated-labs.infura-ipfs.io/ipfs/'; // TODO: Change this
	string private constant BASE_IMG_IPFS_CID =
		'QmaYdi8vzDGqkU81j2dQpCyrSTiQnVybCkRGt4uT6hCG9y'; // TODO: Change this

	constructor() {
		_disableInitializers();
	}

	function initialize() public initializer {
		__ERC721_init('Lava Venture Pass - Test', 'LVP');
		__ERC721URIStorage_init();
		__AccessControl_init();
		__UUPSUpgradeable_init();

		_grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
		_grantRole(MINTER_ROLE, msg.sender);
		_grantRole(UPGRADER_ROLE, msg.sender);
		// TODO: Add imgration contract address to minters
	}

	event MintEvent(address indexed _from, uint256 indexed _tokenId);

	function generateImgUrl(string memory cid)
		public
		pure
		returns (string memory)
	{
		return string(abi.encodePacked(BASE_IPFS_URL, cid));
	}

	function getTokenURI(uint256 tokenId, string memory cid)
		public
		pure
		returns (string memory)
	{
		bytes memory dataURI = abi.encodePacked( // TODO: Change this
			'{',
			'"name": "Currated Labs - Original #',
			tokenId.toString(),
			'",',
			'"description": "Uniqe. On of a kind. Currated Labs Original!",',
			'"image": "',
			generateImgUrl(cid),
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

	function safeMint(string memory uri) public onlyRole(MINTER_ROLE) {
		uint256 tokenId = _tokenIdCounter.current();
		_tokenIdCounter.increment();
		_safeMint(msg.sender, tokenId);
		_setTokenURI(tokenId, getTokenURI(tokenId, BASE_IMG_IPFS_CID));
		emit MintEvent(msg.sender, tokenId);
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
