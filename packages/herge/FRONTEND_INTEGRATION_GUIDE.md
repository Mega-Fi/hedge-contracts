# 🎯 Hegic Protocol - Frontend Integration Guide

**Network:** Arbitrum Sepolia Testnet  
**Chain ID:** 421614  
**Package:** Herge (Current Production Version)

---

## 📋 Overview

This guide provides the **essential contracts** your frontend needs to integrate with the Hegic Protocol. The deployment includes **254 total contracts**, but you only need to interact with **3-4 core contracts** directly.

---

## 🎯 Core Contracts for Frontend Integration

### 1. ⭐ OperationalTreasury - **PRIMARY CONTRACT**

**Address:** `0xeD5129B6Fc93C1D9c8278E540c4986dB9DC9D930`  
**Interface:** `IOperationalTreasury`  
**Purpose:** Main contract for all option trading operations

**Arbiscan:** https://sepolia.arbiscan.io/address/0xeD5129B6Fc93C1D9c8278E540c4986dB9DC9D930

#### Key Functions for Frontend:

```solidity
// Buy an option
function buy(
    IHegicStrategy strategy,    // Strategy contract address
    address holder,             // User's address
    uint256 amount,             // Option size (in underlying tokens)
    uint256 period,             // Duration in seconds
    bytes[] calldata additional // Strategy-specific params
) external;

// Exercise/settle an option
function payOff(uint256 positionID, address account) external;

// Get locked liquidity details
function lockedLiquidity(uint256 id) 
    external view returns (
        LockedLiquidityState state,
        IHegicStrategy strategy,
        uint128 negativepnl,
        uint128 positivepnl,
        uint32 expiration
    );

// Get balance info
function totalBalance() external view returns (uint256);
function totalLocked() external view returns (uint256);
function lockedPremium() external view returns (uint256);

// Get locked amount by strategy
function lockedByStrategy(IHegicStrategy strategy) 
    external view returns (uint256);

// Token reference (USDC)
function token() external view returns (IERC20);

// Positions manager reference
function manager() external view returns (IPositionsManager);
```

#### Events to Listen For:
- `Expired(uint256 indexed id)` - Option expired
- `Paid(uint256 indexed id, address indexed account, uint256 amount)` - Option exercised
- `Replenished(uint256 amount)` - Treasury replenished

---

### 2. 📝 PositionsManager - NFT Manager

**Address:** `0x88a2887bD21974ea9a8D23553eeE532B8a8e2AB3`  
**Interface:** `IPositionsManager`  
**Purpose:** Manages ERC721 NFTs for option positions

**Arbiscan:** https://sepolia.arbiscan.io/address/0x88a2887bD21974ea9a8D23553eeE532B8a8e2AB3

#### Key Functions:
```solidity
// Standard ERC721 functions
function balanceOf(address owner) external view returns (uint256);
function ownerOf(uint256 tokenId) external view returns (address);
function tokenOfOwnerByIndex(address owner, uint256 index) external view returns (uint256);
function tokenURI(uint256 tokenId) external view returns (string memory);

// Hegic-specific
function tokenPool(uint256 tokenId) external returns (address pool);
```

---

### 3. 💰 CoverPool - Liquidity Pool

**Address:** `0xAd02465752782893045089396277697Af935dAdB`  
**Interface:** `ICoverPool`  
**Purpose:** USDC liquidity pool for LPs

**Arbiscan:** https://sepolia.arbiscan.io/address/0xAd02465752782893045089396277697Af935dAdB

#### Key Functions:

```solidity
// Provide liquidity (deposit USDC)
function provide(uint256 amount, uint256 positionId) 
    external returns (uint256);

// Withdraw liquidity
function withdraw(uint256 positionId, uint256 amount) external;

// Claim profits
function claim(uint256 psoitionId) external returns (uint256 amount);

// View functions
function currentEpoch() external view returns (uint256 epochID);
function coverTokenTotal() external view returns (uint256 amount);
function availableToClaim(uint256 positionId) external view returns (uint256);
function coverTokenBalance(uint256 positionId) external view returns (uint256);

// Get epoch info
function epoch(uint256 id) 
    external view returns (
        uint256 start,
        uint256 cumulativePoint,
        uint256 changingPrice,
        uint256 profitTokenOut,
        uint256 coverTokenOut,
        uint256 totalShareOut
    );
```

