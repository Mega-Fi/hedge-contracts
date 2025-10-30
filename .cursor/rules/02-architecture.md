# Hegic Protocol - Architecture

## System Architecture Overview

The Hegic protocol consists of three main layers:

```
┌─────────────────────────────────────────────────────────┐
│                    USER INTERFACE                        │
│              (External Apps/Frontends)                   │
└────────────────────┬────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────┐
│                  CORE CONTRACTS                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │ Operational  │  │  Positions   │  │   Strategy   │  │
│  │  Treasury    │◄─┤   Manager    │◄─┤  Contracts   │  │
│  └──────┬───────┘  └──────────────┘  └──────────────┘  │
│         │                                                │
└─────────┼────────────────────────────────────────────────┘
          │
┌─────────▼────────────────────────────────────────────────┐
│                LIQUIDITY LAYER                            │
│  ┌──────────────┐           ┌──────────────┐            │
│  │  Cover Pool  │           │  Payoff Pool │            │
│  │   (HEGIC)    │◄─────────►│    (USDC)    │            │
│  └──────────────┘           └──────────────┘            │
└───────────────────────────────────────────────────────────┘
```

## Core Components (Herge Version)

### 1. **Operational Treasury**
**Purpose**: Central hub for option creation and settlement

**Responsibilities**:
- Creates options when users buy
- Locks liquidity (negativePNL/positivePNL)
- Manages strategy connections
- Handles option payoffs
- Coordinates with Cover Pool for coverage

**Key Functions**:
```solidity
function buy(IHegicStrategy strategy, address holder, uint256 amount, uint256 period, bytes[] calldata additional)
function payOff(uint256 positionID, address account)
function unlock(uint256 lockedLiquidityID)
```

**State Variables**:
- `lockedLiquidity`: Mapping of locked liquidity per option
- `lockedByStrategy`: Total locked per strategy
- `benchmark`: Risk benchmark for coverage calculation
- `totalLocked`: Total liquidity locked across all options

### 2. **Cover Pool**
**Purpose**: Backstop liquidity funded by HEGIC token stakers

**Responsibilities**:
- Accept HEGIC deposits from stakers
- Provide coverage when Operational Treasury insufficient
- Distribute profits to stakers
- Manage epochs for profit distribution
- Convert HEGIC to USDC via changing price mechanism

**Key Functions**:
```solidity
function provide(uint256 amount, uint256 positionId) → uint256
function withdraw(uint256 positionId, uint256 amount)
function claim(uint256 positionId) → uint256
function payOut(uint256 amount)
```

**Epoch System**:
- Each epoch has a duration (minimum 7 days)
- `windowSize`: Period for entering/exiting (default 5 days)
- `changingPrice`: HEGIC/USDC conversion rate per epoch
- Profits distributed at epoch end

### 3. **Positions Manager**
**Purpose**: ERC721 tokenization of options

**Responsibilities**:
- Mint NFT for each option purchased
- Link token ID to option data
- Enable option transfer/trading
- Track token ownership

**Key Functions**:
```solidity
function createOptionFor(address holder) → uint256
function tokenPool(uint256 tokenId) → address
```

### 4. **Strategy Contracts**
**Purpose**: Implement specific options strategies

**Available Strategies**:

#### Basic Options
- `HegicStrategyCall`: Long call options
- `HegicStrategyPut`: Long put options

#### Combinations
- `HegicStrategyStraddle`: Call + Put at same strike
- `HegicStrategyStrangle`: Call + Put at different strikes
- `HegicStrategyStrap`: 2 Calls + 1 Put
- `HegicStrategyStrip`: 1 Call + 2 Puts

#### Spreads
- `HegicStrategySpreadCall`: Bull call spread
- `HegicStrategySpreadPut`: Bear put spread

#### Inverse Strategies
- `HegicStrategyInverseBearCallSpread`: Profit from moderate decline
- `HegicStrategyInverseBullPutSpread`: Profit from moderate rise
- `HegicStrategyInverseLongButterfly`: Profit from specific price
- `HegicStrategyInverseLongCondor`: Profit from price range

**Strategy Interface**:
```solidity
function create(uint256 id, address holder, uint256 amount, uint256 period, bytes[] calldata)
    → (uint32 expiration, uint256 positivePNL, uint256 negativePNL)
function payOffAmount(uint256 optionID) → uint256
function calculateNegativepnlAndPositivepnl(uint256 amount, uint256 period, bytes[] calldata)
    → (uint128 negativepnl, uint128 positivepnl)
```

