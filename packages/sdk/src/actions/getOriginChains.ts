import { getClient } from "../client";

export async function getOriginChains() {
  const client = getClient();
  const res = await fetch(client.apiUrl);
  //   ...
  return res;
}
