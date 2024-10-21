import { beforeAll } from "vitest";
import { chainClients } from "./anvil.mts";

export function sleep(ms: number) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(true), ms);
  });
}

export type Compute<type> = { [key in keyof type]: type[key] } & unknown;

export async function resetChainBeforeAll() {
  return beforeAll(async () => {
    await Promise.all(
      Object.values(chainClients).map((client) => client.reset()),
    );
  });
}
