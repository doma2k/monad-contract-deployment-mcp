import {
  type Address,
  type Hash,
  type TransactionReceipt,
  type EstimateGasParameters,
} from "viem";
import { getPublicClient } from "./clients.js";

/**
 * Get a transaction by hash for a specific network
 */
export async function getTransaction(hash: Hash) {
  const client = await getPublicClient();
  return await client.getTransaction({ hash });
}

/**
 * Get a transaction receipt by hash for a specific network
 */
export async function getTransactionReceipt(
  hash: Hash
): Promise<TransactionReceipt> {
  const client = await getPublicClient();
  return await client.getTransactionReceipt({ hash });
}

/**
 * Get the transaction count for an address for a specific network
 */
export async function getTransactionCount(address: Address): Promise<number> {
  const client = await getPublicClient();
  const count = await client.getTransactionCount({ address });
  return Number(count);
}

/**
 * Estimate gas for a transaction for a specific network
 */
export async function estimateGas(
  params: EstimateGasParameters
): Promise<bigint> {
  const client = await getPublicClient();
  return await client.estimateGas(params);
}

/**
 * Get the chain ID for a specific network
 */
export async function getChainId(): Promise<number> {
  const client = await getPublicClient();
  const chainId = await client.getChainId();
  return Number(chainId);
}
