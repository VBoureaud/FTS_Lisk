import React, { useEffect, useContext } from "react";
import {
  useAccount,
} from 'wagmi';
import styles from './market.module.css'
import Web3Context, { tradesEnum } from "@/store/Web3Context";
import Web2Context from "@/store/Web2Context";

import config from "@/config/index";

import Navigation from "@/components/Navigation/Navigation";
import { Link } from "react-router-dom";

// Token
import { nameTypeToken } from "@/utils/gameEngine";
import NftsIcon from "@/components/NftsIcon";
import AgritelMarket from "@/components/AgritelMarket";
import ListMarket from "@/components/ListMarket";

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
    simulationState,
  } = useContext(Web2Context);

  useEffect(() => {
    if (simulationState && !loadingTrades)
      getTrades();
    if (simulationState && !loadingMetaData && !metaDatas)
      getMetaData();
  }, []);

  return (
    <>
      <Navigation />
      <div
        style={{
          maxWidth: "768px",
          display: 'flex',
          flexDirection: 'column',
          justifyContent: "center",
          alignItems: "center",
          paddingTop: '25px',
          margin: 'auto',
        }}
      >
        <h1>Market</h1>

        {!address && <>
          <h3>Connect an account to join the platform.</h3>
        </>}

        {address && simulationState && <>
          <p>Address: {config.LISKSEPOLIA.CONTRACT_TRADE_TTS_ADDR}</p>
          {loadingTrades && <p>loadingTrades</p>}
          {!trades && !loadingTrades && <p>No trades yet</p>}
          {metaDatas && trades && trades.map((elt: any, index: number) => {
            const infoToken = metaDatas.filter((data: any) => data.name == parseInt(elt[tradesEnum.item]) + '')[0];
            if (!infoToken) return null;
            return (
              <div key={index} className={styles.tradeBlock}>
                <div style={{ maxWidth: '150px' }}>
                  <Link to={config.subDomain + `/nfts/${infoToken.name}`}>
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
                    && <button style={{ padding: '5px' }} onClick={() => cancelTrade(address, elt[tradesEnum.id])}>Cancel Trade</button>}
                  {address && elt[tradesEnum.from] !== address
                    && elt[tradesEnum.status] === 'Open'
                    && <button style={{ padding: '5px' }} onClick={() => executeTrade(address, elt[tradesEnum.id], elt[tradesEnum.price])}>Execute Trade</button>}
                  {address && elt[tradesEnum.from] !== address
                    && elt[tradesEnum.status] === 'Open'
                    && <button style={{ padding: '5px' }} onClick={() => approveTrade(address, elt[tradesEnum.price])}>Approve Trade</button>}
                </div>
              </div>
            );
          })}
        </>}

        {address && !simulationState && <>
          <span style={{ margin: '15px', display: 'block' }}></span>
          <AgritelMarket />
          <span style={{ margin: '15px', display: 'block' }}></span>
          <ListMarket />
        </>}
      </div>
    </>
  );
};

export default MarketPage;
