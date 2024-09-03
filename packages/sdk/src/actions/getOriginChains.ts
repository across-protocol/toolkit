import { getClient } from "../client";
import { fetchAcross } from "../utils";

export async function getOriginChains() {
  const client = getClient();
  const res = await fetchAcross(client.apiUrl);
  //   ...
  return res;
}
