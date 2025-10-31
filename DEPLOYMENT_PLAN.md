# Hegic Protocol Fork - USDC-Only Deployment Plan

## Overview
Deploy Hegic Protocol fork using USDC for both cover liquidity and profit distribution, eliminating the need for a native token. Launch with zero capital by attracting LPs first.

## Core Configuration Parameters

### Token Configuration
- **coverToken**: USDC (existing stablecoin address)
- **profitToken**: USDC (same as coverToken)
- **changingPrice**: 1e30 (1:1 ratio since both tokens are USDC)
- **Result**: No token conversion needed, transparent 1:1 accounting

### Epoch Configuration
- **Epoch Duration**: 7 days (call fixProfit() weekly)
- **windowSize**: 5 days (432000 seconds)
- **MINIMAL_EPOCH_DURATION**: 7 days (hardcoded in contract)
- **Result**: LPs can deposit/withdraw Days 0-5, locked Days 5-7

### Treasury Configuration
- **Initial Balance**: 0 USDC (zero capital start)
- **maxLockupPeriod**: 30 days (2592000 seconds)
- **benchmark**: 0 USDC initially (will increase as Treasury builds)
- **Result**: Treasury fills naturally from option premiums

### Profit Distribution
- **Protocol Fee**: 10% (withdrawn to team wallet)
- **Treasury Retention**: 20% (kept in Treasury, increases benchmark)
- **LP Distribution**: 70% (transferred to CoverPool, then distributed)
- **Execution**: Manual script run weekly after fixProfit()

### Risk Management
- **Conservative Start**: Set strategy limits to 50% of CoverPool TVL
- **Per-Strategy Limit**: Configurable per strategy (e.g., 20k USDC each)
- **Total Protocol Limit**: Via LimitController (e.g., 50k USDC total)

## Deployment Steps

### Phase 1: Preparation

**1. Environment Setup**
- Clone Hegic repository: `git clone https://github.com/hegic/contracts.git`
- Navigate to Herge package: `cd packages/herge`
- Install dependencies: `yarn install`
- Configure environment variables in `.env`:
  - Network RPC URLs (Arbitrum recommended for lower gas)
  - Deployer private key
  - Etherscan API key for verification
  - Team wallet address for protocol fees
  - Payoff pool address (can be separate wallet you control)

**2. Get USDC Contract Address**
- Mainnet USDC: 0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48
- Arbitrum USDC: 0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8
- Or deploy mock USDC for testing on testnet

**3. Prepare Named Accounts**
Edit `hardhat.config.ts` namedAccounts section:
```typescript
namedAccounts: {
  deployer: {
    default: 0,
    arbitrum: "YOUR_DEPLOYER_ADDRESS"
  },
  payoffPool: {
    default: 1,
    arbitrum: "YOUR_PAYOFF_POOL_ADDRESS"
  }
}
```

### Phase 2: Contract Deployment

**Order of Deployment** (dependencies matter):

**1. Deploy Price Providers (Chainlink Oracles)**
File: `packages/herge/deploy/01_price_providers.ts`
- ETH/USD Price Feed (Arbitrum: 0x639Fe6ab55C921f74e7fac1ee960C0B6293ba612)
- BTC/USD Price Feed (Arbitrum: 0x6ce185860a4963106506C203335A2910413708e9)
- No modifications needed

**2. Deploy CoverPool**
File: `packages/herge/deploy/02_cover_pool.ts`

Modify deployment args:
```typescript
await deploy("CoverPool", {
  from: deployer,
  log: true,
  args: [
    USDC.address,        // coverToken = USDC
    USDC.address,        // profitToken = USDC (same!)
    payoffPool,          // Your controlled address
    parseUnits("1", 30)  // changingPrice = 1e30 (1:1 ratio)
  ]
})
```

**3. Deploy PositionsManager**
File: `packages/herge/deploy/04_positions_manager.ts`
- No modifications needed
- Deploys ERC721 for option NFTs

