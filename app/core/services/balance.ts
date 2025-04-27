import {
  formatEther,
  formatUnits,
  type Address,
  type Abi,
  getContract,
} from "viem";
import { getPublicClient } from "./clients";
import { readContract } from "./contracts";

// Standard ERC20 ABI (minimal for reading)
const erc20Abi = [
  {
    inputs: [],
    name: "symbol",
    outputs: [{ type: "string" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "decimals",
    outputs: [{ type: "uint8" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ type: "address", name: "account" }],
    name: "balanceOf",
    outputs: [{ type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
] as const;

// Standard ERC721 ABI (minimal for reading)
const erc721Abi = [
  {
    inputs: [{ type: "address", name: "owner" }],
    name: "balanceOf",
    outputs: [{ type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ type: "uint256", name: "tokenId" }],
    name: "ownerOf",
    outputs: [{ type: "address" }],
    stateMutability: "view",
    type: "function",
  },
] as const;

// Standard ERC1155 ABI (minimal for reading)
const erc1155Abi = [
  {
    inputs: [
      { type: "address", name: "account" },
      { type: "uint256", name: "id" },
    ],
    name: "balanceOf",
    outputs: [{ type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
] as const;

/**
 * Get the ETH balance for an address
 * @param address Ethereum address
 * @returns Balance in wei and ether
 */
export async function getETHBalance(
  address: Address
): Promise<{ wei: bigint; ether: string }> {
  const client = await getPublicClient();
  const balance = await client.getBalance({ address });

  return {
    wei: balance,
    ether: formatEther(balance),
  };
}

/**
 * Get the balance of an ERC20 token for an address
 * @param tokenAddress Token contract address
 * @param ownerAddress Owner address
 * @param network Network name or chain ID
 * @returns Token balance with formatting information
 */
export async function getERC20Balance(
  tokenAddress: Address,
  ownerAddress: Address,
  network = "ethereum"
): Promise<{
  raw: bigint;
  formatted: string;
  token: {
    symbol: string;
    decimals: number;
  };
}> {
  const publicClient = await getPublicClient();

  const contract = getContract({
    address: tokenAddress,
    abi: erc20Abi,
    client: publicClient,
  });

  const [balance, symbol, decimals] = await Promise.all([
    contract.read.balanceOf([ownerAddress]),
    contract.read.symbol(),
    contract.read.decimals(),
  ]);

  return {
    raw: balance,
    formatted: formatUnits(balance, decimals),
    token: {
      symbol,
      decimals,
    },
  };
}

/**
 * Check if an address owns a specific NFT
 * @param tokenAddress NFT contract address
 * @param ownerAddress Owner address
 * @param tokenId Token ID to check
 * @returns True if the address owns the NFT
 */
export async function isNFTOwner(
  tokenAddress: Address,
  ownerAddress: Address,
  tokenId: bigint
): Promise<boolean> {
  try {
    const actualOwner = (await readContract({
      address: tokenAddress,
      abi: erc721Abi,
      functionName: "ownerOf",
      args: [tokenId],
    })) as Address;

    return actualOwner.toLowerCase() === ownerAddress.toLowerCase();
  } catch (error: any) {
    console.error(`Error checking NFT ownership: ${error.message}`);
    return false;
  }
}

/**
 * Get the number of NFTs owned by an address for a specific collection
 * @param tokenAddress NFT contract address
 * @param ownerAddress Owner address
 * @param network Network name or chain ID
 * @returns Number of NFTs owned
 */
export async function getERC721Balance(
  tokenAddress: Address,
  ownerAddress: Address
): Promise<bigint> {
  return readContract({
    address: tokenAddress,
    abi: erc721Abi,
    functionName: "balanceOf",
    args: [ownerAddress],
  }) as Promise<bigint>;
}

/**
 * Get the balance of an ERC1155 token for an address
 * @param tokenAddress ERC1155 contract address
 * @param ownerAddress Owner address
 * @param tokenId Token ID to check
 * @returns Token balance
 */
export async function getERC1155Balance(
  tokenAddress: Address,
  ownerAddress: Address,
  tokenId: bigint
): Promise<bigint> {
  return readContract({
    address: tokenAddress,
    abi: erc1155Abi,
    functionName: "balanceOf",
    args: [ownerAddress, tokenId],
  }) as Promise<bigint>;
}
