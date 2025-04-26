import { createPublicClient, createWalletClient, http } from "viem";
// import { privateKeyToAccount } from "viem/accounts";
import { monadTestnet } from "viem/chains";

const signer = process.env.SIGNER_KEY || "0x";
// export const account = privateKeyToAccount(`0x${signer}`);

export const publicClient = createPublicClient({
  chain: monadTestnet,
  transport: http(),
});

// export const walletClient = createWalletClient({
//   account,
//   chain: monadTestnet,
//   transport: http(),
// });
