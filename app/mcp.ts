import { initializeMcpApiHandler } from "../lib/mcp-api-handler";
import { toolRegistry } from "./core/tools";

export const mcpHandler = initializeMcpApiHandler(
  (server) => {
    toolRegistry(server);
  },
  {
    capabilities: {
      tools: {
        echo: {
          description: "Echo a message",
        },
      },
    },
  }
);
