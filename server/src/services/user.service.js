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
  Notifications,
} = require('../models');
const ApiError = require('../utils/ApiError');
const ethService = require('./eth.service');
const metaDataService = require('./metaData.service');

/**
 * Create an User and generate Quest & Need
 * @param {Object} data
 * @param {string} [data.name] - name or pseudo for this user
 * @param {string} [data.type] - type reference
 * @param {string} [data.image] - image for slider
 * @param {string} [data.server] - server of reference
 * @param {string} [data.address] - address account
 * @param {string} [data.location] - location account
 * @returns {Promise<User>}
 */
const createUser = async (data) => {
  console.log('createUser');
  // check title
  let name = addslashes(data.name.trim());
  let type = data.type ? data.type.trim() : null;
  let address = addslashes(data.address.trim());
  let location = data.location;
  let image = data.image;
  let lastCo = new Date().getTime();

  if (!name || !type || !address) 
    throw new ApiError(httpStatus.BAD_REQUEST, 'Field is missing.');

  const user = await getUser(address);
  if (user) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'User already exist for this address');
  }

  /*const accountNTFS = await ethService.getAccountNFTS(data.address, server.url);
  if (!accountNTFS) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Account not found');
  }*/

  const profilesAvailable = Object.keys(profiles);
  if (profilesAvailable.indexOf(type) == -1)
    throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid Profile');

  const tokenBuildable = getRandomType([], type, profiles[type].typeCount);
  const tokenNeeded = getRandomType(tokenBuildable, '', profiles[type].questCount);
  const quest = [{
    id: 0,
    date: new Date().getTime(),
    winDate: '',
    tokenNeeded
  }];
  const pocket = profiles[type].pocketSize;

  const userDoc = await User.create({
    name,
    type,
    image,
    address,
    location,
    server: '',
    pocket,
    tokenBuildable,
    quest,
    lastCo,
  });

  /*await addNotification(
    address,
    server.name,
    notifType.createUser,
    'Game is joined',
    'Welcome on Food Trust Simulator.');*/

  return await getUser(address);
};

/**
 * Get all users
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const allUsers = async (filter, options) => {
  const users = await User.paginate(filter, options);
  return users;
};

/**
 * Get one user with this address
 * can be not found - when create new one
 * @param {string} address
 * @param {string} server - optional verification
 * @returns {Promise<QueryResult>}
 */
const getUser = async (address) => {
  console.log('getUser');
  

  let accountNTFS;
  let user = await User.find({ address });
  console.log({ address });
  let userObj = user && user[0] ? user[0] : null;
  if (userObj) {
    /*let transfers = await ethService.getTransfers(address);
    console.log(transfers.items);*/

    // update NFTS
    let nfts = await ethService.getNFTS();
    if (nfts && nfts.items) {
      //console.log(nfts.items);
      metaDataService.synchroniseNFT(userObj, nfts.items);
    }

    // update lastCo
    userObj.lastCo = new Date().getTime();
    await userObj.save();
  }

  return userObj;
};

/**
 * Update user by address
 * Can only work for update profile, one time
 * or for Quest Completed.
 * @param {string} address
 * @param {Object} updateBody
 * @param {string} [updateBody.burnout] - new burnout
 * @param {string} [updateBody.type] - when new burnout
 * @param {string} [updateBody.image] - when new burnout
 * @param {boolean} [updateBody.quest] - if true, check quest validation
 * @param {object} [updateBody.notification] - if one and nothing else, add notif
 * @returns {Promise<User>}
 */
