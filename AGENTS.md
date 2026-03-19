# AGENTS.md - toolkit

This is the Across Protocol toolkit monorepo — home of the `@across-protocol/app-sdk`, the TypeScript SDK for integrating Across bridging and swaps into dApps.

## How to use docs in this repo

Read docs in this order:

1. This file (`AGENTS.md`) for top-level navigation and module map.
2. `packages/sdk/README.md` for SDK usage, authentication, and examples.
3. `apps/example/` for working integration examples (viem + ethers).

## Documentation maintenance

Keep all relevant `AGENTS.md` and `README.md` files updated in the same change whenever SDK APIs, actions, or types change.

- Before writing implementation plans, surface material ambiguities first and resolve them with the user.
- For each new task, propose 0-3 targeted updates to `AGENTS.md` or `README.md` files (or explicitly state why no updates are needed).
- When adding new SDK actions, update the action list in this file and the SDK README.

## Quick index

- SDK source: `packages/sdk/src/`
- SDK entry point: `packages/sdk/src/index.ts`
- SDK client: `packages/sdk/src/client.ts`
- SDK actions: `packages/sdk/src/actions/`
- API layer: `packages/sdk/src/api/`
- SDK types: `packages/sdk/src/types/`
- SDK utilities: `packages/sdk/src/utils/`
- SDK tests: `packages/sdk/test/`
- Example app (viem): `apps/example/app/viem/`
- Example app (ethers): `apps/example/app/ethers/`
- Changesets: `.changeset/`

## SDK actions

The SDK exposes these actions through `AcrossClient`:

**Quotes and routes:**
- `getSuggestedFees` — Protocol fee suggestions
- `getAvailableRoutes` — Discover supported routes
- `getLimits` — Transfer limits
- `getQuote` — Bridge quote
- `getSwapQuote` — Swap + bridge quote
- `getSwapTokens` — Available swap tokens
- `getSwapChains` — Available swap chains

**Execution:**
- `executeQuote` — Execute a bridge quote
- `executeSwapQuote` — Execute a swap + bridge quote
- `simulateDepositTx` — Simulate deposit transaction
- `simulateApproveTx` — Simulate token approval
- `simulateUpdateDepositTx` — Simulate deposit update

**Tracking:**
- `waitForDepositTx` — Wait for deposit confirmation
- `waitForFillTx` — Wait for fill on destination chain
- `getDeposit` — Get deposit by ID
- `getDepositFromLogs` — Parse deposit from tx logs
- `getFillByDepositTx` — Find fill for a deposit

**Other:**
- `signUpdateDeposit` — Sign deposit update message

## Directory tree

```text
toolkit/
├── packages/
│   ├── sdk/                          # @across-protocol/app-sdk
│   │   ├── src/
│   │   │   ├── index.ts              # Main export
│   │   │   ├── client.ts             # AcrossClient class
│   │   │   ├── actions/              # 18 SDK action implementations
│   │   │   ├── api/                  # API communication (routes, fees, swap)
│   │   │   ├── abis/                 # SpokePool ABIs (v3, v3_5)
│   │   │   ├── constants/            # SDK constants
│   │   │   ├── errors/               # Error types
│   │   │   ├── types/                # TypeScript type definitions
│   │   │   └── utils/                # Utilities (logger, multicall, tenderly, etc.)
│   │   ├── test/
│   │   │   ├── unit/                 # Unit tests
│   │   │   ├── e2e/                  # End-to-end tests
│   │   │   ├── mocks/               # API mocks and fixtures
│   │   │   └── common/              # Test setup and helpers
│   │   ├── vitest.config.ts          # Test configuration
│   │   └── package.json              # Peer dep: viem@^2.31.2
│   ├── eslint-config/                # Shared ESLint config
│   └── typescript-config/            # Shared TypeScript config
├── apps/
│   └── example/                      # Next.js demo app
│       ├── app/viem/                 # viem + wagmi integration example
│       ├── app/ethers/               # ethers v5 integration example
│       └── scripts/                  # CLI demo scripts
├── turbo.json                        # Turborepo config
├── pnpm-workspace.yaml               # Workspace definition
├── .changeset/                       # Changeset versioning
└── package.json                      # pnpm, Node >=18
```

## Build and test

```bash
# Build all packages
pnpm build

# Run all tests
pnpm test

# Run SDK tests only
cd packages/sdk && pnpm test

# Lint and type-check
pnpm lint

# Format
pnpm format

# Release workflow
pnpm version-packages    # Changeset version bump
pnpm release             # Build + publish to npm
```

## Release process

This repo uses [changesets](https://github.com/changesets/changesets) for versioning:

1. Create a changeset: `pnpm changeset`
2. Version packages: `pnpm version-packages`
3. Merge to master — CI publishes automatically via GitHub Actions.

## Key dependencies

- **viem** (peer dependency, ^2.31.2) — Ethereum client library
- **zod** — Runtime type validation
- **Vitest** — Test framework
- **MSW** — API mocking in tests
