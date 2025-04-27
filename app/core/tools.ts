import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { deployContracts } from "./services/deploy";
import { privateKeyValidation, validateAddress } from "./services/utils";
import { getETHBalance } from "./services/balance";
import { privateKeyToAccount } from "viem/accounts";

export async function toolRegistry(server: McpServer) {
  server.tool(
    "resolve-signer-address",
    "Resolve the address of a signer",
    {
      signerKey: z.string().describe("Signer private key"),
    },
    async ({ signerKey }) => {
      const resolvedAddress = privateKeyToAccount(
        privateKeyValidation(signerKey)
      );
      return {
        content: [
          {
            type: "text",
            text: `Signer address: ${resolvedAddress.address}`,
          },
        ],
      };
    }
  );

  server.tool(
    "get_balance",
    "Get the Monad token balance for an address",
    {
      address: z
        .string()
        .describe(
          "The wallet address (e.g., '0x1234...') to check the balance for"
        ),
    },
    async ({ address }) => {
      try {
        const validatedAddress = validateAddress(address);
        const balance = await getETHBalance(validatedAddress);

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(
                {
                  address,
                  wei: balance.wei.toString(),
                  ether: balance.ether,
                },
                null,
                2
              ),
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `Error fetching balance: ${
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
    "compile-and-deploy",
    "Compile solidity contract and deploy it to Monad testnet",
    {
      contract: z.string().describe("Solidity contract source code"),
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
}
