const fs = require('fs');
const path = require('path');

const addressesFile = path.join(__dirname, '../deployments/arbitrum-sepolia/.addresses.json');
const addresses = JSON.parse(fs.readFileSync(addressesFile, 'utf8'));

// Core contracts
const coreContracts = [
  'CoverPool',
  'ProfitDistributor',
  'PositionsManager',
  'ProfitCalculator',
  'LimitController',
  'OperationalTreasury'
];

// Token and oracle contracts
const tokenContracts = ['USDC', 'WETH', 'WBTC', 'PriceProviderBTC', 'PriceProviderETH'];

// Strategy categories
const strategyCategories = {
  'PUT_100': { name: 'PUT Options - ETH (100% Strike)', pattern: /^HegicStrategy_PUT_100_ETH_/ },
  'PUT_90': { name: 'PUT Options - ETH (90% Strike)', pattern: /^HegicStrategy_PUT_90_ETH_/ },
  'PUT_80': { name: 'PUT Options - ETH (80% Strike)', pattern: /^HegicStrategy_PUT_80_ETH_/ },
  'PUT_70': { name: 'PUT Options - ETH (70% Strike)', pattern: /^HegicStrategy_PUT_70_ETH_/ },
  'CALL_100': { name: 'CALL Options - ETH (100% Strike)', pattern: /^HegicStrategy_CALL_100_ETH_/ },
  'CALL_110': { name: 'CALL Options - ETH (110% Strike)', pattern: /^HegicStrategy_CALL_110_ETH_/ },
  'CALL_120': { name: 'CALL Options - ETH (120% Strike)', pattern: /^HegicStrategy_CALL_120_ETH_/ },
  'CALL_130': { name: 'CALL Options - ETH (130% Strike)', pattern: /^HegicStrategy_CALL_130_ETH_/ },
  'STRADDLE_ETH': { name: 'STRADDLE - ETH', pattern: /^HegicStrategy_STRADDLE_ETH_/ },
  'STRANGLE_10_ETH': { name: 'STRANGLE - ETH (10%)', pattern: /^HegicStrategy_STRANGLE_10_ETH_/ },
  'STRANGLE_20_ETH': { name: 'STRANGLE - ETH (20%)', pattern: /^HegicStrategy_STRANGLE_20_ETH_/ },
  'STRANGLE_30_ETH': { name: 'STRANGLE - ETH (30%)', pattern: /^HegicStrategy_STRANGLE_30_ETH_/ },
  'STRAP_ETH': { name: 'STRAP - ETH', pattern: /^HegicStrategy_STRAP_ETH_/ },
  'STRIP_ETH': { name: 'STRIP - ETH', pattern: /^HegicStrategy_STRIP_ETH_/ },
  'SPREAD_CALL_10_ETH': { name: 'SPREAD CALL - ETH (10%)', pattern: /^HegicStrategy_SPREAD_CALL_10_ETH_/ },
  'SPREAD_CALL_20_ETH': { name: 'SPREAD CALL - ETH (20%)', pattern: /^HegicStrategy_SPREAD_CALL_20_ETH_/ },
  'SPREAD_CALL_30_ETH': { name: 'SPREAD CALL - ETH (30%)', pattern: /^HegicStrategy_SPREAD_CALL_30_ETH_/ },
  'SPREAD_PUT_10_ETH': { name: 'SPREAD PUT - ETH (10%)', pattern: /^HegicStrategy_SPREAD_PUT_10_ETH_/ },
  'SPREAD_PUT_20_ETH': { name: 'SPREAD PUT - ETH (20%)', pattern: /^HegicStrategy_SPREAD_PUT_20_ETH_/ },
  'SPREAD_PUT_30_ETH': { name: 'SPREAD PUT - ETH (30%)', pattern: /^HegicStrategy_SPREAD_PUT_30_ETH_/ },
  // BTC strategies
  'PUT_100_BTC': { name: 'PUT Options - BTC (100% Strike)', pattern: /^HegicStrategy_PUT_100_BTC_/ },
  'PUT_90_BTC': { name: 'PUT Options - BTC (90% Strike)', pattern: /^HegicStrategy_PUT_90_BTC_/ },
  'PUT_80_BTC': { name: 'PUT Options - BTC (80% Strike)', pattern: /^HegicStrategy_PUT_80_BTC_/ },
  'PUT_70_BTC': { name: 'PUT Options - BTC (70% Strike)', pattern: /^HegicStrategy_PUT_70_BTC_/ },
  'CALL_100_BTC': { name: 'CALL Options - BTC (100% Strike)', pattern: /^HegicStrategy_CALL_100_BTC_/ },
  'CALL_110_BTC': { name: 'CALL Options - BTC (110% Strike)', pattern: /^HegicStrategy_CALL_110_BTC_/ },
  'CALL_120_BTC': { name: 'CALL Options - BTC (120% Strike)', pattern: /^HegicStrategy_CALL_120_BTC_/ },
  'CALL_130_BTC': { name: 'CALL Options - BTC (130% Strike)', pattern: /^HegicStrategy_CALL_130_BTC_/ },
  'STRADDLE_BTC': { name: 'STRADDLE - BTC', pattern: /^HegicStrategy_STRADDLE_BTC_/ },
  'STRANGLE_10_BTC': { name: 'STRANGLE - BTC (10%)', pattern: /^HegicStrategy_STRANGLE_10_BTC_/ },
  'STRANGLE_20_BTC': { name: 'STRANGLE - BTC (20%)', pattern: /^HegicStrategy_STRANGLE_20_BTC_/ },
  'STRANGLE_30_BTC': { name: 'STRANGLE - BTC (30%)', pattern: /^HegicStrategy_STRANGLE_30_BTC_/ },
  'STRAP_BTC': { name: 'STRAP - BTC', pattern: /^HegicStrategy_STRAP_BTC_/ },
  'STRIP_BTC': { name: 'STRIP - BTC', pattern: /^HegicStrategy_STRIP_BTC_/ },
  'SPREAD_CALL_10_BTC': { name: 'SPREAD CALL - BTC (10%)', pattern: /^HegicStrategy_SPREAD_CALL_10_BTC_/ },
  'SPREAD_CALL_20_BTC': { name: 'SPREAD CALL - BTC (20%)', pattern: /^HegicStrategy_SPREAD_CALL_20_BTC_/ },
  'SPREAD_CALL_30_BTC': { name: 'SPREAD CALL - BTC (30%)', pattern: /^HegicStrategy_SPREAD_CALL_30_BTC_/ },
  'SPREAD_PUT_10_BTC': { name: 'SPREAD PUT - BTC (10%)', pattern: /^HegicStrategy_SPREAD_PUT_10_BTC_/ },
  'SPREAD_PUT_20_BTC': { name: 'SPREAD PUT - BTC (20%)', pattern: /^HegicStrategy_SPREAD_PUT_20_BTC_/ },
  'SPREAD_PUT_30_BTC': { name: 'SPREAD PUT - BTC (30%)', pattern: /^HegicStrategy_SPREAD_PUT_30_BTC_/ },
  // Inverse strategies
  'INVERSE_BEAR_CALL_SPREAD_10_ETH': { name: 'INVERSE Bear Call Spread - ETH (10%)', pattern: /^HegicStrategy_INVERSE_BEAR_CALL_SPREAD_10_ETH$/ },
  'INVERSE_BEAR_CALL_SPREAD_20_ETH': { name: 'INVERSE Bear Call Spread - ETH (20%)', pattern: /^HegicStrategy_INVERSE_BEAR_CALL_SPREAD_20_ETH$/ },
  'INVERSE_BEAR_CALL_SPREAD_30_ETH': { name: 'INVERSE Bear Call Spread - ETH (30%)', pattern: /^HegicStrategy_INVERSE_BEAR_CALL_SPREAD_30_ETH$/ },
  'INVERSE_BULL_PUT_SPREAD_10_ETH': { name: 'INVERSE Bull Put Spread - ETH (10%)', pattern: /^HegicStrategy_INVERSE_BULL_PUT_SPREAD_10_ETH$/ },
  'INVERSE_BULL_PUT_SPREAD_20_ETH': { name: 'INVERSE Bull Put Spread - ETH (20%)', pattern: /^HegicStrategy_INVERSE_BULL_PUT_SPREAD_20_ETH$/ },
  'INVERSE_BULL_PUT_SPREAD_30_ETH': { name: 'INVERSE Bull Put Spread - ETH (30%)', pattern: /^HegicStrategy_INVERSE_BULL_PUT_SPREAD_30_ETH$/ },
  'INVERSE_LONG_BUTTERFLY_10_ETH': { name: 'INVERSE Long Butterfly - ETH (10%)', pattern: /^HegicStrategy_INVERSE_LONG_BUTTERFLY_10_ETH$/ },
  'INVERSE_LONG_BUTTERFLY_20_ETH': { name: 'INVERSE Long Butterfly - ETH (20%)', pattern: /^HegicStrategy_INVERSE_LONG_BUTTERFLY_20_ETH$/ },
  'INVERSE_LONG_BUTTERFLY_30_ETH': { name: 'INVERSE Long Butterfly - ETH (30%)', pattern: /^HegicStrategy_INVERSE_LONG_BUTTERFLY_30_ETH$/ },
  'INVERSE_LONG_CONDOR_20_ETH': { name: 'INVERSE Long Condor - ETH (20%)', pattern: /^HegicStrategy_INVERSE_LONG_CONDOR_20_ETH$/ },
  'INVERSE_LONG_CONDOR_30_ETH': { name: 'INVERSE Long Condor - ETH (30%)', pattern: /^HegicStrategy_INVERSE_LONG_CONDOR_30_ETH$/ },
  'INVERSE_BEAR_CALL_SPREAD_10_BTC': { name: 'INVERSE Bear Call Spread - BTC (10%)', pattern: /^HegicStrategy_INVERSE_BEAR_CALL_SPREAD_10_BTC$/ },
  'INVERSE_BEAR_CALL_SPREAD_20_BTC': { name: 'INVERSE Bear Call Spread - BTC (20%)', pattern: /^HegicStrategy_INVERSE_BEAR_CALL_SPREAD_20_BTC$/ },
  'INVERSE_BEAR_CALL_SPREAD_30_BTC': { name: 'INVERSE Bear Call Spread - BTC (30%)', pattern: /^HegicStrategy_INVERSE_BEAR_CALL_SPREAD_30_BTC$/ },
  'INVERSE_BULL_PUT_SPREAD_10_BTC': { name: 'INVERSE Bull Put Spread - BTC (10%)', pattern: /^HegicStrategy_INVERSE_BULL_PUT_SPREAD_10_BTC$/ },
  'INVERSE_BULL_PUT_SPREAD_20_BTC': { name: 'INVERSE Bull Put Spread - BTC (20%)', pattern: /^HegicStrategy_INVERSE_BULL_PUT_SPREAD_20_BTC$/ },
  'INVERSE_BULL_PUT_SPREAD_30_BTC': { name: 'INVERSE Bull Put Spread - BTC (30%)', pattern: /^HegicStrategy_INVERSE_BULL_PUT_SPREAD_30_BTC$/ },
  'INVERSE_LONG_BUTTERFLY_10_BTC': { name: 'INVERSE Long Butterfly - BTC (10%)', pattern: /^HegicStrategy_INVERSE_LONG_BUTTERFLY_10_BTC$/ },
  'INVERSE_LONG_BUTTERFLY_20_BTC': { name: 'INVERSE Long Butterfly - BTC (20%)', pattern: /^HegicStrategy_INVERSE_LONG_BUTTERFLY_20_BTC$/ },
  'INVERSE_LONG_BUTTERFLY_30_BTC': { name: 'INVERSE Long Butterfly - BTC (30%)', pattern: /^HegicStrategy_INVERSE_LONG_BUTTERFLY_30_BTC$/ },
  'INVERSE_LONG_CONDOR_20_BTC': { name: 'INVERSE Long Condor - BTC (20%)', pattern: /^HegicStrategy_INVERSE_LONG_CONDOR_20_BTC$/ },
  'INVERSE_LONG_CONDOR_30_BTC': { name: 'INVERSE Long Condor - BTC (30%)', pattern: /^HegicStrategy_INVERSE_LONG_CONDOR_30_BTC$/ },
};

