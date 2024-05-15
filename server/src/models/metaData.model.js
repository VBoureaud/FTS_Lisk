const mongoose = require('mongoose');
const validator = require('validator');
const { toJSON, paginate } = require('./plugins');


/*
  @example
  created;date;user;null
  transfer;date;user;10
  destroyed;date;user;null
*/
const metaDataHistory = mongoose.Schema({
  action: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  user: {
    type: String,
    required: true,
  },
  price: {
    type: String,
  },
});

const metaDataOwner = mongoose.Schema({
  ens_domain_name: {
      type: String,
    },
  hash: {
    type: String,
    required: true,
    trim: true,
  },
  is_contract: {
    type: Boolean,
  },
  is_verified: {
    type: Boolean,
  },
});

const metaDataToken = mongoose.Schema({
  address: {
    type: String,
    required: true,
    trim: true,
  },
  holders: {
    type: String,
    required: true,
    trim: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  symbol: {
    type: String,
    required: true,
    trim: true,
  },
  type: {
    type: String,
    required: true,
    trim: true,
  },
});

// Metadata Structure based on EIP-721
const metaDataSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    image_url: {
      type: String,
      trim: true,
    },
    owner: metaDataOwner,
    token: metaDataToken,
    history: [metaDataHistory],
    user: {
      type: String,
      required: true,
    },
    validity: {
      type: Boolean,
      default: true,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
metaDataSchema.plugin(toJSON);
metaDataSchema.plugin(paginate);

/**
 * @typedef MetaData
 */
const MetaData = mongoose.model('MetaData', metaDataSchema);

module.exports = MetaData;