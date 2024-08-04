import React, { useState, useEffect, useContext } from "react";
import Navigation from "@/components/Navigation/Navigation";
import {
  useAccount,
} from 'wagmi';
import styles from './account.module.css'
import Balance from '@/components/Balance';
import Transactions from '@/components/Transactions';
import Web3Context from "@/store/Web3Context";
import Web2Context from "@/store/Web2Context";
import { PictureCreator, ProfileCreator } from "@/components/Profile";
import { levelDisplay, nameTypeToken, profilesGame } from "@/utils/gameEngine";
import NftsIcon from "@/components/NftsIcon";
import SalesDashboard from "@/components/SalesDashboard/SalesDashboard";
import { apiServer } from "@/config/index";
import { Switch } from "antd";

type ProfileProps = {
  name: string;
  type: string;
  image: string;
  description: string;
  pocketSize: number;
  typeCount: number;
  typeRandom: boolean;
  sell: {
    farmer: number;
    manager: number;
    cook: number;
  };
};

const listProfiles: ProfileProps[] = Object.keys(profilesGame).map((elt: any) => ({
  name: elt,
  type: elt,
  image: profilesGame[elt].image,
  description: profilesGame[elt].description['en'],
  pocketSize: profilesGame[elt].pocketSize,
  typeCount: profilesGame[elt].typeCount,
  typeRandom: profilesGame[elt].typeRandom,
  sell: profilesGame[elt].sell,
})
);

type Props = {};

const AccountPage = (props: Props) => {
  const [isMounted, setIsMounted] = useState(false);

  const {
    //isConnected,
    address,
    chainId,
    /*addresses,
    isConnecting,
    isDisconnected,
    isReconnecting,
    status*/
  } = useAccount();

  const {
    loadingUser,
    getUser,
    user,
    loadingMetaData,
    errorServer,
    createUser,
    getMetaData,
    metaDatas,
    simulationState,
    updateSimulation,
  } = useContext(Web2Context);

  const {
    loadingTx,
    transactions,
    getTransaction,
    isGoodChain,
  } = useContext(Web3Context);

  useEffect(() => {
    if (!metaDatas)
      getMetaData();
  }, []);

  useEffect(() => {
    /*if (address && !loadingTx && !transactions)
      getTransaction(address);*/
    if (!user && address)
      getUser(address);
    setIsMounted(true);
  }, [address]);


  const onSwitchSimulation = (checked: boolean) => {
    console.log(`switch to ${checked}`);
    updateSimulation(checked);
  };

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
        {!address && <>
          {!loadingUser && <h3>Connect an account to join the platform.</h3>}
          {loadingUser && <h3>Loading...</h3>}
        </>}

        {/* Creation Account */}
        {address && isMounted && !loadingMetaData && !loadingUser && !user && <>
          <h1 style={{ marginBottom: '15px' }}>Welcome in <span style={{ fontSize: '40px' }}>Food Trust Simulator</span>.</h1>
          <ProfileCreator
            listProfiles={listProfiles}
            onClick={(data: any) => createUser({ ...data, address })}
            apiServer={apiServer.getCities.url}
            loadingConfirm={false}
            errConfirm={false}
          />
          <span className={styles.separator}></span>
        </>}

        {address && loadingUser && <h3>Loading User...</h3>}
        {address && errorServer && <h3>Server connection issue.</h3>}

        {address && user && <>
          <h1>My account</h1>
          {!isGoodChain(chainId) && <h6>Switch to Lisk Sepolia to continue.</h6>}

          <h4 style={{ marginTop: '15px' }}>Simulation: <Switch defaultChecked={simulationState} onChange={onSwitchSimulation} /></h4>

          <span className={styles.separator}></span>
          {/*<h4>{address}</h4>*/}
          <span className={styles.separator}></span>

          {simulationState && <div style={{ display: 'flex' }}>
            <PictureCreator
              mode={0}
              imageDisplay={user.image}
              level={user.experience > 0 ? levelDisplay(user.experience) : 1}
              type={user.type}
              name={user.name}
              location={user.location.name}
            />

            {/*
                <p className={styles.details}>isConnected: {isConnected ? 'true' : 'false'}</p>
                <p className={styles.details}>address: {address}</p>
                <p className={styles.details}>addresses: {addresses}</p>
                <p className={styles.details}>chainId: {chainId}</p>
                <p className={styles.details}>isConnecting: {isConnecting ? 'true' : 'false'}</p>
                <p className={styles.details}>isDisconnected: {isDisconnected ? 'true' : 'false'}</p>
                <p className={styles.details}>isReconnecting: {isReconnecting ? 'true' : 'false'}</p>
                <p className={styles.details}>status: {status}</p>
                {isConnected && address && <Balance address={address} />}
              */}
            {/*isConnected 
                && <Transactions 
                      loading={loadingTx}
                      transactions={transactions}
                   />*/}

            <div style={{ padding: '15px 40px' }}>
              {address && <h2 style={{ marginBottom: '20px' }}>Your Quest</h2>}
              {loadingMetaData && <h3>Loading NFTS...</h3>}
              {user && user.quest[0].tokenNeeded.map((elt: string, index: number) =>
                <span key={index} style={{ display: 'block', margin: '15px', width: '100px' }}>
                  <NftsIcon
                    nftTokenName={''}
                    user={address}
                    tokenType={elt && elt.length > 3 && elt.slice(-3)}
                    tokenDate={''}
                    tokenIssuer={''}
                    tokenOwner={''}
                    validity={true}
                    sizeCss={"nftTokenMin minType"}
                  />
                </span>
              )}
            </div>
          </div>}

          {!simulationState && <div>
            <h3 style={{ marginBottom: '15px' }}>You can now browse the website as an investor/farmer, but you will only see simulation data.</h3>
            <SalesDashboard />
          </div>}
        </>}

      </div>
    </>
  );
};

export default AccountPage;
