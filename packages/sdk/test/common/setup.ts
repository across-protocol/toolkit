import { afterAll } from "vitest";

// optionally reset anvil instance to the initial fork block.
//  commenting this out since we don't do chain interactions in every test file
afterAll(async () => {
  //   await Promise.all(
  //     Object.values(chainClients).map((client) => client.reset()),
  //   );
  return;
});
