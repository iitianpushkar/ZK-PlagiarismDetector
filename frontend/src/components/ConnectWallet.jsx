import { ethers } from "ethers";
import { useState,useContext } from "react";
import { UserContext } from "./Context";

const EDU_CHAIN_PARAMS = {
  chainId: "0xA045C", // 656476 in hex
  chainName: "EDU Chain Testnet",
  rpcUrls: ["https://rpc.open-campus-codex.gelato.digital"],
  nativeCurrency: {
    name: "EDU",
    symbol: "EDU",
    decimals: 18,
  },
  blockExplorerUrls: ["https://opencampus-codex.blockscout.com/"], 
};


const CONTRACT_ADDRESS = "0x8d3cf544E94D0505e33e0fFb10a6b0Eb725D9786";
const ABI=[
  {
      "inputs": [
          {
              "internalType": "address",
              "name": "_zkvContract",
              "type": "address"
          },
          {
              "internalType": "bytes32",
              "name": "_vkey",
              "type": "bytes32"
          },
          {
              "internalType": "bytes32",
              "name": "_vhash",
              "type": "bytes32"
          },
          {
              "internalType": "string",
              "name": "tokenURI_",
              "type": "string"
          }
      ],
      "stateMutability": "nonpayable",
      "type": "constructor"
  },
  {
      "inputs": [
          {
              "internalType": "address",
              "name": "sender",
              "type": "address"
          },
          {
              "internalType": "uint256",
              "name": "tokenId",
              "type": "uint256"
          },
          {
              "internalType": "address",
              "name": "owner",
              "type": "address"
          }
      ],
      "name": "ERC721IncorrectOwner",
      "type": "error"
  },
  {
      "inputs": [
          {
              "internalType": "address",
              "name": "operator",
              "type": "address"
          },
          {
              "internalType": "uint256",
              "name": "tokenId",
              "type": "uint256"
          }
      ],
      "name": "ERC721InsufficientApproval",
      "type": "error"
  },
  {
      "inputs": [
          {
              "internalType": "address",
              "name": "approver",
              "type": "address"
          }
      ],
      "name": "ERC721InvalidApprover",
      "type": "error"
  },
  {
      "inputs": [
          {
              "internalType": "address",
              "name": "operator",
              "type": "address"
          }
      ],
      "name": "ERC721InvalidOperator",
      "type": "error"
  },
  {
      "inputs": [
          {
              "internalType": "address",
              "name": "owner",
              "type": "address"
          }
      ],
      "name": "ERC721InvalidOwner",
      "type": "error"
  },
  {
      "inputs": [
          {
              "internalType": "address",
              "name": "receiver",
              "type": "address"
          }
      ],
      "name": "ERC721InvalidReceiver",
      "type": "error"
  },
  {
      "inputs": [
          {
              "internalType": "address",
              "name": "sender",
              "type": "address"
          }
      ],
      "name": "ERC721InvalidSender",
      "type": "error"
  },
  {
      "inputs": [
          {
              "internalType": "uint256",
              "name": "tokenId",
              "type": "uint256"
          }
      ],
      "name": "ERC721NonexistentToken",
      "type": "error"
  },
  {
      "anonymous": false,
      "inputs": [
          {
              "indexed": true,
              "internalType": "address",
              "name": "owner",
              "type": "address"
          },
          {
              "indexed": true,
              "internalType": "address",
              "name": "approved",
              "type": "address"
          },
          {
              "indexed": true,
              "internalType": "uint256",
              "name": "tokenId",
              "type": "uint256"
          }
      ],
      "name": "Approval",
      "type": "event"
  },
  {
      "anonymous": false,
      "inputs": [
          {
              "indexed": true,
              "internalType": "address",
              "name": "owner",
              "type": "address"
          },
          {
              "indexed": true,
              "internalType": "address",
              "name": "operator",
              "type": "address"
          },
          {
              "indexed": false,
              "internalType": "bool",
              "name": "approved",
              "type": "bool"
          }
      ],
      "name": "ApprovalForAll",
      "type": "event"
  },
  {
      "anonymous": false,
      "inputs": [
          {
              "indexed": false,
              "internalType": "uint256",
              "name": "_fromTokenId",
              "type": "uint256"
          },
          {
              "indexed": false,
              "internalType": "uint256",
              "name": "_toTokenId",
              "type": "uint256"
          }
      ],
      "name": "BatchMetadataUpdate",
      "type": "event"
  },
  {
      "anonymous": false,
      "inputs": [
          {
              "indexed": false,
              "internalType": "uint256",
              "name": "_tokenId",
              "type": "uint256"
          }
      ],
      "name": "MetadataUpdate",
      "type": "event"
  },
  {
      "anonymous": false,
      "inputs": [
          {
              "indexed": true,
              "internalType": "address",
              "name": "minter",
              "type": "address"
          },
          {
              "indexed": false,
              "internalType": "uint256",
              "name": "tokenId",
              "type": "uint256"
          }
      ],
      "name": "NFTMinted",
      "type": "event"
  },
  {
      "anonymous": false,
      "inputs": [
          {
              "indexed": true,
              "internalType": "address",
              "name": "from",
              "type": "address"
          },
          {
              "indexed": true,
              "internalType": "address",
              "name": "to",
              "type": "address"
          },
          {
              "indexed": true,
              "internalType": "uint256",
              "name": "tokenId",
              "type": "uint256"
          }
      ],
      "name": "Transfer",
      "type": "event"
  },
  {
      "inputs": [],
      "name": "PROVING_SYSTEM_ID",
      "outputs": [
          {
              "internalType": "bytes32",
              "name": "",
              "type": "bytes32"
          }
      ],
      "stateMutability": "view",
      "type": "function"
  },
  {
      "inputs": [
          {
              "internalType": "address",
              "name": "to",
              "type": "address"
          },
          {
              "internalType": "uint256",
              "name": "tokenId",
              "type": "uint256"
          }
      ],
      "name": "approve",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
  },
  {
      "inputs": [
          {
              "internalType": "address",
              "name": "owner",
              "type": "address"
          }
      ],
      "name": "balanceOf",
      "outputs": [
          {
              "internalType": "uint256",
              "name": "",
              "type": "uint256"
          }
      ],
      "stateMutability": "view",
      "type": "function"
  },
  {
      "inputs": [
          {
              "internalType": "bytes",
              "name": "_hash",
              "type": "bytes"
          },
          {
              "internalType": "uint256",
              "name": "attestationId",
              "type": "uint256"
          },
          {
              "internalType": "bytes32[]",
              "name": "merklePath",
              "type": "bytes32[]"
          },
          {
              "internalType": "uint256",
              "name": "leafCount",
              "type": "uint256"
          },
          {
              "internalType": "uint256",
              "name": "index",
              "type": "uint256"
          }
      ],
      "name": "checkHash",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
  },
  {
      "inputs": [
          {
              "internalType": "uint256",
              "name": "tokenId",
              "type": "uint256"
          }
      ],
      "name": "getApproved",
      "outputs": [
          {
              "internalType": "address",
              "name": "",
              "type": "address"
          }
      ],
      "stateMutability": "view",
      "type": "function"
  },
  {
      "inputs": [
          {
              "internalType": "address",
              "name": "",
              "type": "address"
          }
      ],
      "name": "hasSubmittedValidProof",
      "outputs": [
          {
              "internalType": "bool",
              "name": "",
              "type": "bool"
          }
      ],
      "stateMutability": "view",
      "type": "function"
  },
  {
      "inputs": [
          {
              "internalType": "address",
              "name": "owner",
              "type": "address"
          },
          {
              "internalType": "address",
              "name": "operator",
              "type": "address"
          }
      ],
      "name": "isApprovedForAll",
      "outputs": [
          {
              "internalType": "bool",
              "name": "",
              "type": "bool"
          }
      ],
      "stateMutability": "view",
      "type": "function"
  },
  {
      "inputs": [],
      "name": "name",
      "outputs": [
          {
              "internalType": "string",
              "name": "",
              "type": "string"
          }
      ],
      "stateMutability": "view",
      "type": "function"
  },
  {
      "inputs": [
          {
              "internalType": "uint256",
              "name": "tokenId",
              "type": "uint256"
          }
      ],
      "name": "ownerOf",
      "outputs": [
          {
              "internalType": "address",
              "name": "",
              "type": "address"
          }
      ],
      "stateMutability": "view",
      "type": "function"
  },
  {
      "inputs": [
          {
              "internalType": "address",
              "name": "from",
              "type": "address"
          },
          {
              "internalType": "address",
              "name": "to",
              "type": "address"
          },
          {
              "internalType": "uint256",
              "name": "tokenId",
              "type": "uint256"
          }
      ],
      "name": "safeTransferFrom",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
  },
  {
      "inputs": [
          {
              "internalType": "address",
              "name": "from",
              "type": "address"
          },
          {
              "internalType": "address",
              "name": "to",
              "type": "address"
          },
          {
              "internalType": "uint256",
              "name": "tokenId",
              "type": "uint256"
          },
          {
              "internalType": "bytes",
              "name": "data",
              "type": "bytes"
          }
      ],
      "name": "safeTransferFrom",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
  },
  {
      "inputs": [
          {
              "internalType": "address",
              "name": "operator",
              "type": "address"
          },
          {
              "internalType": "bool",
              "name": "approved",
              "type": "bool"
          }
      ],
      "name": "setApprovalForAll",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
  },
  {
      "inputs": [
          {
              "internalType": "bytes4",
              "name": "interfaceId",
              "type": "bytes4"
          }
      ],
      "name": "supportsInterface",
      "outputs": [
          {
              "internalType": "bool",
              "name": "",
              "type": "bool"
          }
      ],
      "stateMutability": "view",
      "type": "function"
  },
  {
      "inputs": [],
      "name": "symbol",
      "outputs": [
          {
              "internalType": "string",
              "name": "",
              "type": "string"
          }
      ],
      "stateMutability": "view",
      "type": "function"
  },
  {
      "inputs": [
          {
              "internalType": "uint256",
              "name": "tokenId",
              "type": "uint256"
          }
      ],
      "name": "tokenURI",
      "outputs": [
          {
              "internalType": "string",
              "name": "",
              "type": "string"
          }
      ],
      "stateMutability": "view",
      "type": "function"
  },
  {
      "inputs": [
          {
              "internalType": "address",
              "name": "from",
              "type": "address"
          },
          {
              "internalType": "address",
              "name": "to",
              "type": "address"
          },
          {
              "internalType": "uint256",
              "name": "tokenId",
              "type": "uint256"
          }
      ],
      "name": "transferFrom",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
  },
  {
      "inputs": [],
      "name": "vhash",
      "outputs": [
          {
              "internalType": "bytes32",
              "name": "",
              "type": "bytes32"
          }
      ],
      "stateMutability": "view",
      "type": "function"
  },
  {
      "inputs": [],
      "name": "vkey",
      "outputs": [
          {
              "internalType": "bytes32",
              "name": "",
              "type": "bytes32"
          }
      ],
      "stateMutability": "view",
      "type": "function"
  },
  {
      "inputs": [],
      "name": "zkvContract",
      "outputs": [
          {
              "internalType": "address",
              "name": "",
              "type": "address"
          }
      ],
      "stateMutability": "view",
      "type": "function"
  }
]

