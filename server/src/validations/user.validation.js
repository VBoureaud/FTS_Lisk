const Joi = require('joi');
const { objectId, ethAddress, ethServer, imageProfil, typeName } = require('./custom.validation');

const addOne = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    type: Joi.string().custom(typeName).required(),
    image: Joi.string().custom(imageProfil),
    address: Joi.string().custom(ethAddress).required(),
    location: Joi.object().keys({
      name: Joi.string(),
      lat: Joi.string(),
      lng: Joi.string(),
      country: Joi.string(),
    }),
  }),
};
const getUser = {
  query: Joi.object().keys({
    address: Joi.string().custom(ethAddress),
  }),
};
const updateOne = {
  params: Joi.object().keys({
    address: Joi.string().custom(ethAddress),
  }),
  body: Joi.object()
    .keys({
      burnout: Joi.number(),
      type: Joi.string(),
      image: Joi.string(),
      quest: Joi.boolean(),
      notifications: Joi.object().keys({
        type: Joi.number().integer(),
        title: Joi.string(),
        desc: Joi.string(),
      })
    })
    .min(1),
};
const deleteOne = {
  params: Joi.object().keys({
    address: Joi.string().custom(ethAddress),
  }),
};
const createAd = {
  params: Joi.object().keys({
    address: Joi.string().custom(ethAddress),
  }),
  body: Joi.object()
    .keys({
      address: Joi.string().custom(ethAddress).required(),
      message: Joi.string().required()
    })
    .min(1)
};
const allUsers = {
  query: Joi.object().keys({
    name: Joi.string(),
    address: Joi.string(),
    location: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};
const logoutUser = {
  params: Joi.object().keys({
    address: Joi.string().custom(ethAddress).required(),
  }),
};

module.exports = {
  addOne,
  getUser,
  updateOne,
  deleteOne,
  createAd,
  allUsers,
  logoutUser,
};