#### Events to Listen For:
- `Provided(...)` - User deposited liquidity
- `Claimed(uint256 indexed positionId, uint256 amount)` - Profits claimed
- `Profit(uint256 indexed epoch, uint256 amount)` - Epoch profits distributed

---

### 4. 🎲 Strategy Contracts - Option Types

You don't need to interact with strategies directly, but you need their **addresses** to call `OperationalTreasury.buy()`. Each strategy represents a specific option type with fixed parameters.

#### How to Access Strategies:

The `OperationalTreasury` has 176 strategy contracts connected. You can filter strategies by:

1. **Asset** (ETH or BTC)
2. **Type** (PUT, CALL, STRADDLE, STRAP, STRIP, SPREAD, INVERSE)
3. **Strike** (70%, 80%, 90%, 100%, 110%, 120%, 130%)
4. **Period** (7-14 days, 14-30 days, 1-30 days)

#### Strategy Naming Convention:

```
HegicStrategy_[TYPE]_[STRIKE]_[ASSET]_[INDEX]
```

Examples:
- `HegicStrategy_PUT_100_ETH_1` - ETH PUT at 100% strike, period 7-14 days
- `HegicStrategy_CALL_110_BTC_2` - BTC CALL at 110% strike, period 14-30 days
- `HegicStrategy_STRADDLE_ETH_1` - ETH Straddle, period 7-14 days
- `HegicStrategy_INVERSE_BEAR_CALL_SPREAD_10_ETH` - Inverse Bear Call Spread, 10% spread

#### Strategy Addresses:

All 176 strategy addresses are available in:
- `packages/herge/deployments/arbitrum-sepolia/.addresses.json`
- `packages/herge/DEPLOYMENT_COMPLETE_DETAILED.md`

---

## 📦 Token Addresses

### USDC (Settlement Token)
**Address:** `0xf3C3351D6Bd0098EEb33ca8f830FAf2a141Ea2E1`  
**Decimals:** 6  
**Usage:** Premium payments, payouts, LP deposits

### WETH (Underlying Asset)
**Address:** `0x980B62Da83eFf3D4576C647993b0c1D7faf17c73`  
**Decimals:** 18  
**Usage:** ETH options underlying

### WBTC (Underlying Asset)
**Address:** `0x806D0637Fbbfb4EB9efD5119B0895A5C7Cbc66e7`  
**Decimals:** 8  
**Usage:** BTC options underlying

---

## 🔗 Chainlink Price Feeds

### ETH/USD Price Feed
**Address:** `0xd30e2101a97dcbAeBCBC04F14C3f624E67A35165`  
**Decimals:** 8  
**Usage:** ETH option pricing and settlements

### BTC/USD Price Feed
**Address:** `0x56a43EB56Da12C0dc1D972ACb0895A5C7Cbc66e7`  
**Decimals:** 8  
**Usage:** BTC option pricing and settlements

---

## 🎮 Frontend Integration Workflows

### Workflow 1: User Buys an Option

```javascript
// 1. User selects strategy and parameters
const strategyAddress = "0xDB9ddC29d5cff07233b1A776c655196598cFB916"; // Example: ETH PUT 100%
const amount = ethers.utils.parseEther("1"); // 1 ETH
const period = 7 * 24 * 60 * 60; // 7 days

// 2. Approve USDC (if not already approved)
const usdcContract = new ethers.Contract(USDC_ADDRESS, USDC_ABI, signer);
await usdcContract.approve(OPERATIONAL_TREASURY_ADDRESS, maxPremium);

// 3. Call buy() on OperationalTreasury
const treasuryContract = new ethers.Contract(
    OPERATIONAL_TREASURY_ADDRESS,
    IOperationalTreasury_ABI,
    signer
);

const tx = await treasuryContract.buy(
    strategyAddress,
    userAddress,
    amount,
    period,
    [] // additional params (empty for basic options)
);

const receipt = await tx.wait();

// 4. Parse events to get position ID
const event = receipt.events.find(e => e.event === "LockedLiquidity");
const positionID = event.args.id;
```

