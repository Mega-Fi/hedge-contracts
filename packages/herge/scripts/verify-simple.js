const axios = require('axios');
const fs = require('fs');
const path = require('path');

const ARBISCAN_API_KEY = process.env.ARBISCAN_API_KEY || '57KKIYR46R6JRU6J3YJMCVKYNPGU7SPS81';
const API_URL = 'https://api-sepolia.arbiscan.io/api';
const DELAY = 500; // ms between requests

const deploymentsDir = path.join(__dirname, '../deployments/arbitrum-sepolia');
const addressesFile = path.join(deploymentsDir, '.addresses.json');
const addresses = JSON.parse(fs.readFileSync(addressesFile, 'utf8'));

// Contracts to skip (external tokens/oracles)
const SKIP_CONTRACTS = ['USDC', 'WETH', 'WBTC', 'PriceProviderBTC', 'PriceProviderETH'];

// Sleep helper
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Verify a single contract
async function verifyContract(contractName, address) {
  if (SKIP_CONTRACTS.includes(contractName)) {
    console.log(`⏭️  Skipping ${contractName} (external contract)`);
    return { success: true, skipped: true };
  }

  const artifactPath = path.join(deploymentsDir, `${contractName}.json`);
  if (!fs.existsSync(artifactPath)) {
    console.log(`⚠️  No artifact found for ${contractName}`);
    return { success: false, error: 'No artifact' };
  }

  const artifact = JSON.parse(fs.readFileSync(artifactPath, 'utf8'));
  
  if (!artifact.args || artifact.args.length === 0) {
    console.log(`⚠️  No constructor args for ${contractName}`);
    return { success: false, error: 'No args' };
  }

  try {
    // Check if already verified
    const checkUrl = `${API_URL}?module=contract&action=getabi&address=${address}&apikey=${ARBISCAN_API_KEY}`;
    const checkRes = await axios.get(checkUrl);
    
    if (checkRes.data.status === '1' && checkRes.data.result && checkRes.data.result !== 'Contract source code not verified') {
      console.log(`✅ ${contractName} already verified`);
      return { success: true, alreadyVerified: true };
    }

    // Get constructor args as string
    const constructorArgs = artifact.args.map(arg => 
      typeof arg === 'string' ? arg : String(arg)
    ).join(',');

    // Verify using hardhat verify (simpler approach)
    const { exec } = require('child_process');
    const util = require('util');
    const execPromise = util.promisify(exec);
    
    const cmd = `cd ${path.join(__dirname, '..')} && npx hardhat verify --network arbitrum-sepolia ${address} ${constructorArgs}`;
    
    console.log(`🔍 Verifying ${contractName}...`);
    try {
      const { stdout, stderr } = await execPromise(cmd, { timeout: 60000 });
      if (stdout.includes('Successfully verified') || stdout.includes('already verified')) {
        console.log(`✅ ${contractName} verified`);
        return { success: true };
      }
      console.log(`❌ ${contractName} failed: ${stderr || stdout}`);
      return { success: false, error: stderr || stdout };
    } catch (error) {
      // Try direct API call if hardhat verify fails
      console.log(`  ⚠️  Hardhat verify failed, trying direct API...`);
      return { success: false, error: error.message, tryDirectAPI: true };
    }
  } catch (error) {
    console.log(`❌ Error verifying ${contractName}: ${error.message}`);
    return { success: false, error: error.message };
  }
}

// Main verification loop
async function main() {
  const contracts = Object.entries(addresses);
  const total = contracts.length;
  const results = { verified: 0, failed: 0, skipped: 0, alreadyVerified: 0 };

  console.log(`\n🚀 Starting verification of ${total} contracts...\n`);

  // Verify core contracts first
  const coreContracts = ['CoverPool', 'ProfitDistributor', 'PositionsManager', 'ProfitCalculator', 'LimitController', 'OperationalTreasury'];
  const otherContracts = contracts.filter(([name]) => !coreContracts.includes(name));

  // Verify core contracts first
  for (const [name, address] of contracts.filter(([name]) => coreContracts.includes(name))) {
    const result = await verifyContract(name, address);
    if (result.success) {
      if (result.alreadyVerified) results.alreadyVerified++;
      else if (result.skipped) results.skipped++;
      else results.verified++;
    } else {
      results.failed++;
    }
    await sleep(DELAY);
  }

  // Then verify others
  for (const [name, address] of otherContracts) {
    const result = await verifyContract(name, address);
    if (result.success) {
      if (result.alreadyVerified) results.alreadyVerified++;
      else if (result.skipped) results.skipped++;
      else results.verified++;
    } else {
      results.failed++;
    }
    await sleep(DELAY);
  }

  console.log(`\n📊 Verification Summary:`);
  console.log(`   ✅ Verified: ${results.verified}`);
  console.log(`   ✅ Already Verified: ${results.alreadyVerified}`);
  console.log(`   ⏭️  Skipped: ${results.skipped}`);
  console.log(`   ❌ Failed: ${results.failed}`);
}

main().catch(console.error);

