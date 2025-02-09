// @ts-ignore

import React, { useEffect, useState } from "react";
import NFT_TTS from '@/contracts/NFT_TTS.json';
import Trade_TTS from '@/contracts/Trade_TTS.json';
import ERC20 from '@/contracts/ERC20.json';

import config from "@/config/index";
import { publicClient, walletClient, liskSepolia } from "@/config/wagmiConfig";
import { fromHex } from "viem";

const Web3Context = React.createContext({
  loading: false,
  loadingTx: false,
  loadingNft: false,
  loadingMint: false,
  loadingBurn: false,
  loadingTrades: false,
  loadingSwitch: false,
  transactions: null,
  trades: null,
  nfts: null,
  getTransaction: (address: `0x${string}`) => { },
  getNfts: () => { },
  getTrades: () => { },
  openTrade: (address: `0x${string}`, idToken: number, price: number) => { },
  approveTrade: (address: `0x${string}`, price: number) => { },
  executeTrade: (address: `0x${string}`, idTrace: number, value: number) => { },
  cancelTrade: (address: `0x${string}`, id: number) => { },
  actionMint: (address: `0x${string}`, typeToken: string) => { },
  actionBurn: (address: `0x${string}`, typeToken: string) => { },
  switchChain: () => { },
  isGoodChain: (idChain: number | undefined): boolean => { },
});

type Props = {
  children: React.ReactNode;
};

const apiBlockScout = {
  transactionsAddr: (address: `0x${string}`) => `https://sepolia-blockscout.lisk.com/api/v2/addresses/${address}/transactions?filter=to%20%7C%20from`,
  nftList: (address: string) => `https://sepolia-blockscout.lisk.com/api/v2/tokens/${address}/instances`,
}

export const tradesEnum = {
  'from': 0,
  'item': 1,
  'price': 2,
  'status': 3,
  'id': 4,
};

