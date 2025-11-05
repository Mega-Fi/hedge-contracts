const axios = require('axios');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const util = require('util');
const execPromise = util.promisify(exec);

const ARBISCAN_API_KEY = process.env.ARBISCAN_API_KEY || '57KKIYR46R6JRU6J3YJMCVKYNPGU7SPS81';
const API_URL = 'https://api-sepolia.arbiscan.io/api';
const DELAY = 2000; // 2 seconds between requests to avoid rate limits

const deploymentsDir = path.join(__dirname, '../deployments/arbitrum-sepolia');
const addressesFile = path.join(deploymentsDir, '.addresses.json');
const addresses = JSON.parse(fs.readFileSync(addressesFile, 'utf8'));

// Contracts to skip (external tokens/oracles)
const SKIP_CONTRACTS = ['USDC', 'WETH', 'WBTC', 'PriceProviderBTC', 'PriceProviderETH'];

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Check if contract is already verified
async function isVerified(address) {
  try {
    const url = `${API_URL}?module=contract&action=getabi&address=${address}&apikey=${ARBISCAN_API_KEY}`;
    const response = await axios.get(url);
    return response.data.status === '1' && response.data.result && 
           response.data.result !== 'Contract source code not verified';
  } catch (error) {
    return false;
  }
}

// Get constructor args from deployment artifact
function getConstructorArgs(contractName) {
  const artifactPath = path.join(deploymentsDir, `${contractName}.json`);
  if (!fs.existsSync(artifactPath)) return null;
  
  const artifact = JSON.parse(fs.readFileSync(artifactPath, 'utf8'));
  return artifact.args || null;
}

// Verify contract using direct API call
async function verifyContractDirect(contractName, address) {
  if (SKIP_CONTRACTS.includes(contractName)) {
    return { success: true, skipped: true, message: 'External contract' };
  }

  // Check if already verified
  if (await isVerified(address)) {
    return { success: true, alreadyVerified: true };
  }

  const artifactPath = path.join(deploymentsDir, `${contractName}.json`);
  if (!fs.existsSync(artifactPath)) {
    return { success: false, error: 'No artifact found' };
  }

  const artifact = JSON.parse(fs.readFileSync(artifactPath, 'utf8'));
  const args = artifact.args;
  
  if (!args || args.length === 0) {
    return { success: false, error: 'No constructor args' };
  }

  // Get source file and contract name from metadata
  let sourceFile = null;
  let contractNameFromMetadata = null;
  
  if (artifact.metadata) {
    try {
      const metadata = typeof artifact.metadata === 'string' 
        ? JSON.parse(artifact.metadata) 
        : artifact.metadata;
      
      if (metadata.settings && metadata.settings.compilationTarget) {
        const targets = Object.keys(metadata.settings.compilationTarget);
        if (targets.length > 0) {
          sourceFile = targets[0];
          contractNameFromMetadata = metadata.settings.compilationTarget[targets[0]];
        }
      }
    } catch (e) {
      // Ignore
    }
  }

  if (!sourceFile || sourceFile.startsWith('@hegic/v8888')) {
    // Skip contracts from v8888 package for now (flattening issues)
    return { success: false, error: 'External package contract (flattening needed)' };
  }

  // Format constructor args as ABI-encoded string
  const constructorArgs = args.map(arg => {
    if (typeof arg === 'string') {
      return arg.startsWith('0x') ? arg : arg;
    }
    return String(arg);
  });

  // Try to flatten and verify
  try {
    console.log(`  📝 Flattening ${sourceFile}...`);
    const flattenCmd = `cd ${path.join(__dirname, '..')} && npx hardhat flatten ${sourceFile}`;
    const { stdout: flattenedCode } = await execPromise(flattenCmd, { 
      maxBuffer: 10 * 1024 * 1024,
      timeout: 30000
    });

    // Clean up duplicate SPDX licenses
    const lines = flattenedCode.split('\n');
    const seenLicenses = new Set();
    const cleaned = lines.filter(line => {
      if (line.includes('SPDX-License-Identifier')) {
        if (seenLicenses.has(line.trim())) return false;
        seenLicenses.add(line.trim());
      }
      return true;
    }).join('\n');

    // Submit verification
    const formData = new URLSearchParams();
    formData.append('apikey', ARBISCAN_API_KEY);
    formData.append('module', 'contract');
    formData.append('action', 'verifysourcecode');
    formData.append('contractaddress', address);
    formData.append('sourceCode', cleaned);
    formData.append('codeformat', 'solidity-single-file');
    formData.append('contractname', contractNameFromMetadata || contractName);
    formData.append('compilerversion', 'v0.8.15+commit.e14f2714');
    formData.append('optimizationUsed', '1');
    formData.append('runs', '200');
    formData.append('constructorArgu', JSON.stringify(constructorArgs));

    console.log(`  📤 Submitting verification for ${contractName}...`);
    const verifyUrl = `${API_URL}`;
    const response = await axios.post(verifyUrl, formData, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });

    if (response.data.status === '1') {
      console.log(`  ✅ Verification submitted for ${contractName} (GUID: ${response.data.result})`);
      return { success: true, guid: response.data.result };
    } else {
      console.log(`  ❌ Verification failed: ${response.data.message || response.data.result}`);
      return { success: false, error: response.data.message || response.data.result };
    }
  } catch (error) {
    return { success: false, error: error.message };
  }
}

// Main function
async function main() {
  const contracts = Object.entries(addresses);
  const total = contracts.length;
  const results = { verified: 0, submitted: 0, failed: 0, skipped: 0, alreadyVerified: 0 };

  console.log(`\n🚀 Starting verification of ${total} contracts on Arbitrum Sepolia...\n`);

  // Prioritize core contracts
  const coreContracts = ['CoverPool', 'ProfitDistributor', 'PositionsManager', 'ProfitCalculator', 'LimitController', 'OperationalTreasury'];
  const core = contracts.filter(([name]) => coreContracts.includes(name));
  const others = contracts.filter(([name]) => !coreContracts.includes(name));

  // Verify core contracts first
  for (const [name, address] of core) {
    console.log(`[${core.indexOf([name, address]) + 1}/${core.length}] Verifying ${name}...`);
    const result = await verifyContractDirect(name, address);
    
    if (result.success) {
      if (result.alreadyVerified) results.alreadyVerified++;
      else if (result.skipped) results.skipped++;
      else if (result.guid) results.submitted++;
      else results.verified++;
    } else {
      results.failed++;
      console.log(`  ❌ ${result.error}`);
    }
    
    await sleep(DELAY);
  }

  // Then verify others
  for (const [name, address] of others) {
    console.log(`[${others.indexOf([name, address]) + core.length + 1}/${total}] Verifying ${name}...`);
    const result = await verifyContractDirect(name, address);
    
    if (result.success) {
      if (result.alreadyVerified) results.alreadyVerified++;
      else if (result.skipped) results.skipped++;
      else if (result.guid) results.submitted++;
      else results.verified++;
    } else {
      results.failed++;
      console.log(`  ❌ ${result.error}`);
    }
    
    await sleep(DELAY);
  }

  console.log(`\n📊 Verification Summary:`);
  console.log(`   ✅ Verified: ${results.verified}`);
  console.log(`   📤 Submitted: ${results.submitted}`);
  console.log(`   ✅ Already Verified: ${results.alreadyVerified}`);
  console.log(`   ⏭️  Skipped: ${results.skipped}`);
  console.log(`   ❌ Failed: ${results.failed}`);
  console.log(`\n💡 Note: Submitted verifications may take a few minutes to process on Arbiscan.\n`);
}

main().catch(console.error);

