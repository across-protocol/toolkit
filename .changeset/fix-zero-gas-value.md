---
"@across-protocol/app-sdk": patch
---

Fix `executeSwapQuote` passing `gas: 0n` to the simulation call when `swapTx.gas` is zero. Some RPC providers (e.g. Alchemy on testnets) reject `eth_call` with `gas: "0x0"` as `IntrinsicGasTooLowError`. Zero-ish gas values are now treated as unset.
