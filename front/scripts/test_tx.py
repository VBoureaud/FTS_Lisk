from moralis import evm_api

api_key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJub25jZSI6ImExNDY3ZDVhLTViNGItNDI3Yi04ZDNjLTljOGI3N2YwNWExNCIsIm9yZ0lkIjoiMzkwNzc5IiwidXNlcklkIjoiNDAxNTQ1IiwidHlwZUlkIjoiZDllN2VjNjMtMDBkOS00MDkyLWIzMTktNTU2NmU3ZDdiN2E5IiwidHlwZSI6IlBST0pFQ1QiLCJpYXQiOjE3MTQ3NTcyMTQsImV4cCI6NDg3MDUxNzIxNH0.1h2ZA8c4BwxyoOYY-oNzvu7GtGW7wvD3vvd5d3xdWvo"

params = {
  #"chain": "sepolia",
  "chain": "0xa",
  "format": "decimal",
  "media_items": False,
  "address": "0x197c29968f6242d612c1B72d3915503Fa2318062"
}

nfts = evm_api.nft.get_wallet_nfts(
  api_key=api_key,
  params=params,
)

tx = evm_api.transaction.get_wallet_transactions(
  api_key=api_key,
  params=params,
)

print(tx)
print(nfts)

# result: moralis ok on sepolia, not on lisk sepolia