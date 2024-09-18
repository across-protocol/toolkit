"use client";

import { useEtherBalance, useEthers } from "@usedapp/core";

export function useGetBalance() {
  const { account } = useEthers();
  const userBalance = useEtherBalance(account);
  return userBalance;
}
