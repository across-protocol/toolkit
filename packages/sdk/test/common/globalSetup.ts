import { chainClients } from "./anvil.js";

export default async function () {
  const servers = await Promise.all(
    Object.values(chainClients).map((chain) => chain.start()),
  );

  return async () => {
    await Promise.all(servers.map((chain) => chain.stop()));
  };
}
