import {
  type Address,
  type Hash,
  type Hex,
  type ReadContractParameters,
  type GetLogsParameters,
  type Log,
} from "viem";
import { getPublicClient, getWalletClient } from "./clients";

export async function readContract(params: ReadContractParameters) {
  const client = await getPublicClient();
  return await client.readContract(params);
}

export async function writeContract(
  privateKey: Hex,
  params: Record<string, any>
): Promise<Hash> {
  const client = await getWalletClient(privateKey);
  return await client.writeContract(params as any);
}

export async function getLogs(params: GetLogsParameters): Promise<Log[]> {
  const client = await getPublicClient();
  return await client.getLogs(params);
}

export async function isContract(address: Address): Promise<boolean> {
  const client = await getPublicClient();
  const code = await client.getCode({ address });
  return code !== undefined && code !== "0x";
}