**4. Deploy ProfitCalculator**
File: `packages/herge/deploy/05_profit_calculator.ts`
- No modifications needed
- Library for payoff calculations

**5. Deploy LimitController**
Create new file: `packages/herge/deploy/05_limit_controller.ts`
```typescript
await deploy("LimitController", {
  from: deployer,
  log: true,
  args: [parseUnits("50000", 6)] // 50k USDC total protocol limit
})
```

**6. Deploy Strategies**
Files: `packages/herge/deploy/06_strategies/*.ts`

For each strategy (Call, Put, Straddle, etc.), configure:
```typescript
await deploy("HegicStrategyCall", {
  from: deployer,
  libraries: {
    ProfitCalculator: profitCalculator.address
  },
  args: [
    priceProviderETH.address,        // Chainlink ETH/USD
    pricerETH.address,                // Premium calculator
    parseUnits("20000", 6),           // 20k USDC per-strategy limit
    18,                                // ETH decimals
    10000,                             // Price scale (100% = ATM)
    [86400, 2592000],                 // Period: 1 day min, 30 days max
    3600,                              // Exercise window: 1 hour before expiry
    limitController.address
  ]
})
```

Repeat for all strategies you want to support:
- HegicStrategyCall
- HegicStrategyPut
- HegicStrategyStraddle
- HegicStrategyStrangle
- HegicStrategySpreadCall
- HegicStrategySpreadPut
- HegicStrategyInverseBearCallSpread (optional)
- HegicStrategyInverseBullPutSpread (optional)
- HegicStrategyInverseLongButterfly (optional)
- HegicStrategyInverseLongCondor (optional)

**7. Deploy OperationalTreasury**
File: `packages/herge/deploy/07_operational_treasury.ts`

Modify deployment args:
```typescript
await deploy("OperationalTreasury", {
  from: deployer,
  log: true,
  args: [
    USDC.address,                    // token = USDC
    positionsManager.address,        // Positions NFT manager
    2592000,                         // maxLockupPeriod = 30 days
    coverPool.address,               // CoverPool for backup
    0,                               // benchmark = 0 (no initial capital)
    [                                // initialStrategies array
      strategyCall.address,
      strategyPut.address,
      strategyStraddle.address
      // Add all your strategies
    ]
  ]
})
```

**8. Initialize Contracts**
File: `packages/herge/deploy/08_init_pools.ts`

Grant necessary roles:
```typescript
// Grant OperationalTreasury access to CoverPool
await coverPool.grantRole(
  OPERATIONAL_TREASURY_ROLE,
  operationalTreasury.address
)

// Grant OperationalTreasury access to PositionsManager
await positionsManager.grantRole(
  HEGIC_POOL_ROLE,
  operationalTreasury.address
)

// Configure CoverPool window size
await coverPool.setWindowSize(432000) // 5 days in seconds
```

### Phase 3: Verification

**Verify all contracts on Etherscan/Arbiscan:**
```bash
npx hardhat etherscan-verify --network arbitrum
```

**Test basic operations on testnet first:**
1. LP deposits USDC to CoverPool
2. Buy option through OperationalTreasury
3. Exercise option when profitable
4. Call fixProfit() to distribute
5. LP claims profit and withdraws

### Phase 4: LP Acquisition (Zero Capital Bootstrap)

**Week -2 to Week 0: Pre-Launch Marketing**

Target: $50k-$100k initial LP deposits

Marketing message:
```
Launch Benefits:
- Earn 70% of ALL option premiums
- First LPs get larger share ratios (built-in advantage)
- Stablecoin-only (no token price risk)
- Weekly profit distribution
- Transparent on-chain accounting

Target APY: 20-40% on USDC
- Conservative estimate based on trading volume
- All returns in USDC (no token exposure)
```

Tactics:
- Reach out to DeFi communities (Discord, Telegram, Twitter)
- Create landing page with real-time stats
- Offer early LP incentives (first 10 get X)
- Build transparency dashboard before launch

**Week 0: Soft Launch**

