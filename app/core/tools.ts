import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { formatUnits } from "viem";
import { publicClient } from "./clients";
import { deployContracts } from "./deploy";

export async function toolRegistry(server: McpServer) {
  const client = await publicClient();

  server.tool(
    "compile-and-deploy",
    "Compile solidity contract and deploy it to Monad testnet",
    {
      contract: z.string().describe("Solidity contracts source code"),
      signerKey: z.string().describe("Signer private key"),
    },
    async ({ contract, signerKey }) => {
      try {
        const deployedHashesList = await deployContracts(signerKey, contract);
        return {
          content: [
            {
              type: "text",
              text: `Contracts deployed successfully:${JSON.stringify(
                deployedHashesList
              )}`,
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text" as const,
              text: `Error generating contract: ${
                error instanceof Error ? error.message : String(error)
              }`,
            },
          ],
          isError: true,
        };
      }
    }
  );

  server.tool(
    // Tool ID
    "get-mon-balance",
    // Description of what the tool does
    "Get MON balance for an address on Monad testnet",
    // Input schema
    {
      address: z
        .string()
        .describe("Monad testnet address to check balance for"),
    },
    // Tool implementation
    async ({ address }) => {
      try {
        // Check MON balance for the input address
        const balance = await client.getBalance({
          address: address as `0x${string}`,
        });

        // Return a human friendly message indicating the balance.
        return {
          content: [
            {
              type: "text",
              text: `Balance for ${address}: ${formatUnits(balance, 18)} MON`,
            },
          ],
        };
      } catch (error) {
        // If the balance check process fails, return a graceful message back to the MCP client indicating a failure.
        return {
          content: [
            {
              type: "text",
              text: `Failed to retrieve balance for address: ${address}. Error: ${
                error instanceof Error ? error.message : String(error)
              }`,
            },
          ],
        };
      }
    }
  );
}
