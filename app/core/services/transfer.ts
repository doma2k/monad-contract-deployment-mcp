import {
  parseEther,
  parseUnits,
  formatUnits,
  type Address,
  type Hash,
  type Hex,
  type Abi,
  getContract,
  type Account,
} from "viem";
import { getPublicClient, getWalletClient } from "./clients";

// Standard ERC20 ABI for transfers
const erc20TransferAbi = [
  {
    inputs: [
      { type: "address", name: "to" },
      { type: "uint256", name: "amount" },
    ],
    name: "transfer",
    outputs: [{ type: "bool" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { type: "address", name: "spender" },
      { type: "uint256", name: "amount" },
    ],
    name: "approve",
    outputs: [{ type: "bool" }],
    stateMutability: "nonpayable",
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
    inputs: [],
    name: "symbol",
    outputs: [{ type: "string" }],
    stateMutability: "view",
    type: "function",
  },
] as const;

// Standard ERC721 ABI for transfers
const erc721TransferAbi = [
  {
    inputs: [
      { type: "address", name: "from" },
      { type: "address", name: "to" },
      { type: "uint256", name: "tokenId" },
    ],
    name: "transferFrom",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "name",
    outputs: [{ type: "string" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "symbol",
    outputs: [{ type: "string" }],
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

// ERC1155 ABI for transfers
const erc1155TransferAbi = [
  {
    inputs: [
      { type: "address", name: "from" },
      { type: "address", name: "to" },
      { type: "uint256", name: "id" },
      { type: "uint256", name: "amount" },
      { type: "bytes", name: "data" },
    ],
    name: "safeTransferFrom",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
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
 * Transfer ETH to an address
 * @param privateKey Sender's private key
 * @param toAddress Recipient address
 * @param amount Amount to send in ETH
 * @param network Network name or chain ID
 * @returns Transaction hash
 */
export async function transferETH(
  privateKey: string | Hex,
  toAddress: Address,
  amount: string, // in ether
  network = "ethereum"
): Promise<Hash> {
  // Ensure the private key has 0x prefix
  const formattedKey =
    typeof privateKey === "string" && !privateKey.startsWith("0x")
      ? (`0x${privateKey}` as Hex)
      : (privateKey as Hex);

  const client = await getWalletClient(formattedKey);
  const amountWei = parseEther(amount);

  return client.sendTransaction({
    to: toAddress,
    value: amountWei,
    account: client.account!,
    chain: client.chain,
  });
}

/**
 * Transfer ERC20 tokens to an address
 * @param tokenAddress Token contract address
 * @param toAddress Recipient address
 * @param amount Amount to send (in token units)
 * @param privateKey Sender's private key
 * @param network Network name or chain ID
 * @returns Transaction details
 */
export async function transferERC20(
  tokenAddress: Address,
  toAddress: Address,
  amount: string,
  privateKey: string | `0x${string}`,
  network: string = "ethereum"
): Promise<{
  txHash: Hash;
  amount: {
    raw: bigint;
    formatted: string;
  };
  token: {
    symbol: string;
    decimals: number;
  };
}> {
  // Ensure the private key has 0x prefix
  const formattedKey =
    typeof privateKey === "string" && !privateKey.startsWith("0x")
      ? (`0x${privateKey}` as `0x${string}`)
      : (privateKey as `0x${string}`);

  // Get token details
  const publicClient = await getPublicClient();
  const contract = getContract({
    address: tokenAddress,
    abi: erc20TransferAbi,
    client: publicClient,
  });

  // Get token decimals and symbol
  const decimals = await contract.read.decimals();
  const symbol = await contract.read.symbol();

  // Parse the amount with the correct number of decimals
  const rawAmount = parseUnits(amount, decimals);

  // Create wallet client for sending the transaction
  const walletClient = await getWalletClient(formattedKey);

  // Send the transaction
  const hash = await walletClient.writeContract({
    address: tokenAddress,
    abi: erc20TransferAbi,
    functionName: "transfer",
    args: [toAddress, rawAmount],
    account: walletClient.account!,
    chain: walletClient.chain,
  });

  return {
    txHash: hash,
    amount: {
      raw: rawAmount,
      formatted: amount,
    },
    token: {
      symbol,
      decimals,
    },
  };
}

/**
 * Approve ERC20 token spending
 * @param tokenAddress Token contract address
 * @param spenderAddress Spender address
 * @param amount Amount to approve (in token units)
 * @param privateKey Owner's private key
 * @param network Network name or chain ID
 * @returns Transaction details
 */
export async function approveERC20(
  tokenAddress: Address,
  spenderAddress: Address,
  amount: string,
  privateKey: string | `0x${string}`,
  network: string = "ethereum"
): Promise<{
  txHash: Hash;
  amount: {
    raw: bigint;
    formatted: string;
  };
  token: {
    symbol: string;
    decimals: number;
  };
}> {
  // Ensure the private key has 0x prefix
  const formattedKey =
    typeof privateKey === "string" && !privateKey.startsWith("0x")
      ? (`0x${privateKey}` as `0x${string}`)
      : (privateKey as `0x${string}`);

  // Get token details
  const publicClient = await getPublicClient();
  const contract = getContract({
    address: tokenAddress,
    abi: erc20TransferAbi,
    client: publicClient,
  });

  // Get token decimals and symbol
  const decimals = await contract.read.decimals();
  const symbol = await contract.read.symbol();

  // Parse the amount with the correct number of decimals
  const rawAmount = parseUnits(amount, decimals);

  // Create wallet client for sending the transaction
  const walletClient = await getWalletClient(formattedKey);

  // Send the transaction
  const hash = await walletClient.writeContract({
    address: tokenAddress,
    abi: erc20TransferAbi,
    functionName: "approve",
    args: [spenderAddress, rawAmount],
    account: walletClient.account!,
    chain: walletClient.chain,
  });

  return {
    txHash: hash,
    amount: {
      raw: rawAmount,
      formatted: amount,
    },
    token: {
      symbol,
      decimals,
    },
  };
}

/**
 * Transfer ERC721 token (NFT) to an address
 * @param tokenAddress NFT contract address
 * @param toAddress Recipient address
 * @param tokenId Token ID to transfer
 * @param privateKey Owner's private key
 * @param network Network name or chain ID
 * @returns Transaction details
 */
export async function transferERC721(
  tokenAddress: Address,
  toAddress: Address,
  tokenId: bigint,
  privateKey: string | `0x${string}`,
  network: string = "ethereum"
): Promise<{
  txHash: Hash;
  tokenId: string;
  token: {
    name: string;
    symbol: string;
  };
}> {
  // Ensure the private key has 0x prefix
  const formattedKey =
    typeof privateKey === "string" && !privateKey.startsWith("0x")
      ? (`0x${privateKey}` as `0x${string}`)
      : (privateKey as `0x${string}`);

  // Get token details
  const publicClient = await getPublicClient();
  const contract = getContract({
    address: tokenAddress,
    abi: erc721TransferAbi,
    client: publicClient,
  });

  // Get token name and symbol
  const [name, symbol] = await Promise.all([
    contract.read.name(),
    contract.read.symbol(),
  ]);

  // Create wallet client for sending the transaction
  const walletClient = await getWalletClient(formattedKey);

  // Send the transaction
  const hash = await walletClient.writeContract({
    address: tokenAddress,
    abi: erc721TransferAbi,
    functionName: "transferFrom",
    args: [walletClient.account!.address, toAddress, tokenId],
    account: walletClient.account!,
    chain: walletClient.chain,
  });

  return {
    txHash: hash,
    tokenId: tokenId.toString(),
    token: {
      name,
      symbol,
    },
  };
}

/**
 * Transfer ERC1155 tokens to an address
 * @param tokenAddress ERC1155 contract address
 * @param toAddress Recipient address
 * @param tokenId Token ID to transfer
 * @param amount Amount to transfer
 * @param privateKey Owner's private key
 * @param network Network name or chain ID
 * @returns Transaction details
 */
export async function transferERC1155(
  tokenAddress: Address,
  toAddress: Address,
  tokenId: bigint,
  amount: string,
  privateKey: string | `0x${string}`,
  network: string = "ethereum"
): Promise<{
  txHash: Hash;
  tokenId: string;
  amount: string;
}> {
  // Ensure the private key has 0x prefix
  const formattedKey =
    typeof privateKey === "string" && !privateKey.startsWith("0x")
      ? (`0x${privateKey}` as `0x${string}`)
      : (privateKey as `0x${string}`);

  // Create wallet client for sending the transaction
  const walletClient = await getWalletClient(formattedKey);

  // Send the transaction
  const hash = await walletClient.writeContract({
    address: tokenAddress,
    abi: erc1155TransferAbi,
    functionName: "safeTransferFrom",
    args: [
      walletClient.account!.address,
      toAddress,
      tokenId,
      BigInt(amount),
      "0x",
    ],
    account: walletClient.account!,
    chain: walletClient.chain,
  });

  return {
    txHash: hash,
    tokenId: tokenId.toString(),
    amount,
  };
}