Once $50k+ committed:
1. LPs deposit USDC to CoverPool via `provide(amount, 0)`
2. Monitor deposits until target reached
3. Conservative strategy limits based on TVL
4. Enable options trading

**Week 1+: Live Operations**

Day-to-day operations:
- Monitor option trading volume
- Respond to LP questions
- Run weekly profit distribution
- Adjust limits as TVL grows

### Phase 5: Weekly Profit Distribution

**Create profit distribution script:**
File: `packages/herge/scripts/distribute-weekly-profits.ts`

```typescript
import { ethers } from "hardhat"

async function main() {
  const [admin] = await ethers.getSigners()
  const treasury = await ethers.getContract("OperationalTreasury")
  const coverPool = await ethers.getContract("CoverPool")
  const USDC = await ethers.getContract("USDC")
  
  const PROTOCOL_FEE = 0.10      // 10%
  const RETENTION = 0.20          // 20%
  const LP_SHARE = 0.70           // 70%
  const TEAM_WALLET = process.env.TEAM_WALLET_ADDRESS
  
  console.log("=== Weekly Profit Distribution ===")
  
  // 1. Calculate profit
  const balance = await treasury.totalBalance()
  const locked = await treasury.totalLocked()
  const premium = await treasury.lockedPremium()
  const benchmark = await treasury.benchmark()
  
  const totalProfit = balance.sub(locked).sub(premium).sub(benchmark)
  console.log(`Total Profit: ${ethers.utils.formatUnits(totalProfit, 6)} USDC`)
  
  if (totalProfit.lte(0)) {
    console.log("No profit to distribute")
    return
  }
  
  // 2. Protocol Fee (10%)
  const protocolFee = totalProfit.mul(ethers.utils.parseUnits("0.1", 6)).div(1e6)
  console.log(`Protocol Fee (10%): ${ethers.utils.formatUnits(protocolFee, 6)} USDC`)
  const tx1 = await treasury.withdraw(TEAM_WALLET, protocolFee)
  await tx1.wait()
  console.log("✅ Protocol fee withdrawn")
  
  // 3. Treasury Retention (20%)
  const retention = totalProfit.mul(ethers.utils.parseUnits("0.2", 6)).div(1e6)
  console.log(`Treasury Retention (20%): ${ethers.utils.formatUnits(retention, 6)} USDC`)
  const newBenchmark = benchmark.add(retention)
  const tx2 = await treasury.setBenchmark(newBenchmark)
  await tx2.wait()
  console.log("✅ Benchmark updated")
  
  // 4. LP Share (70%)
  const lpShare = totalProfit.mul(ethers.utils.parseUnits("0.7", 6)).div(1e6)
  console.log(`LP Share (70%): ${ethers.utils.formatUnits(lpShare, 6)} USDC`)
  
  // Transfer to CoverPool
  const tx3 = await treasury.withdraw(coverPool.address, lpShare)
  await tx3.wait()
  
  // Distribute to LPs
  const tx4 = await coverPool.fixProfit()
  await tx4.wait()
  console.log("✅ Profits distributed to LPs")
  
  console.log(`\nNew Treasury Benchmark: ${ethers.utils.formatUnits(newBenchmark, 6)} USDC`)
  console.log("=== Distribution Complete ===")
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error)
    process.exit(1)
  })
```

**Run weekly:**
```bash
npx hardhat run scripts/distribute-weekly-profits.ts --network arbitrum
```

**Schedule as cron job (recommended):**
```bash
# Every Monday at 9:00 AM
0 9 * * 1 cd /path/to/hegic-fork && npx hardhat run scripts/distribute-weekly-profits.ts --network arbitrum
```

### Phase 6: Monitoring & Adjustments

**Key Metrics Dashboard:**
- Treasury balance (real-time)
- CoverPool TVL (total LP deposits)
- Weekly premium volume
- Weekly payout volume
- Net profit per epoch
- LP APY (calculated)
- Options open interest
- Strategy utilization rates

**Adjustment Triggers:**

