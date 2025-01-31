/**
 * @notice ABI definition for the Across Protocol SpokePool contract
 * @dev WARNING: This ABI may be reduced in scope over time as unused functions are removed
 * @see {@link https://github.com/across-protocol/contracts/blob/audit-latest/contracts/SpokePool.sol} for the most recent audited contract specification
 */
export const spokePoolAbiV3_5 = [
  {
    inputs: [],
    name: "ClaimedMerkleLeaf",
    type: "error",
  },
  {
    inputs: [],
    name: "DepositsArePaused",
    type: "error",
  },
  {
    inputs: [],
    name: "DisabledRoute",
    type: "error",
  },
  {
    inputs: [],
    name: "ExpiredFillDeadline",
    type: "error",
  },
  {
    inputs: [],
    name: "FillsArePaused",
    type: "error",
  },
  {
    inputs: [],
    name: "InsufficientSpokePoolBalanceToExecuteLeaf",
    type: "error",
  },
  {
    inputs: [],
    name: "InvalidBytes32",
    type: "error",
  },
  {
    inputs: [],
    name: "InvalidChainId",
    type: "error",
  },
  {
    inputs: [],
    name: "InvalidCrossDomainAdmin",
    type: "error",
  },
  {
    inputs: [],
    name: "InvalidDepositorSignature",
    type: "error",
  },
  {
    inputs: [],
    name: "InvalidExclusiveRelayer",
    type: "error",
  },
  {
    inputs: [],
    name: "InvalidFillDeadline",
    type: "error",
  },
  {
    inputs: [],
    name: "InvalidMerkleLeaf",
    type: "error",
  },
  {
    inputs: [],
    name: "InvalidMerkleProof",
    type: "error",
  },
  {
    inputs: [],
    name: "InvalidPayoutAdjustmentPct",
    type: "error",
  },
  {
    inputs: [],
    name: "InvalidQuoteTimestamp",
    type: "error",
  },
  {
    inputs: [],
    name: "InvalidRelayerFeePct",
    type: "error",
  },
  {
    inputs: [],
    name: "InvalidSlowFillRequest",
    type: "error",
  },
  {
    inputs: [],
    name: "InvalidWithdrawalRecipient",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "bytes",
        name: "data",
        type: "bytes",
      },
    ],
    name: "LowLevelCallFailed",
    type: "error",
  },
  {
    inputs: [],
    name: "MaxTransferSizeExceeded",
    type: "error",
  },
  {
    inputs: [],
    name: "MsgValueDoesNotMatchInputAmount",
    type: "error",
  },
  {
    inputs: [],
    name: "NoRelayerRefundToClaim",
    type: "error",
  },
  {
    inputs: [],
    name: "NoSlowFillsInExclusivityWindow",
    type: "error",
  },
  {
    inputs: [],
    name: "NotEOA",
    type: "error",
  },
  {
    inputs: [],
    name: "NotExclusiveRelayer",
    type: "error",
  },
  {
    inputs: [],
    name: "RelayFilled",
    type: "error",
  },
  {
    inputs: [],
    name: "WrongERC7683OrderId",
    type: "error",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "previousAdmin",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "newAdmin",
        type: "address",
      },
    ],
    name: "AdminChanged",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "beacon",
        type: "address",
      },
    ],
    name: "BeaconUpgraded",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes32",
        name: "l2TokenAddress",
        type: "bytes32",
      },
      {
        indexed: true,
        internalType: "bytes32",
        name: "refundAddress",
        type: "bytes32",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "address",
        name: "caller",
        type: "address",
      },
    ],
    name: "ClaimedRelayerRefund",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "rootBundleId",
        type: "uint256",
      },
    ],
    name: "EmergencyDeletedRootBundle",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "originToken",
        type: "address",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "destinationChainId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "bool",
        name: "enabled",
        type: "bool",
      },
    ],
    name: "EnabledDepositRoute",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "amountToReturn",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "chainId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256[]",
        name: "refundAmounts",
        type: "uint256[]",
      },
      {
        indexed: true,
        internalType: "uint32",
        name: "rootBundleId",
        type: "uint32",
      },
      {
        indexed: true,
        internalType: "uint32",
        name: "leafId",
        type: "uint32",
      },
      {
        indexed: false,
        internalType: "address",
        name: "l2TokenAddress",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address[]",
        name: "refundAddresses",
        type: "address[]",
      },
      {
        indexed: false,
        internalType: "bool",
        name: "deferredRefunds",
        type: "bool",
      },
      {
        indexed: false,
        internalType: "address",
        name: "caller",
        type: "address",
      },
    ],
    name: "ExecutedRelayerRefundRoot",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "bytes32",
        name: "inputToken",
        type: "bytes32",
      },
      {
        indexed: false,
        internalType: "bytes32",
        name: "outputToken",
        type: "bytes32",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "inputAmount",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "outputAmount",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "repaymentChainId",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "originChainId",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "depositId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint32",
        name: "fillDeadline",
        type: "uint32",
      },
      {
        indexed: false,
        internalType: "uint32",
        name: "exclusivityDeadline",
        type: "uint32",
      },
      {
        indexed: false,
        internalType: "bytes32",
        name: "exclusiveRelayer",
        type: "bytes32",
      },
      {
        indexed: true,
        internalType: "bytes32",
        name: "relayer",
        type: "bytes32",
      },
      {
        indexed: false,
        internalType: "bytes32",
        name: "depositor",
        type: "bytes32",
      },
      {
        indexed: false,
        internalType: "bytes32",
        name: "recipient",
        type: "bytes32",
      },
      {
        indexed: false,
        internalType: "bytes32",
        name: "messageHash",
        type: "bytes32",
      },
      {
        components: [
          {
            internalType: "bytes32",
            name: "updatedRecipient",
            type: "bytes32",
          },
          {
            internalType: "bytes32",
            name: "updatedMessageHash",
            type: "bytes32",
          },
          {
            internalType: "uint256",
            name: "updatedOutputAmount",
            type: "uint256",
          },
          {
            internalType: "enum V3SpokePoolInterface.FillType",
            name: "fillType",
            type: "uint8",
          },
        ],
        indexed: false,
        internalType: "struct V3SpokePoolInterface.V3RelayExecutionEventInfo",
        name: "relayExecutionInfo",
        type: "tuple",
      },
    ],
    name: "FilledRelay",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "inputToken",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "outputToken",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "inputAmount",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "outputAmount",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "repaymentChainId",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "originChainId",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "uint32",
        name: "depositId",
        type: "uint32",
      },
      {
        indexed: false,
        internalType: "uint32",
        name: "fillDeadline",
        type: "uint32",
      },
      {
        indexed: false,
        internalType: "uint32",
        name: "exclusivityDeadline",
        type: "uint32",
      },
      {
        indexed: false,
        internalType: "address",
        name: "exclusiveRelayer",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "relayer",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "depositor",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "recipient",
        type: "address",
      },
      {
        indexed: false,
        internalType: "bytes",
        name: "message",
        type: "bytes",
      },
      {
        components: [
          {
            internalType: "address",
            name: "updatedRecipient",
            type: "address",
          },
          {
            internalType: "bytes",
            name: "updatedMessage",
            type: "bytes",
          },
          {
            internalType: "uint256",
            name: "updatedOutputAmount",
            type: "uint256",
          },
          {
            internalType: "enum V3SpokePoolInterface.FillType",
            name: "fillType",
            type: "uint8",
          },
        ],
        indexed: false,
        internalType:
          "struct V3SpokePoolInterface.LegacyV3RelayExecutionEventInfo",
        name: "relayExecutionInfo",
        type: "tuple",
      },
    ],
    name: "FilledV3Relay",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "bytes32",
        name: "inputToken",
        type: "bytes32",
      },
      {
        indexed: false,
        internalType: "bytes32",
        name: "outputToken",
        type: "bytes32",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "inputAmount",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "outputAmount",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "destinationChainId",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "depositId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint32",
        name: "quoteTimestamp",
        type: "uint32",
      },
      {
        indexed: false,
        internalType: "uint32",
        name: "fillDeadline",
        type: "uint32",
      },
      {
        indexed: false,
        internalType: "uint32",
        name: "exclusivityDeadline",
        type: "uint32",
      },
      {
        indexed: true,
        internalType: "bytes32",
        name: "depositor",
        type: "bytes32",
      },
      {
        indexed: false,
        internalType: "bytes32",
        name: "recipient",
        type: "bytes32",
      },
      {
        indexed: false,
        internalType: "bytes32",
        name: "exclusiveRelayer",
        type: "bytes32",
      },
      {
        indexed: false,
        internalType: "bytes",
        name: "message",
        type: "bytes",
      },
    ],
    name: "FundsDeposited",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint8",
        name: "version",
        type: "uint8",
      },
    ],
    name: "Initialized",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "bool",
        name: "isPaused",
        type: "bool",
      },
    ],
    name: "PausedDeposits",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "bool",
        name: "isPaused",
        type: "bool",
      },
    ],
    name: "PausedFills",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint32",
        name: "rootBundleId",
        type: "uint32",
      },
      {
        indexed: true,
        internalType: "bytes32",
        name: "relayerRefundRoot",
        type: "bytes32",
      },
      {
        indexed: true,
        internalType: "bytes32",
        name: "slowRelayRoot",
        type: "bytes32",
      },
    ],
    name: "RelayedRootBundle",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "bytes32",
        name: "inputToken",
        type: "bytes32",
      },
      {
        indexed: false,
        internalType: "bytes32",
        name: "outputToken",
        type: "bytes32",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "inputAmount",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "outputAmount",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "originChainId",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "depositId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint32",
        name: "fillDeadline",
        type: "uint32",
      },
      {
        indexed: false,
        internalType: "uint32",
        name: "exclusivityDeadline",
        type: "uint32",
      },
      {
        indexed: false,
        internalType: "bytes32",
        name: "exclusiveRelayer",
        type: "bytes32",
      },
      {
        indexed: false,
        internalType: "bytes32",
        name: "depositor",
        type: "bytes32",
      },
      {
        indexed: false,
        internalType: "bytes32",
        name: "recipient",
        type: "bytes32",
      },
      {
        indexed: false,
        internalType: "bytes32",
        name: "messageHash",
        type: "bytes32",
      },
    ],
    name: "RequestedSlowFill",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "updatedOutputAmount",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "depositId",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "bytes32",
        name: "depositor",
        type: "bytes32",
      },
      {
        indexed: false,
        internalType: "bytes32",
        name: "updatedRecipient",
        type: "bytes32",
      },
      {
        indexed: false,
        internalType: "bytes",
        name: "updatedMessage",
        type: "bytes",
      },
      {
        indexed: false,
        internalType: "bytes",
        name: "depositorSignature",
        type: "bytes",
      },
    ],
    name: "RequestedSpeedUpDeposit",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "updatedOutputAmount",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "uint32",
        name: "depositId",
        type: "uint32",
      },
      {
        indexed: true,
        internalType: "address",
        name: "depositor",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "updatedRecipient",
        type: "address",
      },
      {
        indexed: false,
        internalType: "bytes",
        name: "updatedMessage",
        type: "bytes",
      },
      {
        indexed: false,
        internalType: "bytes",
        name: "depositorSignature",
        type: "bytes",
      },
    ],
    name: "RequestedSpeedUpV3Deposit",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "inputToken",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "outputToken",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "inputAmount",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "outputAmount",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "originChainId",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "uint32",
        name: "depositId",
        type: "uint32",
      },
      {
        indexed: false,
        internalType: "uint32",
        name: "fillDeadline",
        type: "uint32",
      },
      {
        indexed: false,
        internalType: "uint32",
        name: "exclusivityDeadline",
        type: "uint32",
      },
      {
        indexed: false,
        internalType: "address",
        name: "exclusiveRelayer",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "depositor",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "recipient",
        type: "address",
      },
      {
        indexed: false,
        internalType: "bytes",
        name: "message",
        type: "bytes",
      },
    ],
    name: "RequestedV3SlowFill",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "newWithdrawalRecipient",
        type: "address",
      },
    ],
    name: "SetWithdrawalRecipient",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "newAdmin",
        type: "address",
      },
    ],
    name: "SetXDomainAdmin",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "amountToReturn",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "chainId",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "uint32",
        name: "leafId",
        type: "uint32",
      },
      {
        indexed: true,
        internalType: "bytes32",
        name: "l2TokenAddress",
        type: "bytes32",
      },
      {
        indexed: false,
        internalType: "address",
        name: "caller",
        type: "address",
      },
    ],
    name: "TokensBridged",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "implementation",
        type: "address",
      },
    ],
    name: "Upgraded",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "inputToken",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "outputToken",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "inputAmount",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "outputAmount",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "destinationChainId",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "uint32",
        name: "depositId",
        type: "uint32",
      },
      {
        indexed: false,
        internalType: "uint32",
        name: "quoteTimestamp",
        type: "uint32",
      },
      {
        indexed: false,
        internalType: "uint32",
        name: "fillDeadline",
        type: "uint32",
      },
      {
        indexed: false,
        internalType: "uint32",
        name: "exclusivityDeadline",
        type: "uint32",
      },
      {
        indexed: true,
        internalType: "address",
        name: "depositor",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "recipient",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "exclusiveRelayer",
        type: "address",
      },
      {
        indexed: false,
        internalType: "bytes",
        name: "message",
        type: "bytes",
      },
    ],
    name: "V3FundsDeposited",
    type: "event",
  },
  {
    inputs: [],
    name: "EMPTY_RELAYER",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "EMPTY_REPAYMENT_CHAIN_ID",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "INFINITE_FILL_DEADLINE",
    outputs: [
      {
        internalType: "uint32",
        name: "",
        type: "uint32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "MAX_EXCLUSIVITY_PERIOD_SECONDS",
    outputs: [
      {
        internalType: "uint32",
        name: "",
        type: "uint32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "MAX_TRANSFER_SIZE",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "UPDATE_ADDRESS_DEPOSIT_DETAILS_HASH",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "UPDATE_BYTES32_DEPOSIT_DETAILS_HASH",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint32",
        name: "_initialDepositId",
        type: "uint32",
      },
      {
        internalType: "address",
        name: "_crossDomainAdmin",
        type: "address",
      },
      {
        internalType: "address",
        name: "_withdrawalRecipient",
        type: "address",
      },
    ],
    name: "__SpokePool_init",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "chainId",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "l2TokenAddress",
        type: "bytes32",
      },
      {
        internalType: "bytes32",
        name: "refundAddress",
        type: "bytes32",
      },
    ],
    name: "claimRelayerRefund",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "crossDomainAdmin",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "depositor",
        type: "bytes32",
      },
      {
        internalType: "bytes32",
        name: "recipient",
        type: "bytes32",
      },
      {
        internalType: "bytes32",
        name: "inputToken",
        type: "bytes32",
      },
      {
        internalType: "bytes32",
        name: "outputToken",
        type: "bytes32",
      },
      {
        internalType: "uint256",
        name: "inputAmount",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "outputAmount",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "destinationChainId",
        type: "uint256",
      },
      {
        internalType: "bytes32",
        name: "exclusiveRelayer",
        type: "bytes32",
      },
      {
        internalType: "uint32",
        name: "quoteTimestamp",
        type: "uint32",
      },
      {
        internalType: "uint32",
        name: "fillDeadline",
        type: "uint32",
      },
      {
        internalType: "uint32",
        name: "exclusivityParameter",
        type: "uint32",
      },
      {
        internalType: "bytes",
        name: "message",
        type: "bytes",
      },
    ],
    name: "deposit",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "recipient",
        type: "address",
      },
      {
        internalType: "address",
        name: "originToken",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "destinationChainId",
        type: "uint256",
      },
      {
        internalType: "int64",
        name: "relayerFeePct",
        type: "int64",
      },
      {
        internalType: "uint32",
        name: "quoteTimestamp",
        type: "uint32",
      },
      {
        internalType: "bytes",
        name: "message",
        type: "bytes",
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "depositDeprecated_5947912356",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "depositor",
        type: "address",
      },
      {
        internalType: "address",
        name: "recipient",
        type: "address",
      },
      {
        internalType: "address",
        name: "originToken",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "destinationChainId",
        type: "uint256",
      },
      {
        internalType: "int64",
        name: "relayerFeePct",
        type: "int64",
      },
      {
        internalType: "uint32",
        name: "quoteTimestamp",
        type: "uint32",
      },
      {
        internalType: "bytes",
        name: "message",
        type: "bytes",
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "depositFor",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "depositor",
        type: "bytes32",
      },
      {
        internalType: "bytes32",
        name: "recipient",
        type: "bytes32",
      },
      {
        internalType: "bytes32",
        name: "inputToken",
        type: "bytes32",
      },
      {
        internalType: "bytes32",
        name: "outputToken",
        type: "bytes32",
      },
      {
        internalType: "uint256",
        name: "inputAmount",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "outputAmount",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "destinationChainId",
        type: "uint256",
      },
      {
        internalType: "bytes32",
        name: "exclusiveRelayer",
        type: "bytes32",
      },
      {
        internalType: "uint32",
        name: "fillDeadlineOffset",
        type: "uint32",
      },
      {
        internalType: "uint32",
        name: "exclusivityPeriod",
        type: "uint32",
      },
      {
        internalType: "bytes",
        name: "message",
        type: "bytes",
      },
    ],
    name: "depositNow",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [],
    name: "depositQuoteTimeBuffer",
    outputs: [
      {
        internalType: "uint32",
        name: "",
        type: "uint32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "depositor",
        type: "address",
      },
      {
        internalType: "address",
        name: "recipient",
        type: "address",
      },
      {
        internalType: "address",
        name: "inputToken",
        type: "address",
      },
      {
        internalType: "address",
        name: "outputToken",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "inputAmount",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "outputAmount",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "destinationChainId",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "exclusiveRelayer",
        type: "address",
      },
      {
        internalType: "uint32",
        name: "quoteTimestamp",
        type: "uint32",
      },
      {
        internalType: "uint32",
        name: "fillDeadline",
        type: "uint32",
      },
      {
        internalType: "uint32",
        name: "exclusivityParameter",
        type: "uint32",
      },
      {
        internalType: "bytes",
        name: "message",
        type: "bytes",
      },
    ],
    name: "depositV3",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "depositor",
        type: "address",
      },
      {
        internalType: "address",
        name: "recipient",
        type: "address",
      },
      {
        internalType: "address",
        name: "inputToken",
        type: "address",
      },
      {
        internalType: "address",
        name: "outputToken",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "inputAmount",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "outputAmount",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "destinationChainId",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "exclusiveRelayer",
        type: "address",
      },
      {
        internalType: "uint32",
        name: "fillDeadlineOffset",
        type: "uint32",
      },
      {
        internalType: "uint32",
        name: "exclusivityPeriod",
        type: "uint32",
      },
      {
        internalType: "bytes",
        name: "message",
        type: "bytes",
      },
    ],
    name: "depositV3Now",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "rootBundleId",
        type: "uint256",
      },
    ],
    name: "emergencyDeleteRootBundle",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "enabledDepositRoutes",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint32",
        name: "rootBundleId",
        type: "uint32",
      },
      {
        components: [
          {
            internalType: "uint256",
            name: "amountToReturn",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "chainId",
            type: "uint256",
          },
          {
            internalType: "uint256[]",
            name: "refundAmounts",
            type: "uint256[]",
          },
          {
            internalType: "uint32",
            name: "leafId",
            type: "uint32",
          },
          {
            internalType: "address",
            name: "l2TokenAddress",
            type: "address",
          },
          {
            internalType: "address[]",
            name: "refundAddresses",
            type: "address[]",
          },
        ],
        internalType: "struct SpokePoolInterface.RelayerRefundLeaf",
        name: "relayerRefundLeaf",
        type: "tuple",
      },
      {
        internalType: "bytes32[]",
        name: "proof",
        type: "bytes32[]",
      },
    ],
    name: "executeRelayerRefundLeaf",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          {
            components: [
              {
                internalType: "bytes32",
                name: "depositor",
                type: "bytes32",
              },
              {
                internalType: "bytes32",
                name: "recipient",
                type: "bytes32",
              },
              {
                internalType: "bytes32",
                name: "exclusiveRelayer",
                type: "bytes32",
              },
              {
                internalType: "bytes32",
                name: "inputToken",
                type: "bytes32",
              },
              {
                internalType: "bytes32",
                name: "outputToken",
                type: "bytes32",
              },
              {
                internalType: "uint256",
                name: "inputAmount",
                type: "uint256",
              },
              {
                internalType: "uint256",
                name: "outputAmount",
                type: "uint256",
              },
              {
                internalType: "uint256",
                name: "originChainId",
                type: "uint256",
              },
              {
                internalType: "uint256",
                name: "depositId",
                type: "uint256",
              },
              {
                internalType: "uint32",
                name: "fillDeadline",
                type: "uint32",
              },
              {
                internalType: "uint32",
                name: "exclusivityDeadline",
                type: "uint32",
              },
              {
                internalType: "bytes",
                name: "message",
                type: "bytes",
              },
            ],
            internalType: "struct V3SpokePoolInterface.V3RelayData",
            name: "relayData",
            type: "tuple",
          },
          {
            internalType: "uint256",
            name: "chainId",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "updatedOutputAmount",
            type: "uint256",
          },
        ],
        internalType: "struct V3SpokePoolInterface.V3SlowFill",
        name: "slowFillLeaf",
        type: "tuple",
      },
      {
        internalType: "uint32",
        name: "rootBundleId",
        type: "uint32",
      },
      {
        internalType: "bytes32[]",
        name: "proof",
        type: "bytes32[]",
      },
    ],
    name: "executeSlowRelayLeaf",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "orderId",
        type: "bytes32",
      },
      {
        internalType: "bytes",
        name: "originData",
        type: "bytes",
      },
      {
        internalType: "bytes",
        name: "fillerData",
        type: "bytes",
      },
    ],
    name: "fill",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "fillDeadlineBuffer",
    outputs: [
      {
        internalType: "uint32",
        name: "",
        type: "uint32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: "bytes32",
            name: "depositor",
            type: "bytes32",
          },
          {
            internalType: "bytes32",
            name: "recipient",
            type: "bytes32",
          },
          {
            internalType: "bytes32",
            name: "exclusiveRelayer",
            type: "bytes32",
          },
          {
            internalType: "bytes32",
            name: "inputToken",
            type: "bytes32",
          },
          {
            internalType: "bytes32",
            name: "outputToken",
            type: "bytes32",
          },
          {
            internalType: "uint256",
            name: "inputAmount",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "outputAmount",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "originChainId",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "depositId",
            type: "uint256",
          },
          {
            internalType: "uint32",
            name: "fillDeadline",
            type: "uint32",
          },
          {
            internalType: "uint32",
            name: "exclusivityDeadline",
            type: "uint32",
          },
          {
            internalType: "bytes",
            name: "message",
            type: "bytes",
          },
        ],
        internalType: "struct V3SpokePoolInterface.V3RelayData",
        name: "relayData",
        type: "tuple",
      },
      {
        internalType: "uint256",
        name: "repaymentChainId",
        type: "uint256",
      },
      {
        internalType: "bytes32",
        name: "repaymentAddress",
        type: "bytes32",
      },
    ],
    name: "fillRelay",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: "bytes32",
            name: "depositor",
            type: "bytes32",
          },
          {
            internalType: "bytes32",
            name: "recipient",
            type: "bytes32",
          },
          {
            internalType: "bytes32",
            name: "exclusiveRelayer",
            type: "bytes32",
          },
          {
            internalType: "bytes32",
            name: "inputToken",
            type: "bytes32",
          },
          {
            internalType: "bytes32",
            name: "outputToken",
            type: "bytes32",
          },
          {
            internalType: "uint256",
            name: "inputAmount",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "outputAmount",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "originChainId",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "depositId",
            type: "uint256",
          },
          {
            internalType: "uint32",
            name: "fillDeadline",
            type: "uint32",
          },
          {
            internalType: "uint32",
            name: "exclusivityDeadline",
            type: "uint32",
          },
          {
            internalType: "bytes",
            name: "message",
            type: "bytes",
          },
        ],
        internalType: "struct V3SpokePoolInterface.V3RelayData",
        name: "relayData",
        type: "tuple",
      },
      {
        internalType: "uint256",
        name: "repaymentChainId",
        type: "uint256",
      },
      {
        internalType: "bytes32",
        name: "repaymentAddress",
        type: "bytes32",
      },
      {
        internalType: "uint256",
        name: "updatedOutputAmount",
        type: "uint256",
      },
      {
        internalType: "bytes32",
        name: "updatedRecipient",
        type: "bytes32",
      },
      {
        internalType: "bytes",
        name: "updatedMessage",
        type: "bytes",
      },
      {
        internalType: "bytes",
        name: "depositorSignature",
        type: "bytes",
      },
    ],
    name: "fillRelayWithUpdatedDeposit",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    name: "fillStatuses",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: "address",
            name: "depositor",
            type: "address",
          },
          {
            internalType: "address",
            name: "recipient",
            type: "address",
          },
          {
            internalType: "address",
            name: "exclusiveRelayer",
            type: "address",
          },
          {
            internalType: "address",
            name: "inputToken",
            type: "address",
          },
          {
            internalType: "address",
            name: "outputToken",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "inputAmount",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "outputAmount",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "originChainId",
            type: "uint256",
          },
          {
            internalType: "uint32",
            name: "depositId",
            type: "uint32",
          },
          {
            internalType: "uint32",
            name: "fillDeadline",
            type: "uint32",
          },
          {
            internalType: "uint32",
            name: "exclusivityDeadline",
            type: "uint32",
          },
          {
            internalType: "bytes",
            name: "message",
            type: "bytes",
          },
        ],
        internalType: "struct V3SpokePoolInterface.V3RelayDataLegacy",
        name: "relayData",
        type: "tuple",
      },
      {
        internalType: "uint256",
        name: "repaymentChainId",
        type: "uint256",
      },
    ],
    name: "fillV3Relay",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "getCurrentTime",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "l2TokenAddress",
        type: "address",
      },
      {
        internalType: "address",
        name: "refundAddress",
        type: "address",
      },
    ],
    name: "getRelayerRefund",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "msgSender",
        type: "address",
      },
      {
        internalType: "bytes32",
        name: "depositor",
        type: "bytes32",
      },
      {
        internalType: "uint256",
        name: "depositNonce",
        type: "uint256",
      },
    ],
    name: "getUnsafeDepositId",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes[]",
        name: "data",
        type: "bytes[]",
      },
    ],
    name: "multicall",
    outputs: [
      {
        internalType: "bytes[]",
        name: "results",
        type: "bytes[]",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "numberOfDeposits",
    outputs: [
      {
        internalType: "uint32",
        name: "",
        type: "uint32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bool",
        name: "pause",
        type: "bool",
      },
    ],
    name: "pauseDeposits",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bool",
        name: "pause",
        type: "bool",
      },
    ],
    name: "pauseFills",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "pausedDeposits",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "pausedFills",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "proxiableUUID",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "relayerRefundRoot",
        type: "bytes32",
      },
      {
        internalType: "bytes32",
        name: "slowRelayRoot",
        type: "bytes32",
      },
    ],
    name: "relayRootBundle",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "relayerRefund",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: "bytes32",
            name: "depositor",
            type: "bytes32",
          },
          {
            internalType: "bytes32",
            name: "recipient",
            type: "bytes32",
          },
          {
            internalType: "bytes32",
            name: "exclusiveRelayer",
            type: "bytes32",
          },
          {
            internalType: "bytes32",
            name: "inputToken",
            type: "bytes32",
          },
          {
            internalType: "bytes32",
            name: "outputToken",
            type: "bytes32",
          },
          {
            internalType: "uint256",
            name: "inputAmount",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "outputAmount",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "originChainId",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "depositId",
            type: "uint256",
          },
          {
            internalType: "uint32",
            name: "fillDeadline",
            type: "uint32",
          },
          {
            internalType: "uint32",
            name: "exclusivityDeadline",
            type: "uint32",
          },
          {
            internalType: "bytes",
            name: "message",
            type: "bytes",
          },
        ],
        internalType: "struct V3SpokePoolInterface.V3RelayData",
        name: "relayData",
        type: "tuple",
      },
    ],
    name: "requestSlowFill",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "rootBundles",
    outputs: [
      {
        internalType: "bytes32",
        name: "slowRelayRoot",
        type: "bytes32",
      },
      {
        internalType: "bytes32",
        name: "relayerRefundRoot",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newCrossDomainAdmin",
        type: "address",
      },
    ],
    name: "setCrossDomainAdmin",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "originToken",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "destinationChainId",
        type: "uint256",
      },
      {
        internalType: "bool",
        name: "enabled",
        type: "bool",
      },
    ],
    name: "setEnableRoute",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newWithdrawalRecipient",
        type: "address",
      },
    ],
    name: "setWithdrawalRecipient",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "depositor",
        type: "bytes32",
      },
      {
        internalType: "uint256",
        name: "depositId",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "updatedOutputAmount",
        type: "uint256",
      },
      {
        internalType: "bytes32",
        name: "updatedRecipient",
        type: "bytes32",
      },
      {
        internalType: "bytes",
        name: "updatedMessage",
        type: "bytes",
      },
      {
        internalType: "bytes",
        name: "depositorSignature",
        type: "bytes",
      },
    ],
    name: "speedUpDeposit",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "depositor",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "depositId",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "updatedOutputAmount",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "updatedRecipient",
        type: "address",
      },
      {
        internalType: "bytes",
        name: "updatedMessage",
        type: "bytes",
      },
      {
        internalType: "bytes",
        name: "depositorSignature",
        type: "bytes",
      },
    ],
    name: "speedUpV3Deposit",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes[]",
        name: "data",
        type: "bytes[]",
      },
    ],
    name: "tryMulticall",
    outputs: [
      {
        components: [
          {
            internalType: "bool",
            name: "success",
            type: "bool",
          },
          {
            internalType: "bytes",
            name: "returnData",
            type: "bytes",
          },
        ],
        internalType: "struct MultiCallerUpgradeable.Result[]",
        name: "results",
        type: "tuple[]",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "depositor",
        type: "bytes32",
      },
      {
        internalType: "bytes32",
        name: "recipient",
        type: "bytes32",
      },
      {
        internalType: "bytes32",
        name: "inputToken",
        type: "bytes32",
      },
      {
        internalType: "bytes32",
        name: "outputToken",
        type: "bytes32",
      },
      {
        internalType: "uint256",
        name: "inputAmount",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "outputAmount",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "destinationChainId",
        type: "uint256",
      },
      {
        internalType: "bytes32",
        name: "exclusiveRelayer",
        type: "bytes32",
      },
      {
        internalType: "uint256",
        name: "depositNonce",
        type: "uint256",
      },
      {
        internalType: "uint32",
        name: "quoteTimestamp",
        type: "uint32",
      },
      {
        internalType: "uint32",
        name: "fillDeadline",
        type: "uint32",
      },
      {
        internalType: "uint32",
        name: "exclusivityParameter",
        type: "uint32",
      },
      {
        internalType: "bytes",
        name: "message",
        type: "bytes",
      },
    ],
    name: "unsafeDeposit",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newImplementation",
        type: "address",
      },
    ],
    name: "upgradeTo",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newImplementation",
        type: "address",
      },
      {
        internalType: "bytes",
        name: "data",
        type: "bytes",
      },
    ],
    name: "upgradeToAndCall",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [],
    name: "withdrawalRecipient",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "wrappedNativeToken",
    outputs: [
      {
        internalType: "contract WETH9Interface",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    stateMutability: "payable",
    type: "receive",
  },
] as const;
