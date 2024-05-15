const dotenv = require('dotenv');
const path = require('path');
const Joi = require('joi');

dotenv.config({ path: path.join(__dirname, '../../.env') });

const envVarsSchema = Joi.object()
  .keys({
    NODE_ENV: Joi.string().valid('production', 'development', 'test').required(),
    PORT: Joi.number().default(3000),
    PORT_WS: Joi.number().default(3005),
    APP_NAME: Joi.string().description('Project Name'),
    CLIENT_URL: Joi.string().description('Url of front project'),
    MONGODB_URL: Joi.string().required().description('Mongo DB url'),
    NFT_CONTRACT: Joi.string().required().description('NFT contract address on-chain'),
    TRADE_CONTRACT: Joi.string().required().description('Trade contract address on-chain'),
  })
  .unknown();

const { value: envVars, error } = envVarsSchema.prefs({ errors: { label: 'key' } }).validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

module.exports = {
  env: envVars.NODE_ENV,
  port: envVars.PORT,
  port_ws: envVars.PORT_WS,
  appName: envVars.APP_NAME,
  clientUrl: envVars.CLIENT_URL,
  nftContract: envVars.NFT_CONTRACT,
  tradeContract: envVars.TRADE_CONTRACT,
  mongoose: {
    url: envVars.MONGODB_URL + (envVars.NODE_ENV === 'test' ? '-test' : ''),
    options: {
      useCreateIndex: true,
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
  },
};
