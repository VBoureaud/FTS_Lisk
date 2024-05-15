// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
//import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
//import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
//import "@openzeppelin/contracts/access/Ownable.sol";

contract NFT_TTS is ERC721 {
    uint256 public currentTokenId;

    constructor() ERC721("TestSimulator", "TTS") {}

    // typeToken [1-999]
    function mint(
        uint256 typeToken,
        address operator
    ) public payable returns (uint256) {
        uint256 newItemId = (++currentTokenId * 1000) + typeToken;
        _safeMint(msg.sender, newItemId);

        if (operator != address(0))
            //_approve(operator, newItemId, address(0));
            setApprovalForAll(operator, true);

        return newItemId;
    }


    // typeToken [1-999]
    /*function safeMint(uint256 typeToken, address operator, string memory uri) public onlyOwner {
        uint256 newTokenId = (++currentTokenId * 1000) + typeToken;
        _safeMint(msg.sender, newTokenId);
        setTokenURI(newTokenId, uri);
    }*/

    /*function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }*/

    /*function tokenURI(uint256 tokenId)
        public
        view
        // override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }*/
}