const updateUserByAddr = async (address, updateBody) => {
  const user = await getUser(address);
  const now = new Date().getTime();
  if (!user)
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');

  // todo refacto
  if (updateBody.burnout) {
    // required
    if (!updateBody.type || !updateBody.image)
      throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid Request 4');
    // condition
    if (updateBody.type === user.type)
      throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid Request 5');
    if (user.burnout && user.burnout.length > 0)
      if (howManyDayBetweenTwoDate(user.burnout[user.burnout.length - 1]) < limitGame.maxDayBurnout)
        throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid Request 6');
    
    // all ok do it
    const currentBurnout = user.burnout ? user.burnout : [];
    currentBurnout.push(new Date().getTime());
    const updatedBody = {
      burnout: currentBurnout,
      type: updateBody.type,
      image: updateBody.image,
      tokenBuildable: getRandomType([], updateBody.type, profiles[updateBody.type].typeCount),
    };
    Object.assign(user, updatedBody);
    await user.save();
    return await getUser(user.address);
  } else if (updateBody.quest) {
    // Check model need quest
    if (!user.quest || user.quest.length == 0)
      throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid Request 0');

    // Check date ready
    if (user.quest && user.quest.length > 1) {
      const hoursDiff = Math.abs(new Date() - new Date(parseInt(user.quest[1].winDate))) / 36e5;
      if (hoursDiff < profiles[user.type].questLimit)
        throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid Request 1');
    }

    // Check collection then match list
    const requiredCollection = user.quest[0].tokenNeeded;
    const metaDatas = await MetaData.find({ 'properties.owner': address, 'validity': true });
    if (metaDatas.length < requiredCollection.length)
      throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid Request 2');

    let collectionFind = [];// collection of uris needed
    for (let i = 0; i < metaDatas.length; i++) {
      const decoded = {};//decodeHashURI(convertHexToString(metaDatas[i].name));
      const type = decoded.type;
      const date = decoded.date;

      if (requiredCollection.indexOf(type) != -1
        && collectionFind.filter(e => e.image === type).length === 0
        && buildProgress(date, metaDatas[i].properties.durability) > 0)
        collectionFind.push(metaDatas[i]);

      // check in parents from valid boxs
      if (type === '002001' && buildProgress(date, metaDatas[i].properties.durability) > 0) { 
        for (let j = 0; j < metaDatas[i].properties.parents.length; j++) {
          const pType = "";//decodeHashURI(convertHexToString(metaDatas[i].properties.parents[j])).type;
          if (requiredCollection.indexOf(pType) != -1
            && collectionFind.filter(e => e.image === pType).length === 0)
            collectionFind.push({
              name: metaDatas[i].properties.parents[j],
            });
        }
      }
    }

    if (collectionFind.length != requiredCollection.length)
      throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid Request 3');

    // update xp according to power of ingredients
    let newXp = 0;
    for (let i = 0; i < collectionFind.length; i++) {
      // no properties.power if URI is parents from a box, so we choose default
      const power = collectionFind[i].properties ? collectionFind[i].properties.power : limitGame.powerDefault;
      newXp = newXp + power * (actionPoints.questCompleted / collectionFind.length);
    }

    // UPDATE TIME
    const updatedBody = buildUpdatedUser(user.experience, collectionFind.length > 0 ? newXp : 0, null, user.type);

    // new Quest
    const questUpdated = user.quest;
    questUpdated[0].winDate = now;
    const quest = {
      id: questUpdated.length,
      date: now,
      winDate: '',
      tokenNeeded: getRandomType(questUpdated[0].tokenNeeded, '', profiles[user.type].questCount),
    };
    questUpdated.splice(0, 0, quest);
    updatedBody['quest'] = questUpdated;
    /*if (levelDisplay(user.experience) != levelDisplay(updatedBody.experience)) {
      // Add notif new level
      const notifs = await addNotification(
        user.address,
        user.server,
        notifType.levelUp,
        'Level Up',
        'You have reached level ' + levelDisplay(updatedBody.experience));
    }*/

    Object.assign(user, updatedBody);
    await user.save();

    return await getUser(user.address);
  } /*else if (updateBody.notifications) {
    // add notification
    const notifsToAdd = updateBody.notifications;
    const notifs = await addNotification(
      user.address,
      user.server,
      notifsToAdd.type,
      notifsToAdd.title,
      notifsToAdd.desc
    );
    return await getUser(user.address);
  }*/
  throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid Request 3');
};

/**
 * Delete user by address
 * @param {string} address
 * @returns {Promise<User>}
 */
const deleteUserByAddr = async (address) => {
  const user = await getUser(address);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  // Forbidden action by default
  throw new ApiError(httpStatus.FORBIDDEN, 'Forbidden');
  await user.remove();
  return user;
};

/**
 * Logout user
 * @param {string} address
 * @param {string} server
 * @return {boolean}
 */
const logoutUserByAddr = async (address, server) => {
  const user = await getUser(address, server);
  if (user) {
    //throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
    // await logoutWss(address, user.server);
  } else {
    console.log('no user ? because of user creation time?');
  }
  

  return true;
};

module.exports = {
  createUser,
  allUsers,
  getUser,
  updateUserByAddr,
  deleteUserByAddr,
  logoutUserByAddr,
};
