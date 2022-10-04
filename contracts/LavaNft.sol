// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import '@openzeppelin/contracts/utils/Counters.sol';
import '@openzeppelin/contracts/utils/Strings.sol';
import '@openzeppelin/contracts/utils/Base64.sol';
import '@openzeppelin/contracts/access/AccessControl.sol';
import '@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol';

// https://docs.openzeppelin.com/contracts/2.x/access-control

contract LavaNft is ERC721URIStorage, AccessControl {
	using Strings for uint256;
	using Counters for Counters.Counter;

	bytes32 public constant MINTER_ROLE = keccak256('MINTER_ROLE');

	Counters.Counter private _tokenIds;
	address payable owner;
	address private migrationContract;

	string private constant BASE_IPFS_URL =
		'https://currated-labs.infura-ipfs.io/ipfs/'; // TODO: Change this
	string private constant BASE_IMG_IPFS_CID =
		'QmaYdi8vzDGqkU81j2dQpCyrSTiQnVybCkRGt4uT6hCG9y'; // TODO: Change this

	constructor(
		string memory _nftName,
		string memory _nftSymbol,
		address migrationContractAddress
	) ERC721(_nftName, _nftSymbol) {
		owner = payable(msg.sender);
		_tokenIds.increment();

		_setupRole(MINTER_ROLE, msg.sender);
		_setupRole(MINTER_ROLE, migrationContractAddress);
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

	function withdrawAll() public {
		require(
			msg.sender == owner,
			'Only the contract owner can withdraw the funds!'
		);
		require(owner.send(address(this).balance));
	}

	function mint() public payable onlyRole(MINTER_ROLE) {
		uint256 newItemId = _tokenIds.current();
		_safeMint(msg.sender, newItemId);
		_setTokenURI(newItemId, getTokenURI(newItemId, BASE_IMG_IPFS_CID));

		_tokenIds.increment();

		emit MintEvent(msg.sender, newItemId);
	}

	function supportsInterface(bytes4 interfaceId)
		public
		view
		override(ERC721, AccessControl)
		returns (bool)
	{
		return super.supportsInterface(interfaceId);
	}
}
