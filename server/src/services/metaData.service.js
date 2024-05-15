const config = require('../config');
const { 
  profiles,
  getRandomType,
  buildUpdatedUser,
  actionPoints,
  levelDisplay,
  notifType,
  limitGame,
  buildProgress,
  configOnChain,
} = require('../config/gameEngine');
const { 
  badWords
} = require('../utils/badWords');
const { 
  howManyDayBetweenTwoDate,
  getObjInArray,
} = require('../utils');
const { decodeHashURI, addslashes } = require('../utils');
const httpStatus = require('http-status');
const { 
  User,
  MetaData,
} = require('../models');
const ApiError = require('../utils/ApiError');
const ethService = require('./eth.service');


/**
 * get all MetaData
 * @returns {MetaData[]}
 */
const getAllNFTS = async (nft, history=[]) => {
  const metaDatas = await MetaData.find({});
  return metaDatas;
}

/**
 * Create an MetaData
 * @param {Object} nft 
 * @param {string} address of owner 
 * @param {Array(Object)} history of creation
 * @returns {MetaData}
 */
const register = async (nft, history=[]) => {
  const validity = true;

  const date = new Date();
  const metaDataDoc = await MetaData.create({
    name: nft.id,
    image_url: nft.image_url,
    owner: {
      ens_domain_name: nft.owner.ens_domain_name, 
      hash: nft.owner.hash,
      is_contract: nft.owner.is_contract,
      is_verified: nft.owner.is_verified,
    },
    token: {
      address: nft.token.address,
      holders: nft.token.holders,
      name: nft.token.name,
      symbol: nft.token.symbol,
      type: nft.token.type,
    },
    history,
    user: nft.owner.hash,
    validity
  });
}

/**
 * Synchronise
 * @param {Object} user
 * @param {Object} nfts
 * @returns {user}
 */
const synchroniseNFT = async (user, nfts) => {
  console.log('synchroniseNFT');
  try {
    if (!user || !nfts) 
      throw new ApiError(httpStatus.BAD_REQUEST, 'Field is missing.');

    const metaData = await MetaData.find({ owner: { hash: user.address } });
    console.log({ metaData });
    console.log({ nfts: nfts.length });

    const accountToCheck = [];

    // Synchronise NFTs
    for (let i = nfts.length - 1; i >= 0; i--) {

      const currentId = nfts[i].id;
      const currentOwner = nfts[i].owner.hash;

      console.log({ currentId });
      console.log({ currentOwner });

      let nftDb = await MetaData.findOne({ name: nfts[i].id });
      if (!nftDb) {
        // create NFT in DB
        nftDb = await register(nfts[i]);
        console.log('created');
        console.log({ nftDb });
      }

      if (accountToCheck.indexOf(currentOwner) == -1) {
        accountToCheck.push(currentOwner);
      }
    }

    // get history transfer
    console.log('-gettransfers-history-');
    for (let j = 0; j < accountToCheck.length; j++) {
      const transfers = await ethService.getTransfers(accountToCheck[j]);
      for (let i = transfers.items.length - 1; i >= 0; i--) {
        const currentId = transfers.items[i].total.token_id;
        // [ token_transfer, token_minting ]
        const currentType = transfers.items[i].type;
        const currentMethod = transfers.items[i].method;
        const currentTo = transfers.items[i].to.hash;
        const currentTimestamp = transfers.items[i].timestamp;
        const currentHash = transfers.items[i].tx_hash;
        const transaction = await ethService.getTransaction(currentHash);
        let history = [];
      
        console.log('---');
        console.log({ currentId });
        console.log({ currentMethod });

        let nftDb = await MetaData.findOne({ name: currentId });
        if (!nftDb)
          throw new ApiError(httpStatus.BAD_REQUEST, 'synchroniseNFT fail2');

        if (nftDb.history.length > 0 && nftDb.history.filter(h => h.date == currentTimestamp && h.user == currentTo).length > 0) {
          console.log('already saved');
          continue;
        }

        const nftHistory = nftDb.history;
        nftHistory.push({
          action: currentType == 'token_minting' ? 'created' : 'transfer',
          date: currentTimestamp,
          user: currentTo,
          price: currentMethod === 'openTrade' ? transaction.decoded_input.parameters[1].value : null,
        });
        const newHistory = nftHistory.sort((a, b) => { return new Date(a.date) - new Date(b.date) });

        let user = {}
        let owner = {}
        if (transfers.items[i].to.hash != nftDb.owner) {
          console.log('new owner');
          /*user = {
            user: transfers.items[i].to.hash,
          };
          owner = {
            owner: {
              ens_domain_name: transfers.items[i].to.ens_domain_name,
              hash: transfers.items[i].to.hash,
              is_contract: transfers.items[i].to.is_contract,
              is_verified: transfers.items[i].to.is_verified,
            }
          };*/

          nftDb.user = transfers.items[i].to.hash;
          nftDb.owner = {
            ens_domain_name: transfers.items[i].to.ens_domain_name,
            hash: transfers.items[i].to.hash,
            is_contract: transfers.items[i].to.is_contract,
            is_verified: transfers.items[i].to.is_verified,
          };
        }

        console.log('debug');
        console.log(nftDb);
        // updating
        /*const newData = {
          ...owner,
          history: newHistory,
          ...user,
        };*/
        nftDb.history = newHistory;
        //console.log({ newData });
        //Object.assign(nftDb, newData);
        //const saved = await nftDb.save();
        console.log('updated');
      }
    }
    console.log('ok');
  } catch (error) {
    console.log({ error });
    throw new ApiError(httpStatus.BAD_REQUEST, 'synchroniseNFT fail');
  }

  /*const user = await getUser(address);
  if (user) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'User already exist for this address');
  }*/

  /*const accountNTFS = await ethService.getAccountNFTS(data.address, server.url);
  if (!accountNTFS) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Account not found');
  }*/

  return {};
};

module.exports = {
  synchroniseNFT,
  getAllNFTS,
};