// Price calculators
const priceCalculators = Object.keys(addresses).filter(k => k.startsWith('PriceCalculator_'));

function generateDoc() {
  let doc = `# Hegic Protocol - Deployed Contracts on Arbitrum Sepolia

**Deployment Date:** ${new Date().toISOString().split('T')[0]}
**Network:** Arbitrum Sepolia Testnet (Chain ID: 421614)
**Deployer:** 0x711eE890B41fFbd23Ba3c96975DEBDB1145cbB83
**Model:** USDC-Only (LPs deposit USDC, earn USDC)
**USDC Token:** \`0x75faf114eafb1BDbe2F0316DF893fd58CE46AA4d\`

---

## ✅ Deployment Summary

- **Total Contracts Deployed:** ${Object.keys(addresses).length}
- **Core Contracts:** 6
- **Price Calculators:** ${priceCalculators.length}
- **Strategy Contracts:** ${Object.keys(addresses).length - priceCalculators.length - coreContracts.length - tokenContracts.length}
- **Deployment Status:** ✅ Complete

---

## 🔑 Core Contracts (Chronological Order)

| # | Contract Name | Address | Purpose |
|---|---------------|---------|---------|
`;

  coreContracts.forEach((name, idx) => {
    if (addresses[name]) {
      doc += `| ${idx + 1} | **${name}** | \`${addresses[name]}\` | ${getCoreContractPurpose(name)} |\n`;
    }
  });

  doc += `\n---

## 🪙 Token & Oracle Contracts

| Contract Name | Address | Type |
|---------------|---------|------|
`;

  tokenContracts.forEach(name => {
    if (addresses[name]) {
      doc += `| **${name}** | \`${addresses[name]}\` | ${getTokenType(name)} |\n`;
    }
  });

  doc += `\n---

## 📊 Strategy Contracts by Type

`;

  // Group strategies by category
  const categorizedStrategies = {};
  Object.keys(strategyCategories).forEach(cat => {
    categorizedStrategies[cat] = [];
  });
  const uncategorized = [];

  Object.keys(addresses).forEach(name => {
    if (name.startsWith('HegicStrategy_')) {
      let found = false;
      for (const [cat, { pattern }] of Object.entries(strategyCategories)) {
        if (pattern.test(name)) {
          categorizedStrategies[cat].push({ name, address: addresses[name] });
          found = true;
          break;
        }
      }
      if (!found) {
        uncategorized.push({ name, address: addresses[name] });
      }
    }
  });

  // Generate strategy sections
  Object.entries(strategyCategories).forEach(([cat, { name: categoryName }]) => {
    if (categorizedStrategies[cat].length > 0) {
      doc += `### ${categoryName}\n`;
      doc += `| Period | Address |\n`;
      doc += `|--------|---------|\n`;
      categorizedStrategies[cat].forEach(({ name, address }) => {
        const periodMatch = name.match(/_(\d+)$/);
        const period = periodMatch ? `Variant ${periodMatch[1]}` : 'Single';
        doc += `| ${period} | \`${address}\` |\n`;
      });
      doc += `\n`;
    }
  });

  // Add price calculators section
  doc += `---

## 💰 Price Calculator Contracts

| Calculator Type | Address |
|----------------|---------|
`;

  priceCalculators.sort().forEach(name => {
    const displayName = name.replace('PriceCalculator_', '');
    doc += `| **${displayName}** | \`${addresses[name]}\` |\n`;
  });

  doc += `\n---

## 🔧 Verification Status

Verification via Hardhat Etherscan plugin is currently pending due to custom chain configuration. Contracts can be verified manually using:

\`\`\`bash
# Set API key
export ARBISCAN_API_KEY=57KKIYR46R6JRU6J3YJMCVKYNPGU7SPS81

# Verify individual contracts (example)
npx hardhat verify --network arbitrum-sepolia <address> <constructor_args>
\`\`\`

Or use the verification scripts:
- \`scripts/verify-direct.js\` - Direct API verification
- \`scripts/verify-all-api.js\` - Batch verification (may need fixes for v8888 imports)

---

## 🔗 Explorer Links

- **Arbitrum Sepolia Explorer:** https://sepolia.arbiscan.io
- **CoverPool:** https://sepolia.arbiscan.io/address/${addresses.CoverPool}
- **OperationalTreasury:** https://sepolia.arbiscan.io/address/${addresses.OperationalTreasury}

---

## 📦 Artifacts

- **Addresses JSON:** \`packages/herge/deployments/arbitrum-sepolia/.addresses.json\`
- **Deployment Artifacts:** \`packages/herge/deployments/arbitrum-sepolia/\`

---

## 📋 Complete Contract List (Alphabetical)

For a complete machine-readable list, see:
\`packages/herge/deployments/arbitrum-sepolia/.addresses.json\`

Total: ${Object.keys(addresses).length} deployed contracts across:
- 🎯 Core infrastructure: ${coreContracts.filter(c => addresses[c]).length} contracts
- 📊 Price calculators: ${priceCalculators.length} contracts  
- 🎲 Strategy contracts: ${Object.keys(addresses).filter(k => k.startsWith('HegicStrategy_')).length} contracts

---

**Deployment completed successfully! 🎉**

*Generated: ${new Date().toISOString()}*
`;

  return doc;
}

function getCoreContractPurpose(name) {
  const purposes = {
    'CoverPool': 'USDC liquidity pool for backstop coverage',
    'ProfitDistributor': 'Distributes profits to LPs',
    'PositionsManager': 'ERC721 NFT manager for options',
    'ProfitCalculator': 'Calculates option payoffs',
    'LimitController': 'Controls strategy limits',
    'OperationalTreasury': '⭐ **Main contract** - Creates and settles options'
  };
  return purposes[name] || 'Core contract';
}

function getTokenType(name) {
  const types = {
    'USDC': 'Settlement Token',
    'WETH': 'Underlying Asset',
    'WBTC': 'Underlying Asset',
    'PriceProviderETH': 'Chainlink ETH/USD Oracle',
    'PriceProviderBTC': 'Chainlink BTC/USD Oracle'
  };
  return types[name] || 'Token';
}

// Generate and write the document
const doc = generateDoc();
const outputFile = path.join(__dirname, '../DEPLOYED_CONTRACTS_ARBITRUM_SEPOLIA.md');
fs.writeFileSync(outputFile, doc, 'utf8');
console.log(`✅ Deployment documentation generated: ${outputFile}`);
console.log(`📊 Total contracts documented: ${Object.keys(addresses).length}`);