### Workflow 2: User Views Their Options

```javascript
// 1. Get all NFT token IDs owned by user
const positionsManager = new ethers.Contract(
    POSITIONS_MANAGER_ADDRESS,
    IPositionsManager_ABI,
    signer
);

const balance = await positionsManager.balanceOf(userAddress);
const tokenIds = [];

for (let i = 0; i < balance; i++) {
    const tokenId = await positionsManager.tokenOfOwnerByIndex(userAddress, i);
    tokenIds.push(tokenId);
}

// 2. Get detailed info for each option
const options = await Promise.all(
    tokenIds.map(async (tokenId) => {
        const liquidity = await treasuryContract.lockedLiquidity(tokenId);
        
        return {
            id: tokenId,
            strategy: liquidity.strategy,
            state: liquidity.state, // 0 = Unlocked, 1 = Locked
            negativePNL: liquidity.negativepnl,
            positivePNL: liquidity.positivepnl,
            expiration: new Date(liquidity.expiration * 1000),
        };
    })
);
```

### Workflow 3: User Exercises an Option

```javascript
// 1. Check if option is profitable
const liquidity = await treasuryContract.lockedLiquidity(positionID);

// Get current profit (if any)
const strategyContract = new ethers.Contract(
    liquidity.strategy,
    IHegicStrategy_ABI,
    signer
);

const profit = await strategyContract.payOffAmount(positionID);

if (profit.gt(0)) {
    // 2. Exercise the option
    const tx = await treasuryContract.payOff(positionID, userAddress);
    await tx.wait();
    
    console.log(`Profit: ${ethers.utils.formatUnits(profit, 6)} USDC`);
}
```

### Workflow 4: LP Provides Liquidity

```javascript
// 1. Approve USDC
const usdcContract = new ethers.Contract(USDC_ADDRESS, USDC_ABI, signer);
const lpAmount = ethers.utils.parseUnits("10000", 6); // 10,000 USDC

await usdcContract.approve(COVER_POOL_ADDRESS, lpAmount);

// 2. Deposit to CoverPool
const coverPool = new ethers.Contract(
    COVER_POOL_ADDRESS,
    ICoverPool_ABI,
    signer
);

const tx = await coverPool.provide(lpAmount, 0); // 0 = create new position
const receipt = await tx.wait();

// 3. Get position ID from event
const event = receipt.events.find(e => e.event === "Provided");
const positionID = event.args.positionId;
```

### Workflow 5: LP Claims Profits

```javascript
// 1. Check available profits
const availableProfit = await coverPool.availableToClaim(lpPositionID);
console.log(`Available: ${ethers.utils.formatUnits(availableProfit, 6)} USDC`);

// 2. Claim
const tx = await coverPool.claim(lpPositionID);
const receipt = await tx.wait();

console.log("Profits claimed!");
```

---

## 📊 Important View Functions

### Get Current Price
```javascript
const ethPriceFeed = new ethers.Contract(
    ETH_PRICE_FEED_ADDRESS,
    AGGREGATOR_V3_ABI,
    provider
);

const roundData = await ethPriceFeed.latestRoundData();
const currentPrice = roundData.answer; // Already has 8 decimals
```

### Get Treasury Balance
```javascript
const totalBalance = await treasuryContract.totalBalance();
const totalLocked = await treasuryContract.totalLocked();
const available = totalBalance.sub(totalLocked);

console.log(`Available liquidity: ${ethers.utils.formatUnits(available, 6)} USDC`);
```