When CoverPool TVL > $100k:
- Increase per-strategy limits to $30k
- Increase total limit to $100k

When Treasury > $20k:
- Reduce retention to 10% (more to LPs)
- Increase protocol fee to 15% (more revenue)

When LP APY drops below 15%:
- Marketing push for more traders
- Consider additional LP incentives

When Treasury > $50k:
- Can stop retention entirely (0%)
- Distribute 90% to LPs, 10% protocol fee

## Configuration Summary Table

| Parameter | Value | Location | Can Change? |
|-----------|-------|----------|-------------|
| coverToken | USDC address | CoverPool constructor | ❌ Immutable |
| profitToken | USDC address | CoverPool constructor | ❌ Immutable |
| changingPrice | 1e30 (1:1) | CoverPool constructor | ✅ setNextEpochChangingPrice() |
| windowSize | 432000 (5 days) | CoverPool state | ✅ setWindowSize() |
| Epoch Duration | 7 days | Manual (when you call fixProfit()) | ✅ Anytime |
| maxLockupPeriod | 2592000 (30 days) | Treasury immutable | ❌ Immutable |
| benchmark | 0 initially | Treasury state | ✅ setBenchmark() |
| Protocol Fee | 10% | Off-chain script | ✅ Edit script |
| Retention | 20% | Off-chain script | ✅ Edit script |
| LP Share | 70% | Off-chain script | ✅ Edit script |
| Strategy Limits | 20k each | Strategy immutable | ✅ setLimit() per strategy |
| Total Limit | 50k | LimitController | ✅ Via LimitController |

## Critical Notes

**No Contract Modifications Required:**
- All parameters configured via constructor arguments
- All fees handled via admin functions
- 100% uses audited Hegic code as-is

**Security Considerations:**
- Transfer admin role to multisig after testing
- Set up monitoring/alerts for large payouts
- Test profit distribution script thoroughly on testnet
- Have emergency pause capability (admin role)

**Economics:**
- LPs earn from premiums minus payouts
- Your team earns 10% protocol fee
- Treasury builds 20% reserve automatically
- All earnings in stable USDC (no token risk)

**LP Value Proposition:**
- 70% of net profits
- 20-40% estimated APY on stablecoin
- No impermanent loss
- No token price exposure
- Weekly distributions
- First-mover share advantage

## Post-Deployment Checklist

- [ ] All contracts deployed and verified
- [ ] Roles granted correctly (test with read functions)
- [ ] Window size configured (5 days)
- [ ] Strategy limits set appropriately
- [ ] Profit distribution script tested
- [ ] Landing page live with contract addresses
- [ ] LP documentation published
- [ ] Initial LP commitments secured ($50k+)
- [ ] Test epoch completed successfully
- [ ] Monitoring dashboard operational
- [ ] Team wallet secured (hardware wallet recommended)
- [ ] Admin key transferred to multisig (after initial testing)

## Success Metrics (First 3 Months)

**Month 1:**
- Target: $100k LP TVL
- Target: 500 options traded
- Target: $5k net profit
- LP APY: 20%+

**Month 2:**
- Target: $250k LP TVL
- Target: 1500 options traded
- Target: $15k net profit
- LP APY: 25%+

**Month 3:**
- Target: $500k LP TVL
- Target: 3000 options traded
- Target: $40k net profit
- LP APY: 30%+
- Treasury: $25k+ self-sustaining

## Files to Modify

Only deployment scripts need changes (no contract code):

1. `packages/herge/deploy/02_cover_pool.ts` - USDC addresses and 1:1 ratio
2. `packages/herge/deploy/07_operational_treasury.ts` - Zero benchmark, USDC address
3. `packages/herge/deploy/08_init_pools.ts` - Add windowSize configuration
4. Create `packages/herge/scripts/distribute-weekly-profits.ts` - New profit distribution script
5. `packages/herge/hardhat.config.ts` - Update namedAccounts with your addresses

All contract `.sol` files remain unchanged - using battle-tested, audited code as-is.

