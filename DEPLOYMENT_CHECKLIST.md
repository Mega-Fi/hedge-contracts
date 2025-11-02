# Deployment Checklist - USDC-Only Model

## ✅ Pre-Deployment Verification

### Code Changes Complete
- [x] `02_cover_pool.ts` - Modified to use USDC/USDC
- [x] `00_tokens.ts` - HEGIC commented out
- [x] `08_init_pools.ts` - Changed to USDC approvals
- [x] All changes documented in `USDC_ONLY_MODEL_CHANGES.md`

### Contracts Compile
```bash
cd packages/herge
npx hardhat compile
# ✅ Should compile without errors
```

---

## 📝 Information Needed Before Deployment

### Network Configuration
- [ ] Target network name (e.g., "arbitrum", "localhost")
- [ ] RPC URL (e.g., https://arb1.arbitrum.io/rpc)
- [ ] Chain ID (e.g., 42161 for Arbitrum)
- [ ] Block explorer API key (for verification)

### Accounts
- [ ] Deployer address
- [ ] Deployer private key (in .env)
- [ ] Deployer has enough ETH for gas
- [ ] Payoff pool address (can be same as deployer for testing)

### Token Addresses
- [ ] USDC token address (for mainnet/testnet)
  - Arbitrum: 0xff970a61a04b1ca14834a43f5de4533ebddb5cc8
  - Or deploy mock for localhost
- [ ] WETH token address (for price oracles)
- [ ] WBTC token address (for price oracles)

### Price Feed Addresses (Chainlink)
- [ ] ETH/USD price feed
- [ ] BTC/USD price feed
- [ ] Or use mock price feeds for testing

### Treasury Configuration
- [ ] maxLockupPeriod: _______ seconds (recommended: 2592000 = 30 days)
- [ ] benchmark: _______ USDC (recommended: 0 for zero-capital start)
- [ ] Initial strategies to connect (can be all)

### Strategy Configuration
For each strategy, define:
- [ ] Limit (max locked liquidity per strategy)
- [ ] Period limits [min, max] in seconds
- [ ] Exercise window duration in seconds
- [ ] Price scale parameters (if applicable)

### Epoch Configuration (CoverPool)
- [ ] Window size: _______ seconds (default: 432000 = 5 days)
- [ ] Initial changing price: 1e30 (for USDC-only model)

---

## 🚀 Deployment Steps

### 1. Environment Setup
```bash
cd packages/herge

# Create .env file
cat > .env << EOF
PRIVATE_KEY=your_private_key_here
ARBITRUM_RPC_URL=your_rpc_url_here
ETHERSCAN_API_KEY=your_etherscan_key_here
ARBISCAN_API_KEY=your_arbiscan_key_here
EOF

# Install dependencies (if not already done)
yarn install
```

### 2. Configure hardhat.config.ts
```typescript
networks: {
  arbitrum: {
    url: process.env.ARBITRUM_RPC_URL,
    accounts: [process.env.PRIVATE_KEY],
    chainId: 42161
  }
}
```

### 3. Update Named Accounts
Edit deployment scripts if needed:
```typescript
namedAccounts: {
  deployer: {
    default: 0,
    arbitrum: "your_deployer_address"
  },
  payoffPool: {
    default: 9,
    arbitrum: "your_payoff_pool_address"
  }
}
```

### 4. Compile Contracts
```bash
npx hardhat compile
# ✅ Should see: "Compiled X Solidity files successfully"
```

### 5. Deploy to Test Network (Recommended First)
```bash
# Start local node (in separate terminal)
npx hardhat node

# Deploy to localhost
npx hardhat deploy --network localhost

# ✅ Verify all contracts deployed
# ✅ Note down all contract addresses
```

### 6. Test Deployment
```bash
# Run tests against deployed contracts
npx hardhat test --network localhost

# ✅ Verify:
# - CoverPool accepts USDC deposits
# - Options can be purchased
# - Payoffs work correctly
```

### 7. Deploy to Mainnet/Production
```bash
# Deploy to Arbitrum
npx hardhat deploy --network arbitrum

# ✅ Save all deployment addresses!
# ✅ Deployments saved in: deployments/arbitrum/
```

---

## 🔐 Post-Deployment Tasks

### 1. Verify Contracts on Block Explorer
```bash
npx hardhat etherscan-verify --network arbitrum
# ✅ All contracts should show verified source code
```

### 2. Grant Roles
```bash
# Grant OPERATIONAL_TREASURY_ROLE to OperationalTreasury
npx hardhat run scripts/grantRoles.ts --network arbitrum

# ✅ Verify roles granted correctly
```

### 3. Initialize Pools (If Using Mocks)
Only for test networks with mock tokens:
```bash
# Uncomment initialization code in 08_init_pools.ts
# Then redeploy:
npx hardhat deploy --network localhost --tags "init pools"

# ✅ Verify USDC minted to test accounts
# ✅ Verify approvals set
```

### 4. Connect Strategies
```bash
# Connect all deployed strategies to Treasury
# (May be done automatically in deployment script)
npx hardhat run scripts/connectStrategies.ts --network arbitrum

# ✅ Verify strategies are "accepted" in Treasury
```

### 5. Set Strategy Limits
```bash
# Set per-strategy locked liquidity limits
npx hardhat run scripts/setLimits.ts --network arbitrum

# ✅ Verify limits set for each strategy
```

### 6. Test Option Purchase (Small Amount)
```bash
# Test with small USDC amount first
# Buy a simple call option
# Verify:
# - Premium charged correctly
# - NFT minted
# - Liquidity locked
# - Can exercise if profitable
```

### 7. Provide Initial Liquidity
```bash
# If zero-capital start, invite LPs to provide USDC
# Monitor CoverPool.totalLiquidity()
# Recommended: Start with at least 10,000 USDC
```

### 8. Transfer Admin Rights
```bash
# Transfer DEFAULT_ADMIN_ROLE to multisig or governance
# CRITICAL: Do this LAST after all setup complete
npx hardhat run scripts/transferAdmin.ts --network arbitrum

# ✅ Verify admin role transferred
# ✅ Deployer no longer has admin access
```

---

## 📊 Monitoring & Verification

### Check Deployment State
```bash
# View all deployed contracts
cat deployments/arbitrum/.chainId
cat deployments/arbitrum/OperationalTreasury.json | jq .address

# Verify on block explorer:
# https://arbiscan.io/address/<contract_address>
```

### Verify CoverPool Configuration
```javascript
const coverPool = await ethers.getContract("CoverPool");
console.log("Cover Token:", await coverPool.coverToken()); // Should be USDC
console.log("Profit Token:", await coverPool.profitToken()); // Should be USDC
console.log("Changing Price:", await coverPool.changingPrice()); // Should be 1e30
console.log("Window Size:", await coverPool.windowSize()); // Should be 432000
```

### Verify OperationalTreasury Configuration
```javascript
const treasury = await ethers.getContract("OperationalTreasury");
console.log("Token:", await treasury.token()); // Should be USDC
console.log("Cover Pool:", await treasury.coverPool()); // Should be CoverPool address
console.log("Benchmark:", await treasury.benchmark()); // Should be 0 or your value
console.log("Max Lockup:", await treasury.maxLockupPeriod()); // Should be 2592000
console.log("Total Locked:", await treasury.totalLocked()); // Should be 0 initially
```

### Verify Strategy Connections
```javascript
const treasury = await ethers.getContract("OperationalTreasury");
const callStrategy = await ethers.getContract("HegicStrategyCall");
console.log("Strategy Accepted:", await treasury.acceptedStrategy(callStrategy.address)); // Should be true
```

---

## ⚠️ Troubleshooting

### Issue: "Cannot find module"
```bash
rm -rf node_modules cache artifacts
yarn install
npx hardhat compile
```

### Issue: "Insufficient funds for gas"
- Ensure deployer has enough ETH for gas
- Check gas price on network
- Consider using `gasPrice` or `maxFeePerGas` in hardhat.config.ts

### Issue: "Contract deployment failed"
- Check if contract already deployed (may need `--reset` flag)
- Verify constructor arguments are correct
- Check if dependencies deployed first

### Issue: "Nonce too high/too low"
```bash
# Reset nonce tracking
rm -rf deployments/arbitrum/.pending
# Or reset entire deployment
npx hardhat deploy --network arbitrum --reset
```

### Issue: "Transaction underpriced"
- Increase gas price in hardhat.config.ts
- Wait for network congestion to clear

---

## 📋 Final Checklist

Before going live:
- [ ] All contracts deployed successfully
- [ ] All contracts verified on block explorer
- [ ] CoverPool uses USDC/USDC (not HEGIC/USDC)
- [ ] changingPrice = 1e30
- [ ] All roles granted correctly
- [ ] All strategies connected and limited
- [ ] Test option purchase successful
- [ ] Initial liquidity provided (if not zero-capital)
- [ ] Admin transferred to multisig
- [ ] Documentation updated with contract addresses
- [ ] Frontend updated with new contract addresses
- [ ] Announce to community

---

## 🎉 Success Criteria

Your deployment is successful when:
- ✅ Users can deposit USDC to CoverPool
- ✅ Users can buy options (pay premium in USDC)
- ✅ Options exercise correctly (receive profit in USDC)
- ✅ LPs earn USDC profits from premiums
- ✅ Treasury builds capital from premiums (if zero-capital start)
- ✅ No errors in transactions
- ✅ All contracts verified and readable on block explorer

---

## 📞 Need Help?

If you encounter issues:
1. Check `USDC_ONLY_MODEL_CHANGES.md` for configuration details
2. Review `06-deployment-guide.md` for general deployment info
3. Check contract source code in `packages/herge/contracts/`
4. Review test files in `packages/herge/test/` for usage examples

---

*Checklist Version: 1.0*
*Model: USDC-Only*
*Last Updated: 2024*

