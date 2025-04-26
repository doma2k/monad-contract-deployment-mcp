const solc = require("solc");
import { Hex, Abi } from "viem";
import fs from "fs";

export async function compileContracts(
  sourceCode: string
): Promise<{ [contractName: string]: { abi: Abi; hex: Hex } }> {
  try {
    const input = {
      language: "Solidity",
      sources: { "contract.sol": { content: sourceCode } },
      settings: {
        outputSelection: { "*": { "*": ["abi", "evm.bytecode"] } },
      },
    };

    const output = JSON.parse(
      solc.compile(JSON.stringify(input), {
        import: findImports,
      })
    );

    const contracts = output.contracts["contract.sol"];
    const result: { [contractName: string]: { abi: Abi; hex: Hex } } = {};

    for (const contractName in contracts) {
      const contract = contracts[contractName];
      result[contractName] = {
        abi: contract.abi as Abi,
        hex: `0x${contract.evm.bytecode.object}` as Hex,
      };
    }

    return result;
  } catch (error: unknown) {
    console.error("Compilation error details:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    throw new Error(`Error compiling contract: ${errorMessage}`);
  }
}

function findImports(path: string) {
  if (path.includes("@openzeppelin")) {
    const newPath = path.replace("@openzeppelin", process.cwd());
    return {
      contents: fs.readFileSync(newPath, "utf8"),
    };
  } else {
    return { error: "File not found" };
  }
}
