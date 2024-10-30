import { afterAll } from "vitest";
import { chainClients } from "./anvil";

afterAll(async () => {
  await Promise.all(
    Object.values(chainClients).map((client) => client.reset()),
  );
  return;
});
