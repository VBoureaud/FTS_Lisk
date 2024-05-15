const httpStatus = require('http-status');
const fetch = require('node-fetch');
const config = require('../config');
const viem = require('viem');

const ApiError = require('../utils/ApiError');
const CONTRACT_NFT = require('../contracts/NFT_TTS.json');
const CONTRACT_TRADE = require('../contracts/Trade_TTS.json');

const apiBlockScout = {
    transactionsAddr: (address) => `https://sepolia-blockscout.lisk.com/api/v2/addresses/${address}/transactions?filter=to%20%7C%20from`,
    nftList: (address) => `https://sepolia-blockscout.lisk.com/api/v2/tokens/${address}/instances`,
    tokenTransfer: (address) => `https://sepolia-blockscout.lisk.com/api/v2/addresses/${address}/token-transfers?type=ERC-721&filter=to%20%7C%20from&token=${config.nftContract}`,
    transaction: (txAddr) => `https://sepolia-blockscout.lisk.com/api/v2/transactions/${txAddr}`,
}

// config blockchain link
const liskSepolia = viem.defineChain({
  id: 4202,
  name: 'Lisk Sepolia Testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'Ether',
    symbol: 'ETH',
  },
  rpcUrls: {
    default: {
      http: ['https://rpc.sepolia-api.lisk.com'],
      webSocket: ['wss://ws.sepolia-api.lisk.com'],
    },
  },
  blockExplorers: {
    default: { name: 'Explorer', url: 'https://sepolia-blockscout.lisk.com' },
  },
  contracts: {
    multicall3: {
      address: '0xcA11bde05977b3631167028862bE2a173976CA11',
      blockCreated: 5882,
    },
  },
});

const publicClient = viem.createPublicClient({
  chain: liskSepolia,
  transport: viem.http()
})


/**
 * Get Transactions from address
 * @param {String} address
 * @returns {String[]}
 */
const getAddrTx = async (address) => {
  try {
    const response = await fetch(apiBlockScout.transactionsAddr(address));
    const responseTx = await response.json();
    return responseTx;
  } catch (error) {
    console.log({ error });
    throw new ApiError(httpStatus.BAD_REQUEST, 'address not found');
  }
}

/**
 * Get NFTS from NFT contract
 * @returns {String[]}
 */
const getNFTS = async () => {
  try {
    const response = await fetch(apiBlockScout.nftList(config.nftContract));
    const responseNfts = await response.json();
    return responseNfts;
  } catch (error) {
    console.log({ error });
    throw new ApiError(httpStatus.BAD_REQUEST, 'NFT contract not found');
  }
};

/**
 * Get NFTS from NFT contract
 * @returns {String[]}
 */
const getTransfers = async (address) => {
  try {
    const response = await fetch(apiBlockScout.tokenTransfer(address));
    const responseTransfers = await response.json();
    return responseTransfers;
  } catch (error) {
    console.log({ error });
    throw new ApiError(httpStatus.BAD_REQUEST, 'Transfers not found');
  }
};

/**
 * Get transactions from hash
 * @returns {String[]}
 */
const getTransaction = async (hashAddr) => {
  try {
    const response = await fetch(apiBlockScout.transaction(hashAddr));
    const responseTransfers = await response.json();
    return responseTransfers;
  } catch (error) {
    console.log({ error });
    throw new ApiError(httpStatus.BAD_REQUEST, 'Transaction not found');
  }
};

/**
 * Get Trades from Trade Contract
 * @returns {String[]}
 */
const getTrades = async () => {
  try {
    const tradeCounter = await publicClient.readContract({
      address: config.tradeContract,
      abi: CONTRACT_TRADE.abi,
      functionName: 'tradeCounter',
    });
    const count = parseInt(tradeCounter);
    console.log({ count });
    if (count) {
        const newTrades = [];
        for (let i = 0; i < count; i++) {
            const trade = await publicClient.readContract({
              address: config.tradeContract,
              abi: CONTRACT_TRADE.abi,
              functionName: 'getTrade',
              args: [ i ],
            });
            trade[tradesEnum.status] = viem.fromHex(trade[tradesEnum.status], { size:32, to: 'string' });
            
            trade[tradesEnum.id] = i;
            console.log({ trade });
            newTrades.push(trade);
        }
        return newTrades;
    }
  } catch (error) {
    console.log({ error });
    throw new ApiError(httpStatus.BAD_REQUEST, 'Trade contract not found');
  }
};


module.exports = {
  getAddrTx,
  getNFTS,
  getTransfers,
  getTransaction,
  getTrades,
};
