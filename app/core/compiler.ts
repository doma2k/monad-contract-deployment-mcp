const ethers = require("ethers");
const solc = require("solc");

export async function compileAndDeploy(
  sourceCode: string,
  provider?: any,
  signer?: any
): Promise<string> {
  try {
    // Compile
    const input = {
      language: "Solidity",
      sources: { "contract.sol": { content: sourceCode } },
      settings: {
        outputSelection: { "*": { "*": ["abi", "evm.bytecode"] } },
      },
    };

    const output = JSON.parse(solc.compile(JSON.stringify(input)));

    // Check for compilation errors
    if (output.errors) {
      const errors = output.errors
        .filter((x: any) => x.severity === "error")
        .map((x: any) => x.formattedMessage || x.message);

      if (errors.length > 0) {
        throw new Error(`Compilation errors:\n${errors.join("\n")}`);
      }

      // Log warnings if any
      const warnings = output.errors
        .filter((x: any) => x.severity === "warning")
        .map((x: any) => x.formattedMessage || x.message);

      if (warnings.length > 0) {
        console.warn("Compilation warnings:\n", warnings.join("\n"));
      }
    }

    // Debug output structure
    console.log(
      "Compiler output structure:",
      JSON.stringify(Object.keys(output), null, 2)
    );

    if (!output.contracts) {
      throw new Error("No contracts found in compiler output");
    }

    if (!output.contracts["contract.sol"]) {
      throw new Error(
        "No contracts found in 'contract.sol'. Available contracts: " +
          Object.keys(output.contracts).join(", ")
      );
    }

    const contractNames = Object.keys(output.contracts["contract.sol"]);
    if (contractNames.length === 0) {
      throw new Error("No contracts found in the source code");
    }

    const contractName = contractNames[0];
    const contract = output.contracts["contract.sol"][contractName];

    if (!contract) {
      throw new Error(
        `Contract '${contractName}' not found in compiler output`
      );
    }

    if (!contract.abi) {
      throw new Error(`No ABI found for contract '${contractName}'`);
    }

    if (
      !contract.evm ||
      !contract.evm.bytecode ||
      !contract.evm.bytecode.object
    ) {
      throw new Error(`No bytecode found for contract '${contractName}'`);
    }

    // Deploy
    const abi = contract.abi;
    const bytecode = "0x" + contract.evm.bytecode.object;
    // const factory = new ethers.ContractFactory(abi, bytecode, signer);
    // return await factory.deploy();
    return JSON.stringify({ contractName, abi, bytecode });
  } catch (error: unknown) {
    console.error("Compilation error details:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    throw new Error(`Error compiling contract: ${errorMessage}`);
  }
}