### 5. **Profit Calculator**
**Purpose**: Calculate option payoffs

**Functions**:
- `calculateCallProfit()`: Call option P&L
- `calculatePutProfit()`: Put option P&L
- Handles price scaling and decimals
- Returns profit in settlement token

### 6. **Limit Controller**
**Purpose**: Risk management and limits

**Responsibilities**:
- Set strategy limits
- Control total exposure
- Prevent over-leveraging
- Dynamic limit adjustments

## Data Flow

### Option Purchase Flow

```
1. User calls buy() on Operational Treasury
2. Treasury calls strategy.create()
3. Strategy calculates negativePNL/positivePNL
4. Treasury locks liquidity
5. Positions Manager mints ERC721 token
6. User receives option NFT
```

### Option Exercise Flow

```
1. User calls payOff() on Operational Treasury
2. Treasury calls strategy.payOffAmount()
3. Strategy calculates current profit
4. Treasury unlocks liquidity
5. If profit > 0:
   - Treasury pays from USDC balance
   - If insufficient, Cover Pool.payOut()
6. User receives USDC profit
```

### Liquidity Provision Flow

```
1. User calls provide() on Cover Pool
2. User transfers HEGIC tokens
3. Pool calculates share based on totalShare
4. Pool mints or updates ERC721 position
5. Position tracks share ownership
```

### Profit Distribution Flow

```
1. Admin calls fixProfit() on Cover Pool
2. Pool calculates profit since last epoch
3. Updates cumulativeProfit per share
4. Starts next epoch
5. Users claim() to withdraw profits
```

## v8888 Architecture Differences

The older v8888 version has different architecture:

### Key Differences
1. **No Cover Pool**: Uses `HegicPool` directly
2. **Options Manager**: Separate contract for option management
3. **Hedged/Unhedged Tranches**: Two types of liquidity
4. **Settlement Fees**: Fee distributor for stakers
5. **Bonding Curve**: For token price discovery

### v8888 Flow
```
User → OptionsManager → HegicPool → Strategy
                            ↓
                     HegicStaking (fees)
```

## Security Architecture

### Access Control
- `DEFAULT_ADMIN_ROLE`: Contract owner/governance
- `OPERATIONAL_TRESUARY_ROLE`: Treasury access to Cover Pool
- `TEMPORARY_ADMIN_ROLE`: Setup/initialization

### Reentrancy Protection
- `ReentrancyGuard` on critical functions
- `nonReentrant` modifier on buy/payOff

### Oracle Integration
- Chainlink `AggregatorV3Interface`
- Price validation and staleness checks
- Fallback mechanisms

### Liquidity Management
- `lockedLimit` per strategy
- `maxLockupPeriod` for time bounds
- Utilization rate caps

## State Management

### Locked Liquidity Structure
```solidity
struct LockedLiquidity {
    LockedLiquidityState state;  // Unlocked/Locked
    IHegicStrategy strategy;      // Which strategy
    uint128 negativepnl;          // Max loss
    uint128 positivepnl;          // Max profit
    uint32 expiration;            // When expires
}
```

### Strategy Data
```solidity
struct StrategyData {
    uint128 amount;    // Option size
    uint128 strike;    // Strike price
}
```

### Epoch Structure (Cover Pool)
```solidity
struct Epoch {
    uint256 start;              // Epoch start time
    uint256 changingPrice;      // HEGIC/USDC rate
    uint256 cumulativePoint;    // Profit checkpoint
    uint256 totalShareOut;      // Shares withdrawn
    uint256 coverTokenOut;      // HEGIC withdrawn
    uint256 profitTokenOut;     // USDC profits
    mapping(uint256 => uint256) outShare;  // Per position
}
```

## Integration Points

### External Dependencies
1. **Chainlink Oracles**: Price feeds for underlying assets
2. **ERC20 Tokens**: USDC (settlement), HEGIC (staking)
3. **OpenZeppelin**: Standard implementations

### Internal Dependencies
```
herge → utils (Math, ERC721WithURIBuilder)
hardcore-beta → v8888, utils
All packages → OpenZeppelin, Chainlink
```

