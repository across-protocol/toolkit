---
name: "Bug report \U0001F41B"
about: Thank you for reporting an issue with the Across Integrator SDK. To help us
  address your problem efficiently, please fill out the following details.
title: ''
labels: bug
assignees: ''

---

## Summary

<!-- Provide a clear and concise description of the issue -->

## Environment Details

- **Across Integrator SDK version**: <!-- e.g., 2.1.0 -->
- **Node.js version**: <!-- e.g., v16.13.0 -->
- **Package manager and version**: <!-- e.g., npm 8.1.0, yarn 1.22.17 -->
- **Operating System**: <!-- e.g., Windows 10, macOS Monterey 12.0.1, Ubuntu 20.04 -->
- **Frontend framework and version**: <!-- e.g., React 17.0.2, Vue 3.2.21, Next 14 -->
- **Browser and version**: <!-- If applicable, e.g., Chrome 95.0.4638.69, Firefox 94.0.1 -->
- **Other relevant dependencies**: <!-- List any other libraries or frameworks involved -->

## Integration Details

- **Functionality Affected**:

  - [ ] Getting a quote
  - [ ] Executing a quote
  - [ ] Tracking bridge progress & step affected (approval, deposit, fill)
  - [ ] Lower-level utilities
  - [ ] Other (please specify): <!-- Describe if other functionality is affected -->

- **Route**:
```ts
const route = {
  originChainId: 10,
  destinationChainId: 42_161,
  inputToken: "0x0b2C639c533813f4Aa9D7837CAf62653d097Ff85",
  outputToken: "0xaf88d065e77c8cC2239327C5EDb3A432268e5831",
}
```

- **Custom RPCs**:
- optimism - https://opt-mainnet.g.alchemy.com/v2/${ALCHEMY_KEY}
- arbitrum - https://arb-mainnet.g.alchemy.com/v2/${ALCHEMY_KEY}

## Steps to Reproduce

<!-- Provide a detailed step-by-step guide to reproduce the issue -->

1. <!-- Step 1: e.g., "Initialized the SDK with specific parameters" -->
2. <!-- Step 2: e.g., "Called the getQuote function with X parameters" -->
3. <!-- Step 3: e.g., "Observed an error message Y" -->

## Expected Behavior

<!-- Describe what you expected to happen -->

## Actual Behavior

<!-- Describe what actually happened, including any error messages or stack traces -->

## Is This a Regression?

- [ ] Yes
- [ ] No
- [ ] Not Sure

## Code Snippets (optional)

<!-- Provide relevant code snippets that can help us understand and reproduce the issue -->

```ts
const client = AcrossClient.create({
  chains,
  useTestnet: false,
  integratorId: "TEST",
  logLevel: "DEBUG",
  walletClient,
  tenderly: {
    accessKey: process.env.TENDERLY_ACCESS_KEY!,
    accountSlug: process.env.TENDERLY_ACCOUNT_SLUG!,
    projectSlug: process.env.TENDERLY_PROJECT_SLUG!,
  },
});

const routeInfo = await client.getAvailableRoutes({
  originChainId: 10,
  destinationChainId: 1,
  originToken: "0x123123",
});
```

## Logs / Error Messages (optional)

<!-- Include any relevant logs or error messages -->

## Screenshots (optional)

<!-- If applicable, add screenshots to help explain your problem -->

<!-- If yes, specify the last version where the issue did not occur -->

## Additional Context (optional)

<!-- Add any other information that might be relevant, such as recent changes to your environment, stack traces, or links to related issues -->

---
