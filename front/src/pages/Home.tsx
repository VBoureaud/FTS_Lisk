import React, { useState, useEffect, useContext } from 'react';
import {
  useAccount,
} from 'wagmi';
import styles from "./home.module.css";
import Web3Context from "@/store/Web3Context";
import Web2Context from "@/store/Web2Context";
import { parseEther } from 'viem';
import Navigation from "@/components/Navigation/Navigation";
import ListInvest from "@/components/ListInvest";
import config from "@/config";

import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css";

// Token
import { Link } from "react-router-dom";
import { nameTypeToken } from "@/utils/gameEngine";
import NftsIcon from "@/components/NftsIcon";

import P5Game from "@/components/Game/P5Game";
import sketch1, { ruleSketch1 } from "@/components/Game/GameSketch1";
import sketch2, { ruleSketch2 } from "@/components/Game/GameSketch2";
import sketch3, { ruleSketch3 } from "@/components/Game/GameSketch3";
import sketch4, { ruleSketch4 } from "@/components/Game/GameSketch4";
import sketch5, { ruleSketch5 } from "@/components/Game/GameSketch5";
import sketch6, { ruleSketch6 } from "@/components/Game/GameSketch6";
import sketch7, { ruleSketch7 } from "@/components/Game/GameSketch7";
import sketch8, { ruleSketch8 } from "@/components/Game/GameSketch8";
import sketch9, { ruleSketch9 } from "@/components/Game/GameSketch9";

import Modal from '@mui/material/Modal';
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import CloseIcon from "@mui/icons-material/Close";
import {
  Button,
} from 'antd';

type GameMapper = {
  [x: string]: {
    e: any;
  };
};
const gameMapper: GameMapper = {
  /*  '1': { e: GameHeatToken },
    '2': { e: GameIceToken },
    '3': { e: GameMixToken },
    '4': { e: GameBoxToken },
  */
  '1': { e: P5Game },
  '2': { e: P5Game },
  '3': { e: P5Game },
  '4': { e: P5Game },
}