export const Web3ContextProvider = (props: Props) => {
  const [loading, setLoading] = useState(false);
  const [loadingTx, setLoadingTx] = useState(false);
  const [loadingNft, setLoadingNft] = useState(false);
  const [loadingMint, setLoadingMint] = useState(false);
  const [loadingBurn, setLoadingBurn] = useState(false);
  const [loadingTrades, setLoadingTrades] = useState(false);
  const [loadingSwitch, setLoadingSwitch] = useState(false);
  const [transactions, setTransactions] = useState(null);
  const [trades, setTrades] = useState(null);
  const [nfts, setNfts] = useState(null);

  const setWatcherNFT = () => {
    console.count('run set Watched');
    return publicClient.watchContractEvent({
      address: config.LISKSEPOLIA.CONTRACT_NFT_ADDR as `0x${string}`,
      abi: NFT_TTS.abi,
      eventName: 'Transfer',
      onLogs: async (logs) => {
        console.log('Contract on Transfer Event, log:', logs);

        // reload nfts
        await getNfts();
      },
    });
  };

  const setWatcherTrade = () => {
    console.count('run set Watched');
    return publicClient.watchContractEvent({
      address: config.LISKSEPOLIA.CONTRACT_TRADE_TTS_ADDR as `0x${string}`,
      abi: Trade_TTS.abi,
      eventName: 'TradeStatusChange',
      onLogs: async (logs) => {
        console.log('Contract on TradeStatusChange Event, log:', logs);

        // reload trades & nfts
        await getTrades();
        await getNfts();
      },
    });
  };

  useEffect(() => {
    console.log('init - hello context');
    const unWatchNFT = setWatcherNFT();
    const unWatchTrade = setWatcherTrade();

    return () => {
      console.count('run useEffect return and unwatch Watched');
      unWatchNFT();
      unWatchTrade();
    };
  }, []);

  const getTransaction = async (address: `0x${string}`) => {
    console.log('getTransaction');
    try {
      setLoadingTx(true);
      const response = await fetch(apiBlockScout.transactionsAddr(address));
      const responseTx = await response.json();
      setTransactions(responseTx);
      setLoadingTx(false);
      return responseTx;
    } catch (e) {
      setLoadingTx(false);
      console.log('error');
      console.log(e)
    }
  }

  const getNfts = async () => {
    console.log('getNfts');
    try {
      setLoadingNft(true);
      const response = await fetch(apiBlockScout.nftList(config.LISKSEPOLIA.CONTRACT_NFT_ADDR));
      const responseNfts = await response.json();
      setNfts(responseNfts);
      setLoadingNft(false);
      console.log({ responseNfts });
      return responseNfts;
    } catch (e) {
      setLoadingNft(false);
      console.log('error');
      console.log(e)
    }
  }

  const actionMint = async (address: `0x${string}`, typeToken: string) => {
    try {
      setLoadingMint(true);
      const marketplace = config.LISKSEPOLIA.CONTRACT_TRADE_TTS_ADDR;
      console.log({ typeToken, marketplace });
      const { request } = await publicClient.simulateContract({
        account: address,
        address: config.LISKSEPOLIA.CONTRACT_NFT_ADDR,
        abi: NFT_TTS.abi,
        functionName: 'mint',
        args: [typeToken, marketplace],
      });
      const write = await walletClient.writeContract(request);
      console.log({ write });
      setLoadingMint(false);
    } catch (e) {
      setLoadingMint(false);
      console.log('error');
      console.log(e)
    }
  }

  const actionBurn = async (address: `0x${string}`, typeToken: string) => {
    try {
      setLoadingBurn(true);
      console.log({ address, typeToken });
      const { request } = await publicClient.simulateContract({
        account: address,
        address: config.LISKSEPOLIA.CONTRACT_NFT_ADDR as `0x${string}`,
        abi: NFT_TTS.abi,
        functionName: 'burn',
        args: [typeToken, marketplace],
      });
      const write = await walletClient.writeContract(request);
      console.log({ write });
      setLoadingBurn(false);
    } catch (e) {
      setLoadingBurn(false);
      console.log('error');
      console.log(e)
    }
  }

  const getTrades = async () => {
    try {
      console.log('getTrades');
      setLoadingTrades(true);
      const tradeCounter = await publicClient.readContract({
        address: config.LISKSEPOLIA.CONTRACT_TRADE_TTS_ADDR as `0x${string}`,
        abi: Trade_TTS.abi,
        functionName: 'tradeCounter',
      })
      const count = parseInt(tradeCounter + "");
      console.log({ count });
      if (count) {
        const newTrades = [];
        for (let i = count - 1; i >= 0; i--) {
          const trade = await publicClient.readContract({
            address: config.LISKSEPOLIA.CONTRACT_TRADE_TTS_ADDR as `0x${string}`,
            abi: Trade_TTS.abi,
            functionName: 'getTrade',
            args: [i],
          });
          trade[tradesEnum.status] = fromHex(trade[tradesEnum.status], { size: 32, to: 'string' });

          trade[tradesEnum.id] = i;
          console.log({ trade });
          newTrades.push(trade);
        }
        setTrades(newTrades);
      }
      setLoadingTrades(false);
    } catch (e) {
      setLoadingTrades(false);
      console.log('error');
      console.log(e)
    }
  }

  // Approve & Open
  const openTrade = async (address: `0x${string}`, idToken: number, price: number) => {
    try {
      console.log('openTrade');
      setLoadingTrades(true);
      const { request } = await publicClient.simulateContract({
        account: address,
        address: config.LISKSEPOLIA.CONTRACT_TRADE_TTS_ADDR as `0x${string}`,
        abi: Trade_TTS.abi,
        functionName: 'openTrade',
        args: [idToken, price],
      });
      const write = await walletClient.writeContract(request);

      /*const results = await publicClient.multicall({
        contracts: [
          {
            address: config.LISKSEPOLIA.CONTRACT_NFT_ADDR,
            abi: NFT_TTS.abi,
            functionName: 'approve',
            args: [ config.LISKSEPOLIA.CONTRACT_TRADE_TTS_ADDR, idToken] 
          },
          {
            address: config.LISKSEPOLIA.CONTRACT_TRADE_TTS_ADDR,
            abi: Trade_TTS.abi,
            functionName: 'openTrade',
            args: [ idToken, price ] 
          },
        ]
      });*/
      // console.log({ results });

    } catch (e) {
      setLoadingTrades(false);
      console.log('error');
      console.log(e)
    }
  }

  const approveTrade = async (address: `0x${string}`, price: number) => {
    try {
      console.log('approveTrade');
      setLoadingTrades(true);
      const { request } = await publicClient.simulateContract({
        account: address,
        address: config.LISKSEPOLIA.CONTRACT_NATIVE_COIN as `0x${string}`,
        abi: ERC20.abi,
        functionName: 'approve',
        args: [config.LISKSEPOLIA.CONTRACT_TRADE_TTS_ADDR, price],
      });
      /*const request = await walletClient.prepareTransactionRequest({ 
        account: address,
        to: config.LISKSEPOLIA.CONTRACT_NATIVE_COIN,
        value: price
      });*/
      const write = await walletClient.writeContract(request);
    } catch (e) {
      setLoadingTrades(false);
      console.log('error');
      console.log(e)
    }
  }

  const executeTrade = async (address: `0x${string}`, idTrace: number, value: number) => {
    try {
      console.log('executeTrade', address, idTrace, value);
      setLoadingTrades(true);
      const { request } = await publicClient.simulateContract({
        account: address,
        address: config.LISKSEPOLIA.CONTRACT_TRADE_TTS_ADDR as `0x${string}`,
        abi: Trade_TTS.abi,
        functionName: 'executeTrade',
        args: [idTrace],
        value: value,
      });
      const write = await walletClient.writeContract(request);
    } catch (e) {
      setLoadingTrades(false);
      console.log('error');
      console.log(e)
    }
  }

  const cancelTrade = async (address: `0x${string}`, id: number) => {
    try {
      console.log('cancelTrade');
      setLoadingTrades(true);
      const { request } = await publicClient.simulateContract({
        account: address,
        address: config.LISKSEPOLIA.CONTRACT_TRADE_TTS_ADDR as `0x${string}`,
        abi: Trade_TTS.abi,
        functionName: 'cancelTrade',
        args: [id],
      });
      const write = await walletClient.writeContract(request);
    } catch (e) {
      setLoadingTrades(false);
      console.log('error');
      console.log(e)
    }
  }

  const switchChain = async () => {
    try {
      console.log('switchChain', liskSepolia.id);
      if (walletClient && !loadingSwitch) {
        setLoadingSwitch(true);
        await walletClient.switchChain({ id: liskSepolia.id });
      }
    } catch (e) {
      console.log(e);
    }
    setLoadingSwitch(false);
  }

  const isGoodChain = (idChain: number | undefined) => {
    if (idChain === undefined) return false;
    const liskId = liskSepolia.id;
    return idChain === liskId;
  }

  return (
    <Web3Context.Provider
      value={{
        loading,
        loadingTx,
        loadingNft,
        loadingMint,
        loadingBurn,
        loadingTrades,
        loadingSwitch,
        transactions,
        getTransaction,
        nfts,
        getNfts,
        actionMint,
        actionBurn,
        trades,
        getTrades,
        openTrade,
        approveTrade,
        executeTrade,
        cancelTrade,
        switchChain,
        isGoodChain,
      }}>
      {props.children}
    </Web3Context.Provider>
  )
}

export default Web3Context;

