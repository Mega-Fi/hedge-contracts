# ABI Reference – `packages/herge/abi/contracts`

This guide catalogues every ABI artifact generated for the **Herge** Solidity contracts.  Use it as a quick reference when wiring frontends, scripts, or verification tools.  Paths shown below are relative to `packages/herge/abi/contracts/`.

---

## 1. Core Protocol Contracts

| Contract | ABI Path | What it Covers |
| --- | --- | --- |
| `CoverPool` | `CoverPool.sol/CoverPool.json` | HEGIC staking pool, USDC backstop, epoch management, liquidity accounting |
| `ICoverPool` | `ICoverPool.sol/ICoverPool.json` | Minimal interface (provide/withdraw/claim, payout hooks) |
| `IOperationalTreasury` | `IOperationalTreasury.sol/IOperationalTreasury.json` | Public view + event schema for treasury integration |
| `MainPool` | `MainPool.sol/MainPool.json` | Thin proxy contract used in some deployments (pool of pools) |
| `OperationalTreasury` | `OperationalTreasury.sol/OperationalTreasury.json` | Option lifecycle hub (buy, payOff, limits, NFT minting) |
| `PositionsManager` | `PositionsManager.sol/PositionsManager.json` | ERC‑721 NFT minter for positions |
| `IPositionsManager` | `PositionsManager/IPositionsManager.sol/IPositionsManager.json` | Minimal external interface used by treasury/strategies |
| `ProfitDistributor` | `ProfitDistributor.sol/ProfitDistributor.json` | Distributes USDC profits from strategies to LPs |

### Notes
- **CoverPool** and **OperationalTreasury** ABIs include extensive AccessControl functions (`grantRole`, `revokeRole`, etc.).
- Use `I*` ABI variants for lightweight read-only clients or to reduce bundle size.

---

## 2. Strategy Base Contracts

| Contract | ABI Path | Highlights |
| --- | --- | --- |
| `HegicStrategy` | `Strategies/HegicStrategy.sol/HegicStrategy.json` | Abstract base with `create`, `payOffAmount`, `setLimit`, period bounds |
| `HegicInverseStrategy` | `Strategies/HegicInverseStrategy.sol/HegicInverseStrategy.json` | Adds `EXERCISER_ROLE` support for inverse positions |
| `IHegicStrategy` | `Strategies/IHegicStrategy.sol/IHegicStrategy.json` | Minimal client interface |
| `IHegicInverseStrategy` | `Strategies/IHegicInverseStrategy.sol/IHegicInverseStrategy.json` | Minimal interface specific to inverse variants |
| `LimitController` | `Strategies/LimitController.sol/LimitController.json` | Global liquidity ceilings and treasury linkage |
| `ProfitCalculator` | `Strategies/ProfitCalculator.sol/ProfitCalculator.json` | Pure-library ABI (for static call usage) |

👉 **Need the ABI for a specific deployed address?**  
See the auto-generated matrix: [`ABI_ADDRESS_INDEX.md`](./ABI_ADDRESS_INDEX.md) (255 entries, each linking directly to its JSON ABI).

---

## 3. Strategy Implementations

All concrete strategies share the `create`, `payOffAmount`, `lockedLimit`, and admin setters inherited from `HegicStrategy`.  Functionality differs in payoff math and strike selection.

| Strategy Type | ABI Path | Description |
| --- | --- | --- |
| **Call (100% spot)** | `Strategies/HegicStrategyCall.sol/HegicStrategyCall.json` | Vanilla long calls with optional price scaling |
| **Put (100% spot)** | `Strategies/HegicStrategyPut.sol/HegicStrategyPut.json` | Vanilla long puts |
| **Spread Call** | `Strategies/HegicStrategySpreadCall.sol/HegicStrategySpreadCall.json` | Bull call spread (long/short strikes) |
| **Spread Put** | `Strategies/HegicStrategySpreadPut.sol/HegicStrategySpreadPut.json` | Bear put spread |
| **Straddle** | `Strategies/HegicStrategyStraddle.sol/HegicStrategyStraddle.json` | Long call + long put at same strike |
| **Strangle (±10/20/30%)** | `Strategies/HegicStrategyStrangle.sol/HegicStrategyStrangle.json` | Long call & put with OTM strikes; % encoded in additional data |
| **Strap** | `Strategies/HegicStrategyStrap.sol/HegicStrategyStrap.json` | 2× call + 1× put (bullish volatility) |
| **Strip** | `Strategies/HegicStrategyStrip.sol/HegicStrategyStrip.json` | 1× call + 2× put (bearish volatility) |
| **Inverse Bear Call Spread** | `Strategies/HegicStrategyInverseBearCallSpread.sol/HegicStrategyInverseBearCallSpread.json` | Short bear call spread (collect premium if price stays below upper strike) |
| **Inverse Bull Put Spread** | `Strategies/HegicStrategyInverseBullPutSpread.sol/HegicStrategyInverseBullPutSpread.json` | Short bull put spread |
| **Inverse Long Butterfly** | `Strategies/HegicStrategyInverseLongButterfly.sol/HegicStrategyInverseLongButterfly.json` | Short butterfly (profit if price moves away from center strike) |
| **Inverse Long Condor** | `Strategies/HegicStrategyInverseLongCondor.sol/HegicStrategyInverseLongCondor.json` | Short condor (wider body than butterfly) |

> **Tip:** Strategy ABIs can be reused for every variant (ETH/BTC, 7/14/30-day) because logic is identical; addresses differ only by deployment configuration.

---

## 4. Supporting Interfaces & Libraries

| Contract | ABI Path | Purpose |
| --- | --- | --- |
| `ICoverPool` | `ICoverPool.sol/ICoverPool.json` | External interface for the Cover Pool |
| `IOperationalTreasury` | `IOperationalTreasury.sol/IOperationalTreasury.json` | External interface for treasury reads |
| `MainPool` | `MainPool.sol/MainPool.json` | Convenience wrapper (legacy compatibility) |

Additionally, third-party ABIs under `@openzeppelin`, `@hegic`, and `@chainlink` provide ERC standards, utils, and oracle interfaces.

---

## 5. How to Consume These ABIs

```ts
import CoverPoolABI from "../abi/contracts/CoverPool.sol/CoverPool.json";

const coverPool = new ethers.Contract(
  "0x7174d…1C5b",
  CoverPoolABI,
  signerOrProvider
);

await coverPool.provide(amount, positionId);
```

- **TypeChain users** already receive TS typings under `packages/herge/typechain/`, but these JSON artifacts are handy for external clients or manual verification.
- ABI paths mirror the Solidity file structure, making it easy to locate the correct artifact by contract name.

---

## 6. Keeping the Reference Current

- Regenerate by running `npx hardhat compile` (ABIs output to `abi/…`).
- Refresh the per-address index with `node scripts/generate-abi-index.js`.
- When adding new contracts, ensure the ABI tree stays in sync and update this document with contract name, path, and purpose.

---

**Last Updated:** 2025-11-11


