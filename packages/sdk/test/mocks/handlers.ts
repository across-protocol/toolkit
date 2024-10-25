// src/mocks/handlers.js
import { http, HttpResponse } from "msw";
import { MAINNET_SUPPORTED_CHAINS, TEST_BASE_URL } from "../common/sdk";
import {
  usdcMainnetArbitrum as route,
  mainnetChainInfo,
  usdcMainnetArbitrumFees as fees,
} from "./data";
import { getCurrentTimeSeconds } from "../../src";
import { MOCK_API } from "../common/constants";

export const handlers = MOCK_API
  ? [
      //  getAvailableRoutes
      http.get(`${TEST_BASE_URL}/available-routes`, async ({ request }) => {
        const url = new URL(request.url);
        console.log(url);
        return HttpResponse.json(route);
      }),
      //  getSupportedChains
      http.get(`${TEST_BASE_URL}/chains`, async ({ request }) => {
        const url = new URL(request.url);
        const givenChainIds = new Set(
          url.searchParams.getAll("chainId").map(Number),
        );
        const expectedChainIds = new Set(
          MAINNET_SUPPORTED_CHAINS.map((chain) => chain.id),
        );
        // check if client has in-fact fetched chain info for ALL chains, if not we force test to fail downstream
        if (givenChainIds.size !== expectedChainIds.size) {
          return HttpResponse.json({
            status: 500,
            data: undefined,
          });
        }
        return HttpResponse.json(mainnetChainInfo);
      }),
      //  getSuggestedFees
      http.get(`${TEST_BASE_URL}/suggested-fees`, async ({ request }) => {
        console.log(request.url);
        const data = {
          ...fees,
          timestamp: getCurrentTimeSeconds(),
        };
        return HttpResponse.json(data);
      }),
    ]
  : [];
