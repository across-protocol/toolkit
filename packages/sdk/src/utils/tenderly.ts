import { HttpError } from "../errors";
import { isOk } from "./fetch";

export type TenderlySimulateTxParams = {
  accountSlug: string;
  projectSlug: string;
  accessKey: string;
  // Tenderly required params
  networkId: string;
  from: string;
  to: string;
  value: string;
  data: string;
  gas?: bigint;
  blockNumber?: "latest" | number;
  // Optional params
  enableShare?: boolean;
};

// Only subset with fields we use. For full response body see
// https://docs.tenderly.co/reference/api#/operations/simulateTransaction#response-body
type TenderlySimulateTxResponse = {
  simulation: {
    id: string;
  };
};

/**
 * Simulates a transaction on Tenderly and returns a shareable URL.
 *
 * @param params - The parameters for the simulation.
 * @returns A URL to the simulation result.
 */
export async function simulateTxOnTenderly(params: TenderlySimulateTxParams) {
  const simUrl = `https://api.tenderly.co/api/v1/account/${params.accountSlug}/project/${params.projectSlug}/simulate`;
  const simRes = await fetch(simUrl, {
    method: "POST",
    headers: {
      "X-Access-Key": params.accessKey,
    },
    body: JSON.stringify({
      network_id: params.networkId,
      from: params.from,
      to: params.to,
      input: params.data,
      gas: params.gas ? Number(params.gas) : undefined,
      block_number: params.blockNumber,
      save: true,
    }),
  });

  if (!isOk(simRes)) {
    throw new HttpError({
      status: simRes.status,
      url: simUrl,
      message: `Failed to simulate tx on Tenderly - ${simRes.status} ${simRes.statusText} - ${await simRes.text()}`,
    });
  }

  const simData = (await simRes.json()) as TenderlySimulateTxResponse;
  const simulationId = simData.simulation.id;

  // Enable sharing for the simulation
  if (params.enableShare) {
    const enableShareUrl = `https://api.tenderly.co/api/v1/account/${params.accountSlug}/project/${params.projectSlug}/simulations/${simulationId}/share`;
    const enableShareRes = await fetch(enableShareUrl, {
      method: "POST",
      headers: {
        "X-Access-Key": params.accessKey,
      },
    });

    if (!isOk(enableShareRes)) {
      throw new HttpError({
        status: enableShareRes.status,
        url: enableShareUrl,
        message: `Failed to enable sharing Tenderly simulation - ${enableShareRes.status} ${enableShareRes.statusText} - ${await enableShareRes.text()}`,
      });
    }
  }

  const url = params.enableShare
    ? `https://www.tdly.co/shared/simulation/${simulationId}`
    : `https://dashboard.tenderly.co/${params.accountSlug}/${params.projectSlug}/simulator/${simulationId}`;
  return {
    simulationId,
    simulationUrl: url,
  };
}
