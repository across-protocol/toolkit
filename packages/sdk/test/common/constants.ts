import { getAddress } from "viem";

export const pool = Number(process.env.VITEST_POOL_ID ?? 1);

// Test accounts
export const ACCOUNTS = [
  "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
  "0x70997970c51812dc3a010c7d01b50e0d17dc79c8",
  "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC",
  "0x90F79bf6EB2c4f870365E785982E1f101E93b906",
  "0x15d34aaf54267db7d7c367839aaf71a00a2c6a65",
  "0x9965507D1a55bcC2695C58ba16FB37d819B0A4dc",
  "0x976EA74026E726554dB657fA54763abd0C3a0aa9",
  "0x14dC79964da2C08b23698B3D3cc7Ca32193d9955",
  "0x23618e81E3f5cdF7f54C3d65f7FBc0aBf5B21E8f",
  "0xa0Ee7A142d267C1f36714E4a8F75612F20a79720",
] as const;

// Intentionally disclosed private key for 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
export const PRIVATE_KEY =
  "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";

// Named accounts
export const [ALICE, BOB, RELAYER] = ACCOUNTS;

export const USDC_MAINNET = getAddress(
  "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
);
export const USDC_WHALE = getAddress(
  "0x55fe002aeff02f77364de339a1292923a15844b8",
);

function getEnv(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing environment variable "${key}"`);
  }
  return value;
}

function getMaybeEnv(key: string): string | undefined {
  return process.env[key];
}
const ALCHEMY_KEY = getEnv("VITE_ANVIL_ALCHEMY_KEY");
// FORK URLs
export const FORK_URL_OPTIMISM = `https://opt-mainnet.g.alchemy.com/v2/${ALCHEMY_KEY}`;
export const FORK_URL_BASE = `https://base-mainnet.g.alchemy.com/v2/${ALCHEMY_KEY}`;
export const FORK_URL_MAINNET = `https://eth-mainnet.g.alchemy.com/v2/${ALCHEMY_KEY}`;
export const FORK_URL_ARBITRUM = `https://arb-mainnet.g.alchemy.com/v2/${ALCHEMY_KEY}`;

// FORK BLOCK NUMBERS
export const BLOCK_NUMBER_OPTIMISM = BigInt(126951625);
export const BLOCK_NUMBER_BASE = BigInt(21363706);
export const BLOCK_NUMBER_MAINNET = BigInt(21020558);
export const BLOCK_NUMBER_ARBITRUM = BigInt(266447962);

export const TENDERLY_KEY = getMaybeEnv("VITE_TENDERLY_KEY");
export const MOCK_API = getMaybeEnv("VITE_MOCK_API") === "true";
