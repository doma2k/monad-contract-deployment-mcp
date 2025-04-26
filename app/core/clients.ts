import { createPublicClient, createWalletClient, http } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { monadTestnet } from "viem/chains";

export async function walletClient() {
  const signer = process.env.SIGNER_KEY || "0x";
  const account = privateKeyToAccount(`0x${signer}`);

  const walletClient = await createWalletClient({
    account,
    chain: monadTestnet,
    transport: http(),
  });
  return walletClient;
}

export async function publicClient() {
  const publicClient = await createPublicClient({
    chain: monadTestnet,
    transport: http(),
  });
  return publicClient;
}
