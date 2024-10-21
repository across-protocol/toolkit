import { chainClients } from "./anvil.mts";

export default async function () {
  const servers = await Promise.all(
    Object.values(chainClients).map((chain) => chain.start()),
  );

  return async () => {
    await Promise.all(Object.values(chainClients).map((chain) => chain.stop()));
  };
}
