import { beforeAll } from "vitest";

import { chainClients } from "./anvil";

// beforeAll(async () => {
//   // If you are using a fork, you can reset your anvil instance to the initial fork block.
//   await Promise.all(
//     Object.values(chainClients).map((client) => client.reset()),
//   );
// });
