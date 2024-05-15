const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { metaDataService } = require('../services');

const getAllNFTS = catchAsync(async (req, res) => {
  const nfts = await metaDataService.getAllNFTS();
  res.status(httpStatus.OK).send({ nfts });
});

module.exports = {
  getAllNFTS,
}