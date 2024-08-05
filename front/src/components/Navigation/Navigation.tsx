import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import Web2Context from "@/store/Web2Context";
import Web3Context from "@/store/Web3Context";
import { ConnectWallet } from "@/components/WagmiWallet/ConnectWallet";
import {
  useAccount,
} from 'wagmi';
import config from "@/config";

type Props = {
};

enum Route {
  HOME = "Home",
  MARKET = "Market",
  ACCOUNT = "Account",
}

const routes = {
  [Route.HOME]: config.subDomain + "/",
  [Route.MARKET]: config.subDomain + "/market",
  [Route.ACCOUNT]: config.subDomain + "/account",
};

const Navigation = (props: Props) => {
  //const basePath = usePathname();
  const basePath = '';
  const { address, chainId } = useAccount();

  const {
    setDisconnected
  } = React.useContext(Web2Context);

  const {
    loadingSwitch,
    switchChain,
    isGoodChain
  } = React.useContext(Web3Context);

  return (
    <>
      <nav
        style={{
          display: "flex",
          gap: "2rem",
          justifyContent: "center",
          alignItems: "center",
          padding: "2rem",
          background: '#222',
        }}
      >
        <h3>FTS</h3>
        {Object.entries(routes).map(([name, path]) => (
          <Link to={path} key={path} style={{ textDecoration: "none" }}>
            {basePath === path ? <strong>{name}</strong> : name}
          </Link>
        ))}

        <div style={{ display: 'flex', flexDirection: 'row' }}>
          {address && !isGoodChain(chainId)
            && <button
              style={{
                cursor: 'pointer',
                padding: '5px',
                background: '#4752ff',
                border: '1px solid #8186e3',
                borderRadius: '5px',
                marginRight: '5px',
              }}
              onClick={() => switchChain()}
            >
              {!loadingSwitch && <span>Switch to Lisk Sepolia</span>}
              {loadingSwitch && <span>Loading...</span>}
            </button>}

          <ConnectWallet
            onDisconnect={setDisconnected}
          />
        </div>
      </nav>
    </>
  );
};

export default Navigation;
