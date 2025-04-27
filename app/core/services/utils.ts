import {
  parseEther,
  formatEther,
  type Account,
  type Hash,
  type Chain,
  type WalletClient,
  type Transport,
  type HttpTransport,
  Hex,
  Address,
} from "viem";
/**
 * Utility functions for formatting and parsing values
 */
export const utils = {
  // Convert ether to wei
  parseEther,

  // Convert wei to ether
  formatEther,

  // Format a bigint to a string
  formatBigInt: (value: bigint): string => value.toString(),

  // Format an object to JSON with bigint handling
  formatJson: (obj: unknown): string =>
    JSON.stringify(
      obj,
      (_, value) => (typeof value === "bigint" ? value.toString() : value),
      2
    ),

  // Format a number with commas
  formatNumber: (value: number | string): string => {
    return Number(value).toLocaleString();
  },

  // Convert a hex string to a number
  hexToNumber: (hex: string): number => {
    return parseInt(hex, 16);
  },

  // Convert a number to a hex string
  numberToHex: (num: number): string => {
    return "0x" + num.toString(16);
  },
};

export function privateKeyValidation(key: string): Hex {
  if (!key.startsWith("0x")) {
    return `0x${key}`;
  }
  if (!/^0x[0-9a-fA-F]+$/.test(key)) {
    throw new Error("Invalid key string");
  }
  return key as Hex;
}

export function validateAddress(address: string): Address {
  if (!address.startsWith("0x")) {
    throw new Error("Address must start with 0x");
  }
  if (address.length !== 42) {
    throw new Error("Address must be 42 characters long (including 0x)");
  }
  // Ensure the address is lowercase and properly formatted
  return address.toLowerCase() as Address;
}
