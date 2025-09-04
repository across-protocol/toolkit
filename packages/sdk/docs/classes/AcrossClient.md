[@across-protocol/app-sdk](../README.md) / AcrossClient

# Class: AcrossClient

Defined in: [packages/sdk/src/client.ts:158](https://github.com/across-protocol/toolkit/blob/6b29eb5487c0ac0b498f1f420b1793303bd8b70a/packages/sdk/src/client.ts#L158)

Entrypoint for the Across Integrator SDK

## Properties

### logger

> **logger**: [`LoggerT`](../type-aliases/LoggerT.md)

Defined in: [packages/sdk/src/client.ts:168](https://github.com/across-protocol/toolkit/blob/6b29eb5487c0ac0b498f1f420b1793303bd8b70a/packages/sdk/src/client.ts#L168)

## Accessors

### isTenderlyEnabled

#### Get Signature

> **get** **isTenderlyEnabled**(): `boolean`

Defined in: [packages/sdk/src/client.ts:178](https://github.com/across-protocol/toolkit/blob/6b29eb5487c0ac0b498f1f420b1793303bd8b70a/packages/sdk/src/client.ts#L178)

##### Returns

`boolean`

## Methods

### executeQuote()

> **executeQuote**(`params`): `Promise`\<[`ExecuteQuoteResponseParams`](../type-aliases/ExecuteQuoteResponseParams.md)\>

Defined in: [packages/sdk/src/client.ts:298](https://github.com/across-protocol/toolkit/blob/6b29eb5487c0ac0b498f1f420b1793303bd8b70a/packages/sdk/src/client.ts#L298)

Execute a quote by:
1. Approving the SpokePool contract if necessary
2. Depositing the input token on the origin chain
3. Waiting for the deposit to be filled on the destination chain

See [executeQuote](../functions/executeQuote.md) for more details.

#### Parameters

##### params

[`MakeOptional`](../type-aliases/MakeOptional.md)\<[`ExecuteQuoteParams`](../type-aliases/ExecuteQuoteParams.md), `"logger"` \| `"integratorId"` \| `"walletClient"` \| `"originClient"` \| `"destinationClient"`\>

See [ExecuteQuoteParams](../type-aliases/ExecuteQuoteParams.md).

#### Returns

`Promise`\<[`ExecuteQuoteResponseParams`](../type-aliases/ExecuteQuoteResponseParams.md)\>

The deposit ID and receipts for the deposit and fill transactions.

#### Example

```ts
const quote = await client.getQuote({ route, inputAmount });
const { depositId } = await client.executeQuote({ deposit: quote.deposit });
```

***

### executeSwapQuote()

> **executeSwapQuote**(`params`): `Promise`\<[`ExecuteSwapQuoteResponseParams`](../type-aliases/ExecuteSwapQuoteResponseParams.md)\>

Defined in: [packages/sdk/src/client.ts:405](https://github.com/across-protocol/toolkit/blob/6b29eb5487c0ac0b498f1f420b1793303bd8b70a/packages/sdk/src/client.ts#L405)

Execute a swap quote by:
1. Executing approval transactions if present
2. Executing the swap/bridge transaction
3. Waiting for the deposit transaction to be confirmed
4. Waiting for the fill transaction to be confirmed

See [executeSwapQuote](../functions/executeSwapQuote.md) for more details.

#### Parameters

##### params

[`MakeOptional`](../type-aliases/MakeOptional.md)\<[`ExecuteSwapQuoteParams`](../type-aliases/ExecuteSwapQuoteParams.md), `"logger"` \| `"integratorId"` \| `"walletClient"` \| `"originClient"` \| `"destinationClient"`\>

See [ExecuteSwapQuoteParams](../type-aliases/ExecuteSwapQuoteParams.md).

#### Returns

`Promise`\<[`ExecuteSwapQuoteResponseParams`](../type-aliases/ExecuteSwapQuoteResponseParams.md)\>

The deposit ID and receipts for the deposit and fill transactions.

#### Example

```ts
const quote = await client.getSwapQuote({
  originChainId: 1,
  destinationChainId: 10,
  inputToken: "0x...",
  outputToken: "0x...",
  amount: "10",
  depositor: "0x...",
});
const { depositId, swapTxReceipt, fillTxReceipt } = await client.executeSwapQuote({ swapQuote: quote });
```

***

### getAvailableRoutes()

> **getAvailableRoutes**(`params`): `Promise`\<[`GetAvailableRoutesReturnType`](../type-aliases/GetAvailableRoutesReturnType.md)\>

Defined in: [packages/sdk/src/client.ts:497](https://github.com/across-protocol/toolkit/blob/6b29eb5487c0ac0b498f1f420b1793303bd8b70a/packages/sdk/src/client.ts#L497)

Get the available routes for a given set of parameters. See [getAvailableRoutes](../functions/getAvailableRoutes.md).

#### Parameters

##### params

[`MakeOptional`](../type-aliases/MakeOptional.md)\<[`GetAvailableRoutesParams`](../type-aliases/GetAvailableRoutesParams.md), `"logger"` \| `"apiUrl"`\>

See [GetAvailableRoutesParams](../type-aliases/GetAvailableRoutesParams.md).

#### Returns

`Promise`\<[`GetAvailableRoutesReturnType`](../type-aliases/GetAvailableRoutesReturnType.md)\>

See [GetAvailableRoutesReturnType](../type-aliases/GetAvailableRoutesReturnType.md).

***

### getChainInfo()

> **getChainInfo**(`chainId`): `Promise`\<[`AcrossChain`](../type-aliases/AcrossChain.md)\>

Defined in: [packages/sdk/src/client.ts:264](https://github.com/across-protocol/toolkit/blob/6b29eb5487c0ac0b498f1f420b1793303bd8b70a/packages/sdk/src/client.ts#L264)

#### Parameters

##### chainId

`number`

number

#### Returns

`Promise`\<[`AcrossChain`](../type-aliases/AcrossChain.md)\>

See [AcrossChain](../type-aliases/AcrossChain.md).

***

### getDeposit()

> **getDeposit**(`params`): `Promise`\<[`Deposit`](../type-aliases/Deposit.md)\>

Defined in: [packages/sdk/src/client.ts:874](https://github.com/across-protocol/toolkit/blob/6b29eb5487c0ac0b498f1f420b1793303bd8b70a/packages/sdk/src/client.ts#L874)

Get a deposit by its deposit tx hash or deposit id + spoke pool address. See [getDeposit](../functions/getDeposit.md).

#### Parameters

##### params

`Omit`\<`Omit`\<[`GetDepositParams`](../type-aliases/GetDepositParams.md), `"findBy"`\>, `"indexerUrl"` \| `"destinationChainClient"` \| `"originChainClient"`\> & `Partial`\<`Pick`\<`Omit`\<[`GetDepositParams`](../type-aliases/GetDepositParams.md), `"findBy"`\>, `"indexerUrl"` \| `"destinationChainClient"` \| `"originChainClient"`\>\> & `object`

See [GetDepositParams](../type-aliases/GetDepositParams.md).

#### Returns

`Promise`\<[`Deposit`](../type-aliases/Deposit.md)\>

See [Deposit](../type-aliases/Deposit.md).

***

### getFillByDepositTx()

> **getFillByDepositTx**(`params`): `Promise`\<[`FillStatus`](../type-aliases/FillStatus.md)\>

Defined in: [packages/sdk/src/client.ts:841](https://github.com/across-protocol/toolkit/blob/6b29eb5487c0ac0b498f1f420b1793303bd8b70a/packages/sdk/src/client.ts#L841)

Get a fill after a deposit has been made. See [getFillByDepositTx](../functions/getFillByDepositTx.md).

#### Parameters

##### params

[`MakeOptional`](../type-aliases/MakeOptional.md)\<[`GetFillByDepositTxParams`](../type-aliases/GetFillByDepositTxParams.md), `"logger"` \| `"indexerUrl"` \| `"destinationChainClient"`\>

See [GetFillByDepositTxParams](../type-aliases/GetFillByDepositTxParams.md).

#### Returns

`Promise`\<[`FillStatus`](../type-aliases/FillStatus.md)\>

See [FillStatus](../type-aliases/FillStatus.md).

***

### getLimits()

> **getLimits**(`params`): `Promise`\<[`GetLimitsReturnType`](../type-aliases/GetLimitsReturnType.md)\>

Defined in: [packages/sdk/src/client.ts:581](https://github.com/across-protocol/toolkit/blob/6b29eb5487c0ac0b498f1f420b1793303bd8b70a/packages/sdk/src/client.ts#L581)

Get the deposit limits for a given route. See [getLimits](../functions/getLimits.md).

#### Parameters

##### params

[`MakeOptional`](../type-aliases/MakeOptional.md)\<[`GetLimitsParams`](../type-aliases/GetLimitsParams.md), `"logger"` \| `"apiUrl"`\>

See [GetLimitsParams](../type-aliases/GetLimitsParams.md).

#### Returns

`Promise`\<[`GetLimitsReturnType`](../type-aliases/GetLimitsReturnType.md)\>

See [GetLimitsReturnType](../type-aliases/GetLimitsReturnType.md).

***

### getPublicClient()

> **getPublicClient**(`chainId`): `object`

Defined in: [packages/sdk/src/client.ts:246](https://github.com/across-protocol/toolkit/blob/6b29eb5487c0ac0b498f1f420b1793303bd8b70a/packages/sdk/src/client.ts#L246)

**`Internal`**

#### Parameters

##### chainId

`number`

#### Returns

##### account

> **account**: `undefined`

The Account of the Client.

##### batch?

> `optional` **batch**: `object`

Flags for batch settings.

###### batch.multicall?

> `optional` **multicall**: `boolean` \| \{ `batchSize?`: `number`; `wait?`: `number`; \}

Toggle to enable `eth_call` multicall aggregation.

###### Type Declaration

`boolean`

\{ `batchSize?`: `number`; `wait?`: `number`; \}

##### cacheTime

> **cacheTime**: `number`

Time (in ms) that cached data will remain in memory.

##### call()

> **call**: (`parameters`) => `Promise`\<`CallReturnType`\>

Executes a new message call immediately without submitting a transaction to the network.

- Docs: https://viem.sh/docs/actions/public/call
- JSON-RPC Methods: [`eth_call`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_call)

###### Parameters

###### parameters

`CallParameters`\<`Chain`\>

###### Returns

`Promise`\<`CallReturnType`\>

The call data. CallReturnType

###### Example

```ts
import { createPublicClient, http } from 'viem'
import { mainnet } from 'viem/chains'

const client = createPublicClient({
  chain: mainnet,
  transport: http(),
})
const data = await client.call({
  account: '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266',
  data: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
  to: '0x70997970c51812dc3a010c7d01b50e0d17dc79c8',
})
```

##### ccipRead?

> `optional` **ccipRead**: `false` \| \{ `request?`: (`parameters`) => `Promise`\<`` `0x${string}` ``\>; \}

[CCIP Read](https://eips.ethereum.org/EIPS/eip-3668) configuration.

###### Type Declaration

`false`

\{ `request?`: (`parameters`) => `Promise`\<`` `0x${string}` ``\>; \}

##### chain

> **chain**: `Chain`

Chain for the client.

##### createAccessList()

> **createAccessList**: (`parameters`) => `Promise`\<\{ `accessList`: `AccessList`; `gasUsed`: `bigint`; \}\>

Creates an EIP-2930 access list that you can include in a transaction.

- Docs: https://viem.sh/docs/actions/public/createAccessList
- JSON-RPC Methods: `eth_createAccessList`

###### Parameters

###### parameters

`CreateAccessListParameters`\<`Chain`\>

###### Returns

`Promise`\<\{ `accessList`: `AccessList`; `gasUsed`: `bigint`; \}\>

The call data. CreateAccessListReturnType

###### Example

```ts
import { createPublicClient, http } from 'viem'
import { mainnet } from 'viem/chains'

const client = createPublicClient({
  chain: mainnet,
  transport: http(),
})

const data = await client.createAccessList({
  data: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
  to: '0x70997970c51812dc3a010c7d01b50e0d17dc79c8',
})
```

##### createBlockFilter()

> **createBlockFilter**: () => `Promise`\<\{ `id`: `` `0x${string}` ``; `request`: `EIP1193RequestFn`\<readonly \[\{ `Method`: `"eth_getFilterChanges"`; `Parameters`: \[`` `0x${string}` ``\]; `ReturnType`: `` `0x${string}` ``[] \| `RpcLog`[]; \}, \{ `Method`: `"eth_getFilterLogs"`; `Parameters`: \[`` `0x${string}` ``\]; `ReturnType`: `RpcLog`[]; \}, \{ `Method`: `"eth_uninstallFilter"`; `Parameters`: \[`` `0x${string}` ``\]; `ReturnType`: `boolean`; \}\]\>; `type`: `"block"`; \}\>

Creates a Filter to listen for new block hashes that can be used with [`getFilterChanges`](https://viem.sh/docs/actions/public/getFilterChanges).

- Docs: https://viem.sh/docs/actions/public/createBlockFilter
- JSON-RPC Methods: [`eth_newBlockFilter`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_newBlockFilter)

###### Returns

`Promise`\<\{ `id`: `` `0x${string}` ``; `request`: `EIP1193RequestFn`\<readonly \[\{ `Method`: `"eth_getFilterChanges"`; `Parameters`: \[`` `0x${string}` ``\]; `ReturnType`: `` `0x${string}` ``[] \| `RpcLog`[]; \}, \{ `Method`: `"eth_getFilterLogs"`; `Parameters`: \[`` `0x${string}` ``\]; `ReturnType`: `RpcLog`[]; \}, \{ `Method`: `"eth_uninstallFilter"`; `Parameters`: \[`` `0x${string}` ``\]; `ReturnType`: `boolean`; \}\]\>; `type`: `"block"`; \}\>

Filter. CreateBlockFilterReturnType

###### Example

```ts
import { createPublicClient, createBlockFilter, http } from 'viem'
import { mainnet } from 'viem/chains'

const client = createPublicClient({
  chain: mainnet,
  transport: http(),
})
const filter = await createBlockFilter(client)
// { id: "0x345a6572337856574a76364e457a4366", type: 'block' }
```

##### createContractEventFilter()

> **createContractEventFilter**: \<`abi`, `eventName`, `args`, `strict`, `fromBlock`, `toBlock`\>(`args`) => `Promise`\<`CreateContractEventFilterReturnType`\<`abi`, `eventName`, `args`, `strict`, `fromBlock`, `toBlock`\>\>

Creates a Filter to retrieve event logs that can be used with [`getFilterChanges`](https://viem.sh/docs/actions/public/getFilterChanges) or [`getFilterLogs`](https://viem.sh/docs/actions/public/getFilterLogs).

- Docs: https://viem.sh/docs/contract/createContractEventFilter

###### Type Parameters

###### abi

`abi` *extends* `Abi` \| readonly `unknown`[]

###### eventName

`eventName` *extends* `undefined` \| `string`

###### args

`args` *extends* `undefined` \| `Record`\<`string`, `unknown`\> \| readonly `unknown`[]

###### strict

`strict` *extends* `undefined` \| `boolean` = `undefined`

###### fromBlock

`fromBlock` *extends* `undefined` \| `bigint` \| `BlockTag` = `undefined`

###### toBlock

`toBlock` *extends* `undefined` \| `bigint` \| `BlockTag` = `undefined`

###### Parameters

###### args

`CreateContractEventFilterParameters`\<`abi`, `eventName`, `args`, `strict`, `fromBlock`, `toBlock`\>

CreateContractEventFilterParameters

###### Returns

`Promise`\<`CreateContractEventFilterReturnType`\<`abi`, `eventName`, `args`, `strict`, `fromBlock`, `toBlock`\>\>

[`Filter`](https://viem.sh/docs/glossary/types#filter). CreateContractEventFilterReturnType

###### Example

```ts
import { createPublicClient, http, parseAbi } from 'viem'
import { mainnet } from 'viem/chains'

const client = createPublicClient({
  chain: mainnet,
  transport: http(),
})
const filter = await client.createContractEventFilter({
  abi: parseAbi(['event Transfer(address indexed, address indexed, uint256)']),
})
```

##### createEventFilter()

> **createEventFilter**: \<`abiEvent`, `abiEvents`, `strict`, `fromBlock`, `toBlock`, `_EventName`, `_Args`\>(`args?`) => `Promise`\<\{ \[K in string \| number \| symbol\]: Filter\<"event", abiEvents, \_EventName, \_Args, strict, fromBlock, toBlock\>\[K\] \}\>

Creates a [`Filter`](https://viem.sh/docs/glossary/types#filter) to listen for new events that can be used with [`getFilterChanges`](https://viem.sh/docs/actions/public/getFilterChanges).

- Docs: https://viem.sh/docs/actions/public/createEventFilter
- JSON-RPC Methods: [`eth_newFilter`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_newfilter)

###### Type Parameters

###### abiEvent

`abiEvent` *extends* `undefined` \| `AbiEvent` = `undefined`

###### abiEvents

`abiEvents` *extends* `undefined` \| readonly `unknown`[] \| readonly `AbiEvent`[] = `abiEvent` *extends* `AbiEvent` ? \[`abiEvent`\<`abiEvent`\>\] : `undefined`

###### strict

`strict` *extends* `undefined` \| `boolean` = `undefined`

###### fromBlock

`fromBlock` *extends* `undefined` \| `bigint` \| `BlockTag` = `undefined`

###### toBlock

`toBlock` *extends* `undefined` \| `bigint` \| `BlockTag` = `undefined`

###### _EventName

`_EventName` *extends* `undefined` \| `string` = `MaybeAbiEventName`\<`abiEvent`\>

###### _Args

`_Args` *extends* `undefined` \| `Record`\<`string`, `unknown`\> \| readonly `unknown`[] = `undefined`

###### Parameters

###### args?

`CreateEventFilterParameters`\<`abiEvent`, `abiEvents`, `strict`, `fromBlock`, `toBlock`, `_EventName`, `_Args`\>

CreateEventFilterParameters

###### Returns

`Promise`\<\{ \[K in string \| number \| symbol\]: Filter\<"event", abiEvents, \_EventName, \_Args, strict, fromBlock, toBlock\>\[K\] \}\>

[`Filter`](https://viem.sh/docs/glossary/types#filter). CreateEventFilterReturnType

###### Example

```ts
import { createPublicClient, http } from 'viem'
import { mainnet } from 'viem/chains'

const client = createPublicClient({
  chain: mainnet,
  transport: http(),
})
const filter = await client.createEventFilter({
  address: '0xfba3912ca04dd458c843e2ee08967fc04f3579c2',
})
```

##### createPendingTransactionFilter()

> **createPendingTransactionFilter**: () => `Promise`\<\{ `id`: `` `0x${string}` ``; `request`: `EIP1193RequestFn`\<readonly \[\{ `Method`: `"eth_getFilterChanges"`; `Parameters`: \[`` `0x${string}` ``\]; `ReturnType`: `` `0x${string}` ``[] \| `RpcLog`[]; \}, \{ `Method`: `"eth_getFilterLogs"`; `Parameters`: \[`` `0x${string}` ``\]; `ReturnType`: `RpcLog`[]; \}, \{ `Method`: `"eth_uninstallFilter"`; `Parameters`: \[`` `0x${string}` ``\]; `ReturnType`: `boolean`; \}\]\>; `type`: `"transaction"`; \}\>

Creates a Filter to listen for new pending transaction hashes that can be used with [`getFilterChanges`](https://viem.sh/docs/actions/public/getFilterChanges).

- Docs: https://viem.sh/docs/actions/public/createPendingTransactionFilter
- JSON-RPC Methods: [`eth_newPendingTransactionFilter`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_newpendingtransactionfilter)

###### Returns

`Promise`\<\{ `id`: `` `0x${string}` ``; `request`: `EIP1193RequestFn`\<readonly \[\{ `Method`: `"eth_getFilterChanges"`; `Parameters`: \[`` `0x${string}` ``\]; `ReturnType`: `` `0x${string}` ``[] \| `RpcLog`[]; \}, \{ `Method`: `"eth_getFilterLogs"`; `Parameters`: \[`` `0x${string}` ``\]; `ReturnType`: `RpcLog`[]; \}, \{ `Method`: `"eth_uninstallFilter"`; `Parameters`: \[`` `0x${string}` ``\]; `ReturnType`: `boolean`; \}\]\>; `type`: `"transaction"`; \}\>

[`Filter`](https://viem.sh/docs/glossary/types#filter). CreateBlockFilterReturnType

###### Example

```ts
import { createPublicClient, http } from 'viem'
import { mainnet } from 'viem/chains'

const client = createPublicClient({
  chain: mainnet,
  transport: http(),
})
const filter = await client.createPendingTransactionFilter()
// { id: "0x345a6572337856574a76364e457a4366", type: 'transaction' }
```

##### estimateContractGas()

> **estimateContractGas**: \<`chain`, `abi`, `functionName`, `args`\>(`args`) => `Promise`\<`bigint`\>

Estimates the gas required to successfully execute a contract write function call.

- Docs: https://viem.sh/docs/contract/estimateContractGas

###### Type Parameters

###### chain

`chain` *extends* `undefined` \| `Chain`

###### abi

`abi` *extends* `Abi` \| readonly `unknown`[]

###### functionName

`functionName` *extends* `string`

###### args

`args` *extends* `unknown`

###### Parameters

###### args

`EstimateContractGasParameters`\<`abi`, `functionName`, `args`, `chain`\>

EstimateContractGasParameters

###### Returns

`Promise`\<`bigint`\>

The gas estimate (in wei). EstimateContractGasReturnType

###### Remarks

Internally, uses a [Public Client](https://viem.sh/docs/clients/public) to call the [`estimateGas` action](https://viem.sh/docs/actions/public/estimateGas) with [ABI-encoded `data`](https://viem.sh/docs/contract/encodeFunctionData).

###### Example

```ts
import { createPublicClient, http, parseAbi } from 'viem'
import { mainnet } from 'viem/chains'

const client = createPublicClient({
  chain: mainnet,
  transport: http(),
})
const gas = await client.estimateContractGas({
  address: '0xFBA3912Ca04dd458c843e2EE08967fC04f3579c2',
  abi: parseAbi(['function mint() public']),
  functionName: 'mint',
  account: '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266',
})
```

##### estimateFeesPerGas()

> **estimateFeesPerGas**: \<`chainOverride`, `type`\>(`args?`) => `Promise`\<`EstimateFeesPerGasReturnType`\<`type`\>\>

Returns an estimate for the fees per gas for a transaction to be included
in the next block.

- Docs: https://viem.sh/docs/actions/public/estimateFeesPerGas

###### Type Parameters

###### chainOverride

`chainOverride` *extends* `undefined` \| `Chain` = `undefined`

###### type

`type` *extends* `FeeValuesType` = `"eip1559"`

###### Parameters

###### args?

`EstimateFeesPerGasParameters`\<`Chain`, `chainOverride`, `type`\>

###### Returns

`Promise`\<`EstimateFeesPerGasReturnType`\<`type`\>\>

An estimate (in wei) for the fees per gas. EstimateFeesPerGasReturnType

###### Example

```ts
import { createPublicClient, http } from 'viem'
import { mainnet } from 'viem/chains'

const client = createPublicClient({
  chain: mainnet,
  transport: http(),
})
const maxPriorityFeePerGas = await client.estimateFeesPerGas()
// { maxFeePerGas: ..., maxPriorityFeePerGas: ... }
```

##### estimateGas()

> **estimateGas**: (`args`) => `Promise`\<`bigint`\>

Estimates the gas necessary to complete a transaction without submitting it to the network.

- Docs: https://viem.sh/docs/actions/public/estimateGas
- JSON-RPC Methods: [`eth_estimateGas`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_estimategas)

###### Parameters

###### args

`EstimateGasParameters`\<`Chain`\>

EstimateGasParameters

###### Returns

`Promise`\<`bigint`\>

The gas estimate (in wei). EstimateGasReturnType

###### Example

```ts
import { createPublicClient, http, parseEther } from 'viem'
import { mainnet } from 'viem/chains'

const client = createPublicClient({
  chain: mainnet,
  transport: http(),
})
const gasEstimate = await client.estimateGas({
  account: '0xA0Cf798816D4b9b9866b5330EEa46a18382f251e',
  to: '0x70997970c51812dc3a010c7d01b50e0d17dc79c8',
  value: parseEther('1'),
})
```

##### estimateMaxPriorityFeePerGas()

> **estimateMaxPriorityFeePerGas**: \<`chainOverride`\>(`args?`) => `Promise`\<`bigint`\>

Returns an estimate for the max priority fee per gas (in wei) for a transaction
to be included in the next block.

- Docs: https://viem.sh/docs/actions/public/estimateMaxPriorityFeePerGas

###### Type Parameters

###### chainOverride

`chainOverride` *extends* `undefined` \| `Chain` = `undefined`

###### Parameters

###### args?

###### chain?

`null` \| `chainOverride`

###### Returns

`Promise`\<`bigint`\>

An estimate (in wei) for the max priority fee per gas. EstimateMaxPriorityFeePerGasReturnType

###### Example

```ts
import { createPublicClient, http } from 'viem'
import { mainnet } from 'viem/chains'

const client = createPublicClient({
  chain: mainnet,
  transport: http(),
})
const maxPriorityFeePerGas = await client.estimateMaxPriorityFeePerGas()
// 10000000n
```

##### extend()

> **extend**: \<`client`\>(`fn`) => `Client`\<`Transport`, `Chain`, `undefined`, `PublicRpcSchema`, \{ \[K in string \| number \| symbol\]: client\[K\] \} & `PublicActions`\<`Transport`, `Chain`\>\>

###### Type Parameters

###### client

`client` *extends* `object` & `ExactPartial`\<`ExtendableProtectedActions`\<`Transport`, `Chain`, `undefined`\>\>

###### Parameters

###### fn

(`client`) => `client`

###### Returns

`Client`\<`Transport`, `Chain`, `undefined`, `PublicRpcSchema`, \{ \[K in string \| number \| symbol\]: client\[K\] \} & `PublicActions`\<`Transport`, `Chain`\>\>

##### getBalance()

> **getBalance**: (`args`) => `Promise`\<`bigint`\>

Returns the balance of an address in wei.

- Docs: https://viem.sh/docs/actions/public/getBalance
- JSON-RPC Methods: [`eth_getBalance`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_getbalance)

###### Parameters

###### args

`GetBalanceParameters`

GetBalanceParameters

###### Returns

`Promise`\<`bigint`\>

The balance of the address in wei. GetBalanceReturnType

###### Remarks

You can convert the balance to ether units with [`formatEther`](https://viem.sh/docs/utilities/formatEther).

```ts
const balance = await getBalance(client, {
  address: '0xA0Cf798816D4b9b9866b5330EEa46a18382f251e',
  blockTag: 'safe'
})
const balanceAsEther = formatEther(balance)
// "6.942"
```

###### Example

```ts
import { createPublicClient, http } from 'viem'
import { mainnet } from 'viem/chains'

const client = createPublicClient({
  chain: mainnet,
  transport: http(),
})
const balance = await client.getBalance({
  address: '0xA0Cf798816D4b9b9866b5330EEa46a18382f251e',
})
// 10000000000000000000000n (wei)
```

##### getBlobBaseFee()

> **getBlobBaseFee**: () => `Promise`\<`bigint`\>

Returns the base fee per blob gas in wei.

- Docs: https://viem.sh/docs/actions/public/getBlobBaseFee
- JSON-RPC Methods: [`eth_blobBaseFee`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_blobBaseFee)

###### Returns

`Promise`\<`bigint`\>

The blob base fee (in wei). GetBlobBaseFeeReturnType

###### Example

```ts
import { createPublicClient, http } from 'viem'
import { mainnet } from 'viem/chains'
import { getBlobBaseFee } from 'viem/public'

const client = createPublicClient({
  chain: mainnet,
  transport: http(),
})
const blobBaseFee = await client.getBlobBaseFee()
```

##### getBlock()

> **getBlock**: \<`includeTransactions`, `blockTag`\>(`args?`) => `Promise`\<\{ `baseFeePerGas`: `null` \| `bigint`; `blobGasUsed`: `bigint`; `difficulty`: `bigint`; `excessBlobGas`: `bigint`; `extraData`: `` `0x${string}` ``; `gasLimit`: `bigint`; `gasUsed`: `bigint`; `hash`: `blockTag` *extends* `"pending"` ? `null` : `` `0x${string}` ``; `logsBloom`: `blockTag` *extends* `"pending"` ? `null` : `` `0x${string}` ``; `miner`: `` `0x${string}` ``; `mixHash`: `` `0x${string}` ``; `nonce`: `blockTag` *extends* `"pending"` ? `null` : `` `0x${string}` ``; `number`: `blockTag` *extends* `"pending"` ? `null` : `bigint`; `parentBeaconBlockRoot?`: `` `0x${string}` ``; `parentHash`: `` `0x${string}` ``; `receiptsRoot`: `` `0x${string}` ``; `sealFields`: `` `0x${string}` ``[]; `sha3Uncles`: `` `0x${string}` ``; `size`: `bigint`; `stateRoot`: `` `0x${string}` ``; `timestamp`: `bigint`; `totalDifficulty`: `null` \| `bigint`; `transactions`: `includeTransactions` *extends* `true` ? (\{ `accessList?`: `undefined`; `authorizationList?`: `undefined`; `blobVersionedHashes?`: `undefined`; `blockHash`: `blockTag` *extends* `"pending"` ? `true` : `false` *extends* `true` ? `null` : `` `0x${string}` ``; `blockNumber`: `blockTag` *extends* `"pending"` ? `true` : `false` *extends* `true` ? `null` : `bigint`; `chainId?`: `number`; `from`: `` `0x${string}` ``; `gas`: `bigint`; `gasPrice`: `bigint`; `hash`: `` `0x${string}` ``; `input`: `` `0x${string}` ``; `maxFeePerBlobGas?`: `undefined`; `maxFeePerGas?`: `undefined`; `maxPriorityFeePerGas?`: `undefined`; `nonce`: `number`; `r`: `` `0x${string}` ``; `s`: `` `0x${string}` ``; `to`: `null` \| `` `0x${string}` ``; `transactionIndex`: `blockTag` *extends* `"pending"` ? `true` : `false` *extends* `true` ? `null` : `number`; `type`: `"legacy"`; `typeHex`: `null` \| `` `0x${string}` ``; `v`: `bigint`; `value`: `bigint`; `yParity?`: `undefined`; \} \| \{ `accessList`: `AccessList`; `authorizationList?`: `undefined`; `blobVersionedHashes?`: `undefined`; `blockHash`: `blockTag` *extends* `"pending"` ? `true` : `false` *extends* `true` ? `null` : `` `0x${string}` ``; `blockNumber`: `blockTag` *extends* `"pending"` ? `true` : `false` *extends* `true` ? `null` : `bigint`; `chainId`: `number`; `from`: `` `0x${string}` ``; `gas`: `bigint`; `gasPrice`: `bigint`; `hash`: `` `0x${string}` ``; `input`: `` `0x${string}` ``; `maxFeePerBlobGas?`: `undefined`; `maxFeePerGas?`: `undefined`; `maxPriorityFeePerGas?`: `undefined`; `nonce`: `number`; `r`: `` `0x${string}` ``; `s`: `` `0x${string}` ``; `to`: `null` \| `` `0x${string}` ``; `transactionIndex`: `blockTag` *extends* `"pending"` ? `true` : `false` *extends* `true` ? `null` : `number`; `type`: `"eip2930"`; `typeHex`: `null` \| `` `0x${string}` ``; `v`: `bigint`; `value`: `bigint`; `yParity`: `number`; \} \| \{ `accessList`: `AccessList`; `authorizationList?`: `undefined`; `blobVersionedHashes?`: `undefined`; `blockHash`: `blockTag` *extends* `"pending"` ? `true` : `false` *extends* `true` ? `null` : `` `0x${string}` ``; `blockNumber`: `blockTag` *extends* `"pending"` ? `true` : `false` *extends* `true` ? `null` : `bigint`; `chainId`: `number`; `from`: `` `0x${string}` ``; `gas`: `bigint`; `gasPrice?`: `undefined`; `hash`: `` `0x${string}` ``; `input`: `` `0x${string}` ``; `maxFeePerBlobGas?`: `undefined`; `maxFeePerGas`: `bigint`; `maxPriorityFeePerGas`: `bigint`; `nonce`: `number`; `r`: `` `0x${string}` ``; `s`: `` `0x${string}` ``; `to`: `null` \| `` `0x${string}` ``; `transactionIndex`: `blockTag` *extends* `"pending"` ? `true` : `false` *extends* `true` ? `null` : `number`; `type`: `"eip1559"`; `typeHex`: `null` \| `` `0x${string}` ``; `v`: `bigint`; `value`: `bigint`; `yParity`: `number`; \} \| \{ `accessList`: `AccessList`; `authorizationList?`: `undefined`; `blobVersionedHashes`: readonly `` `0x${string}` ``[]; `blockHash`: `blockTag` *extends* `"pending"` ? `true` : `false` *extends* `true` ? `null` : `` `0x${string}` ``; `blockNumber`: `blockTag` *extends* `"pending"` ? `true` : `false` *extends* `true` ? `null` : `bigint`; `chainId`: `number`; `from`: `` `0x${string}` ``; `gas`: `bigint`; `gasPrice?`: `undefined`; `hash`: `` `0x${string}` ``; `input`: `` `0x${string}` ``; `maxFeePerBlobGas`: `bigint`; `maxFeePerGas`: `bigint`; `maxPriorityFeePerGas`: `bigint`; `nonce`: `number`; `r`: `` `0x${string}` ``; `s`: `` `0x${string}` ``; `to`: `null` \| `` `0x${string}` ``; `transactionIndex`: `blockTag` *extends* `"pending"` ? `true` : `false` *extends* `true` ? `null` : `number`; `type`: `"eip4844"`; `typeHex`: `null` \| `` `0x${string}` ``; `v`: `bigint`; `value`: `bigint`; `yParity`: `number`; \} \| \{ `accessList`: `AccessList`; `authorizationList`: `SignedAuthorizationList`; `blobVersionedHashes?`: `undefined`; `blockHash`: `blockTag` *extends* `"pending"` ? `true` : `false` *extends* `true` ? `null` : `` `0x${string}` ``; `blockNumber`: `blockTag` *extends* `"pending"` ? `true` : `false` *extends* `true` ? `null` : `bigint`; `chainId`: `number`; `from`: `` `0x${string}` ``; `gas`: `bigint`; `gasPrice?`: `undefined`; `hash`: `` `0x${string}` ``; `input`: `` `0x${string}` ``; `maxFeePerBlobGas?`: `undefined`; `maxFeePerGas`: `bigint`; `maxPriorityFeePerGas`: `bigint`; `nonce`: `number`; `r`: `` `0x${string}` ``; `s`: `` `0x${string}` ``; `to`: `null` \| `` `0x${string}` ``; `transactionIndex`: `blockTag` *extends* `"pending"` ? `true` : `false` *extends* `true` ? `null` : `number`; `type`: `"eip7702"`; `typeHex`: `null` \| `` `0x${string}` ``; `v`: `bigint`; `value`: `bigint`; `yParity`: `number`; \})[] : `` `0x${string}` ``[]; `transactionsRoot`: `` `0x${string}` ``; `uncles`: `` `0x${string}` ``[]; `withdrawals?`: `Withdrawal`[]; `withdrawalsRoot?`: `` `0x${string}` ``; \}\>

Returns information about a block at a block number, hash, or tag.

- Docs: https://viem.sh/docs/actions/public/getBlock
- Examples: https://stackblitz.com/github/wevm/viem/tree/main/examples/blocks_fetching-blocks
- JSON-RPC Methods:
  - Calls [`eth_getBlockByNumber`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_getblockbynumber) for `blockNumber` & `blockTag`.
  - Calls [`eth_getBlockByHash`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_getblockbyhash) for `blockHash`.

###### Type Parameters

###### includeTransactions

`includeTransactions` *extends* `boolean` = `false`

###### blockTag

`blockTag` *extends* `BlockTag` = `"latest"`

###### Parameters

###### args?

`GetBlockParameters`\<`includeTransactions`, `blockTag`\>

GetBlockParameters

###### Returns

`Promise`\<\{ `baseFeePerGas`: `null` \| `bigint`; `blobGasUsed`: `bigint`; `difficulty`: `bigint`; `excessBlobGas`: `bigint`; `extraData`: `` `0x${string}` ``; `gasLimit`: `bigint`; `gasUsed`: `bigint`; `hash`: `blockTag` *extends* `"pending"` ? `null` : `` `0x${string}` ``; `logsBloom`: `blockTag` *extends* `"pending"` ? `null` : `` `0x${string}` ``; `miner`: `` `0x${string}` ``; `mixHash`: `` `0x${string}` ``; `nonce`: `blockTag` *extends* `"pending"` ? `null` : `` `0x${string}` ``; `number`: `blockTag` *extends* `"pending"` ? `null` : `bigint`; `parentBeaconBlockRoot?`: `` `0x${string}` ``; `parentHash`: `` `0x${string}` ``; `receiptsRoot`: `` `0x${string}` ``; `sealFields`: `` `0x${string}` ``[]; `sha3Uncles`: `` `0x${string}` ``; `size`: `bigint`; `stateRoot`: `` `0x${string}` ``; `timestamp`: `bigint`; `totalDifficulty`: `null` \| `bigint`; `transactions`: `includeTransactions` *extends* `true` ? (\{ `accessList?`: `undefined`; `authorizationList?`: `undefined`; `blobVersionedHashes?`: `undefined`; `blockHash`: `blockTag` *extends* `"pending"` ? `true` : `false` *extends* `true` ? `null` : `` `0x${string}` ``; `blockNumber`: `blockTag` *extends* `"pending"` ? `true` : `false` *extends* `true` ? `null` : `bigint`; `chainId?`: `number`; `from`: `` `0x${string}` ``; `gas`: `bigint`; `gasPrice`: `bigint`; `hash`: `` `0x${string}` ``; `input`: `` `0x${string}` ``; `maxFeePerBlobGas?`: `undefined`; `maxFeePerGas?`: `undefined`; `maxPriorityFeePerGas?`: `undefined`; `nonce`: `number`; `r`: `` `0x${string}` ``; `s`: `` `0x${string}` ``; `to`: `null` \| `` `0x${string}` ``; `transactionIndex`: `blockTag` *extends* `"pending"` ? `true` : `false` *extends* `true` ? `null` : `number`; `type`: `"legacy"`; `typeHex`: `null` \| `` `0x${string}` ``; `v`: `bigint`; `value`: `bigint`; `yParity?`: `undefined`; \} \| \{ `accessList`: `AccessList`; `authorizationList?`: `undefined`; `blobVersionedHashes?`: `undefined`; `blockHash`: `blockTag` *extends* `"pending"` ? `true` : `false` *extends* `true` ? `null` : `` `0x${string}` ``; `blockNumber`: `blockTag` *extends* `"pending"` ? `true` : `false` *extends* `true` ? `null` : `bigint`; `chainId`: `number`; `from`: `` `0x${string}` ``; `gas`: `bigint`; `gasPrice`: `bigint`; `hash`: `` `0x${string}` ``; `input`: `` `0x${string}` ``; `maxFeePerBlobGas?`: `undefined`; `maxFeePerGas?`: `undefined`; `maxPriorityFeePerGas?`: `undefined`; `nonce`: `number`; `r`: `` `0x${string}` ``; `s`: `` `0x${string}` ``; `to`: `null` \| `` `0x${string}` ``; `transactionIndex`: `blockTag` *extends* `"pending"` ? `true` : `false` *extends* `true` ? `null` : `number`; `type`: `"eip2930"`; `typeHex`: `null` \| `` `0x${string}` ``; `v`: `bigint`; `value`: `bigint`; `yParity`: `number`; \} \| \{ `accessList`: `AccessList`; `authorizationList?`: `undefined`; `blobVersionedHashes?`: `undefined`; `blockHash`: `blockTag` *extends* `"pending"` ? `true` : `false` *extends* `true` ? `null` : `` `0x${string}` ``; `blockNumber`: `blockTag` *extends* `"pending"` ? `true` : `false` *extends* `true` ? `null` : `bigint`; `chainId`: `number`; `from`: `` `0x${string}` ``; `gas`: `bigint`; `gasPrice?`: `undefined`; `hash`: `` `0x${string}` ``; `input`: `` `0x${string}` ``; `maxFeePerBlobGas?`: `undefined`; `maxFeePerGas`: `bigint`; `maxPriorityFeePerGas`: `bigint`; `nonce`: `number`; `r`: `` `0x${string}` ``; `s`: `` `0x${string}` ``; `to`: `null` \| `` `0x${string}` ``; `transactionIndex`: `blockTag` *extends* `"pending"` ? `true` : `false` *extends* `true` ? `null` : `number`; `type`: `"eip1559"`; `typeHex`: `null` \| `` `0x${string}` ``; `v`: `bigint`; `value`: `bigint`; `yParity`: `number`; \} \| \{ `accessList`: `AccessList`; `authorizationList?`: `undefined`; `blobVersionedHashes`: readonly `` `0x${string}` ``[]; `blockHash`: `blockTag` *extends* `"pending"` ? `true` : `false` *extends* `true` ? `null` : `` `0x${string}` ``; `blockNumber`: `blockTag` *extends* `"pending"` ? `true` : `false` *extends* `true` ? `null` : `bigint`; `chainId`: `number`; `from`: `` `0x${string}` ``; `gas`: `bigint`; `gasPrice?`: `undefined`; `hash`: `` `0x${string}` ``; `input`: `` `0x${string}` ``; `maxFeePerBlobGas`: `bigint`; `maxFeePerGas`: `bigint`; `maxPriorityFeePerGas`: `bigint`; `nonce`: `number`; `r`: `` `0x${string}` ``; `s`: `` `0x${string}` ``; `to`: `null` \| `` `0x${string}` ``; `transactionIndex`: `blockTag` *extends* `"pending"` ? `true` : `false` *extends* `true` ? `null` : `number`; `type`: `"eip4844"`; `typeHex`: `null` \| `` `0x${string}` ``; `v`: `bigint`; `value`: `bigint`; `yParity`: `number`; \} \| \{ `accessList`: `AccessList`; `authorizationList`: `SignedAuthorizationList`; `blobVersionedHashes?`: `undefined`; `blockHash`: `blockTag` *extends* `"pending"` ? `true` : `false` *extends* `true` ? `null` : `` `0x${string}` ``; `blockNumber`: `blockTag` *extends* `"pending"` ? `true` : `false` *extends* `true` ? `null` : `bigint`; `chainId`: `number`; `from`: `` `0x${string}` ``; `gas`: `bigint`; `gasPrice?`: `undefined`; `hash`: `` `0x${string}` ``; `input`: `` `0x${string}` ``; `maxFeePerBlobGas?`: `undefined`; `maxFeePerGas`: `bigint`; `maxPriorityFeePerGas`: `bigint`; `nonce`: `number`; `r`: `` `0x${string}` ``; `s`: `` `0x${string}` ``; `to`: `null` \| `` `0x${string}` ``; `transactionIndex`: `blockTag` *extends* `"pending"` ? `true` : `false` *extends* `true` ? `null` : `number`; `type`: `"eip7702"`; `typeHex`: `null` \| `` `0x${string}` ``; `v`: `bigint`; `value`: `bigint`; `yParity`: `number`; \})[] : `` `0x${string}` ``[]; `transactionsRoot`: `` `0x${string}` ``; `uncles`: `` `0x${string}` ``[]; `withdrawals?`: `Withdrawal`[]; `withdrawalsRoot?`: `` `0x${string}` ``; \}\>

Information about the block. GetBlockReturnType

###### Example

```ts
import { createPublicClient, http } from 'viem'
import { mainnet } from 'viem/chains'

const client = createPublicClient({
  chain: mainnet,
  transport: http(),
})
const block = await client.getBlock()
```

##### getBlockNumber()

> **getBlockNumber**: (`args?`) => `Promise`\<`bigint`\>

Returns the number of the most recent block seen.

- Docs: https://viem.sh/docs/actions/public/getBlockNumber
- Examples: https://stackblitz.com/github/wevm/viem/tree/main/examples/blocks_fetching-blocks
- JSON-RPC Methods: [`eth_blockNumber`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_blocknumber)

###### Parameters

###### args?

`GetBlockNumberParameters`

GetBlockNumberParameters

###### Returns

`Promise`\<`bigint`\>

The number of the block. GetBlockNumberReturnType

###### Example

```ts
import { createPublicClient, http } from 'viem'
import { mainnet } from 'viem/chains'

const client = createPublicClient({
  chain: mainnet,
  transport: http(),
})
const blockNumber = await client.getBlockNumber()
// 69420n
```

##### getBlockTransactionCount()

> **getBlockTransactionCount**: (`args?`) => `Promise`\<`number`\>

Returns the number of Transactions at a block number, hash, or tag.

- Docs: https://viem.sh/docs/actions/public/getBlockTransactionCount
- JSON-RPC Methods:
  - Calls [`eth_getBlockTransactionCountByNumber`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_getblocktransactioncountbynumber) for `blockNumber` & `blockTag`.
  - Calls [`eth_getBlockTransactionCountByHash`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_getblocktransactioncountbyhash) for `blockHash`.

###### Parameters

###### args?

`GetBlockTransactionCountParameters`

GetBlockTransactionCountParameters

###### Returns

`Promise`\<`number`\>

The block transaction count. GetBlockTransactionCountReturnType

###### Example

```ts
import { createPublicClient, http } from 'viem'
import { mainnet } from 'viem/chains'

const client = createPublicClient({
  chain: mainnet,
  transport: http(),
})
const count = await client.getBlockTransactionCount()
```

##### ~~getBytecode()~~

> **getBytecode**: (`args`) => `Promise`\<`GetCodeReturnType`\>

###### Parameters

###### args

`GetCodeParameters`

###### Returns

`Promise`\<`GetCodeReturnType`\>

###### Deprecated

Use `getCode` instead.

##### getChainId()

> **getChainId**: () => `Promise`\<`number`\>

Returns the chain ID associated with the current network.

- Docs: https://viem.sh/docs/actions/public/getChainId
- JSON-RPC Methods: [`eth_chainId`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_chainid)

###### Returns

`Promise`\<`number`\>

The current chain ID. GetChainIdReturnType

###### Example

```ts
import { createPublicClient, http } from 'viem'
import { mainnet } from 'viem/chains'

const client = createPublicClient({
  chain: mainnet,
  transport: http(),
})
const chainId = await client.getChainId()
// 1
```

##### getCode()

> **getCode**: (`args`) => `Promise`\<`GetCodeReturnType`\>

Retrieves the bytecode at an address.

- Docs: https://viem.sh/docs/contract/getCode
- JSON-RPC Methods: [`eth_getCode`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_getcode)

###### Parameters

###### args

`GetCodeParameters`

GetBytecodeParameters

###### Returns

`Promise`\<`GetCodeReturnType`\>

The contract's bytecode. GetBytecodeReturnType

###### Example

```ts
import { createPublicClient, http } from 'viem'
import { mainnet } from 'viem/chains'

const client = createPublicClient({
  chain: mainnet,
  transport: http(),
})
const code = await client.getCode({
  address: '0xFBA3912Ca04dd458c843e2EE08967fC04f3579c2',
})
```

##### getContractEvents()

> **getContractEvents**: \<`abi`, `eventName`, `strict`, `fromBlock`, `toBlock`\>(`args`) => `Promise`\<`GetContractEventsReturnType`\<`abi`, `eventName`, `strict`, `fromBlock`, `toBlock`\>\>

Returns a list of event logs emitted by a contract.

- Docs: https://viem.sh/docs/actions/public/getContractEvents
- JSON-RPC Methods: [`eth_getLogs`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_getlogs)

###### Type Parameters

###### abi

`abi` *extends* `Abi` \| readonly `unknown`[]

###### eventName

`eventName` *extends* `undefined` \| `string` = `undefined`

###### strict

`strict` *extends* `undefined` \| `boolean` = `undefined`

###### fromBlock

`fromBlock` *extends* `undefined` \| `bigint` \| `BlockTag` = `undefined`

###### toBlock

`toBlock` *extends* `undefined` \| `bigint` \| `BlockTag` = `undefined`

###### Parameters

###### args

`GetContractEventsParameters`\<`abi`, `eventName`, `strict`, `fromBlock`, `toBlock`\>

###### Returns

`Promise`\<`GetContractEventsReturnType`\<`abi`, `eventName`, `strict`, `fromBlock`, `toBlock`\>\>

A list of event logs. GetContractEventsReturnType

###### Example

```ts
import { createPublicClient, http } from 'viem'
import { mainnet } from 'viem/chains'
import { wagmiAbi } from './abi'

const client = createPublicClient({
  chain: mainnet,
  transport: http(),
})
const logs = await client.getContractEvents(client, {
 address: '0xFBA3912Ca04dd458c843e2EE08967fC04f3579c2',
 abi: wagmiAbi,
 eventName: 'Transfer'
})
```

##### getEip712Domain()

> **getEip712Domain**: (`args`) => `Promise`\<`GetEip712DomainReturnType`\>

Reads the EIP-712 domain from a contract, based on the ERC-5267 specification.

###### Parameters

###### args

`GetEip712DomainParameters`

###### Returns

`Promise`\<`GetEip712DomainReturnType`\>

The EIP-712 domain, fields, and extensions. GetEip712DomainReturnType

###### Example

```ts
import { createPublicClient, http } from 'viem'
import { mainnet } from 'viem/chains'

const client = createPublicClient({
  chain: mainnet,
  transport: http(),
})

const domain = await client.getEip712Domain({
  address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
})
// {
//   domain: {
//     name: 'ExampleContract',
//     version: '1',
//     chainId: 1,
//     verifyingContract: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
//   },
//   fields: '0x0f',
//   extensions: [],
// }
```

##### getEnsAddress()

> **getEnsAddress**: (`args`) => `Promise`\<`GetEnsAddressReturnType`\>

Gets address for ENS name.

- Docs: https://viem.sh/docs/ens/actions/getEnsAddress
- Examples: https://stackblitz.com/github/wevm/viem/tree/main/examples/ens

###### Parameters

###### args

GetEnsAddressParameters

###### blockNumber?

`bigint`

The balance of the account at a block number.

###### blockTag?

`BlockTag`

The balance of the account at a block tag.

**Default**

```ts
'latest'
```

###### coinType?

`number`

ENSIP-9 compliant coinType used to resolve addresses for other chains

###### gatewayUrls?

`string`[]

Universal Resolver gateway URLs to use for resolving CCIP-read requests.

###### name

`string`

Name to get the address for.

###### strict?

`boolean`

Whether or not to throw errors propagated from the ENS Universal Resolver Contract.

###### universalResolverAddress?

`` `0x${string}` ``

Address of ENS Universal Resolver Contract.

###### Returns

`Promise`\<`GetEnsAddressReturnType`\>

Address for ENS name or `null` if not found. GetEnsAddressReturnType

###### Remarks

Calls `resolve(bytes, bytes)` on ENS Universal Resolver Contract.

Since ENS names prohibit certain forbidden characters (e.g. underscore) and have other validation rules, you likely want to [normalize ENS names](https://docs.ens.domains/contract-api-reference/name-processing#normalising-names) with [UTS-46 normalization](https://unicode.org/reports/tr46) before passing them to `getEnsAddress`. You can use the built-in [`normalize`](https://viem.sh/docs/ens/utilities/normalize) function for this.

###### Example

```ts
import { createPublicClient, http } from 'viem'
import { mainnet } from 'viem/chains'
import { normalize } from 'viem/ens'

const client = createPublicClient({
  chain: mainnet,
  transport: http(),
})
const ensAddress = await client.getEnsAddress({
  name: normalize('wevm.eth'),
})
// '0xd2135CfB216b74109775236E36d4b433F1DF507B'
```

##### getEnsAvatar()

> **getEnsAvatar**: (`args`) => `Promise`\<`GetEnsAvatarReturnType`\>

Gets the avatar of an ENS name.

- Docs: https://viem.sh/docs/ens/actions/getEnsAvatar
- Examples: https://stackblitz.com/github/wevm/viem/tree/main/examples/ens

###### Parameters

###### args

GetEnsAvatarParameters

###### assetGatewayUrls?

`AssetGatewayUrls`

Gateway urls to resolve IPFS and/or Arweave assets.

###### blockNumber?

`bigint`

The balance of the account at a block number.

###### blockTag?

`BlockTag`

The balance of the account at a block tag.

**Default**

```ts
'latest'
```

###### gatewayUrls?

`string`[]

Universal Resolver gateway URLs to use for resolving CCIP-read requests.

###### name

`string`

ENS name to get Text for.

###### strict?

`boolean`

Whether or not to throw errors propagated from the ENS Universal Resolver Contract.

###### universalResolverAddress?

`` `0x${string}` ``

Address of ENS Universal Resolver Contract.

###### Returns

`Promise`\<`GetEnsAvatarReturnType`\>

Avatar URI or `null` if not found. GetEnsAvatarReturnType

###### Remarks

Calls [`getEnsText`](https://viem.sh/docs/ens/actions/getEnsText) with `key` set to `'avatar'`.

Since ENS names prohibit certain forbidden characters (e.g. underscore) and have other validation rules, you likely want to [normalize ENS names](https://docs.ens.domains/contract-api-reference/name-processing#normalising-names) with [UTS-46 normalization](https://unicode.org/reports/tr46) before passing them to `getEnsAddress`. You can use the built-in [`normalize`](https://viem.sh/docs/ens/utilities/normalize) function for this.

###### Example

```ts
import { createPublicClient, http } from 'viem'
import { mainnet } from 'viem/chains'
import { normalize } from 'viem/ens'

const client = createPublicClient({
  chain: mainnet,
  transport: http(),
})
const ensAvatar = await client.getEnsAvatar({
  name: normalize('wevm.eth'),
})
// 'https://ipfs.io/ipfs/Qma8mnp6xV3J2cRNf3mTth5C8nV11CAnceVinc3y8jSbio'
```

##### getEnsName()

> **getEnsName**: (`args`) => `Promise`\<`GetEnsNameReturnType`\>

Gets primary name for specified address.

- Docs: https://viem.sh/docs/ens/actions/getEnsName
- Examples: https://stackblitz.com/github/wevm/viem/tree/main/examples/ens

###### Parameters

###### args

GetEnsNameParameters

###### address

`` `0x${string}` ``

Address to get ENS name for.

###### blockNumber?

`bigint`

The balance of the account at a block number.

###### blockTag?

`BlockTag`

The balance of the account at a block tag.

**Default**

```ts
'latest'
```

###### gatewayUrls?

`string`[]

Universal Resolver gateway URLs to use for resolving CCIP-read requests.

###### strict?

`boolean`

Whether or not to throw errors propagated from the ENS Universal Resolver Contract.

###### universalResolverAddress?

`` `0x${string}` ``

Address of ENS Universal Resolver Contract.

###### Returns

`Promise`\<`GetEnsNameReturnType`\>

Name or `null` if not found. GetEnsNameReturnType

###### Remarks

Calls `reverse(bytes)` on ENS Universal Resolver Contract to "reverse resolve" the address to the primary ENS name.

###### Example

```ts
import { createPublicClient, http } from 'viem'
import { mainnet } from 'viem/chains'

const client = createPublicClient({
  chain: mainnet,
  transport: http(),
})
const ensName = await client.getEnsName({
  address: '0xd2135CfB216b74109775236E36d4b433F1DF507B',
})
// 'wevm.eth'
```

##### getEnsResolver()

> **getEnsResolver**: (`args`) => `Promise`\<`` `0x${string}` ``\>

Gets resolver for ENS name.

- Docs: https://viem.sh/docs/ens/actions/getEnsResolver
- Examples: https://stackblitz.com/github/wevm/viem/tree/main/examples/ens

###### Parameters

###### args

GetEnsResolverParameters

###### blockNumber?

`bigint`

The balance of the account at a block number.

###### blockTag?

`BlockTag`

The balance of the account at a block tag.

**Default**

```ts
'latest'
```

###### name

`string`

Name to get the address for.

###### universalResolverAddress?

`` `0x${string}` ``

Address of ENS Universal Resolver Contract.

###### Returns

`Promise`\<`` `0x${string}` ``\>

Address for ENS resolver. GetEnsResolverReturnType

###### Remarks

Calls `findResolver(bytes)` on ENS Universal Resolver Contract to retrieve the resolver of an ENS name.

Since ENS names prohibit certain forbidden characters (e.g. underscore) and have other validation rules, you likely want to [normalize ENS names](https://docs.ens.domains/contract-api-reference/name-processing#normalising-names) with [UTS-46 normalization](https://unicode.org/reports/tr46) before passing them to `getEnsAddress`. You can use the built-in [`normalize`](https://viem.sh/docs/ens/utilities/normalize) function for this.

###### Example

```ts
import { createPublicClient, http } from 'viem'
import { mainnet } from 'viem/chains'
import { normalize } from 'viem/ens'

const client = createPublicClient({
  chain: mainnet,
  transport: http(),
})
const resolverAddress = await client.getEnsResolver({
  name: normalize('wevm.eth'),
})
// '0x4976fb03C32e5B8cfe2b6cCB31c09Ba78EBaBa41'
```

##### getEnsText()

> **getEnsText**: (`args`) => `Promise`\<`GetEnsTextReturnType`\>

Gets a text record for specified ENS name.

- Docs: https://viem.sh/docs/ens/actions/getEnsResolver
- Examples: https://stackblitz.com/github/wevm/viem/tree/main/examples/ens

###### Parameters

###### args

GetEnsTextParameters

###### blockNumber?

`bigint`

The balance of the account at a block number.

###### blockTag?

`BlockTag`

The balance of the account at a block tag.

**Default**

```ts
'latest'
```

###### gatewayUrls?

`string`[]

Universal Resolver gateway URLs to use for resolving CCIP-read requests.

###### key

`string`

Text record to retrieve.

###### name

`string`

ENS name to get Text for.

###### strict?

`boolean`

Whether or not to throw errors propagated from the ENS Universal Resolver Contract.

###### universalResolverAddress?

`` `0x${string}` ``

Address of ENS Universal Resolver Contract.

###### Returns

`Promise`\<`GetEnsTextReturnType`\>

Address for ENS resolver. GetEnsTextReturnType

###### Remarks

Calls `resolve(bytes, bytes)` on ENS Universal Resolver Contract.

Since ENS names prohibit certain forbidden characters (e.g. underscore) and have other validation rules, you likely want to [normalize ENS names](https://docs.ens.domains/contract-api-reference/name-processing#normalising-names) with [UTS-46 normalization](https://unicode.org/reports/tr46) before passing them to `getEnsAddress`. You can use the built-in [`normalize`](https://viem.sh/docs/ens/utilities/normalize) function for this.

###### Example

```ts
import { createPublicClient, http } from 'viem'
import { mainnet } from 'viem/chains'
import { normalize } from 'viem/ens'

const client = createPublicClient({
  chain: mainnet,
  transport: http(),
})
const twitterRecord = await client.getEnsText({
  name: normalize('wevm.eth'),
  key: 'com.twitter',
})
// 'wevm_dev'
```

##### getFeeHistory()

> **getFeeHistory**: (`args`) => `Promise`\<`GetFeeHistoryReturnType`\>

Returns a collection of historical gas information.

- Docs: https://viem.sh/docs/actions/public/getFeeHistory
- JSON-RPC Methods: [`eth_feeHistory`](https://docs.alchemy.com/reference/eth-feehistory)

###### Parameters

###### args

`GetFeeHistoryParameters`

GetFeeHistoryParameters

###### Returns

`Promise`\<`GetFeeHistoryReturnType`\>

The gas estimate (in wei). GetFeeHistoryReturnType

###### Example

```ts
import { createPublicClient, http } from 'viem'
import { mainnet } from 'viem/chains'

const client = createPublicClient({
  chain: mainnet,
  transport: http(),
})
const feeHistory = await client.getFeeHistory({
  blockCount: 4,
  rewardPercentiles: [25, 75],
})
```

##### getFilterChanges()

> **getFilterChanges**: \<`filterType`, `abi`, `eventName`, `strict`, `fromBlock`, `toBlock`\>(`args`) => `Promise`\<`GetFilterChangesReturnType`\<`filterType`, `abi`, `eventName`, `strict`, `fromBlock`, `toBlock`\>\>

Returns a list of logs or hashes based on a [Filter](/docs/glossary/terms#filter) since the last time it was called.

- Docs: https://viem.sh/docs/actions/public/getFilterChanges
- JSON-RPC Methods: [`eth_getFilterChanges`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_getfilterchanges)

###### Type Parameters

###### filterType

`filterType` *extends* `FilterType`

###### abi

`abi` *extends* `undefined` \| `Abi` \| readonly `unknown`[]

###### eventName

`eventName` *extends* `undefined` \| `string`

###### strict

`strict` *extends* `undefined` \| `boolean` = `undefined`

###### fromBlock

`fromBlock` *extends* `undefined` \| `bigint` \| `BlockTag` = `undefined`

###### toBlock

`toBlock` *extends* `undefined` \| `bigint` \| `BlockTag` = `undefined`

###### Parameters

###### args

`GetFilterChangesParameters`\<`filterType`, `abi`, `eventName`, `strict`, `fromBlock`, `toBlock`\>

GetFilterChangesParameters

###### Returns

`Promise`\<`GetFilterChangesReturnType`\<`filterType`, `abi`, `eventName`, `strict`, `fromBlock`, `toBlock`\>\>

Logs or hashes. GetFilterChangesReturnType

###### Remarks

A Filter can be created from the following actions:

- [`createBlockFilter`](https://viem.sh/docs/actions/public/createBlockFilter)
- [`createContractEventFilter`](https://viem.sh/docs/contract/createContractEventFilter)
- [`createEventFilter`](https://viem.sh/docs/actions/public/createEventFilter)
- [`createPendingTransactionFilter`](https://viem.sh/docs/actions/public/createPendingTransactionFilter)

Depending on the type of filter, the return value will be different:

- If the filter was created with `createContractEventFilter` or `createEventFilter`, it returns a list of logs.
- If the filter was created with `createPendingTransactionFilter`, it returns a list of transaction hashes.
- If the filter was created with `createBlockFilter`, it returns a list of block hashes.

###### Examples

```ts
// Blocks
import { createPublicClient, http } from 'viem'
import { mainnet } from 'viem/chains'

const client = createPublicClient({
  chain: mainnet,
  transport: http(),
})
const filter = await client.createBlockFilter()
const hashes = await client.getFilterChanges({ filter })
```

```ts
// Contract Events
import { createPublicClient, http, parseAbi } from 'viem'
import { mainnet } from 'viem/chains'

const client = createPublicClient({
  chain: mainnet,
  transport: http(),
})
const filter = await client.createContractEventFilter({
  address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
  abi: parseAbi(['event Transfer(address indexed, address indexed, uint256)']),
  eventName: 'Transfer',
})
const logs = await client.getFilterChanges({ filter })
```

```ts
// Raw Events
import { createPublicClient, http, parseAbiItem } from 'viem'
import { mainnet } from 'viem/chains'

const client = createPublicClient({
  chain: mainnet,
  transport: http(),
})
const filter = await client.createEventFilter({
  address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
  event: parseAbiItem('event Transfer(address indexed, address indexed, uint256)'),
})
const logs = await client.getFilterChanges({ filter })
```

```ts
// Transactions
import { createPublicClient, http } from 'viem'
import { mainnet } from 'viem/chains'

const client = createPublicClient({
  chain: mainnet,
  transport: http(),
})
const filter = await client.createPendingTransactionFilter()
const hashes = await client.getFilterChanges({ filter })
```

##### getFilterLogs()

> **getFilterLogs**: \<`abi`, `eventName`, `strict`, `fromBlock`, `toBlock`\>(`args`) => `Promise`\<`GetFilterLogsReturnType`\<`abi`, `eventName`, `strict`, `fromBlock`, `toBlock`\>\>

Returns a list of event logs since the filter was created.

- Docs: https://viem.sh/docs/actions/public/getFilterLogs
- JSON-RPC Methods: [`eth_getFilterLogs`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_getfilterlogs)

###### Type Parameters

###### abi

`abi` *extends* `undefined` \| `Abi` \| readonly `unknown`[]

###### eventName

`eventName` *extends* `undefined` \| `string`

###### strict

`strict` *extends* `undefined` \| `boolean` = `undefined`

###### fromBlock

`fromBlock` *extends* `undefined` \| `bigint` \| `BlockTag` = `undefined`

###### toBlock

`toBlock` *extends* `undefined` \| `bigint` \| `BlockTag` = `undefined`

###### Parameters

###### args

`GetFilterLogsParameters`\<`abi`, `eventName`, `strict`, `fromBlock`, `toBlock`\>

GetFilterLogsParameters

###### Returns

`Promise`\<`GetFilterLogsReturnType`\<`abi`, `eventName`, `strict`, `fromBlock`, `toBlock`\>\>

A list of event logs. GetFilterLogsReturnType

###### Remarks

`getFilterLogs` is only compatible with **event filters**.

###### Example

```ts
import { createPublicClient, http, parseAbiItem } from 'viem'
import { mainnet } from 'viem/chains'

const client = createPublicClient({
  chain: mainnet,
  transport: http(),
})
const filter = await client.createEventFilter({
  address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
  event: parseAbiItem('event Transfer(address indexed, address indexed, uint256)'),
})
const logs = await client.getFilterLogs({ filter })
```

##### getGasPrice()

> **getGasPrice**: () => `Promise`\<`bigint`\>

Returns the current price of gas (in wei).

- Docs: https://viem.sh/docs/actions/public/getGasPrice
- JSON-RPC Methods: [`eth_gasPrice`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_gasprice)

###### Returns

`Promise`\<`bigint`\>

The gas price (in wei). GetGasPriceReturnType

###### Example

```ts
import { createPublicClient, http } from 'viem'
import { mainnet } from 'viem/chains'

const client = createPublicClient({
  chain: mainnet,
  transport: http(),
})
const gasPrice = await client.getGasPrice()
```

##### getLogs()

> **getLogs**: \<`abiEvent`, `abiEvents`, `strict`, `fromBlock`, `toBlock`\>(`args?`) => `Promise`\<`GetLogsReturnType`\<`abiEvent`, `abiEvents`, `strict`, `fromBlock`, `toBlock`\>\>

Returns a list of event logs matching the provided parameters.

- Docs: https://viem.sh/docs/actions/public/getLogs
- Examples: https://stackblitz.com/github/wevm/viem/tree/main/examples/logs_event-logs
- JSON-RPC Methods: [`eth_getLogs`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_getlogs)

###### Type Parameters

###### abiEvent

`abiEvent` *extends* `undefined` \| `AbiEvent` = `undefined`

###### abiEvents

`abiEvents` *extends* `undefined` \| readonly `unknown`[] \| readonly `AbiEvent`[] = `abiEvent` *extends* `AbiEvent` ? \[`abiEvent`\<`abiEvent`\>\] : `undefined`

###### strict

`strict` *extends* `undefined` \| `boolean` = `undefined`

###### fromBlock

`fromBlock` *extends* `undefined` \| `bigint` \| `BlockTag` = `undefined`

###### toBlock

`toBlock` *extends* `undefined` \| `bigint` \| `BlockTag` = `undefined`

###### Parameters

###### args?

`GetLogsParameters`\<`abiEvent`, `abiEvents`, `strict`, `fromBlock`, `toBlock`\>

GetLogsParameters

###### Returns

`Promise`\<`GetLogsReturnType`\<`abiEvent`, `abiEvents`, `strict`, `fromBlock`, `toBlock`\>\>

A list of event logs. GetLogsReturnType

###### Example

```ts
import { createPublicClient, http, parseAbiItem } from 'viem'
import { mainnet } from 'viem/chains'

const client = createPublicClient({
  chain: mainnet,
  transport: http(),
})
const logs = await client.getLogs()
```

##### getProof()

> **getProof**: (`args`) => `Promise`\<`GetProofReturnType`\>

Returns the account and storage values of the specified account including the Merkle-proof.

- Docs: https://viem.sh/docs/actions/public/getProof
- JSON-RPC Methods:
  - Calls [`eth_getProof`](https://eips.ethereum.org/EIPS/eip-1186)

###### Parameters

###### args

`GetProofParameters`

###### Returns

`Promise`\<`GetProofReturnType`\>

Proof data. GetProofReturnType

###### Example

```ts
import { createPublicClient, http } from 'viem'
import { mainnet } from 'viem/chains'

const client = createPublicClient({
  chain: mainnet,
  transport: http(),
})
const block = await client.getProof({
 address: '0x...',
 storageKeys: ['0x...'],
})
```

##### getStorageAt()

> **getStorageAt**: (`args`) => `Promise`\<`GetStorageAtReturnType`\>

Returns the value from a storage slot at a given address.

- Docs: https://viem.sh/docs/contract/getStorageAt
- JSON-RPC Methods: [`eth_getStorageAt`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_getstorageat)

###### Parameters

###### args

`GetStorageAtParameters`

GetStorageAtParameters

###### Returns

`Promise`\<`GetStorageAtReturnType`\>

The value of the storage slot. GetStorageAtReturnType

###### Example

```ts
import { createPublicClient, http } from 'viem'
import { mainnet } from 'viem/chains'
import { getStorageAt } from 'viem/contract'

const client = createPublicClient({
  chain: mainnet,
  transport: http(),
})
const code = await client.getStorageAt({
  address: '0xFBA3912Ca04dd458c843e2EE08967fC04f3579c2',
  slot: toHex(0),
})
```

##### getTransaction()

> **getTransaction**: \<`blockTag`\>(`args`) => `Promise`\<\{ `accessList?`: `undefined`; `authorizationList?`: `undefined`; `blobVersionedHashes?`: `undefined`; `blockHash`: `blockTag` *extends* `"pending"` ? `true` : `false` *extends* `true` ? `null` : `` `0x${string}` ``; `blockNumber`: `blockTag` *extends* `"pending"` ? `true` : `false` *extends* `true` ? `null` : `bigint`; `chainId?`: `number`; `from`: `` `0x${string}` ``; `gas`: `bigint`; `gasPrice`: `bigint`; `hash`: `` `0x${string}` ``; `input`: `` `0x${string}` ``; `maxFeePerBlobGas?`: `undefined`; `maxFeePerGas?`: `undefined`; `maxPriorityFeePerGas?`: `undefined`; `nonce`: `number`; `r`: `` `0x${string}` ``; `s`: `` `0x${string}` ``; `to`: `null` \| `` `0x${string}` ``; `transactionIndex`: `blockTag` *extends* `"pending"` ? `true` : `false` *extends* `true` ? `null` : `number`; `type`: `"legacy"`; `typeHex`: `null` \| `` `0x${string}` ``; `v`: `bigint`; `value`: `bigint`; `yParity?`: `undefined`; \} \| \{ `accessList`: `AccessList`; `authorizationList?`: `undefined`; `blobVersionedHashes?`: `undefined`; `blockHash`: `blockTag` *extends* `"pending"` ? `true` : `false` *extends* `true` ? `null` : `` `0x${string}` ``; `blockNumber`: `blockTag` *extends* `"pending"` ? `true` : `false` *extends* `true` ? `null` : `bigint`; `chainId`: `number`; `from`: `` `0x${string}` ``; `gas`: `bigint`; `gasPrice`: `bigint`; `hash`: `` `0x${string}` ``; `input`: `` `0x${string}` ``; `maxFeePerBlobGas?`: `undefined`; `maxFeePerGas?`: `undefined`; `maxPriorityFeePerGas?`: `undefined`; `nonce`: `number`; `r`: `` `0x${string}` ``; `s`: `` `0x${string}` ``; `to`: `null` \| `` `0x${string}` ``; `transactionIndex`: `blockTag` *extends* `"pending"` ? `true` : `false` *extends* `true` ? `null` : `number`; `type`: `"eip2930"`; `typeHex`: `null` \| `` `0x${string}` ``; `v`: `bigint`; `value`: `bigint`; `yParity`: `number`; \} \| \{ `accessList`: `AccessList`; `authorizationList?`: `undefined`; `blobVersionedHashes?`: `undefined`; `blockHash`: `blockTag` *extends* `"pending"` ? `true` : `false` *extends* `true` ? `null` : `` `0x${string}` ``; `blockNumber`: `blockTag` *extends* `"pending"` ? `true` : `false` *extends* `true` ? `null` : `bigint`; `chainId`: `number`; `from`: `` `0x${string}` ``; `gas`: `bigint`; `gasPrice?`: `undefined`; `hash`: `` `0x${string}` ``; `input`: `` `0x${string}` ``; `maxFeePerBlobGas?`: `undefined`; `maxFeePerGas`: `bigint`; `maxPriorityFeePerGas`: `bigint`; `nonce`: `number`; `r`: `` `0x${string}` ``; `s`: `` `0x${string}` ``; `to`: `null` \| `` `0x${string}` ``; `transactionIndex`: `blockTag` *extends* `"pending"` ? `true` : `false` *extends* `true` ? `null` : `number`; `type`: `"eip1559"`; `typeHex`: `null` \| `` `0x${string}` ``; `v`: `bigint`; `value`: `bigint`; `yParity`: `number`; \} \| \{ `accessList`: `AccessList`; `authorizationList?`: `undefined`; `blobVersionedHashes`: readonly `` `0x${string}` ``[]; `blockHash`: `blockTag` *extends* `"pending"` ? `true` : `false` *extends* `true` ? `null` : `` `0x${string}` ``; `blockNumber`: `blockTag` *extends* `"pending"` ? `true` : `false` *extends* `true` ? `null` : `bigint`; `chainId`: `number`; `from`: `` `0x${string}` ``; `gas`: `bigint`; `gasPrice?`: `undefined`; `hash`: `` `0x${string}` ``; `input`: `` `0x${string}` ``; `maxFeePerBlobGas`: `bigint`; `maxFeePerGas`: `bigint`; `maxPriorityFeePerGas`: `bigint`; `nonce`: `number`; `r`: `` `0x${string}` ``; `s`: `` `0x${string}` ``; `to`: `null` \| `` `0x${string}` ``; `transactionIndex`: `blockTag` *extends* `"pending"` ? `true` : `false` *extends* `true` ? `null` : `number`; `type`: `"eip4844"`; `typeHex`: `null` \| `` `0x${string}` ``; `v`: `bigint`; `value`: `bigint`; `yParity`: `number`; \} \| \{ `accessList`: `AccessList`; `authorizationList`: `SignedAuthorizationList`; `blobVersionedHashes?`: `undefined`; `blockHash`: `blockTag` *extends* `"pending"` ? `true` : `false` *extends* `true` ? `null` : `` `0x${string}` ``; `blockNumber`: `blockTag` *extends* `"pending"` ? `true` : `false` *extends* `true` ? `null` : `bigint`; `chainId`: `number`; `from`: `` `0x${string}` ``; `gas`: `bigint`; `gasPrice?`: `undefined`; `hash`: `` `0x${string}` ``; `input`: `` `0x${string}` ``; `maxFeePerBlobGas?`: `undefined`; `maxFeePerGas`: `bigint`; `maxPriorityFeePerGas`: `bigint`; `nonce`: `number`; `r`: `` `0x${string}` ``; `s`: `` `0x${string}` ``; `to`: `null` \| `` `0x${string}` ``; `transactionIndex`: `blockTag` *extends* `"pending"` ? `true` : `false` *extends* `true` ? `null` : `number`; `type`: `"eip7702"`; `typeHex`: `null` \| `` `0x${string}` ``; `v`: `bigint`; `value`: `bigint`; `yParity`: `number`; \}\>

Returns information about a [Transaction](https://viem.sh/docs/glossary/terms#transaction) given a hash or block identifier.

- Docs: https://viem.sh/docs/actions/public/getTransaction
- Example: https://stackblitz.com/github/wevm/viem/tree/main/examples/transactions_fetching-transactions
- JSON-RPC Methods: [`eth_getTransactionByHash`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_getTransactionByHash)

###### Type Parameters

###### blockTag

`blockTag` *extends* `BlockTag` = `"latest"`

###### Parameters

###### args

`GetTransactionParameters`\<`blockTag`\>

GetTransactionParameters

###### Returns

`Promise`\<\{ `accessList?`: `undefined`; `authorizationList?`: `undefined`; `blobVersionedHashes?`: `undefined`; `blockHash`: `blockTag` *extends* `"pending"` ? `true` : `false` *extends* `true` ? `null` : `` `0x${string}` ``; `blockNumber`: `blockTag` *extends* `"pending"` ? `true` : `false` *extends* `true` ? `null` : `bigint`; `chainId?`: `number`; `from`: `` `0x${string}` ``; `gas`: `bigint`; `gasPrice`: `bigint`; `hash`: `` `0x${string}` ``; `input`: `` `0x${string}` ``; `maxFeePerBlobGas?`: `undefined`; `maxFeePerGas?`: `undefined`; `maxPriorityFeePerGas?`: `undefined`; `nonce`: `number`; `r`: `` `0x${string}` ``; `s`: `` `0x${string}` ``; `to`: `null` \| `` `0x${string}` ``; `transactionIndex`: `blockTag` *extends* `"pending"` ? `true` : `false` *extends* `true` ? `null` : `number`; `type`: `"legacy"`; `typeHex`: `null` \| `` `0x${string}` ``; `v`: `bigint`; `value`: `bigint`; `yParity?`: `undefined`; \} \| \{ `accessList`: `AccessList`; `authorizationList?`: `undefined`; `blobVersionedHashes?`: `undefined`; `blockHash`: `blockTag` *extends* `"pending"` ? `true` : `false` *extends* `true` ? `null` : `` `0x${string}` ``; `blockNumber`: `blockTag` *extends* `"pending"` ? `true` : `false` *extends* `true` ? `null` : `bigint`; `chainId`: `number`; `from`: `` `0x${string}` ``; `gas`: `bigint`; `gasPrice`: `bigint`; `hash`: `` `0x${string}` ``; `input`: `` `0x${string}` ``; `maxFeePerBlobGas?`: `undefined`; `maxFeePerGas?`: `undefined`; `maxPriorityFeePerGas?`: `undefined`; `nonce`: `number`; `r`: `` `0x${string}` ``; `s`: `` `0x${string}` ``; `to`: `null` \| `` `0x${string}` ``; `transactionIndex`: `blockTag` *extends* `"pending"` ? `true` : `false` *extends* `true` ? `null` : `number`; `type`: `"eip2930"`; `typeHex`: `null` \| `` `0x${string}` ``; `v`: `bigint`; `value`: `bigint`; `yParity`: `number`; \} \| \{ `accessList`: `AccessList`; `authorizationList?`: `undefined`; `blobVersionedHashes?`: `undefined`; `blockHash`: `blockTag` *extends* `"pending"` ? `true` : `false` *extends* `true` ? `null` : `` `0x${string}` ``; `blockNumber`: `blockTag` *extends* `"pending"` ? `true` : `false` *extends* `true` ? `null` : `bigint`; `chainId`: `number`; `from`: `` `0x${string}` ``; `gas`: `bigint`; `gasPrice?`: `undefined`; `hash`: `` `0x${string}` ``; `input`: `` `0x${string}` ``; `maxFeePerBlobGas?`: `undefined`; `maxFeePerGas`: `bigint`; `maxPriorityFeePerGas`: `bigint`; `nonce`: `number`; `r`: `` `0x${string}` ``; `s`: `` `0x${string}` ``; `to`: `null` \| `` `0x${string}` ``; `transactionIndex`: `blockTag` *extends* `"pending"` ? `true` : `false` *extends* `true` ? `null` : `number`; `type`: `"eip1559"`; `typeHex`: `null` \| `` `0x${string}` ``; `v`: `bigint`; `value`: `bigint`; `yParity`: `number`; \} \| \{ `accessList`: `AccessList`; `authorizationList?`: `undefined`; `blobVersionedHashes`: readonly `` `0x${string}` ``[]; `blockHash`: `blockTag` *extends* `"pending"` ? `true` : `false` *extends* `true` ? `null` : `` `0x${string}` ``; `blockNumber`: `blockTag` *extends* `"pending"` ? `true` : `false` *extends* `true` ? `null` : `bigint`; `chainId`: `number`; `from`: `` `0x${string}` ``; `gas`: `bigint`; `gasPrice?`: `undefined`; `hash`: `` `0x${string}` ``; `input`: `` `0x${string}` ``; `maxFeePerBlobGas`: `bigint`; `maxFeePerGas`: `bigint`; `maxPriorityFeePerGas`: `bigint`; `nonce`: `number`; `r`: `` `0x${string}` ``; `s`: `` `0x${string}` ``; `to`: `null` \| `` `0x${string}` ``; `transactionIndex`: `blockTag` *extends* `"pending"` ? `true` : `false` *extends* `true` ? `null` : `number`; `type`: `"eip4844"`; `typeHex`: `null` \| `` `0x${string}` ``; `v`: `bigint`; `value`: `bigint`; `yParity`: `number`; \} \| \{ `accessList`: `AccessList`; `authorizationList`: `SignedAuthorizationList`; `blobVersionedHashes?`: `undefined`; `blockHash`: `blockTag` *extends* `"pending"` ? `true` : `false` *extends* `true` ? `null` : `` `0x${string}` ``; `blockNumber`: `blockTag` *extends* `"pending"` ? `true` : `false` *extends* `true` ? `null` : `bigint`; `chainId`: `number`; `from`: `` `0x${string}` ``; `gas`: `bigint`; `gasPrice?`: `undefined`; `hash`: `` `0x${string}` ``; `input`: `` `0x${string}` ``; `maxFeePerBlobGas?`: `undefined`; `maxFeePerGas`: `bigint`; `maxPriorityFeePerGas`: `bigint`; `nonce`: `number`; `r`: `` `0x${string}` ``; `s`: `` `0x${string}` ``; `to`: `null` \| `` `0x${string}` ``; `transactionIndex`: `blockTag` *extends* `"pending"` ? `true` : `false` *extends* `true` ? `null` : `number`; `type`: `"eip7702"`; `typeHex`: `null` \| `` `0x${string}` ``; `v`: `bigint`; `value`: `bigint`; `yParity`: `number`; \}\>

The transaction information. GetTransactionReturnType

###### Example

```ts
import { createPublicClient, http } from 'viem'
import { mainnet } from 'viem/chains'

const client = createPublicClient({
  chain: mainnet,
  transport: http(),
})
const transaction = await client.getTransaction({
  hash: '0x4ca7ee652d57678f26e887c149ab0735f41de37bcad58c9f6d3ed5824f15b74d',
})
```

##### getTransactionConfirmations()

> **getTransactionConfirmations**: (`args`) => `Promise`\<`bigint`\>

Returns the number of blocks passed (confirmations) since the transaction was processed on a block.

- Docs: https://viem.sh/docs/actions/public/getTransactionConfirmations
- Example: https://stackblitz.com/github/wevm/viem/tree/main/examples/transactions_fetching-transactions
- JSON-RPC Methods: [`eth_getTransactionConfirmations`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_getTransactionConfirmations)

###### Parameters

###### args

`GetTransactionConfirmationsParameters`\<`Chain`\>

GetTransactionConfirmationsParameters

###### Returns

`Promise`\<`bigint`\>

The number of blocks passed since the transaction was processed. If confirmations is 0, then the Transaction has not been confirmed & processed yet. GetTransactionConfirmationsReturnType

###### Example

```ts
import { createPublicClient, http } from 'viem'
import { mainnet } from 'viem/chains'

const client = createPublicClient({
  chain: mainnet,
  transport: http(),
})
const confirmations = await client.getTransactionConfirmations({
  hash: '0x4ca7ee652d57678f26e887c149ab0735f41de37bcad58c9f6d3ed5824f15b74d',
})
```

##### getTransactionCount()

> **getTransactionCount**: (`args`) => `Promise`\<`number`\>

Returns the number of [Transactions](https://viem.sh/docs/glossary/terms#transaction) an Account has broadcast / sent.

- Docs: https://viem.sh/docs/actions/public/getTransactionCount
- JSON-RPC Methods: [`eth_getTransactionCount`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_gettransactioncount)

###### Parameters

###### args

`GetTransactionCountParameters`

GetTransactionCountParameters

###### Returns

`Promise`\<`number`\>

The number of transactions an account has sent. GetTransactionCountReturnType

###### Example

```ts
import { createPublicClient, http } from 'viem'
import { mainnet } from 'viem/chains'

const client = createPublicClient({
  chain: mainnet,
  transport: http(),
})
const transactionCount = await client.getTransactionCount({
  address: '0xA0Cf798816D4b9b9866b5330EEa46a18382f251e',
})
```

##### getTransactionReceipt()

> **getTransactionReceipt**: (`args`) => `Promise`\<`TransactionReceipt`\>

Returns the [Transaction Receipt](https://viem.sh/docs/glossary/terms#transaction-receipt) given a [Transaction](https://viem.sh/docs/glossary/terms#transaction) hash.

- Docs: https://viem.sh/docs/actions/public/getTransactionReceipt
- Example: https://stackblitz.com/github/wevm/viem/tree/main/examples/transactions_fetching-transactions
- JSON-RPC Methods: [`eth_getTransactionReceipt`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_getTransactionReceipt)

###### Parameters

###### args

`GetTransactionReceiptParameters`

GetTransactionReceiptParameters

###### Returns

`Promise`\<`TransactionReceipt`\>

The transaction receipt. GetTransactionReceiptReturnType

###### Example

```ts
import { createPublicClient, http } from 'viem'
import { mainnet } from 'viem/chains'

const client = createPublicClient({
  chain: mainnet,
  transport: http(),
})
const transactionReceipt = await client.getTransactionReceipt({
  hash: '0x4ca7ee652d57678f26e887c149ab0735f41de37bcad58c9f6d3ed5824f15b74d',
})
```

##### key

> **key**: `string`

A key for the client.

##### multicall()

> **multicall**: \<`contracts`, `allowFailure`\>(`args`) => `Promise`\<`MulticallReturnType`\<`contracts`, `allowFailure`\>\>

Similar to [`readContract`](https://viem.sh/docs/contract/readContract), but batches up multiple functions on a contract in a single RPC call via the [`multicall3` contract](https://github.com/mds1/multicall).

- Docs: https://viem.sh/docs/contract/multicall

###### Type Parameters

###### contracts

`contracts` *extends* readonly `unknown`[]

###### allowFailure

`allowFailure` *extends* `boolean` = `true`

###### Parameters

###### args

`MulticallParameters`\<`contracts`, `allowFailure`\>

MulticallParameters

###### Returns

`Promise`\<`MulticallReturnType`\<`contracts`, `allowFailure`\>\>

An array of results with accompanying status. MulticallReturnType

###### Example

```ts
import { createPublicClient, http, parseAbi } from 'viem'
import { mainnet } from 'viem/chains'

const client = createPublicClient({
  chain: mainnet,
  transport: http(),
})
const abi = parseAbi([
  'function balanceOf(address) view returns (uint256)',
  'function totalSupply() view returns (uint256)',
])
const result = await client.multicall({
  contracts: [
    {
      address: '0xFBA3912Ca04dd458c843e2EE08967fC04f3579c2',
      abi,
      functionName: 'balanceOf',
      args: ['0xA0Cf798816D4b9b9866b5330EEa46a18382f251e'],
    },
    {
      address: '0xFBA3912Ca04dd458c843e2EE08967fC04f3579c2',
      abi,
      functionName: 'totalSupply',
    },
  ],
})
// [{ result: 424122n, status: 'success' }, { result: 1000000n, status: 'success' }]
```

##### name

> **name**: `string`

A name for the client.

##### pollingInterval

> **pollingInterval**: `number`

Frequency (in ms) for polling enabled actions & events. Defaults to 4_000 milliseconds.

##### prepareTransactionRequest()

> **prepareTransactionRequest**: \<`request`, `chainOverride`, `accountOverride`\>(`args`) => `Promise`\<\{ \[K in string \| number \| symbol\]: (UnionRequiredBy\<Extract\<UnionOmit\<(...), (...)\> & ((...) extends (...) ? (...) : (...)) & ((...) extends (...) ? (...) : (...)), IsNever\<(...)\> extends true ? unknown : ExactPartial\<(...)\>\> & \{ chainId?: number \}, ParameterTypeToParameters\<request\["parameters"\] extends readonly PrepareTransactionRequestParameterType\[\] ? any\[any\]\[number\] : "type" \| "chainId" \| "gas" \| "nonce" \| "blobVersionedHashes" \| "fees"\>\> & (unknown extends request\["kzg"\] ? \{\} : Pick\<request, "kzg"\>))\[K\] \}\>

Prepares a transaction request for signing.

- Docs: https://viem.sh/docs/actions/wallet/prepareTransactionRequest

###### Type Parameters

###### request

`request` *extends* `Omit`\<\{ `accessList?`: `undefined`; `authorizationList?`: `undefined`; `blobs?`: `undefined`; `blobVersionedHashes?`: `undefined`; `data?`: `` `0x${string}` ``; `from?`: `` `0x${string}` ``; `gas?`: `bigint`; `gasPrice?`: `bigint`; `kzg?`: `undefined`; `maxFeePerBlobGas?`: `undefined`; `maxFeePerGas?`: `undefined`; `maxPriorityFeePerGas?`: `undefined`; `nonce?`: `number`; `sidecars?`: `undefined`; `to?`: `null` \| `` `0x${string}` ``; `type?`: `"legacy"`; `value?`: `bigint`; \}, `"from"`\> \| `Omit`\<\{ `accessList?`: `AccessList`; `authorizationList?`: `undefined`; `blobs?`: `undefined`; `blobVersionedHashes?`: `undefined`; `data?`: `` `0x${string}` ``; `from?`: `` `0x${string}` ``; `gas?`: `bigint`; `gasPrice?`: `bigint`; `kzg?`: `undefined`; `maxFeePerBlobGas?`: `undefined`; `maxFeePerGas?`: `undefined`; `maxPriorityFeePerGas?`: `undefined`; `nonce?`: `number`; `sidecars?`: `undefined`; `to?`: `null` \| `` `0x${string}` ``; `type?`: `"eip2930"`; `value?`: `bigint`; \}, `"from"`\> \| `Omit`\<\{ `accessList?`: `AccessList`; `authorizationList?`: `undefined`; `blobs?`: `undefined`; `blobVersionedHashes?`: `undefined`; `data?`: `` `0x${string}` ``; `from?`: `` `0x${string}` ``; `gas?`: `bigint`; `gasPrice?`: `undefined`; `kzg?`: `undefined`; `maxFeePerBlobGas?`: `undefined`; `maxFeePerGas?`: `bigint`; `maxPriorityFeePerGas?`: `bigint`; `nonce?`: `number`; `sidecars?`: `undefined`; `to?`: `null` \| `` `0x${string}` ``; `type?`: `"eip1559"`; `value?`: `bigint`; \}, `"from"`\> \| `Omit`\<\{ `accessList?`: `AccessList`; `authorizationList?`: `undefined`; `blobs`: readonly `` `0x${string}` ``[] \| readonly `Uint8Array`[]; `blobVersionedHashes?`: readonly `` `0x${string}` ``[]; `data?`: `` `0x${string}` ``; `from?`: `` `0x${string}` ``; `gas?`: `bigint`; `gasPrice?`: `undefined`; `kzg?`: `Kzg`; `maxFeePerBlobGas`: `bigint`; `maxFeePerGas?`: `bigint`; `maxPriorityFeePerGas?`: `bigint`; `nonce?`: `number`; `sidecars?`: readonly `BlobSidecar`\<`` `0x${string}` ``\>[]; `to`: `null` \| `` `0x${string}` ``; `type?`: `"eip4844"`; `value?`: `bigint`; \}, `"from"`\> \| `Omit`\<\{ `accessList?`: `AccessList`; `authorizationList?`: `AuthorizationList`\<`number`, `boolean`\>; `blobs?`: `undefined`; `blobVersionedHashes?`: `undefined`; `data?`: `` `0x${string}` ``; `from?`: `` `0x${string}` ``; `gas?`: `bigint`; `gasPrice?`: `undefined`; `kzg?`: `undefined`; `maxFeePerBlobGas?`: `undefined`; `maxFeePerGas?`: `bigint`; `maxPriorityFeePerGas?`: `bigint`; `nonce?`: `number`; `sidecars?`: `undefined`; `to?`: `null` \| `` `0x${string}` ``; `type?`: `"eip7702"`; `value?`: `bigint`; \}, `"from"`\> & `object` & `object`

###### chainOverride

`chainOverride` *extends* `undefined` \| `Chain` = `undefined`

###### accountOverride

`accountOverride` *extends* `undefined` \| `` `0x${string}` `` \| `Account` = `undefined`

###### Parameters

###### args

`PrepareTransactionRequestParameters`\<`Chain`, `undefined` \| `Account`, `chainOverride`, `accountOverride`, `request`\>

PrepareTransactionRequestParameters

###### Returns

`Promise`\<\{ \[K in string \| number \| symbol\]: (UnionRequiredBy\<Extract\<UnionOmit\<(...), (...)\> & ((...) extends (...) ? (...) : (...)) & ((...) extends (...) ? (...) : (...)), IsNever\<(...)\> extends true ? unknown : ExactPartial\<(...)\>\> & \{ chainId?: number \}, ParameterTypeToParameters\<request\["parameters"\] extends readonly PrepareTransactionRequestParameterType\[\] ? any\[any\]\[number\] : "type" \| "chainId" \| "gas" \| "nonce" \| "blobVersionedHashes" \| "fees"\>\> & (unknown extends request\["kzg"\] ? \{\} : Pick\<request, "kzg"\>))\[K\] \}\>

The transaction request. PrepareTransactionRequestReturnType

###### Examples

```ts
import { createWalletClient, custom } from 'viem'
import { mainnet } from 'viem/chains'

const client = createWalletClient({
  chain: mainnet,
  transport: custom(window.ethereum),
})
const request = await client.prepareTransactionRequest({
  account: '0xA0Cf798816D4b9b9866b5330EEa46a18382f251e',
  to: '0x0000000000000000000000000000000000000000',
  value: 1n,
})
```

```ts
// Account Hoisting
import { createWalletClient, http } from 'viem'
import { privateKeyToAccount } from 'viem/accounts'
import { mainnet } from 'viem/chains'

const client = createWalletClient({
  account: privateKeyToAccount('0x…'),
  chain: mainnet,
  transport: custom(window.ethereum),
})
const request = await client.prepareTransactionRequest({
  to: '0x0000000000000000000000000000000000000000',
  value: 1n,
})
```

##### readContract()

> **readContract**: \<`abi`, `functionName`, `args`\>(`args`) => `Promise`\<`ReadContractReturnType`\<`abi`, `functionName`, `args`\>\>

Calls a read-only function on a contract, and returns the response.

- Docs: https://viem.sh/docs/contract/readContract
- Examples: https://stackblitz.com/github/wevm/viem/tree/main/examples/contracts_reading-contracts

###### Type Parameters

###### abi

`abi` *extends* `Abi` \| readonly `unknown`[]

###### functionName

`functionName` *extends* `string`

###### args

`args` *extends* `unknown`

###### Parameters

###### args

`ReadContractParameters`\<`abi`, `functionName`, `args`\>

ReadContractParameters

###### Returns

`Promise`\<`ReadContractReturnType`\<`abi`, `functionName`, `args`\>\>

The response from the contract. Type is inferred. ReadContractReturnType

###### Remarks

A "read-only" function (constant function) on a Solidity contract is denoted by a `view` or `pure` keyword. They can only read the state of the contract, and cannot make any changes to it. Since read-only methods do not change the state of the contract, they do not require any gas to be executed, and can be called by any user without the need to pay for gas.

Internally, uses a [Public Client](https://viem.sh/docs/clients/public) to call the [`call` action](https://viem.sh/docs/actions/public/call) with [ABI-encoded `data`](https://viem.sh/docs/contract/encodeFunctionData).

###### Example

```ts
import { createPublicClient, http, parseAbi } from 'viem'
import { mainnet } from 'viem/chains'
import { readContract } from 'viem/contract'

const client = createPublicClient({
  chain: mainnet,
  transport: http(),
})
const result = await client.readContract({
  address: '0xFBA3912Ca04dd458c843e2EE08967fC04f3579c2',
  abi: parseAbi(['function balanceOf(address) view returns (uint256)']),
  functionName: 'balanceOf',
  args: ['0xA0Cf798816D4b9b9866b5330EEa46a18382f251e'],
})
// 424122n
```

##### request

> **request**: `EIP1193RequestFn`\<`PublicRpcSchema`\>

Request function wrapped with friendly error handling

##### sendRawTransaction()

> **sendRawTransaction**: (`args`) => `Promise`\<`` `0x${string}` ``\>

Sends a **signed** transaction to the network

- Docs: https://viem.sh/docs/actions/wallet/sendRawTransaction
- JSON-RPC Method: [`eth_sendRawTransaction`](https://ethereum.github.io/execution-apis/api-documentation/)

###### Parameters

###### args

`SendRawTransactionParameters`

###### Returns

`Promise`\<`` `0x${string}` ``\>

The transaction hash. SendRawTransactionReturnType

###### Example

```ts
import { createWalletClient, custom } from 'viem'
import { mainnet } from 'viem/chains'
import { sendRawTransaction } from 'viem/wallet'

const client = createWalletClient({
  chain: mainnet,
  transport: custom(window.ethereum),
})

const hash = await client.sendRawTransaction({
  serializedTransaction: '0x02f850018203118080825208808080c080a04012522854168b27e5dc3d5839bab5e6b39e1a0ffd343901ce1622e3d64b48f1a04e00902ae0502c4728cbf12156290df99c3ed7de85b1dbfe20b5c36931733a33'
})
```

##### ~~simulate()~~

> **simulate**: \<`calls`\>(`args`) => `Promise`\<`SimulateBlocksReturnType`\<`calls`\>\>

###### Type Parameters

###### calls

`calls` *extends* readonly `unknown`[]

###### Parameters

###### args

`SimulateBlocksParameters`\<`calls`\>

###### Returns

`Promise`\<`SimulateBlocksReturnType`\<`calls`\>\>

###### Deprecated

Use `simulateBlocks` instead.

##### simulateBlocks()

> **simulateBlocks**: \<`calls`\>(`args`) => `Promise`\<`SimulateBlocksReturnType`\<`calls`\>\>

Simulates a set of calls on block(s) with optional block and state overrides.

###### Type Parameters

###### calls

`calls` *extends* readonly `unknown`[]

###### Parameters

###### args

`SimulateBlocksParameters`\<`calls`\>

###### Returns

`Promise`\<`SimulateBlocksReturnType`\<`calls`\>\>

Simulated blocks. SimulateReturnType

###### Example

```ts
import { createPublicClient, http, parseEther } from 'viem'
import { mainnet } from 'viem/chains'

const client = createPublicClient({
  chain: mainnet,
  transport: http(),
})

const result = await client.simulateBlocks({
  blocks: [{
    blockOverrides: {
      number: 69420n,
    },
    calls: [{
      {
        account: '0x5a0b54d5dc17e482fe8b0bdca5320161b95fb929',
        data: '0xdeadbeef',
        to: '0x70997970c51812dc3a010c7d01b50e0d17dc79c8',
      },
      {
        account: '0x5a0b54d5dc17e482fe8b0bdca5320161b95fb929',
        to: '0x70997970c51812dc3a010c7d01b50e0d17dc79c8',
        value: parseEther('1'),
      },
    }],
    stateOverrides: [{
      address: '0x5a0b54d5dc17e482fe8b0bdca5320161b95fb929',
      balance: parseEther('10'),
    }],
  }]
})
```

##### simulateCalls()

> **simulateCalls**: \<`calls`\>(`args`) => `Promise`\<`SimulateCallsReturnType`\<`calls`\>\>

Simulates a set of calls.

###### Type Parameters

###### calls

`calls` *extends* readonly `unknown`[]

###### Parameters

###### args

`SimulateCallsParameters`\<`calls`\>

###### Returns

`Promise`\<`SimulateCallsReturnType`\<`calls`\>\>

Results. SimulateCallsReturnType

###### Example

```ts
import { createPublicClient, http, parseEther } from 'viem'
import { mainnet } from 'viem/chains'

const client = createPublicClient({
  chain: mainnet,
  transport: http(),
})

const result = await client.simulateCalls({
  account: '0x5a0b54d5dc17e482fe8b0bdca5320161b95fb929',
  calls: [{
    {
      data: '0xdeadbeef',
      to: '0x70997970c51812dc3a010c7d01b50e0d17dc79c8',
    },
    {
      to: '0x70997970c51812dc3a010c7d01b50e0d17dc79c8',
      value: parseEther('1'),
    },
  ]
})
```

##### simulateContract()

> **simulateContract**: \<`abi`, `functionName`, `args`, `chainOverride`, `accountOverride`\>(`args`) => `Promise`\<`SimulateContractReturnType`\<`abi`, `functionName`, `args`, `Chain`, `undefined` \| `Account`, `chainOverride`, `accountOverride`\>\>

Simulates/validates a contract interaction. This is useful for retrieving **return data** and **revert reasons** of contract write functions.

- Docs: https://viem.sh/docs/contract/simulateContract
- Examples: https://stackblitz.com/github/wevm/viem/tree/main/examples/contracts_writing-to-contracts

###### Type Parameters

###### abi

`abi` *extends* `Abi` \| readonly `unknown`[]

###### functionName

`functionName` *extends* `string`

###### args

`args` *extends* `unknown`

###### chainOverride

`chainOverride` *extends* `undefined` \| `Chain`

###### accountOverride

`accountOverride` *extends* `undefined` \| `` `0x${string}` `` \| `Account` = `undefined`

###### Parameters

###### args

`SimulateContractParameters`\<`abi`, `functionName`, `args`, `Chain`, `chainOverride`, `accountOverride`\>

SimulateContractParameters

###### Returns

`Promise`\<`SimulateContractReturnType`\<`abi`, `functionName`, `args`, `Chain`, `undefined` \| `Account`, `chainOverride`, `accountOverride`\>\>

The simulation result and write request. SimulateContractReturnType

###### Remarks

This function does not require gas to execute and _**does not**_ change the state of the blockchain. It is almost identical to [`readContract`](https://viem.sh/docs/contract/readContract), but also supports contract write functions.

Internally, uses a [Public Client](https://viem.sh/docs/clients/public) to call the [`call` action](https://viem.sh/docs/actions/public/call) with [ABI-encoded `data`](https://viem.sh/docs/contract/encodeFunctionData).

###### Example

```ts
import { createPublicClient, http } from 'viem'
import { mainnet } from 'viem/chains'

const client = createPublicClient({
  chain: mainnet,
  transport: http(),
})
const result = await client.simulateContract({
  address: '0xFBA3912Ca04dd458c843e2EE08967fC04f3579c2',
  abi: parseAbi(['function mint(uint32) view returns (uint32)']),
  functionName: 'mint',
  args: ['69420'],
  account: '0xA0Cf798816D4b9b9866b5330EEa46a18382f251e',
})
```

##### transport

> **transport**: `TransportConfig`\<`string`, `EIP1193RequestFn`\> & `Record`\<`string`, `any`\>

The RPC transport

##### type

> **type**: `string`

The type of client.

##### uid

> **uid**: `string`

A unique ID for the client.

##### uninstallFilter()

> **uninstallFilter**: (`args`) => `Promise`\<`boolean`\>

Destroys a Filter that was created from one of the following Actions:

- [`createBlockFilter`](https://viem.sh/docs/actions/public/createBlockFilter)
- [`createEventFilter`](https://viem.sh/docs/actions/public/createEventFilter)
- [`createPendingTransactionFilter`](https://viem.sh/docs/actions/public/createPendingTransactionFilter)

- Docs: https://viem.sh/docs/actions/public/uninstallFilter
- JSON-RPC Methods: [`eth_uninstallFilter`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_uninstallFilter)

###### Parameters

###### args

`UninstallFilterParameters`

UninstallFilterParameters

###### Returns

`Promise`\<`boolean`\>

A boolean indicating if the Filter was successfully uninstalled. UninstallFilterReturnType

###### Example

```ts
import { createPublicClient, http } from 'viem'
import { mainnet } from 'viem/chains'
import { createPendingTransactionFilter, uninstallFilter } from 'viem/public'

const filter = await client.createPendingTransactionFilter()
const uninstalled = await client.uninstallFilter({ filter })
// true
```

##### verifyMessage()

> **verifyMessage**: (`args`) => `Promise`\<`boolean`\>

Verify that a message was signed by the provided address.

Compatible with Smart Contract Accounts & Externally Owned Accounts via [ERC-6492](https://eips.ethereum.org/EIPS/eip-6492).

- Docs [https://viem.sh/docs/actions/public/verifyMessage](https://viem.sh/docs/actions/public/verifyMessage)

###### Parameters

###### args

###### address

`` `0x${string}` ``

The address that signed the original message.

###### blockNumber?

`bigint`

The balance of the account at a block number.

###### blockTag?

`BlockTag`

The balance of the account at a block tag.

**Default**

```ts
'latest'
```

###### factory?

`` `0x${string}` ``

###### factoryData?

`` `0x${string}` ``

###### message

`SignableMessage`

The message to be verified.

###### signature

`` `0x${string}` `` \| `Uint8Array` \| `Signature`

The signature that was generated by signing the message with the address's private key.

###### universalSignatureVerifierAddress?

`` `0x${string}` ``

###### Returns

`Promise`\<`boolean`\>

Whether or not the signature is valid. VerifyMessageReturnType

##### verifySiweMessage()

> **verifySiweMessage**: (`args`) => `Promise`\<`boolean`\>

Verifies [EIP-4361](https://eips.ethereum.org/EIPS/eip-4361) formatted message was signed.

Compatible with Smart Contract Accounts & Externally Owned Accounts via [ERC-6492](https://eips.ethereum.org/EIPS/eip-6492).

- Docs [https://viem.sh/docs/siwe/actions/verifySiweMessage](https://viem.sh/docs/siwe/actions/verifySiweMessage)

###### Parameters

###### args

###### address?

`` `0x${string}` ``

Ethereum address to check against.

###### blockNumber?

`bigint`

The balance of the account at a block number.

###### blockTag?

`BlockTag`

The balance of the account at a block tag.

**Default**

```ts
'latest'
```

###### domain?

`string`

[RFC 3986](https://www.rfc-editor.org/rfc/rfc3986) authority to check against.

###### message

`string`

EIP-4361 formatted message.

###### nonce?

`string`

Random string to check against.

###### scheme?

`string`

[RFC 3986](https://www.rfc-editor.org/rfc/rfc3986#section-3.1) URI scheme to check against.

###### signature

`` `0x${string}` ``

Signature to check against.

###### time?

`Date`

Current time to check optional `expirationTime` and `notBefore` fields.

**Default**

```ts
new Date()
```

###### Returns

`Promise`\<`boolean`\>

Whether or not the signature is valid. VerifySiweMessageReturnType

##### verifyTypedData()

> **verifyTypedData**: (`args`) => `Promise`\<`boolean`\>

Verify that typed data was signed by the provided address.

- Docs [https://viem.sh/docs/actions/public/verifyTypedData](https://viem.sh/docs/actions/public/verifyTypedData)

###### Parameters

###### args

`VerifyTypedDataParameters`

###### Returns

`Promise`\<`boolean`\>

Whether or not the signature is valid. VerifyTypedDataReturnType

##### waitForTransactionReceipt()

> **waitForTransactionReceipt**: (`args`) => `Promise`\<`TransactionReceipt`\>

Waits for the [Transaction](https://viem.sh/docs/glossary/terms#transaction) to be included on a [Block](https://viem.sh/docs/glossary/terms#block) (one confirmation), and then returns the [Transaction Receipt](https://viem.sh/docs/glossary/terms#transaction-receipt). If the Transaction reverts, then the action will throw an error.

- Docs: https://viem.sh/docs/actions/public/waitForTransactionReceipt
- Example: https://stackblitz.com/github/wevm/viem/tree/main/examples/transactions_sending-transactions
- JSON-RPC Methods:
  - Polls [`eth_getTransactionReceipt`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_getTransactionReceipt) on each block until it has been processed.
  - If a Transaction has been replaced:
    - Calls [`eth_getBlockByNumber`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_getblockbynumber) and extracts the transactions
    - Checks if one of the Transactions is a replacement
    - If so, calls [`eth_getTransactionReceipt`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_getTransactionReceipt).

###### Parameters

###### args

`WaitForTransactionReceiptParameters`\<`Chain`\>

WaitForTransactionReceiptParameters

###### Returns

`Promise`\<`TransactionReceipt`\>

The transaction receipt. WaitForTransactionReceiptReturnType

###### Remarks

The `waitForTransactionReceipt` action additionally supports Replacement detection (e.g. sped up Transactions).

Transactions can be replaced when a user modifies their transaction in their wallet (to speed up or cancel). Transactions are replaced when they are sent from the same nonce.

There are 3 types of Transaction Replacement reasons:

- `repriced`: The gas price has been modified (e.g. different `maxFeePerGas`)
- `cancelled`: The Transaction has been cancelled (e.g. `value === 0n`)
- `replaced`: The Transaction has been replaced (e.g. different `value` or `data`)

###### Example

```ts
import { createPublicClient, http } from 'viem'
import { mainnet } from 'viem/chains'

const client = createPublicClient({
  chain: mainnet,
  transport: http(),
})
const transactionReceipt = await client.waitForTransactionReceipt({
  hash: '0x4ca7ee652d57678f26e887c149ab0735f41de37bcad58c9f6d3ed5824f15b74d',
})
```

##### watchBlockNumber()

> **watchBlockNumber**: (`args`) => `WatchBlockNumberReturnType`

Watches and returns incoming block numbers.

- Docs: https://viem.sh/docs/actions/public/watchBlockNumber
- Examples: https://stackblitz.com/github/wevm/viem/tree/main/examples/blocks_watching-blocks
- JSON-RPC Methods:
  - When `poll: true`, calls [`eth_blockNumber`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_blocknumber) on a polling interval.
  - When `poll: false` & WebSocket Transport, uses a WebSocket subscription via [`eth_subscribe`](https://docs.alchemy.com/reference/eth-subscribe-polygon) and the `"newHeads"` event.

###### Parameters

###### args

`WatchBlockNumberParameters`

WatchBlockNumberParameters

###### Returns

`WatchBlockNumberReturnType`

A function that can be invoked to stop watching for new block numbers. WatchBlockNumberReturnType

###### Example

```ts
import { createPublicClient, http } from 'viem'
import { mainnet } from 'viem/chains'

const client = createPublicClient({
  chain: mainnet,
  transport: http(),
})
const unwatch = await client.watchBlockNumber({
  onBlockNumber: (blockNumber) => console.log(blockNumber),
})
```

##### watchBlocks()

> **watchBlocks**: \<`includeTransactions`, `blockTag`\>(`args`) => `WatchBlocksReturnType`

Watches and returns information for incoming blocks.

- Docs: https://viem.sh/docs/actions/public/watchBlocks
- Examples: https://stackblitz.com/github/wevm/viem/tree/main/examples/blocks_watching-blocks
- JSON-RPC Methods:
  - When `poll: true`, calls [`eth_getBlockByNumber`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_getBlockByNumber) on a polling interval.
  - When `poll: false` & WebSocket Transport, uses a WebSocket subscription via [`eth_subscribe`](https://docs.alchemy.com/reference/eth-subscribe-polygon) and the `"newHeads"` event.

###### Type Parameters

###### includeTransactions

`includeTransactions` *extends* `boolean` = `false`

###### blockTag

`blockTag` *extends* `BlockTag` = `"latest"`

###### Parameters

###### args

`WatchBlocksParameters`\<`Transport`, `Chain`, `includeTransactions`, `blockTag`\>

WatchBlocksParameters

###### Returns

`WatchBlocksReturnType`

A function that can be invoked to stop watching for new block numbers. WatchBlocksReturnType

###### Example

```ts
import { createPublicClient, http } from 'viem'
import { mainnet } from 'viem/chains'

const client = createPublicClient({
  chain: mainnet,
  transport: http(),
})
const unwatch = await client.watchBlocks({
  onBlock: (block) => console.log(block),
})
```

##### watchContractEvent()

> **watchContractEvent**: \<`abi`, `eventName`, `strict`\>(`args`) => `WatchContractEventReturnType`

Watches and returns emitted contract event logs.

- Docs: https://viem.sh/docs/contract/watchContractEvent

###### Type Parameters

###### abi

`abi` *extends* `Abi` \| readonly `unknown`[]

###### eventName

`eventName` *extends* `string`

###### strict

`strict` *extends* `undefined` \| `boolean` = `undefined`

###### Parameters

###### args

`WatchContractEventParameters`\<`abi`, `eventName`, `strict`, `Transport`\>

WatchContractEventParameters

###### Returns

`WatchContractEventReturnType`

A function that can be invoked to stop watching for new event logs. WatchContractEventReturnType

###### Remarks

This Action will batch up all the event logs found within the [`pollingInterval`](https://viem.sh/docs/contract/watchContractEvent#pollinginterval-optional), and invoke them via [`onLogs`](https://viem.sh/docs/contract/watchContractEvent#onLogs).

`watchContractEvent` will attempt to create an [Event Filter](https://viem.sh/docs/contract/createContractEventFilter) and listen to changes to the Filter per polling interval, however, if the RPC Provider does not support Filters (e.g. `eth_newFilter`), then `watchContractEvent` will fall back to using [`getLogs`](https://viem.sh/docs/actions/public/getLogs) instead.

###### Example

```ts
import { createPublicClient, http, parseAbi } from 'viem'
import { mainnet } from 'viem/chains'

const client = createPublicClient({
  chain: mainnet,
  transport: http(),
})
const unwatch = client.watchContractEvent({
  address: '0xFBA3912Ca04dd458c843e2EE08967fC04f3579c2',
  abi: parseAbi(['event Transfer(address indexed from, address indexed to, uint256 value)']),
  eventName: 'Transfer',
  args: { from: '0xc961145a54C96E3aE9bAA048c4F4D6b04C13916b' },
  onLogs: (logs) => console.log(logs),
})
```

##### watchEvent()

> **watchEvent**: \<`abiEvent`, `abiEvents`, `strict`\>(`args`) => `WatchEventReturnType`

Watches and returns emitted [Event Logs](https://viem.sh/docs/glossary/terms#event-log).

- Docs: https://viem.sh/docs/actions/public/watchEvent
- JSON-RPC Methods:
  - **RPC Provider supports `eth_newFilter`:**
    - Calls [`eth_newFilter`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_newfilter) to create a filter (called on initialize).
    - On a polling interval, it will call [`eth_getFilterChanges`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_getfilterchanges).
  - **RPC Provider does not support `eth_newFilter`:**
    - Calls [`eth_getLogs`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_getlogs) for each block between the polling interval.

###### Type Parameters

###### abiEvent

`abiEvent` *extends* `undefined` \| `AbiEvent` = `undefined`

###### abiEvents

`abiEvents` *extends* `undefined` \| readonly `unknown`[] \| readonly `AbiEvent`[] = `abiEvent` *extends* `AbiEvent` ? \[`abiEvent`\<`abiEvent`\>\] : `undefined`

###### strict

`strict` *extends* `undefined` \| `boolean` = `undefined`

###### Parameters

###### args

`WatchEventParameters`\<`abiEvent`, `abiEvents`, `strict`, `Transport`\>

WatchEventParameters

###### Returns

`WatchEventReturnType`

A function that can be invoked to stop watching for new Event Logs. WatchEventReturnType

###### Remarks

This Action will batch up all the Event Logs found within the [`pollingInterval`](https://viem.sh/docs/actions/public/watchEvent#pollinginterval-optional), and invoke them via [`onLogs`](https://viem.sh/docs/actions/public/watchEvent#onLogs).

`watchEvent` will attempt to create an [Event Filter](https://viem.sh/docs/actions/public/createEventFilter) and listen to changes to the Filter per polling interval, however, if the RPC Provider does not support Filters (e.g. `eth_newFilter`), then `watchEvent` will fall back to using [`getLogs`](https://viem.sh/docs/actions/public/getLogs) instead.

###### Example

```ts
import { createPublicClient, http } from 'viem'
import { mainnet } from 'viem/chains'

const client = createPublicClient({
  chain: mainnet,
  transport: http(),
})
const unwatch = client.watchEvent({
  onLogs: (logs) => console.log(logs),
})
```

##### watchPendingTransactions()

> **watchPendingTransactions**: (`args`) => `WatchPendingTransactionsReturnType`

Watches and returns pending transaction hashes.

- Docs: https://viem.sh/docs/actions/public/watchPendingTransactions
- JSON-RPC Methods:
  - When `poll: true`
    - Calls [`eth_newPendingTransactionFilter`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_newpendingtransactionfilter) to initialize the filter.
    - Calls [`eth_getFilterChanges`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_getFilterChanges) on a polling interval.
  - When `poll: false` & WebSocket Transport, uses a WebSocket subscription via [`eth_subscribe`](https://docs.alchemy.com/reference/eth-subscribe-polygon) and the `"newPendingTransactions"` event.

###### Parameters

###### args

`WatchPendingTransactionsParameters`\<`Transport`\>

WatchPendingTransactionsParameters

###### Returns

`WatchPendingTransactionsReturnType`

A function that can be invoked to stop watching for new pending transaction hashes. WatchPendingTransactionsReturnType

###### Remarks

This Action will batch up all the pending transactions found within the [`pollingInterval`](https://viem.sh/docs/actions/public/watchPendingTransactions#pollinginterval-optional), and invoke them via [`onTransactions`](https://viem.sh/docs/actions/public/watchPendingTransactions#ontransactions).

###### Example

```ts
import { createPublicClient, http } from 'viem'
import { mainnet } from 'viem/chains'

const client = createPublicClient({
  chain: mainnet,
  transport: http(),
})
const unwatch = await client.watchPendingTransactions({
  onTransactions: (hashes) => console.log(hashes),
})
```

***

### getQuote()

> **getQuote**(`params`): `Promise`\<[`Quote`](../type-aliases/Quote.md)\>

Defined in: [packages/sdk/src/client.ts:619](https://github.com/across-protocol/toolkit/blob/6b29eb5487c0ac0b498f1f420b1793303bd8b70a/packages/sdk/src/client.ts#L619)

Get a quote for a given set of parameters. See [getQuote](../functions/getQuote.md).

#### Parameters

##### params

[`MakeOptional`](../type-aliases/MakeOptional.md)\<[`GetQuoteParams`](../type-aliases/GetQuoteParams.md), `"logger"` \| `"apiUrl"`\>

See [GetQuoteParams](../type-aliases/GetQuoteParams.md).

#### Returns

`Promise`\<[`Quote`](../type-aliases/Quote.md)\>

See [Quote](../type-aliases/Quote.md).

***

### getSpokePoolAddress()

> **getSpokePoolAddress**(`chainId`): `Promise`\<`` `0x${string}` ``\>

Defined in: [packages/sdk/src/client.ts:255](https://github.com/across-protocol/toolkit/blob/6b29eb5487c0ac0b498f1f420b1793303bd8b70a/packages/sdk/src/client.ts#L255)

#### Parameters

##### chainId

`number`

#### Returns

`Promise`\<`` `0x${string}` ``\>

***

### getSuggestedFees()

> **getSuggestedFees**(`params`): `Promise`\<[`GetSuggestedFeesReturnType`](../type-aliases/GetSuggestedFeesReturnType.md)\>

Defined in: [packages/sdk/src/client.ts:542](https://github.com/across-protocol/toolkit/blob/6b29eb5487c0ac0b498f1f420b1793303bd8b70a/packages/sdk/src/client.ts#L542)

Get the suggested fees for a given route. See [getSuggestedFees](../functions/getSuggestedFees.md).

#### Parameters

##### params

[`MakeOptional`](../type-aliases/MakeOptional.md)\<[`GetSuggestedFeesParams`](../type-aliases/GetSuggestedFeesParams.md), `"logger"` \| `"apiUrl"`\>

See [GetSuggestedFeesParams](../type-aliases/GetSuggestedFeesParams.md).

#### Returns

`Promise`\<[`GetSuggestedFeesReturnType`](../type-aliases/GetSuggestedFeesReturnType.md)\>

See [GetSuggestedFeesReturnType](../type-aliases/GetSuggestedFeesReturnType.md).

***

### getSupportedChains()

> **getSupportedChains**(`params`): `Promise`\<[`ChainsQueryResponse`](../type-aliases/ChainsQueryResponse.md)\>

Defined in: [packages/sdk/src/client.ts:915](https://github.com/across-protocol/toolkit/blob/6b29eb5487c0ac0b498f1f420b1793303bd8b70a/packages/sdk/src/client.ts#L915)

#### Parameters

##### params

[`MakeOptional`](../type-aliases/MakeOptional.md)\<[`GetSupportedChainsParams`](../type-aliases/GetSupportedChainsParams.md), `"logger"` \| `"apiUrl"`\>

#### Returns

`Promise`\<[`ChainsQueryResponse`](../type-aliases/ChainsQueryResponse.md)\>

***

### getSwapChains()

> **getSwapChains**(`params`): `Promise`\<[`GetSwapChainsReturnType`](../type-aliases/GetSwapChainsReturnType.md)\>

Defined in: [packages/sdk/src/client.ts:527](https://github.com/across-protocol/toolkit/blob/6b29eb5487c0ac0b498f1f420b1793303bd8b70a/packages/sdk/src/client.ts#L527)

Get the available chains from the swap API. See [getSwapChains](../functions/getSwapChains.md).

#### Parameters

##### params

[`MakeOptional`](../type-aliases/MakeOptional.md)\<[`GetSwapChainsParams`](../type-aliases/GetSwapChainsParams.md), `"logger"` \| `"apiUrl"`\> = `{}`

See [GetSwapChainsParams](../type-aliases/GetSwapChainsParams.md).

#### Returns

`Promise`\<[`GetSwapChainsReturnType`](../type-aliases/GetSwapChainsReturnType.md)\>

See [GetSwapChainsReturnType](../type-aliases/GetSwapChainsReturnType.md).

***

### getSwapQuote()

> **getSwapQuote**(`params`): `Promise`\<\{ `amountType`: `string`; `approvalTxns?`: `object`[]; `checks`: \{ `allowance`: \{ `actual`: `string`; `expected`: `string`; `spender`: `string`; `token`: `string`; \}; `balance`: \{ `actual`: `string`; `expected`: `string`; `token`: `string`; \}; \}; `crossSwapType`: `string`; `expectedFillTime`: `number`; `expectedOutputAmount`: `string`; `fees`: \{ `app`: \{ `amount`: `string`; `amountUsd`: `string`; `pct`: `string`; `token`: \{ `address`: `string`; `chainId`: `number`; `decimals`: `number`; `symbol`: `string`; \}; \}; `destinationGas`: \{ `amount`: `string`; `amountUsd`: `string`; `pct`: `string`; `token`: \{ `address`: `string`; `chainId`: `number`; `decimals`: `number`; `symbol`: `string`; \}; \}; `lpFee`: \{ `amount`: `string`; `amountUsd`: `string`; `pct`: `string`; `token`: \{ `address`: `string`; `chainId`: `number`; `decimals`: `number`; `symbol`: `string`; \}; \}; `originGas`: \{ `amount`: `string`; `amountUsd`: `string`; `token`: \{ `address`: `string`; `chainId`: `number`; `decimals`: `number`; `symbol`: `string`; \}; \}; `relayerCapital`: \{ `amount`: `string`; `amountUsd`: `string`; `pct`: `string`; `token`: \{ `address`: `string`; `chainId`: `number`; `decimals`: `number`; `symbol`: `string`; \}; \}; `relayerTotal`: \{ `amount`: `string`; `amountUsd`: `string`; `pct`: `string`; `token`: \{ `address`: `string`; `chainId`: `number`; `decimals`: `number`; `symbol`: `string`; \}; \}; `total`: \{ `amount`: `string`; `amountUsd`: `string`; `pct`: `string`; `token`: \{ `address`: `string`; `chainId`: `number`; `decimals`: `number`; `symbol`: `string`; \}; \}; \}; `id?`: `string`; `inputAmount`: `string`; `inputToken`: \{ `address`: `string`; `chainId`: `number`; `decimals`: `number`; `name?`: `string`; `symbol`: `string`; \}; `minOutputAmount`: `string`; `outputToken`: \{ `address`: `string`; `chainId`: `number`; `decimals`: `number`; `name?`: `string`; `symbol`: `string`; \}; `refundToken`: \{ `address`: `string`; `chainId`: `number`; `decimals`: `number`; `name?`: `string`; `symbol`: `string`; \}; `steps`: \{ `bridge`: \{ `fees`: \{ `lp`: \{ `pct`: `string`; `total`: `string`; \}; `relayerCapital`: \{ `pct`: `string`; `total`: `string`; \}; `relayerGas`: \{ `pct`: `string`; `total`: `string`; \}; `totalRelay`: \{ `pct`: `string`; `total`: `string`; \}; \}; `inputAmount`: `string`; `outputAmount`: `string`; `tokenIn`: \{ `address`: `string`; `chainId`: `number`; `decimals`: `number`; `name?`: `string`; `symbol`: `string`; \}; `tokenOut`: \{ `address`: `string`; `chainId`: `number`; `decimals`: `number`; `name?`: `string`; `symbol`: `string`; \}; \}; `destinationSwap?`: \{ `inputAmount`: `string`; `maxInputAmount`: `string`; `minOutputAmount`: `string`; `outputAmount`: `string`; `swapProvider`: \{ `name`: `string`; `sources`: `string`[]; \}; `tokenIn`: \{ `address`: `string`; `chainId`: `number`; `decimals`: `number`; `symbol`: `string`; \}; `tokenOut`: \{ `address`: `string`; `chainId`: `number`; `decimals`: `number`; `symbol`: `string`; \}; \}; `originSwap?`: \{ `inputAmount`: `string`; `maxInputAmount`: `string`; `minOutputAmount`: `string`; `outputAmount`: `string`; `swapProvider`: \{ `name`: `string`; `sources`: `string`[]; \}; `tokenIn`: \{ `address`: `string`; `chainId`: `number`; `decimals`: `number`; `symbol`: `string`; \}; `tokenOut`: \{ `address`: `string`; `chainId`: `number`; `decimals`: `number`; `symbol`: `string`; \}; \}; \}; `swapTx?`: \{ `chainId`: `number`; `data`: `string`; `gas?`: `string`; `maxFeePerGas?`: `string`; `maxPriorityFeePerGas?`: `string`; `simulationSuccess`: `boolean`; `to`: `string`; `value?`: `string`; \} \| \{ `eip712`: \{ `domain`: \{ `chainId`: `number`; `name`: `string`; `verifyingContract`: `string`; `version`: `string`; \}; `types`: `Record`\<`string`, `object`[]\>; `value`: `Record`\<`string`, `any`\>; \}; `swapTx`: \{ `chainId`: `number`; `data`: `string`; `gas?`: `string`; `maxFeePerGas?`: `string`; `maxPriorityFeePerGas?`: `string`; `simulationSuccess`: `boolean`; `to`: `string`; `value?`: `string`; \}; \}; \}\>

Defined in: [packages/sdk/src/client.ts:657](https://github.com/across-protocol/toolkit/blob/6b29eb5487c0ac0b498f1f420b1793303bd8b70a/packages/sdk/src/client.ts#L657)

Get a swap quote for a given set of parameters. See [getSwapQuote](../functions/getSwapQuote.md).

#### Parameters

##### params

[`MakeOptional`](../type-aliases/MakeOptional.md)\<[`GetSwapQuoteParams`](../type-aliases/GetSwapQuoteParams.md), `"logger"` \| `"apiUrl"`\>

See [GetSwapQuoteParams](../type-aliases/GetSwapQuoteParams.md).

#### Returns

`Promise`\<\{ `amountType`: `string`; `approvalTxns?`: `object`[]; `checks`: \{ `allowance`: \{ `actual`: `string`; `expected`: `string`; `spender`: `string`; `token`: `string`; \}; `balance`: \{ `actual`: `string`; `expected`: `string`; `token`: `string`; \}; \}; `crossSwapType`: `string`; `expectedFillTime`: `number`; `expectedOutputAmount`: `string`; `fees`: \{ `app`: \{ `amount`: `string`; `amountUsd`: `string`; `pct`: `string`; `token`: \{ `address`: `string`; `chainId`: `number`; `decimals`: `number`; `symbol`: `string`; \}; \}; `destinationGas`: \{ `amount`: `string`; `amountUsd`: `string`; `pct`: `string`; `token`: \{ `address`: `string`; `chainId`: `number`; `decimals`: `number`; `symbol`: `string`; \}; \}; `lpFee`: \{ `amount`: `string`; `amountUsd`: `string`; `pct`: `string`; `token`: \{ `address`: `string`; `chainId`: `number`; `decimals`: `number`; `symbol`: `string`; \}; \}; `originGas`: \{ `amount`: `string`; `amountUsd`: `string`; `token`: \{ `address`: `string`; `chainId`: `number`; `decimals`: `number`; `symbol`: `string`; \}; \}; `relayerCapital`: \{ `amount`: `string`; `amountUsd`: `string`; `pct`: `string`; `token`: \{ `address`: `string`; `chainId`: `number`; `decimals`: `number`; `symbol`: `string`; \}; \}; `relayerTotal`: \{ `amount`: `string`; `amountUsd`: `string`; `pct`: `string`; `token`: \{ `address`: `string`; `chainId`: `number`; `decimals`: `number`; `symbol`: `string`; \}; \}; `total`: \{ `amount`: `string`; `amountUsd`: `string`; `pct`: `string`; `token`: \{ `address`: `string`; `chainId`: `number`; `decimals`: `number`; `symbol`: `string`; \}; \}; \}; `id?`: `string`; `inputAmount`: `string`; `inputToken`: \{ `address`: `string`; `chainId`: `number`; `decimals`: `number`; `name?`: `string`; `symbol`: `string`; \}; `minOutputAmount`: `string`; `outputToken`: \{ `address`: `string`; `chainId`: `number`; `decimals`: `number`; `name?`: `string`; `symbol`: `string`; \}; `refundToken`: \{ `address`: `string`; `chainId`: `number`; `decimals`: `number`; `name?`: `string`; `symbol`: `string`; \}; `steps`: \{ `bridge`: \{ `fees`: \{ `lp`: \{ `pct`: `string`; `total`: `string`; \}; `relayerCapital`: \{ `pct`: `string`; `total`: `string`; \}; `relayerGas`: \{ `pct`: `string`; `total`: `string`; \}; `totalRelay`: \{ `pct`: `string`; `total`: `string`; \}; \}; `inputAmount`: `string`; `outputAmount`: `string`; `tokenIn`: \{ `address`: `string`; `chainId`: `number`; `decimals`: `number`; `name?`: `string`; `symbol`: `string`; \}; `tokenOut`: \{ `address`: `string`; `chainId`: `number`; `decimals`: `number`; `name?`: `string`; `symbol`: `string`; \}; \}; `destinationSwap?`: \{ `inputAmount`: `string`; `maxInputAmount`: `string`; `minOutputAmount`: `string`; `outputAmount`: `string`; `swapProvider`: \{ `name`: `string`; `sources`: `string`[]; \}; `tokenIn`: \{ `address`: `string`; `chainId`: `number`; `decimals`: `number`; `symbol`: `string`; \}; `tokenOut`: \{ `address`: `string`; `chainId`: `number`; `decimals`: `number`; `symbol`: `string`; \}; \}; `originSwap?`: \{ `inputAmount`: `string`; `maxInputAmount`: `string`; `minOutputAmount`: `string`; `outputAmount`: `string`; `swapProvider`: \{ `name`: `string`; `sources`: `string`[]; \}; `tokenIn`: \{ `address`: `string`; `chainId`: `number`; `decimals`: `number`; `symbol`: `string`; \}; `tokenOut`: \{ `address`: `string`; `chainId`: `number`; `decimals`: `number`; `symbol`: `string`; \}; \}; \}; `swapTx?`: \{ `chainId`: `number`; `data`: `string`; `gas?`: `string`; `maxFeePerGas?`: `string`; `maxPriorityFeePerGas?`: `string`; `simulationSuccess`: `boolean`; `to`: `string`; `value?`: `string`; \} \| \{ `eip712`: \{ `domain`: \{ `chainId`: `number`; `name`: `string`; `verifyingContract`: `string`; `version`: `string`; \}; `types`: `Record`\<`string`, `object`[]\>; `value`: `Record`\<`string`, `any`\>; \}; `swapTx`: \{ `chainId`: `number`; `data`: `string`; `gas?`: `string`; `maxFeePerGas?`: `string`; `maxPriorityFeePerGas?`: `string`; `simulationSuccess`: `boolean`; `to`: `string`; `value?`: `string`; \}; \}; \}\>

See SwapApprovalApiResponse.

***

### getSwapTokens()

> **getSwapTokens**(`params`): `Promise`\<[`GetSwapTokensReturnType`](../type-aliases/GetSwapTokensReturnType.md)\>

Defined in: [packages/sdk/src/client.ts:512](https://github.com/across-protocol/toolkit/blob/6b29eb5487c0ac0b498f1f420b1793303bd8b70a/packages/sdk/src/client.ts#L512)

Get available tokens from the swap API. See [getSwapTokens](../functions/getSwapTokens.md).

#### Parameters

##### params

[`MakeOptional`](../type-aliases/MakeOptional.md)\<`Partial`\<\{ `apiUrl`: `string`; `chainId`: `number`; `logger`: [`LoggerT`](../type-aliases/LoggerT.md); \}\>, `"logger"` \| `"apiUrl"`\> = `{}`

See [GetSwapTokensParams](../type-aliases/GetSwapTokensParams.md).

#### Returns

`Promise`\<[`GetSwapTokensReturnType`](../type-aliases/GetSwapTokensReturnType.md)\>

See [GetSwapTokensReturnType](../type-aliases/GetSwapTokensReturnType.md).

***

### signUpdateDepositTypedData()

> **signUpdateDepositTypedData**(`params`): `Promise`\<`` `0x${string}` ``\>

Defined in: [packages/sdk/src/client.ts:813](https://github.com/across-protocol/toolkit/blob/6b29eb5487c0ac0b498f1f420b1793303bd8b70a/packages/sdk/src/client.ts#L813)

#### Parameters

##### params

[`MakeOptional`](../type-aliases/MakeOptional.md)\<[`SignUpdateDepositTypedDataParams`](../type-aliases/SignUpdateDepositTypedDataParams.md), `"walletClient"`\>

#### Returns

`Promise`\<`` `0x${string}` ``\>

***

### simulateDepositTx()

> **simulateDepositTx**(`params`): `Promise`\<`SimulateContractReturnType`\>

Defined in: [packages/sdk/src/client.ts:691](https://github.com/across-protocol/toolkit/blob/6b29eb5487c0ac0b498f1f420b1793303bd8b70a/packages/sdk/src/client.ts#L691)

#### Parameters

##### params

[`MakeOptional`](../type-aliases/MakeOptional.md)\<[`SimulateDepositTxParams`](../type-aliases/SimulateDepositTxParams.md), `"logger"` \| `"integratorId"` \| `"publicClient"`\>

#### Returns

`Promise`\<`SimulateContractReturnType`\>

***

### simulateTxOnTenderly()

> **simulateTxOnTenderly**(`params`): `Promise`\<\{ `simulationId`: `string`; `simulationUrl`: `string`; \}\>

Defined in: [packages/sdk/src/client.ts:925](https://github.com/across-protocol/toolkit/blob/6b29eb5487c0ac0b498f1f420b1793303bd8b70a/packages/sdk/src/client.ts#L925)

#### Parameters

##### params

[`MakeOptional`](../type-aliases/MakeOptional.md)\<[`TenderlySimulateTxParams`](../type-aliases/TenderlySimulateTxParams.md), `"accessKey"` \| `"accountSlug"` \| `"enableShare"` \| `"projectSlug"`\>

#### Returns

`Promise`\<\{ `simulationId`: `string`; `simulationUrl`: `string`; \}\>

***

### simulateUpdateDepositTx()

> **simulateUpdateDepositTx**(`params`): `Promise`\<`SimulateContractReturnType`\>

Defined in: [packages/sdk/src/client.ts:766](https://github.com/across-protocol/toolkit/blob/6b29eb5487c0ac0b498f1f420b1793303bd8b70a/packages/sdk/src/client.ts#L766)

This function simulates the update of a deposit on the origin chain. Can be used to
update:
- the recipient address
- the output amount, i.e. the fees
- the cross-chain message

Note that this requires a signature from the depositor.

See [simulateUpdateDepositTx](../functions/simulateUpdateDepositTx.md).

#### Parameters

##### params

[`MakeOptional`](../type-aliases/MakeOptional.md)\<[`SimulateUpdateDepositTxParams`](../type-aliases/SimulateUpdateDepositTxParams.md), `"logger"` \| `"apiUrl"` \| `"destinationChainClient"` \| `"originChainClient"`\>

See [SimulateUpdateDepositTxParams](../type-aliases/SimulateUpdateDepositTxParams.md).

#### Returns

`Promise`\<`SimulateContractReturnType`\>

The result of the simulation.

#### Example

```ts
const result = await client.simulateUpdateDepositTx({
  deposit: {
    // deposit details
  },
  update: {
    recipient: "0xNEW_RECIPIENT_ADDRESS",
  },
 });
const txHash = await walletClient.writeContract({
  account,
  ...txRequest,
});
```

***

### update()

> **update**(`params`): `void`

Defined in: [packages/sdk/src/client.ts:239](https://github.com/across-protocol/toolkit/blob/6b29eb5487c0ac0b498f1f420b1793303bd8b70a/packages/sdk/src/client.ts#L239)

#### Parameters

##### params

`Pick`\<[`AcrossClientOptions`](../type-aliases/AcrossClientOptions.md), `"walletClient"`\>

#### Returns

`void`

***

### waitForDepositTx()

> **waitForDepositTx**(`params`): `Promise`\<[`DepositStatus`](../type-aliases/DepositStatus.md)\>

Defined in: [packages/sdk/src/client.ts:826](https://github.com/across-protocol/toolkit/blob/6b29eb5487c0ac0b498f1f420b1793303bd8b70a/packages/sdk/src/client.ts#L826)

#### Parameters

##### params

[`MakeOptional`](../type-aliases/MakeOptional.md)\<[`WaitForDepositTxParams`](../type-aliases/WaitForDepositTxParams.md), `"publicClient"`\>

#### Returns

`Promise`\<[`DepositStatus`](../type-aliases/DepositStatus.md)\>

***

### waitForFillTx()

> **waitForFillTx**(`params`): `Promise`\<[`FillStatus`](../type-aliases/FillStatus.md)\>

Defined in: [packages/sdk/src/client.ts:857](https://github.com/across-protocol/toolkit/blob/6b29eb5487c0ac0b498f1f420b1793303bd8b70a/packages/sdk/src/client.ts#L857)

#### Parameters

##### params

[`MakeOptional`](../type-aliases/MakeOptional.md)\<[`WaitForFillTxParams`](../type-aliases/WaitForFillTxParams.md), `"destinationChainClient"`\>

#### Returns

`Promise`\<[`FillStatus`](../type-aliases/FillStatus.md)\>

***

### create()

> `static` **create**(`options`): `AcrossClient`

Defined in: [packages/sdk/src/client.ts:218](https://github.com/across-protocol/toolkit/blob/6b29eb5487c0ac0b498f1f420b1793303bd8b70a/packages/sdk/src/client.ts#L218)

Create a new `AcrossClient` instance as a singleton.

#### Parameters

##### options

[`AcrossClientOptions`](../type-aliases/AcrossClientOptions.md)

See [AcrossClientOptions](../type-aliases/AcrossClientOptions.md).

#### Returns

`AcrossClient`

A new `AcrossClient` instance if it doesn't exist, otherwise the existing
instance.

***

### getInstance()

> `static` **getInstance**(): `AcrossClient`

Defined in: [packages/sdk/src/client.ts:230](https://github.com/across-protocol/toolkit/blob/6b29eb5487c0ac0b498f1f420b1793303bd8b70a/packages/sdk/src/client.ts#L230)

Get the existing `AcrossClient` singleton instance.

#### Returns

`AcrossClient`

The existing `AcrossClient` instance.

#### Throws

If the instance is not initialized.
