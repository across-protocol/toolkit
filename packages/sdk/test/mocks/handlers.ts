// src/mocks/handlers.js
import { http, HttpResponse } from "msw";
import { MAINNET_SUPPORTED_CHAINS, TEST_BASE_URL } from "../common/client";
import {
  getAvailableRoutesResponse,
  getSupportedChainsResponse,
  getSuggestedFeesResponse,
} from "./data";

export const handlers = [
  //  getAvailableRoutes
  http.get(`${TEST_BASE_URL}/available-routes`, async ({ request }) => {
    const url = new URL(request.url);
    console.log(url);
    return HttpResponse.json(getAvailableRoutesResponse);
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
    if (givenChainIds.difference(expectedChainIds).keys().toArray().length) {
      return HttpResponse.json({
        status: 500,
        data: undefined,
      });
    }
    return HttpResponse.json(getSupportedChainsResponse);
  }),
  //  getSuggestedFees
  http.get(`${TEST_BASE_URL}/suggested-fees`, async ({ request }) => {
    console.log(request.url);
    return HttpResponse.json(getSuggestedFeesResponse);
  }),
];
