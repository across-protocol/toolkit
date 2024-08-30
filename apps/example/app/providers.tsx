"use client";

import * as React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";
import {
  darkTheme,
  lightTheme,
  RainbowKitProvider,
} from "@rainbow-me/rainbowkit";
import { ThemeProvider, useTheme } from "next-themes";
import { config } from "@/lib/wagmi";

const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={true}
        >
          <RainbowProvider>{children}</RainbowProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

function RainbowProvider({ children }: { children: React.ReactNode }) {
  const { resolvedTheme } = useTheme();
  return (
    <RainbowKitProvider
      theme={resolvedTheme === "dark" ? darkTheme() : lightTheme()}
    >
      {children}
    </RainbowKitProvider>
  );
}
