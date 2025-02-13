// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract ZkVerification is ERC721URIStorage {
    /// The hash of the identifier of the proving system used (risc0 in this case)
    bytes32 public constant PROVING_SYSTEM_ID = keccak256(abi.encodePacked("risc0"));

    /// The address of the ZkvAttestationContract
    address public immutable zkvContract;
    /// The hash of the verification key of the circuit
    bytes32 public vkey;
    bytes32 public vhash;

    /// NFT-related state variables
    uint256 private _tokenIdCounter;
    string private _tokenURI; // Store a single tokenURI

    /// A mapping for recording the addresses which have submitted valid proofs
    mapping(address => bool) public hasSubmittedValidProof;

    event NFTMinted(address indexed minter, uint256 tokenId);

    constructor(address _zkvContract, bytes32 _vkey, bytes32 _vhash, string memory tokenURI_) ERC721("MetaNFT", "MNFT") {
        zkvContract = _zkvContract;
        vkey = _vkey;
        vhash = _vhash;
        _tokenURI = tokenURI_;
    }

    function checkHash(
        bytes memory _hash,
        uint256 attestationId,
        bytes32[] calldata merklePath,
        uint256 leafCount,
        uint256 index
    ) external {
        require(
            _verifyProofHasBeenPostedToZkv(
                _hash,
                attestationId,
                merklePath,
                leafCount,
                index
            ),
            "Invalid proof"
        );
        /// If a valid proof has been posted to zkVerify, mint an NFT
        hasSubmittedValidProof[msg.sender] = true;
        _mintNFT(msg.sender);
    }

    function _verifyProofHasBeenPostedToZkv(
        bytes memory _hash,
        uint256 attestationId,
        bytes32[] calldata merklePath,
        uint256 leafCount,
        uint256 index
    ) internal view returns (bool) {
        bytes32 leaf = keccak256(abi.encodePacked(PROVING_SYSTEM_ID, vkey, vhash, keccak256(abi.encodePacked(_hash))));

        (bool callSuccessful, bytes memory validProof) = zkvContract.staticcall(
            abi.encodeWithSignature(
                "verifyProofAttestation(uint256,bytes32,bytes32[],uint256,uint256)",
                attestationId,
                leaf,
                merklePath,
                leafCount,
                index
            )
        );

        require(callSuccessful, "zkvContract call failed");

        return abi.decode(validProof, (bool));
    }

    function _mintNFT(address recipient) internal {
        _tokenIdCounter++;
        uint256 newTokenId = _tokenIdCounter;
        _safeMint(recipient, newTokenId);
        _setTokenURI(newTokenId, _tokenURI);

        emit NFTMinted(recipient, newTokenId);
    }
}
