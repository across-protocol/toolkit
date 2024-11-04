import { afterAll } from "vitest";
import { chainClients } from "./anvil.js";

afterAll(async () => {
  await Promise.all(
    Object.values(chainClients).map((client) => client.reset()),
  );
  return;
});
