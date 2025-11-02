# USDC-Only Model Configuration Changes

## Overview
Successfully converted Hegic Protocol deployment from HEGIC token model to **USDC-only model** where:
- **LPs deposit USDC** (not HEGIC) to provide liquidity
- **LPs earn USDC** profits from option premiums
- **1:1 ratio** (no token conversion needed)
- **Zero capital launch** possible - Treasury builds naturally from premiums

---

## Files Modified

### ✅ 1. `packages/herge/deploy/02_cover_pool.ts`

**Changes Made:**
- Changed `coverToken` from HEGIC to USDC
- Changed `changingPrice` from ~0.0083 to 1e30 (1:1 ratio)
- Removed HEGIC token dependency

**Before:**
```typescript
const [USDC, HEGIC] = await Promise.all(["USDC", "HEGIC"].map(get))
const changingPrice = parseUnits(".0083", 18) // or parseUnits(".01", 18)

await deploy("CoverPool", {
  args: [HEGIC.address, USDC.address, payoffPool, changingPrice]
  //     ^^^^^^^^^^^^^ coverToken
  //                    ^^^^^^^^^^^^ profitToken
})
```

**After:**
```typescript
const USDC = await get("USDC")  // Only need USDC!
const changingPrice = parseUnits("1", 30)  // 1:1 ratio

await deploy("CoverPool", {
  args: [USDC.address, USDC.address, payoffPool, changingPrice]
  //     ^^^^^^^^^^^^ coverToken = USDC
  //                  ^^^^^^^^^^^^ profitToken = USDC
})
```

---

### ✅ 2. `packages/herge/deploy/00_tokens.ts`

**Changes Made:**
- Commented out HEGIC token deployments for all networks
- Added clear documentation about USDC-only model
- Kept HEGIC deployment available as commented code (for reference/testing original model)

**Key Changes:**

**Arbitrum Network:**
- USDC: ✅ Active (0xff970a61a04b1ca14834a43f5de4533ebddb5cc8)
- HEGIC: ❌ Commented out (not needed)

**Test Networks (localhost, hardhat, etc.):**
- USDC Mock: ✅ Deployed
- WETH Mock: ✅ Deployed (needed for price oracles)
- WBTC Mock: ✅ Deployed (needed for price oracles)
- HEGIC Mock: ❌ Commented out (not needed)

---

### ✅ 3. `packages/herge/deploy/08_init_pools.ts`

**Changes Made:**
- Changed approval from HEGIC to USDC for payoff pool
- Updated all initialization examples to use USDC instead of HEGIC
- Fixed decimal precision (6 decimals for USDC vs 18 for HEGIC)
- Added comprehensive comments explaining USDC-only model

**Key Changes:**

**Active Code:**
```typescript
// BEFORE: await execute("HEGIC", {from: payoffPool}, "approve", ...)
// AFTER:
await execute("USDC", {from: payoffPool}, "approve", CoverPool.address, constants.MaxUint256)
```

**Commented Initialization Examples (for testing):**
```typescript
// Mint USDC to users (not HEGIC)
await execute("USDC", {from: deployer}, "mint", alice, parseUnits("1000000", 6))

// Approve USDC (not HEGIC)
await execute("USDC", {from: alice}, "approve", CoverPool.address, constants.MaxUint256)

// Provide USDC liquidity (not HEGIC) - note the 6 decimals!
await execute("CoverPool", {from: deployer}, "provide", parseUnits("10000000", 6), 0)
```

---

## Impact on Deployment Flow

### 📋 Deployment Order (Unchanged)
The deployment order remains the same:

1. ✅ `00_tokens.ts` - Deploy/reference USDC (HEGIC removed)
2. ✅ `01_price_providers.ts` - Deploy Chainlink oracles (no changes needed)
3. ✅ `02_cover_pool.ts` - Deploy CoverPool with USDC/USDC (MODIFIED)
4. ✅ `03_distributor.ts` - Deploy profit distributor (no changes needed)
5. ✅ `04_positions_manager.ts` - Deploy PositionsManager (no changes needed)
6. ✅ `05_profit_calculator.ts` - Deploy ProfitCalculator (no changes needed)
7. ✅ `06_strategies/*.ts` - Deploy all strategies (no changes needed)
8. ✅ `07_operational_treasury.ts` - Deploy OperationalTreasury (no changes needed)
9. ✅ `08_init_pools.ts` - Initialize with USDC (MODIFIED)

---

## Configuration Parameters

### CoverPool Configuration

| Parameter | Original Value | USDC-Only Value | Notes |
|-----------|---------------|-----------------|-------|
| `coverToken` | HEGIC address | USDC address | LPs deposit USDC |
| `profitToken` | USDC address | USDC address | No change |
| `changingPrice` | 0.0083e18 - 0.01e18 | 1e30 | 1:1 ratio |

### Epoch Configuration (No Changes)

| Parameter | Value |
|-----------|-------|
| `windowSize` | 5 days (432000 seconds) |
| `MINIMAL_EPOCH_DURATION` | 7 days (hardcoded) |

### Treasury Configuration (No Changes)

