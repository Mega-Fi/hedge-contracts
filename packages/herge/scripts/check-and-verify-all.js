const axios = require('axios');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const util = require('util');
const execPromise = util.promisify(exec);

const ARBISCAN_API_KEY = process.env.ARBISCAN_API_KEY || '57KKIYR46R6JRU6J3YJMCVKYNPGU7SPS81';
const API_URL = 'https://api-sepolia.arbiscan.io/api'; // Using V1 API for status checks
const DELAY_BETWEEN_REQUESTS = 2000; // 2 seconds between requests

// Load all addresses from deployment file
const addressesFile = path.join(__dirname, '../deployments/arbitrum-sepolia/.addresses.json');
const addresses = JSON.parse(fs.readFileSync(addressesFile, 'utf8'));

// Contract name to file path mapping (we'll need to map strategy names to their contract paths)
const CONTRACT_PATHS = {
  'CoverPool': 'contracts/CoverPool.sol:CoverPool',
  'OperationalTreasury': 'contracts/OperationalTreasury.sol:OperationalTreasury',
  'PositionsManager': 'contracts/PositionsManager/PositionsManager.sol:PositionsManager',
  'ProfitCalculator': 'contracts/Strategies/ProfitCalculator.sol:ProfitCalculator',
  'LimitController': 'contracts/Strategies/LimitController.sol:LimitController',
  'ProfitDistributor': 'contracts/ProfitDistributor.sol:ProfitDistributor',
};

// Helper to get contract path from name
function getContractPath(contractName) {
  if (CONTRACT_PATHS[contractName]) {
    return CONTRACT_PATHS[contractName];
  }
  
  // For strategies, try to determine the path
  if (contractName.startsWith('HegicStrategy_')) {
    // Strategies are in various subdirectories - we'll need to handle this
    // For now, return a generic path that we'll resolve later
    return `contracts/Strategies/${contractName.replace('HegicStrategy_', 'HegicStrategy')}.sol:${contractName}`;
  }
  
  if (contractName.startsWith('PriceCalculator_')) {
    return `contracts/Strategies/PremiumCalculator.sol:${contractName}`;
  }
  
  return null;
}

async function checkVerificationStatus(address) {
  try {
    const response = await axios.get(API_URL, {
      params: {
        module: 'contract',
        action: 'getabi',
        address: address,
        apikey: ARBISCAN_API_KEY
      },
      timeout: 10000
    });
    
    if (response.data.status === '1' && response.data.result && 
        typeof response.data.result === 'string' && 
        !response.data.result.includes('not verified')) {
      return 'verified';
    }
    return 'not_verified';
  } catch (error) {
    console.warn(`  ⚠️ Error checking ${address}: ${error.message}`);
    return 'error';
  }
}

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function main() {
  console.log(`🔍 Checking verification status for ${Object.keys(addresses).length} contracts...\n`);
  
  const results = [];
  const contracts = Object.entries(addresses);
  
  for (let i = 0; i < contracts.length; i++) {
    const [name, address] = contracts[i];
    process.stdout.write(`[${i + 1}/${contracts.length}] Checking ${name}... `);
    
    const status = await checkVerificationStatus(address);
    results.push({ name, address, status });
    
    if (status === 'verified') {
      console.log('✅ Verified');
    } else if (status === 'not_verified') {
      console.log('❌ Not Verified');
    } else {
      console.log('⚠️ Error checking');
    }
    
    await sleep(DELAY_BETWEEN_REQUESTS);
  }
  
  // Summary
  const verified = results.filter(r => r.status === 'verified').length;
  const notVerified = results.filter(r => r.status === 'not_verified').length;
  const errors = results.filter(r => r.status === 'error').length;
  
  console.log(`\n📊 VERIFICATION STATUS SUMMARY`);
  console.log(`================================`);
  console.log(`✅ Verified: ${verified}`);
  console.log(`❌ Not Verified: ${notVerified}`);
  console.log(`⚠️ Errors: ${errors}`);
  console.log(`Total: ${results.length}`);
  
  // Save results
  const resultsFile = path.join(__dirname, '../verification-status-all.json');
  fs.writeFileSync(resultsFile, JSON.stringify(results, null, 2));
  console.log(`\n💾 Results saved to: ${resultsFile}`);
  
  // List unverified contracts
  const unverified = results.filter(r => r.status === 'not_verified');
  if (unverified.length > 0) {
    console.log(`\n📋 Unverified Contracts (${unverified.length}):`);
    unverified.forEach(({ name, address }) => {
      console.log(`  - ${name}: ${address}`);
    });
  }
  
  // Save unverified list
  const unverifiedFile = path.join(__dirname, '../unverified-contracts.json');
  fs.writeFileSync(unverifiedFile, JSON.stringify(unverified, null, 2));
  console.log(`\n💾 Unverified contracts saved to: ${unverifiedFile}`);
  
  return results;
}

main().catch(error => {
  console.error('❌ Error:', error);
  process.exit(1);
});
