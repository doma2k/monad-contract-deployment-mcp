import { createPublicClient, createWalletClient, http } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { monadTestnet } from "viem/chains";
import { privateKeyValidation } from "./utils";

export async function getWalletClient(key: string) {
  const signer = privateKeyValidation(key);
  const account = privateKeyToAccount(signer);

  const walletClient = createWalletClient({
    account,
    chain: monadTestnet,
    transport: http(),
  });
  return walletClient;
}

export async function getPublicClient() {
  const publicClient = await createPublicClient({
    chain: monadTestnet,
    transport: http(),
  });
  return publicClient;
}
