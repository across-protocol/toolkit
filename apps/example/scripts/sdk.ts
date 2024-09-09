import { AcrossClient } from "@across-toolkit/sdk";
import { encodeFunctionData, parseAbiItem, Address } from "viem";
import { arbitrum, mainnet } from "viem/chains";

const chains = [mainnet, arbitrum];

const rpcUrls = {
  [mainnet.id]: "https://mainnet.infura.io/v3/3f0ba4bb677d4bbbae9fdd888796a955",
  [arbitrum.id]:
    "https://arbitrum-mainnet.infura.io/v3/3f0ba4bb677d4bbbae9fdd888796a955",
};

const client = AcrossClient.create({
  useTestnet: false,
  integratorId: "TEST",
  chains,
  rpcUrls,
});

//  test using client with node
async function main() {
  // available routes
  const routes = await client.actions.getAvailableRoutes({
    originChainId: arbitrum.id,
    destinationChainId: mainnet.id,
  })!;
  const route = routes.find((r) => r.inputTokenSymbol === "DAI")!;
  console.log(route);

  // quote
  const inputAmount = 1000000000000000000000n;
  const userAddress = "0x924a9f036260DdD5808007E1AA95f08eD08aA569";
  // Aave v2 Lending Pool: https://etherscan.io/address/0x7d2768de32b0b80b7a3454c06bdac94a69ddc7a9
  const aaveAddress = "0x7d2768dE32b0b80b7a3454c06BdAc94A69DDc7A9";
  // DAI
  const depositCurrency = "0x6B175474E89094C44Da98b954EedeAC495271d0F";
  const aaveReferralCode = 0;

  const quoteRes = await client.actions.getQuote({
    route,
    inputAmount,
    recipient: "0x924a9f036260DdD5808007E1AA95f08eD08aA569",
    crossChainMessage: {
      actions: [
        {
          target: depositCurrency,
          callData: generateApproveCallData({
            aaveAddress,
            depositAmount: inputAmount,
          }),
          value: 0n,
          updateCallData: (outputAmount: bigint) =>
            generateApproveCallData({
              aaveAddress,
              depositAmount: outputAmount,
            }),
        },
        {
          target: aaveAddress,
          callData: generateDepositCallDataForAave({
            userAddress,
            depositAmount: inputAmount,
            depositCurrency,
            aaveReferralCode,
          }),
          value: 0n,
          updateCallData: (outputAmount: bigint) =>
            generateDepositCallDataForAave({
              userAddress,
              depositAmount: outputAmount,
              depositCurrency,
              aaveReferralCode,
            }),
        },
      ],
      fallbackRecipient: "0x924a9f036260DdD5808007E1AA95f08eD08aA569",
    },
  });
  console.log(quoteRes);
}
main();

function generateApproveCallData({
  aaveAddress,
  depositAmount,
}: {
  aaveAddress: Address;
  depositAmount: bigint;
}) {
  const approveCallData = encodeFunctionData({
    abi: [parseAbiItem("function approve(address spender, uint256 value)")],
    args: [aaveAddress, depositAmount],
  });

  return approveCallData;
}

function generateDepositCallDataForAave({
  userAddress,
  depositAmount,
  depositCurrency,
  aaveReferralCode,
}: {
  userAddress: Address;
  depositAmount: bigint;
  depositCurrency: Address;
  aaveReferralCode: number;
}) {
  return encodeFunctionData({
    abi: [
      parseAbiItem(
        "function deposit(address asset, uint256 amount, address onBehalfOf, uint16 referralCode)",
      ),
    ],
    args: [depositCurrency, depositAmount, userAddress, aaveReferralCode],
  });
}
