// @ts-ignore
'use client';

import React, { useState, useEffect, useContext } from 'react';
import {
  useAccount,
} from 'wagmi';
import styles from "./page.module.css";
import Web3Context from "@/store/Web3Context";
import Web2Context from "@/store/Web2Context";
import MintButton from "@/components/MintButton";
import { parseEther } from 'viem';

// Token
import Link from 'next/link';
import { nameTypeToken } from "@/utils/gameEngine";
import NftsIcon from "@/components/NftsIcon";

//import GameHoney from "@/components/Game/GameHoney";

import GameHeatToken from "@/components/Game/GameHeatToken";
import GameIceToken from "@/components/Game/GameIceToken";
import GameMixToken from "@/components/Game/GameMixToken";
import GameBoxToken from "@/components/Game/GameBoxToken";

import Modal from '@mui/material/Modal';
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import CloseIcon from "@mui/icons-material/Close";

type GameMapper = {
  [x: string]: {
    e: any;
  };
};
const gameMapper: GameMapper = {
  '1': { e: GameHeatToken },
  '2': { e: GameIceToken },
  '3': { e: GameMixToken },
  '4': { e: GameBoxToken },
}

export default function Home() {
  const {
    nfts,
    getNfts,
    loadingNft,
    loadingMint,
    actionMint,
    openTrade,
  } = useContext(Web3Context);

  const {
    loadingUser,
    getUser,
    user,
  } = useContext(Web2Context);

  const { address } = useAccount();
  const [openModal, setOpenModal] = React.useState(false);
  const [playing, setPlaying] = React.useState(false);
  const [activity, setActivity] = React.useState(null);  
  
  useEffect(() => {
    console.log('hello page');
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
    const randGame = Math.floor((Math.random() * Object.keys(gameMapper).length) + 1);
    const randCoinWin = Math.floor((Math.random() * 28) + 1);

    console.log({ randCoinWin });
    const Type = gameMapper[randGame].e;
    setActivity(
      <Type 
        onLaunch={(isPlay: boolean) => setPlaying(isPlay)}
        canPlay={!playing}
        type={''}
        onVictory={() => { actionMint(address, randCoinWin); setOpenModal(false); }}
        onLose={onLost}
      />
    );
    setOpenModal(true);
  }

  return (
    <>
      <div>
        {!user && <h1>Welcome !</h1>}
        {user && user.name && <h1>Hello {user.name} !</h1>}
        {!loadingUser && !user && address && <h3>New in the game ? <Link href={"/account"}><button className={styles.joinBtn}>Join here</button></Link></h3>}
        {loadingUser && <h6>Loading...</h6>}

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

        <button
          onClick={() => launchGame(address)}
          style={{ padding: '5px'}}>
          Play and win NFT
        </button>
        {loadingMint && <p>Mint is loading</p>}

        <div>
          {loadingNft && <p>Loading NFTs</p>}
          {nfts
            && nfts.items
            && nfts.items.filter((elt: any) => elt.owner.hash == address).map((elt: any, index: number) =>
              <div key={index} className={styles.nftBlock}>
                <div style={{ maxWidth: '150px' }}>
                  <Link href={`/nfts?name=${elt.id}`}>
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
                  {elt.owner.hash === address && <button onClick={() => openTrade(address, parseInt(elt.id), parseEther('0.001'))}>Open for Trade at 0.001ETH</button>}
                </div>
              </div>
            )}
        </div>
      </div>
    </>
  );
}
