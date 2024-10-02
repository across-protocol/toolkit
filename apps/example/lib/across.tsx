"use client";

import React from "react";
import { AcrossClient } from "@across-protocol/integrator-sdk";
import { MAINNET_SUPPORTED_CHAINS } from "./chains";

export const SUPPORTED_CHAINS = MAINNET_SUPPORTED_CHAINS;

const sdk = AcrossClient.create({
  chains: [...SUPPORTED_CHAINS],
  useTestnet: false,
  logLevel: "DEBUG",
});

// assuming we want to update the sdk (??), we should pass it around via context.
const AcrossContext = React.createContext<AcrossClient>(sdk);

export function AcrossProvider({ children }: { children: React.ReactNode }) {
  return (
    <AcrossContext.Provider value={sdk}>{children}</AcrossContext.Provider>
  );
}

export function useAcross() {
  return React.useContext(AcrossContext);
}
