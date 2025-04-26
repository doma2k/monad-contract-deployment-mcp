# Monad SSE-based MCP Server built using Next.js

## Monad Contracts !!! Build, Deploy, Ineract !!!.

**This is MCP server to compile and deploy contracts directly from chat promt or compatible MCP client.**

## Current functionality implementations.

- Captures Solidity smart contracts directly from chat promt.
- Contract compilation and deployment on Monad Testnet.
-
-

## Future implementations.

- ENV integration (API keys, private keys).
- Querying the Monad Network.
- Deployed ABI's contracts storage.
- Network intercations.

## Sample Client

`script/test-client.mjs` contains a sample client to try invocations.

```sh
node scripts/test-client.mjs http://localhost:3000
```

## How to use the server

Go to `Cursor > Settings > Cursor Settings > MCP`

![add_mcp](/static/add_mcp.png)

Paste the following in the `mcp.json` file

```json
{
  "mcpServers": {
    ...
    "monad-mcp-sse": {
      "url": "https://model-context-protocol-mcp-with-next-js-azure.vercel.app/sse"
    }
  }
}
```

# 🚧 Project Status: Under Development

> ⚠️ **Warning:** This project is currently under active development and is not yet stable. Features may change, and things may break without notice.