| Parameter | Recommended Value |
|-----------|-------------------|
| `maxLockupPeriod` | 30 days (2592000 seconds) |
| `benchmark` | 0 USDC (zero-capital start) |

---

## Testing Implications

### Test Networks (localhost, hardhat)

**What Works:**
- ✅ USDC mock automatically deployed
- ✅ CoverPool deploys with USDC/USDC
- ✅ LPs can deposit USDC mock tokens
- ✅ All strategies work (settle in USDC)

**What to Do for Testing:**
1. Uncomment initialization code in `08_init_pools.ts`
2. Mint USDC to test accounts
3. Approve and provide USDC to CoverPool
4. Test option purchases (premiums in USDC)
5. Test payoffs (settle in USDC)

### Mainnet/Arbitrum Deployment

**Requirements:**
- ✅ USDC address: 0xff970a61a04b1ca14834a43f5de4533ebddb5cc8 (Arbitrum)
- ✅ NO HEGIC token needed
- ✅ Deployer must have ETH for gas
- ✅ LPs must have USDC to provide liquidity

**Flow:**
1. Deploy all contracts
2. LPs deposit USDC to CoverPool
3. Treasury starts at 0 USDC
4. Users buy options (pay premium in USDC)
5. Premiums build Treasury
6. Profits distributed to LPs in USDC

---

## Key Benefits of USDC-Only Model

### ✅ Simplified Economics
- No dual-token complexity
- No token conversion calculations
- Clear 1:1 accounting

### ✅ Better UX
- LPs: "Deposit USDC → Earn USDC"
- No need to acquire HEGIC token
- Direct stablecoin exposure

### ✅ Zero Capital Launch
- Start with 0 USDC in Treasury
- Attract LPs with yield opportunity
- Treasury grows from option premiums

### ✅ Risk Management
- Single stablecoin reduces volatility
- No HEGIC price risk
- Transparent capital requirements

---

## What Changed vs Original Hegic

### Original Hegic Model
```
LPs: Stake HEGIC → Treasury holds USDC → Options settle in USDC
     ↓
Convert HEGIC to USDC when needed (changingPrice mechanism)
```

### USDC-Only Model
```
LPs: Stake USDC → Treasury holds USDC → Options settle in USDC
     ↓
No conversion needed (1:1 accounting)
```

---

## Files NOT Changed (But Verified Compatible)

### ✅ Core Contracts (Already USDC-based)
- `contracts/OperationalTreasury.sol` - Uses USDC for settlements ✅
- `contracts/Strategies/*.sol` - Price and settle in USDC ✅
- `contracts/PositionsManager.sol` - Token-agnostic NFT manager ✅
- `contracts/ProfitCalculator.sol` - Calculates in USDC ✅

### ✅ Other Deployment Scripts
- `01_price_providers.ts` - Chainlink oracles (unchanged) ✅
- `03_distributor.ts` - Profit distribution (unchanged) ✅
- `04_positions_manager.ts` - NFT manager (unchanged) ✅
- `05_profit_calculator.ts` - Library (unchanged) ✅
- `06_strategies/*.ts` - Strategy deployments (unchanged) ✅
- `07_operational_treasury.ts` - Treasury deployment (unchanged) ✅

---

## Next Steps for Deployment

### 1. Configuration Required
Before deploying, provide:
- ✅ Target network (e.g., Arbitrum)
- ✅ USDC token address (or use mock for testing)
- ✅ Deployer private key
- ✅ Payoff pool address
- ✅ Chainlink price feed addresses
- ✅ Strategy limits and parameters

### 2. Deployment Command
```bash
cd packages/herge

# Test network with mocks
npx hardhat deploy --network localhost

# Arbitrum mainnet
npx hardhat deploy --network arbitrum
```

### 3. Post-Deployment Initialization
```bash
# Grant roles
npx hardhat run scripts/grantRoles.ts --network arbitrum

# Connect strategies
npx hardhat run scripts/connectStrategies.ts --network arbitrum

# Set limits
npx hardhat run scripts/setLimits.ts --network arbitrum
```

---

## Rollback Instructions

If you need to revert to original HEGIC model:

1. In `02_cover_pool.ts`: Uncomment HEGIC, change args back
2. In `00_tokens.ts`: Uncomment all HEGIC deployments
3. In `08_init_pools.ts`: Change USDC back to HEGIC for approvals
4. Update changingPrice to original values (0.0083 or 0.01)

All original code is preserved as comments for easy rollback.

---

## Summary

✅ **USDC-Only Model Successfully Configured**

**What Changed:**
- CoverPool: HEGIC → USDC (coverToken)
- changingPrice: 0.0083 → 1e30 (1:1 ratio)
- All initialization: HEGIC → USDC

**What Stayed Same:**
- Deployment order
- Core contract logic
- All other scripts
- Strategy implementations

**Result:**
- LPs deposit USDC (not HEGIC)
- LPs earn USDC profits
- Simple 1:1 accounting
- Zero-capital launch ready

**Status:** ✅ Ready for deployment configuration and testing

---

*Document created: 2024*
*Configuration: USDC-Only Model*
*Package: packages/herge*

