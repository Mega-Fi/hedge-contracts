#!/usr/bin/env node
// Verify all addresses in deployment documentation have code deployed

const { ethers } = require('ethers');
const fs = require('fs');
const path = require('path');

const RPC_URL = process.env.ARBITRUM_SEPOLIA_RPC_URL || 'https://sepolia-rollup.arbitrum.io/rpc';
const ADDRESSES_FILE = path.join(__dirname, '../deployments/arbitrum-sepolia/.addresses.json');

// Skip external contracts (tokens/oracles that may not have code on testnet)
const SKIP_CONTRACTS = ['USDC', 'WETH', 'WBTC', 'PriceProviderBTC', 'PriceProviderETH'];

async function verifyAddress(provider, address, name) {
  try {
    const code = await provider.getCode(address);
    
    if (!code || code === '0x' || code === '0x0') {
      return { valid: false, error: 'No code deployed', codeLength: 0 };
    }
    
    const codeLength = (code.length - 2) / 2; // Remove 0x prefix, divide by 2 (hex = 2 chars per byte)
    
    if (codeLength < 10) {
      return { valid: false, error: 'Suspicious code length', codeLength };
    }
    
    return { valid: true, codeLength };
  } catch (error) {
    return { valid: false, error: error.message, codeLength: 0 };
  }
}

async function main() {
  console.log('🔍 Verifying all deployed contract addresses have code...');
  console.log(`📡 RPC URL: ${RPC_URL}\n`);

  // Check if addresses file exists
  if (!fs.existsSync(ADDRESSES_FILE)) {
    console.error(`❌ Error: Addresses file not found: ${ADDRESSES_FILE}`);
    process.exit(1);
  }

  // Load addresses
  const addresses = JSON.parse(fs.readFileSync(ADDRESSES_FILE, 'utf8'));
  const total = Object.keys(addresses).length;
  
  console.log(`📊 Total addresses to verify: ${total}\n`);

  // Connect to provider
  const provider = new ethers.providers.JsonRpcProvider(RPC_URL);
  
  // Test connection
  try {
    const blockNumber = await provider.getBlockNumber();
    console.log(`✅ Connected to Arbitrum Sepolia (Block: ${blockNumber})\n`);
  } catch (error) {
    console.error(`❌ Error connecting to RPC: ${error.message}`);
    process.exit(1);
  }

  // Verify addresses
  const results = {
    verified: 0,
    noCode: 0,
    errors: 0,
    skipped: 0,
    invalidAddresses: []
  };

  const contracts = Object.entries(addresses);
  const coreContracts = ['CoverPool', 'ProfitDistributor', 'PositionsManager', 'ProfitCalculator', 'LimitController', 'OperationalTreasury'];
  
  // Prioritize core contracts
  const core = contracts.filter(([name]) => coreContracts.includes(name));
  const others = contracts.filter(([name]) => !coreContracts.includes(name));
  const all = [...core, ...others];

  console.log('🎯 Verifying core contracts first...\n');

  for (let i = 0; i < all.length; i++) {
    const [name, address] = all[i];
    const isCore = coreContracts.includes(name);
    const isSkipped = SKIP_CONTRACTS.includes(name);
    
    if (isSkipped) {
      console.log(`⏭️  [${i + 1}/${total}] Skipping ${name} (external contract)`);
      results.skipped++;
      continue;
    }

    // Validate address format
    if (!ethers.utils.isAddress(address)) {
      console.log(`❌ [${i + 1}/${total}] ${name}: Invalid address format`);
      results.invalidAddresses.push({ name, address, reason: 'Invalid format' });
      results.errors++;
      continue;
    }

    const prefix = isCore ? '🔴' : '  ';
    process.stdout.write(`${prefix} [${i + 1}/${total}] Checking ${name}... `);

    const result = await verifyAddress(provider, address, name);

    if (result.valid) {
      console.log(`✅ Code deployed (${result.codeLength} bytes)`);
      results.verified++;
    } else {
      console.log(`❌ ${result.error} (${result.codeLength} bytes)`);
      results.invalidAddresses.push({ name, address, reason: result.error, codeLength: result.codeLength });
      results.noCode++;
    }

    // Small delay to avoid rate limiting
    if (i < all.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }

  console.log('\n════════════════════════════════════════════════════════════');
  console.log('📊 Verification Summary');
  console.log('════════════════════════════════════════════════════════════');
  console.log(`✅ Verified (has code): ${results.verified}`);
  console.log(`❌ No code: ${results.noCode}`);
  console.log(`⏭️  Skipped (external): ${results.skipped}`);
  console.log(`⚠️  Errors: ${results.errors}`);
  console.log(`📊 Total checked: ${total}`);
  console.log('');

  if (results.invalidAddresses.length > 0) {
    console.log('❌ Addresses with issues:');
    console.log('');
    results.invalidAddresses.forEach(({ name, address, reason, codeLength }) => {
      console.log(`   ${name}:`);
      console.log(`     Address: ${address}`);
      console.log(`     Issue: ${reason}`);
      if (codeLength !== undefined) {
        console.log(`     Code length: ${codeLength} bytes`);
      }
      console.log('');
    });
    
    // Save invalid addresses to file
    const invalidFile = path.join(__dirname, '../invalid-addresses.json');
    fs.writeFileSync(invalidFile, JSON.stringify(results.invalidAddresses, null, 2));
    console.log(`📝 Invalid addresses saved to: ${invalidFile}\n`);
    
    process.exit(1);
  } else {
    console.log('✅ All addresses have code deployed!\n');
    process.exit(0);
  }
}

main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});

