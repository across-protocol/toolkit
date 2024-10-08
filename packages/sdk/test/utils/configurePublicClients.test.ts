import { arbitrum, mainnet, optimism, polygon } from "viem/chains";
import { describe, expect, test } from "vitest";
import { configurePublicClients } from "../../src";

const chains = [...[mainnet, optimism, polygon, arbitrum]];

const webSocketArgs: Parameters<typeof configurePublicClients> = [
  chains,
  undefined,
  {
    [mainnet.id]: "wss://eth-mainnet.g.alchemy.com/v2/123abc123abc",
    [optimism.id]: "wss://opt-mainnet.g.alchemy.com/v2/123abc123abc",
    [polygon.id]: "wss://polygon-mainnet.g.alchemy.com/v2/123abc123abc",
    [arbitrum.id]: "wss://arb-mainnet.g.alchemy.com/v2/123abc123abc",
  },
];

const httpArgs: Parameters<typeof configurePublicClients> = [
  chains,
  undefined,
  {
    [mainnet.id]: "https://eth-mainnet.g.alchemy.com/v2/123abc123abc",
    [optimism.id]: "https://opt-mainnet.g.alchemy.com/v2/123abc123abc",
    [polygon.id]: "https://polygon-mainnet.g.alchemy.com/v2/123abc123abc",
    [arbitrum.id]: "https://arb-mainnet.g.alchemy.com/v2/123abc123abc",
  },
];

const webSocketClientsMap = configurePublicClients(...webSocketArgs);
const httpClientsMap = configurePublicClients(...httpArgs);

describe("Initializes Clients correctly", () => {
  test("Resolves web socket url as expected", () => {
    const mainnetTransport = webSocketClientsMap.get(mainnet.id);
    expect(mainnetTransport).to.not.be.undefined;
    const transportType = mainnetTransport?.transport.type;
    expect(transportType).toBe("webSocket");
  });

  test("Resolves http url as expected", () => {
    const mainnetTransport = httpClientsMap.get(mainnet.id);
    expect(mainnetTransport).to.not.be.undefined;
    const transportType = mainnetTransport?.transport.type;
    expect(transportType).toBe("http");
  });
});
