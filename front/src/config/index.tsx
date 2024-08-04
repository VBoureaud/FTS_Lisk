const config = {
  "api": "http://127.0.0.1:3002/v1",
  "version": "0.1.0",
  "LISKSEPOLIA": {
    "CHAIN_ID": 4202,
    "RPC": "https://rpc.sepolia-api.lisk.com",
    "NATIVE_DECIMAL": '18',
    "STABLE_DECIMAL": '6',
    "CONTRACT_NFT_ADDR": "0x80Db7eB011c8Ca7F36ea280E7B60971df6dDdCC4",
    "CONTRACT_TRADE_TTS_ADDR": "0x00Ce5B2aFDde8aA11a401990DF4729A5EC4fe67D",
    //"CONTRACT_NATIVE_COIN": "0xDeadDeAddeAddEAddeadDEaDDEAdDeaDDeAD0000",
    "CONTRACT_NATIVE_COIN": "0x4200000000000000000000000000000000000006",
  },
}

export const apiServer = {
  register: { url: config.api + "/user", method: "POST" },
  getAllUsers: { url: config.api + "/user/all", method: "GET" },
  getUser: { url: config.api + "/user", method: "GET" },
  patchUser: { url: config.api + "/user", method: "PATCH" },
  deleteUser: { url: config.api + "/user", method: "DELETE" },
  getAll: { url: config.api + "/user/all", method: "GET" },
  getCities: { url: config.api + "/cities/", method: "GET" },
  getAllNFTS: { url: config.api + "/metaData", method: "GET" },
  logoutUser: { url: config.api + "/user/logout", method: "GET" },
};

export default config;