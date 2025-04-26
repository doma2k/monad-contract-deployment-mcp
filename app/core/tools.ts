import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { compileAndDeploy } from "./compiler";
import { publicClient } from "./clients";
import { Abi, formatUnits, Hex } from "viem";

export function toolRegistry(server: McpServer) {
  server.tool(
    "compile_and_deploy_a_solidity_contract",
    "Compile solidity contract and deploy it to Monad testnet",
    {
      contract: z.string().describe("Solidity contract source code"),
    },
    async ({ contract }) => {
      try {
        const [abi, bytecode] = await compileAndDeploy(contract);
        // const hash = await walletClient.deployContract({
        //   abi,
        //   bytecode,
        //   args: ["Initial message"],
        // });
        return {
          content: [
            {
              type: "text",
              text: `${JSON.stringify(abi as Abi)}`,
            },
            {
              type: "text",
              text: `${bytecode as Hex}`,
            },
            // {
            //   type: "text",
            //   text: `${hash}`,
            // },
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
        const balance = await publicClient.getBalance({
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
