// @ts-ignore
'use client';

import React, { useEffect, useContext } from "react";
import Image from "next/image";
import {
  useAccount,
} from 'wagmi';
import styles from './market.module.css'
import Web3Context, { tradesEnum } from "@/store/Web3Context";
import Web2Context from "@/store/Web2Context";

import config from "@/config";

// Token
import Link from 'next/link';
import { nameTypeToken } from "@/utils/gameEngine";
import NftsIcon from "@/components/NftsIcon";

type Props = {};

const MarketPage = (props: Props) => {
  const {
    address,
  } = useAccount();

  const {
    loadingTrades,
    getTrades,
    cancelTrade,
    executeTrade,
    approveTrade,
    trades,
  } = useContext(Web3Context);

  const {
    loadingMetaData,
    getMetaData,
    metaDatas,
  } = useContext(Web2Context);

  useEffect(() => {
    if (!loadingTrades && !trades)
      getTrades();
    if (!loadingMetaData && !metaDatas)
      getMetaData();
  }, []);

  return (
    <div
      style={{
        maxWidth: "768px",
        display: 'flex',
        flexDirection: 'column',
        justifyContent: "center",
        alignItems: "center",
        paddingTop: '25px',
      }}
    >
      <h1>Market</h1>
      <p>Address: {config.LISKSEPOLIA.CONTRACT_TRADE_TTS_ADDR}</p>
      {loadingTrades && <p>loadingTrades</p>}
      {!trades && !loadingTrades && <p>No trades yet</p>}
      {metaDatas && trades && trades.map((elt: any, index: number) => {
        const infoToken = metaDatas.filter((data: any) => data.name == parseInt(elt[tradesEnum.item]) + '')[0];
        if (!infoToken) return null;
        return (
          <div key={index} className={styles.tradeBlock}>
            <div style={{ maxWidth: '150px' }}>
              <Link href={`/nfts?name=${infoToken.name}`}>
                <NftsIcon
                  nftTokenName={infoToken.name ? nameTypeToken[infoToken.name.slice(-3)].name : ''}
                  user={infoToken.owner.hash}
                  tokenType={infoToken.name.slice(-3)}
                  tokenDate={''}
                  tokenIssuer={''}
                  tokenOwner={infoToken.owner.hash}
                  validity={true}
                  sizeCss={"nftTokenMiddle middleType"}
                />
              </Link>
            </div>
            <div style={{ padding: '15px' }}>
              <h6>from: {elt[tradesEnum.from]}</h6>
              <h6>owner: {infoToken.owner.hash}</h6>
              <h4>item: {parseInt(elt[tradesEnum.item])}</h4>
              <h3>price: {parseInt(elt[tradesEnum.price])}</h3>
              <h3>status: {elt[tradesEnum.status]}</h3>

              {address && elt[tradesEnum.from] === address
                && elt[tradesEnum.status] === 'Open'
                && <button onClick={() => cancelTrade(address, elt[tradesEnum.id])}>Cancel Trade</button>}
              {address && elt[tradesEnum.from] !== address
                && elt[tradesEnum.status] === 'Open'
                && <button onClick={() => executeTrade(address, elt[tradesEnum.id], elt[tradesEnum.price])}>Execute Trade</button>}
              {address && elt[tradesEnum.from] !== address
                && elt[tradesEnum.status] === 'Open'
                && <button onClick={() => approveTrade(address, elt[tradesEnum.price])}>Approve Trade</button>}

            </div>
          </div>
        );
      })}
    </div>
  );
};

export default MarketPage;
