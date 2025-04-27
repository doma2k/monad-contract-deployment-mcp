import { Hex } from "viem";
import { getWalletClient, getPublicClient } from "./clients";
import { compileContracts } from "./compiler";
import { StringKeyedObject } from "./types";

export async function deployContracts(signer: string, contract: string) {
  console.error("Deploying contracts...");
  const compiledContracts = await compileContracts(contract);
  const client = await getWalletClient(signer);
  const deployedHashesList: StringKeyedObject[] = [];
  const publicClient = await getPublicClient();

  for (const [key, value] of Object.entries(compiledContracts)) {
    const hash = await client.deployContract({
      abi: value.abi,
      bytecode: value.bytecode,
      args: [],
    });
    const tx = await publicClient.waitForTransactionReceipt({ hash });
    if (tx.status === "success") {
      deployedHashesList.push({ [key]: tx });
    } else {
      console.error(`Contract ${key} deployment failed: ${tx.status}`);
    }
  }
  return deployedHashesList;
}