export default function Home() {
  const {
    nfts,
    getNfts,
    loadingNft,
    loadingMint,
    actionMint,
    openTrade,
    isGoodChain,
  } = useContext(Web3Context);

  const {
    loadingUser,
    getUser,
    user,
    simulationState,
  } = useContext(Web2Context);

  const { address, chainId } = useAccount();
  const [openModal, setOpenModal] = React.useState(false);
  const [playing, setPlaying] = React.useState(false);
  const [activity, setActivity] = React.useState<any>(null);

  useEffect(() => {
    if (!nfts && !loadingNft) getNfts();
  }, [nfts]);

  useEffect(() => {
    if (address) {
      getUser(address);
    }
  }, [address]);

  const onLost = () => {
    setPlaying(false);
    setOpenModal(false);
  }

  const launchGame = (address: string) => {
    const Type = gameMapper[1].e;
    const totalGame = [
      { sketch: sketch1, ruleSketch: ruleSketch1 },
      { sketch: sketch2, ruleSketch: ruleSketch2 },
      { sketch: sketch3, ruleSketch: ruleSketch3 },
      { sketch: sketch4, ruleSketch: ruleSketch4 },
      { sketch: sketch5, ruleSketch: ruleSketch5 },
      { sketch: sketch6, ruleSketch: ruleSketch6 },
      { sketch: sketch7, ruleSketch: ruleSketch7 },
      { sketch: sketch8, ruleSketch: ruleSketch8 },
      { sketch: sketch9, ruleSketch: ruleSketch9 },
    ];
    const randGame = Math.floor(Math.random() * totalGame.length);
    const randCoinWin = Math.floor((Math.random() * 28) + 1);

    setActivity(
      <Type
        onLaunch={(isPlay: boolean) => setPlaying(isPlay)}
        canPlay={!playing}
        type={''}
        tokenName={''}
        onVictory={() => { actionMint(address as `0x{string}`, randCoinWin + ""); setPlaying(false); setOpenModal(false); }}
        onLose={onLost}
        sketch={totalGame[randGame].sketch}
        ruleSketch={totalGame[randGame].ruleSketch}
        cost={'0.008'}
      />
    );
    setOpenModal(true);
  }

  return (
    <>
      <Navigation />
      <div style={{ maxWidth: '768px', padding: '30px', margin: 'auto', marginTop: '40px' }}>
        {!user && <h1>Welcome !</h1>}
        {user && user.name && <h1>Hello {user.name} !</h1>}
        {!loadingUser && !user && address && <h3>New in the game ? <Link to={config.subDomain + "/account"}><button className={styles.joinBtn}>Join here</button></Link></h3>}
        {loadingUser && <h6>Loading...</h6>}
        <h3 style={{ fontWeight: 'normal', margin: '15px' }}>Food Trust & Simulator is a platform offering two tools, a simulation-based interface to better understand the concept of blockchain which introduce the second: a solution to help farmers tokenize their crops.</h3>
        {!address && <>
          {!loadingUser && <h3>Connect an account to join the platform.</h3>}
        </>}
        {address && !isGoodChain(chainId) && <p>Switch to Lisk Sepolia to continue.</p>}

        <Modal
          open={openModal}
          onClose={() => !playing && setOpenModal(false)}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
          style={{ display: 'flex', alignItems: 'center' }}
        >
          <Box sx={{
            width: '98vw',
            margin: 'auto',
            marginTop: '10px',
            padding: '15px',
            background: 'white',
            color: 'black',
            borderRadius: '5px',
          }}>
            {activity && activity}
            {!activity && <>
              <Typography id="modal-modal-title" variant="h6" component="h2">
                Something went wrong.
              </Typography>
            </>}
          </Box>
        </Modal>

        {loadingMint && <p>Mint is loading</p>}

        {/* Simulation mode ON */}
        {address && simulationState && <div>
          {isGoodChain(chainId) && <button
            onClick={() => launchGame(address as `0x{string}`)}
            style={{ padding: '5px' }}>
            Play and win NFT
          </button>}
          {loadingNft && <p>Loading NFTs</p>}
          {nfts
            && nfts.items
            && nfts.items.filter((elt: any) => elt.owner.hash == address).map((elt: any, index: number) =>
              <div key={index} className={styles.nftBlock}>
                <div style={{ maxWidth: '150px' }}>
                  <Link to={config.subDomain + `/nfts/${elt.id}`}>
                    <NftsIcon
                      nftTokenName={elt.id ? nameTypeToken[elt.id.slice(-3)].name : ''}
                      user={elt.owner.hash}
                      tokenType={elt.id.slice(-3)}
                      tokenDate={''}
                      tokenIssuer={''}
                      tokenOwner={elt.owner.hash}
                      validity={true}
                      sizeCss={"nftTokenMiddle middleType"}
                    />
                  </Link>
                </div>
                <div style={{ padding: '15px' }}>
                  <h2>{elt.id ? nameTypeToken[elt.id.slice(-3)].name : ''}</h2>
                  <h3>{elt.id}</h3>
                  <h5>{elt.owner.hash}</h5>
                  {elt.owner.hash === address && <button onClick={() => openTrade(address as `0x{string}`, parseInt(elt.id), parseEther("0.001"))}>Open for Trade at 0.001ETH</button>}
                </div>
              </div>
            )
          }
        </div>}

        {/* Simulation mode OFF */}
        {address && !simulationState && <div>

          {/* Stock */}
          <div style={{ marginTop: '15px' }}>
            <h3>Your items</h3>
            <div style={{ display: 'flex' }}>
              <div style={{ flex: 1, maxWidth: '100%' }}>
                <Carousel
                  showThumbs={true}
                  transitionTime={400}
                  onChange={(item) => console.log(item)}
                  className=""
                  emulateTouch={true}
                  infiniteLoop
                  showStatus={false}
                  showIndicators={true}
                  swipeable={true}
                  showArrows={true}
                //selectedItem={skin}
                >
                  <div className={styles.itemBox}>
                    <div style={{ flex: 1, maxWidth: '150px', margin: '5px' }}>
                      <NftsIcon
                        nftTokenName={'test'}
                        user={'test'}
                        tokenType={'5'}
                        tokenDate={''}
                        tokenIssuer={''}
                        tokenOwner={''}
                        validity={true}
                        sizeCss={"nftTokenMiddle middleType"}
                      />
                    </div>
                    <div className={styles.description}>
                      <h3>Cherries</h3>
                      <h5>Batch numbers: 154a89z7es8</h5>
                      <h5>Expiration dates: 21-09-2024</h5>
                      <h5>Quantity: 800 Tokens</h5>
                      <h5>Available: 150 Tokens</h5>
                      <h5>Investors: 6</h5>
                    </div>
                  </div>
                  <div className={styles.itemBox}>
                    <div style={{ flex: 1, maxWidth: '150px', margin: '5px' }}>
                      <NftsIcon
                        nftTokenName={'test'}
                        user={'test'}
                        tokenType={'7'}
                        tokenDate={''}
                        tokenIssuer={''}
                        tokenOwner={''}
                        validity={true}
                        sizeCss={"nftTokenMiddle middleType"}
                      />
                    </div>
                    <div className={styles.description}>
                      <h3>Cheese</h3>
                      <h5>Batch numbers: 154a89z7es8</h5>
                      <h5>Expiration dates: 30-08-2024</h5>
                      <h5>Quantity: 200 Tokens</h5>
                      <h5>Available: 50 Tokens</h5>
                      <h5>Investors: 9</h5>
                    </div>
                  </div>
                  <div className={styles.itemBox}>
                    <div style={{ flex: 1, maxWidth: '150px', margin: '5px' }}>
                      <NftsIcon
                        nftTokenName={'test'}
                        user={'test'}
                        tokenType={'14'}
                        tokenDate={''}
                        tokenIssuer={''}
                        tokenOwner={''}
                        validity={true}
                        sizeCss={"nftTokenMiddle middleType"}
                      />
                    </div>
                    <div className={styles.description}>
                      <h3>Corn</h3>
                      <h5>Batch numbers: 154a89z7es8</h5>
                      <h5>Expiration dates: 21-09-2026</h5>
                      <h5>Quantity: 500 Tokens</h5>
                      <h5>Available: 350 Tokens</h5>
                      <h5>Investors: 4</h5>
                    </div>
                  </div>
                </Carousel>
              </div>
              <div style={{ flex: 1, paddingTop: '35px', maxWidth: '150px', margin: '5px' }}>
                <Link to={config.subDomain + "/addItem"}><div className={styles.addBtn}>+</div></Link>
              </div>
            </div>

          </div>

          {/* Invest */}
          <div>
            <h3>Your Invests</h3>
            <ListInvest />
          </div>
        </div>}
      </div>
    </>
  );
}
