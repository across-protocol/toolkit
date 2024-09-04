import { AcrossClient } from "@across-toolkit/sdk";

//  test using client with node
(async function main() {
  const client = AcrossClient.create({
    useTestnet: false,
    integratorId: "TEST",
  });

  const res = await client.actions.getSuggestedFees({
    token: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
    originChainId: 1,
    destinationChainId: 10,
    amount: "1000000000000000000",
  });

  console.log(res);
})();
