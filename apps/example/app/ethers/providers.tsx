"use client";
import { DAppProvider, Arbitrum, Config, Mainnet } from "@usedapp/core";
import * as React from "react";
import { ThemeProvider } from "next-themes";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={true}>
      <DAppProvider config={config}>{children}</DAppProvider>
    </ThemeProvider>
  );
}

const config: Config = {
  readOnlyChainId: Mainnet.chainId,
  readOnlyUrls: {
    [Mainnet.chainId]: "https://eth.llamarpc.com",
    [Arbitrum.chainId]: "https://arbitrum.llamarpc.com",
  },
};
