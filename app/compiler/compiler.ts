const solc = require("solc");
import { Hex, Abi } from "viem";
import fs from "fs";
export async function compileAndDeploy(
  sourceCode: string
): Promise<[Abi, Hex]> {
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

    const contractNames = Object.keys(output.contracts["contract.sol"]);
    const contract = output.contracts["contract.sol"][contractNames[0]];

    const abi = contract.abi;
    const bytecode = contract.evm.bytecode.object;

    return [abi as Abi, `0x${bytecode}` as Hex];
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
