// 2 upgraded mock spoke pools have been deployed to sepolia
// https://docs.across.to/introduction/migration-guides/migration-guide-for-non-evm-and-prefills/testnet-environment-for-migration
export const UpgradeTestEnvironment = {
  spokePool1: {
    chainId: 11155111,
    address: "0x1755DD08108095C48509F5C91e071e0cb62eb27a",
    WETH: {
      address: "0x43f133FE6fDFA17c417695c476447dc2a449Ba5B",
      decimals: 18,
    },
  },
  spokePool2: {
    chainId: 11155112,
    address: "0xeF89171DBD5DEe4D74842C62689EC0804aF5807B",
    WETH: {
      address: "0x5b3acAADE6c53eFCD113dCa116F71312f2df666d",
      decimals: 18,
    },
  },
} as const;
