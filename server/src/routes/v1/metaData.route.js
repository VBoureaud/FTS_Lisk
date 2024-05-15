const express = require('express');
const validate = require('../../middlewares/validate');
const metaDataValidation = require('../../validations/metaData.validation');
const metaDataController = require('../../controllers/metaData.controller');

const router = express.Router();

router
  .route('/')
  .get(validate(metaDataValidation.getAllNFTS), metaDataController.getAllNFTS);

module.exports = router;


/**
 * @swagger
 * tags:
 *   name: MetaData
 *   description: NFTS saved in DB
 */
 
/**
 * @swagger
 * /metaData:
 *   get:
 *     summary: Get NFTS
 *     description: List all NFTS saved in DB
 *     tags: [MetaData]
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/MetaData'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 */