### Get Strategy Limits
```javascript
// All strategies have a 20,000 USDC limit
const limit = ethers.utils.parseUnits("20000", 6); // 20,000 USDC
const locked = await treasuryContract.lockedByStrategy(strategyAddress);

const available = limit.sub(locked);
console.log(`Available for this strategy: ${ethers.utils.formatUnits(available, 6)} USDC`);
```

### Get Option Premium Quote
```javascript
// Call the strategy to calculate premium
const strategyContract = new ethers.Contract(
    strategyAddress,
    IHegicStrategy_ABI,
    provider
);

const [negativePNL, positivePNL] = await strategyContract
    .calculateNegativepnlAndPositivepnl(amount, period, []);

const premium = negativePNL; // Premium equals negative PNL
console.log(`Premium: ${ethers.utils.formatUnits(premium, 6)} USDC`);
```

---

## ⚙️ Configuration Parameters

| Parameter | Value | Description |
|-----------|-------|-------------|
| Max Lockup Period | 30 days | Maximum option duration |
| Benchmark | 10,000 USDC | Initial treasury reserve |
| Strategy Limit | 20,000 USDC | Per-strategy liquidity cap |
| Min Period | 1 day | Minimum option duration |
| Max Period | 30 days | Maximum option duration |
| Exercise Window | 4 hours | Time before expiry to exercise |
| Epoch Window | 5 days | LP entry/exit window |

---

## 🔍 Contract Events to Monitor

### OperationalTreasury Events
```javascript
treasury.on("Expired", (id) => {
    console.log(`Option ${id} expired`);
});

treasury.on("Paid", (id, account, amount) => {
    console.log(`Option ${id} exercised, profit: ${amount}`);
});

treasury.on("Replenished", (amount) => {
    console.log(`Treasury replenished: ${amount}`);
});
```

### CoverPool Events
```javascript
coverPool.on("Provided", (positionId, amount, ...) => {
    console.log(`Liquidity provided to position ${positionId}: ${amount}`);
});

coverPool.on("Claimed", (positionId, amount) => {
    console.log(`Profits claimed from position ${positionId}: ${amount}`);
});

coverPool.on("Profit", (epoch, amount) => {
    console.log(`Epoch ${epoch} profits: ${amount}`);
});
```

---

## 🚀 Quick Start Integration

1. **Load Contract Addresses** from `deployments/arbitrum-sepolia/.addresses.json`
2. **Load ABIs** from deployment artifacts or TypeChain-generated types
3. **Initialize Contracts** with ethers.js/web3.js
4. **Connect Wallet** and get signer/provider
5. **Start Interacting** using the workflows above

---

## 📁 Contract Files Reference

- `contracts/IOperationalTreasury.sol` - Treasury interface
- `contracts/OperationalTreasury.sol` - Treasury implementation
- `contracts/ICoverPool.sol` - CoverPool interface
- `contracts/CoverPool.sol` - CoverPool implementation
- `contracts/PositionsManager/IPositionsManager.sol` - PositionsManager interface
- `contracts/PositionsManager/PositionsManager.sol` - PositionsManager implementation
- `contracts/Strategies/IHegicStrategy.sol` - Strategy interface
- All strategy contracts in `contracts/Strategies/`

---

## 🔗 Additional Resources

- **Full Deployment Report:** `DEPLOYMENT_COMPLETE_DETAILED.md`
- **Contract Addresses:** `deployments/arbitrum-sepolia/.addresses.json`
- **Arbitrum Sepolia Explorer:** https://sepolia.arbiscan.io
- **Network Info:** Chain ID 421614, RPC: https://sepolia-rollup.arbitrum.io/rpc

---

**🎯 Summary:** You only need to integrate with **3 main contracts** (OperationalTreasury, PositionsManager, CoverPool) and reference the strategy addresses when buying options. The protocol handles all the complex option logic behind the scenes!

