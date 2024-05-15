'use client';

import { 
	createConfig,
	cookieStorage,
	createStorage
} from 'wagmi'
import { defineChain, createPublicClient, http, createWalletClient, custom } from 'viem'

export const liskSepolia = defineChain({
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
})

export const config = createConfig({
  chains: [liskSepolia],
  ssr: true,
  storage: createStorage({
    storage: cookieStorage,
  }),
  transports: {
    [liskSepolia.id]: http(),
  },
})

// to move to web3 ?
export const publicClient = createPublicClient({
  chain: liskSepolia,
  transport: http()
})

// to move to web3 ?
export const walletClient = process.browser ? createWalletClient({
  chain: liskSepolia,
  transport: custom(window.ethereum)
}) : null;