function ConnectWallet () {

  const {account, setAccount, contract, setContract} = useContext(UserContext);

  const connect =async ()=>{
    
    if (!window.ethereum.isMetaMask) {
      alert("MetaMask not detected! Please install MetaMask.");
      return;
    }

    try {
      // Request connection to MetaMask
      await window.ethereum.request({ method: "eth_requestAccounts" });

      // Ensure the correct network is selected
      await window.ethereum.request({
        method: "wallet_addEthereumChain",
        params: [EDU_CHAIN_PARAMS],
      });

      const provider = new ethers.BrowserProvider(window.ethereum,null, { polling: true });
      const signer = await provider.getSigner();
      const address = await signer.getAddress();
      
      setAccount(address);

      const Contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);
          setContract(Contract);
          console.log(Contract);

      alert(`Connected to EDU Chain: ${address}`);
    } catch (error) {
      console.error("Error connecting:", error);
    }
  }

  const disconnect = () => {
    setAccount(null);
    setContract(null);
    alert("Disconnected from wallet");
  };

  return (
    <div className="absolute top-4 right-4">
      {account ? (
        <div className="flex items-center gap-4 animate-fade-in">
          <p className="text-sm bg-purple-500/10 px-4 py-2 rounded-full border border-purple-500/30">
            Connected: <span className="font-mono text-purple-300">{account.slice(0,6)}...{account.slice(-4)}</span>
          </p>
          <button 
            onClick={disconnect}
            className="px-4 py-2 bg-gradient-to-r from-purple-600/50 to-red-600/50 rounded-lg border border-red-400/30 hover:border-red-400/60 transition-all duration-300 hover:scale-[1.02] shadow-red-500/10 hover:shadow-red-500/20"
          >
            Disconnect
          </button>
        </div>
      ) : (
        <button 
          onClick={connect}
          className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-500 rounded-xl hover:from-purple-700 hover:to-blue-600 transition-all duration-300 hover:scale-105 shadow-lg shadow-purple-500/20 animate-pulse-slow"
        >
          ✨ Connect Wallet
        </button>
      )}
    </div>
  );
  }


export default ConnectWallet
