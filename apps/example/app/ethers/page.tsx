"use client";
import { useGetBalance } from "@/lib/ethers/hooks";
import { useEthers } from "@usedapp/core";
import { ethers } from "ethers";
import { Providers } from "./providers";
import { Header } from "./components/Header";
import { Bridge } from "./components/Bridge";

export default function Ethers() {
  return (
    <Providers>
      <Header />
      <main className="flex gap-2 text-sm min-h-screen max-w-[800px] min-w-[600px] mx-auto flex-col items-center justify-start p-24">
        <Bridge />
      </main>
    </Providers>
  );
}

function Balance() {
  const balance = useGetBalance();
  return (
    <h2>
      Balance: {balance ? ethers.utils.formatEther(balance) : "No Balance"}
    </h2>
  );
}

function Connect() {
  const { activateBrowserWallet, deactivate, account } = useEthers();
  if (account) {
    return (
      <div>
        <h2>Account: {account}</h2>
        <button onClick={() => deactivate()}>Disconnect</button>
      </div>
    );
  }
  return <button onClick={() => activateBrowserWallet()}>Connect</button>;
}
