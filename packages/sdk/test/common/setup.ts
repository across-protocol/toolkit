import { afterAll } from "vitest";

import { chainClients } from "./anvil.mts";

afterAll(async () => {
  // If you are using a fork, you can reset your anvil instance to the initial fork block.
  await Promise.all(Object.values(chainClients).map((client) => client.stop()));
});
