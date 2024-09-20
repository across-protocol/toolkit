import React from "react";
import { AcrossClient } from "@across-toolkit/sdk";
import { SUPPORTED_CHAINS } from "./chains";

const sdk = AcrossClient.create({
  chains: [...SUPPORTED_CHAINS],
  useTestnet: false,
  integratorId: "TEST",
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
