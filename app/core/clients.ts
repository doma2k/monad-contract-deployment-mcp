import { createPublicClient, createWalletClient, http } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { monadTestnet } from "viem/chains";
// import { walletActions } from "viem/actions";

export async function walletClient(key: string) {
  const signer = key || process.env.SIGNER_KEY;
  const account = privateKeyToAccount(`0x${signer}`);
  const walletClient = createWalletClient({
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
