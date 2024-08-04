import React, { useState, useEffect, useContext } from "react";
import {
  useAccount,
} from 'wagmi';
import { useParams } from "react-router-dom";
import Navigation from "@/components/Navigation/Navigation";
import NftsIcon from "@/components/NftsIcon";
import Web2Context from "@/store/Web2Context";
//import { useSearchParams } from 'next/navigation'
import { nameTypeToken } from "@/utils/gameEngine";
import { strResume, displayDate, getDistanceFromLatLonInKm } from "@/utils";
import { Table, Tooltip } from "antd";
import WorldMap from "@/components/WorldMap";
import styles from "./nfts.module.css";
import config from "@/config/index";

type Props = {};

const historyLineBuilder = (history: any, users: any) => {
  const result = [];
  if (history.length != 3 || !users) return [];
  const usersLocations = [];
  for (let i = 0; i < history.length; i++) {
    const user1 = users.filter((u: any) => u.address == history[i].user)[0];
    if (user1)
      usersLocations.push([user1.location.lng, user1.location.lat]);
  }
  for (let i = 0; i < usersLocations.length; i++) {
    if (i + 1 < usersLocations.length)
      result.push({
        start: usersLocations[i],
        end: usersLocations[i + 1],
      });
  }
  return result;
}

const getUserInfo = (users: any, address: string) => users && users.filter((u: any) => u.address == address)[0];

const NftsPage = (props: Props) => {
  const { nftId } = useParams();
  const nftsName = nftId;//nftsParams.get('name');
  const [nftInfo, setNftInfo] = useState<any | null>(null);
  const [historyLocation, setHistoryLocation] = useState<any | null>(null);

  const {
    loadingUser,
    loadingUsers,
    getUser,
    getAllUsers,
    user,
    users,
    loadingMetaData,
    getMetaData,
    metaDatas,
  } = useContext(Web2Context);

  const {
    address,
  } = useAccount();

  useEffect(() => {
    // always reload metadata here
    getMetaData();
    if (!users) {
      getAllUsers();
    }
  }, []);

  useEffect(() => {
    if (metaDatas && nftsName && users) {
      const info = metaDatas.filter((elt: any) => elt.name == nftsName)[0];
      if (info && info.history) {
        setNftInfo(info);
        const history = historyLineBuilder(info.history, users);
        setHistoryLocation(history);
      }
    }
  }, [metaDatas, nftsName, users]);

  useEffect(() => {
    if (!user && address) {
      getUser(address);
    }
  }, [address]);

  useEffect(() => {
    if (users && nftInfo) {
      const user = users.filter((u: any) => u.address == nftInfo.history[0].user);
    }
  }, [users]);

  const columns = [
    'action',
    'date',
    'user',
    'price',
  ];

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
        <div>
          {loadingMetaData && <p>Loading NFT...</p>}
          {nftInfo && <>
            <NftsIcon
              nftTokenName={nftInfo && nftInfo.name ? nameTypeToken[nftInfo.name.slice(-3)].name : ''}
              user={address}
              tokenType={nftInfo.name.slice(-3)}
              tokenDate={nftInfo.history.length > 0 ? nftInfo.history[0].date : ''}
              tokenIssuer={nftInfo.history.length > 0 ? nftInfo.history[0].user : ''}
              tokenOwner={nftInfo.owner}
              validity={nftInfo.validity}
              sizeCss={"nftToken type"}
            />
          </>}
        </div>
        {nftInfo && <div>
          <h3>name: {nftInfo && nameTypeToken[nftInfo.name.slice(-3)].name}</h3>
          <h3>owner: {nftInfo && nftInfo.owner.hash}</h3>
        </div>}
      </div>

      <div
        style={{
          maxWidth: "768px",
          margin: 'auto',
          marginTop: '35px',
        }}
      >
        {nftInfo && nftInfo.history && <h3 style={{ textAlign: 'center' }}>History</h3>}
        {nftInfo && nftInfo.history && users &&
          <div className={styles.tableContainer}>
            <table className={styles.tableHistory}>
              <thead className={styles.tableColumn}>
                <tr>
                  {columns.map((elt: any, index: number) => <th key={index}>{elt}</th>)}
                </tr>
              </thead>

              {nftInfo.history.map((elt: any, index: number) => {
                const user = getUserInfo(users, elt.user);
                const userRender = user && <div style={{ textAlign: 'center' }}>
                  <p>{user.name}</p>
                  <p>
                    <Tooltip title={user.address}>
                      {strResume(user.address, 8, '...')}
                    </Tooltip>
                  </p>
                  <p>{user.location.name}</p>
                </div>;
                return (
                  <tbody key={index} className={styles.tableContent}>
                    <tr>
                      <td>{elt.action}</td>
                      <td>{displayDate(elt.date, true)}</td>
                      <td>{userRender ? userRender : elt.user == config.LISKSEPOLIA.CONTRACT_TRADE_TTS_ADDR ? 'MarketPlace Contract' : elt.user}</td>
                      <td>{elt.price}</td>
                    </tr>
                  </tbody>
                );
              })}

            </table>
          </div>}
        {loadingUsers && <h5>Loading users...</h5>}
        {nftInfo && nftInfo.history && users &&
          <div style={{ maxWidth: '768px', width: '100%', borderRadius: '10px', border: '2px solid black' }}>
            <WorldMap
              markers={nftInfo.history.reverse().map((elt: any) => {
                const user = users.filter((u: any) => u.address == elt.user)[0];
                if (!user) return null;
                return ({
                  markerOffset: 15,
                  name: user.name,
                  coordinates: [user.location.lng, user.location.lat],
                });
              }).filter((result: any) => result)}
              lines={historyLocation}
              circleMarker
            //linesParents={parentsLineBuilder(stateNft.parents, [])}
            />
          </div>}
        {nftInfo && nftInfo.history && historyLocation && historyLocation.length > 0 &&
          <div style={{ fontSize: '20px' }}>{
            Math.round(historyLocation
              .map((a) => getDistanceFromLatLonInKm(a.start[1], a.start[0], a.end[1], a.end[0]))
              .reduce((a, b) => a + b))
          } Kms traveled</div>
        }
        <span style={{ margin: '20px' }}></span>
      </div>
    </>
  );
};

export default NftsPage;