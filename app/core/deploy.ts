import { Hex, Abi } from "viem";
import { walletClient } from "./clients";

export async function deployContracts(compiledContracts: {
  [contractName: string]: { abi: Abi; hex: Hex };
}) {
  const client = await walletClient();
  const hashResults = await Promise.all(
    Object.entries(compiledContracts).map(([contractName, { abi, hex }]) =>
      client.deployContract({
        abi,
        bytecode: hex,
        args: ["Initial message"],
      })
    )
  );
  return hashResults;
}
