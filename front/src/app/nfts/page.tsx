// @ts-ignore
'use client';

import React, { useState, useEffect, useContext } from "react";
import {
  useAccount,
} from 'wagmi';
import NftsIcon from "@/components/NftsIcon";
import Web2Context from "@/store/Web2Context";
import { useSearchParams } from 'next/navigation'
import { nameTypeToken } from "@/utils/gameEngine";
import { strResume, displayDate } from "@/utils";
import { Table, Tooltip } from "antd";
import WorldMap from "@/components/WorldMap";
import styles from "./nfts.module.css";

type Props = {};

const historyLineBuilder = (history: any, users: any) => {
  const result = [];
  console.log({ history });;
  if (history.length != 3) return [];
  //for (let i = 0; i < history.length; i++) {
    //if (i + 2 == history.length) continue;
    const user1 = users.filter((u: any) => u.address == history[0].user)[0];
    //if (!user1) continue;
    const user2 = users.filter((u: any) => u.address == history[2].user)[0];
    //if (!user2) continue;
    console.log({user1, user2 });
    if (user1.address == user2.address) return [];

    result.push({
      start: [user1.location.lng, user1.location.lat],
      end: [user2.location.lng, user2.location.lat],
    });
    console.log({ result });
  //}
  return result;
}

const getUserInfo = (users: any, address: string) => users && users.filter((u: any) => u.address == address)[0];

const NftsPage = (props: Props) => {
  const nftsParams = useSearchParams()
  const nftsName = nftsParams.get('name');
  const [nftInfo, setNftInfo] = useState<any | null>(null);

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
    if (!metaDatas)
      getMetaData();
    if (!users) {
      getAllUsers();
    }
  }, []);

  useEffect(() => {
    if (metaDatas && nftsName) {
      setNftInfo(
        metaDatas.filter((elt: any) => elt.name == nftsName)[0])
    }
  }, [metaDatas, nftsName]);

  useEffect(() => {
    // console.log({ address });
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
        <div>
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
        <div>
          <h3>name: {nftInfo && nameTypeToken[nftInfo.name.slice(-3)].name}</h3>
          <h3>owner: {nftInfo && nftInfo.owner.hash}</h3>
        </div>
      </div>

      {nftInfo && nftInfo.history && <h3>history</h3>}
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
                    <td>{userRender ? userRender : elt.user}</td>
                    <td>{elt.price}</td>
                  </tr>
                </tbody>
              );
            })}

          </table>
        </div>}
      {loadingUsers && <h5>Loading users...</h5>}
      {nftInfo && nftInfo.history && users &&
        <div style={{ maxWidth: '400px', width: '100%', borderRadius: '10px', border: '2px solid black' }}>
          <WorldMap
            markers={nftInfo.history.reverse().map((elt: any) => {
              const user = users.filter((u: any) => u.address == elt.user)[0];
              console.log({ user });
              if (!user) return null;
              return ({
                markerOffset: 15,
                name: user.name,
                coordinates: [user.location.lng, user.location.lat],
              });
            }).filter((result: any) => result)}
            lines={historyLineBuilder(nftInfo.history, users)}
            circleMarker
          //linesParents={parentsLineBuilder(stateNft.parents, [])}
          />
        </div>}
      <span style={{ margin: '20px' }}></span>
    </>
  );
};

export default NftsPage;