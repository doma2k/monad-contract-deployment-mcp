import { Hex, Abi } from "viem";
import { walletClient } from "./clients";
import { compileContracts } from "./compiler";

export async function deployContracts(signer: string, contract: string) {
  const compiledContracts = await compileContracts(contract);
  const client = await walletClient(signer);
  const deployedHashesList: { [key: string]: Hex }[] = [];

  for (const [key, value] of Object.entries(compiledContracts)) {
    const hash = await client.deployContract({
      abi: value.abi,
      bytecode: value.bytecode,
    });
    deployedHashesList.push({ [key]: hash });
  }
  return deployedHashesList;
}
