const axios = require('axios');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const util = require('util');
const execPromise = util.promisify(exec);

const ARBISCAN_API_KEY = process.env.ARBISCAN_API_KEY || '57KKIYR46R6JRU6J3YJMCVKYNPGU7SPS81';
const API_URL = 'https://api-sepolia.arbiscan.io/api';
const DELAY = 3000; // 3 seconds between requests

const deploymentsDir = path.join(__dirname, '../deployments/arbitrum-sepolia');
const addressesFile = path.join(deploymentsDir, '.addresses.json');
const addresses = JSON.parse(fs.readFileSync(addressesFile, 'utf8'));

// Skip external contracts
const SKIP_CONTRACTS = ['USDC', 'WETH', 'WBTC', 'PriceProviderBTC', 'PriceProviderETH'];

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Check if contract is already verified
async function isVerified(address) {
  try {
    const url = `${API_URL}?module=contract&action=getabi&address=${address}&apikey=${ARBISCAN_API_KEY}`;
    const response = await axios.get(url);
    if (response.data.status === '1' && response.data.result && response.data.result !== 'Contract source code not verified') {
      return true;
    }
    return false;
  } catch (error) {
    return false;
  }
}

// Get contract source path from deployment artifact
function getSourcePath(contractName) {
  const artifactPath = path.join(deploymentsDir, `${contractName}.json`);
  if (!fs.existsSync(artifactPath)) return null;
  
  const artifact = JSON.parse(fs.readFileSync(artifactPath, 'utf8'));
  
  // Try to get source from metadata
  if (artifact.metadata) {
    try {
      const metadata = typeof artifact.metadata === 'string' 
        ? JSON.parse(artifact.metadata) 
        : artifact.metadata;
      
      if (metadata.settings && metadata.settings.compilationTarget) {
        const targets = Object.keys(metadata.settings.compilationTarget);
        if (targets.length > 0) {
          return targets[0]; // Return the source file path
        }
      }
    } catch (e) {
      // Ignore
    }
  }
  
  // Fallback: try to find contract in contracts directory
  const contractPath = path.join(__dirname, '../contracts', `${contractName}.sol`);
  if (fs.existsSync(contractPath)) {
    return `contracts/${contractName}.sol`;
  }
  
  return null;
}

// Flatten contract source
async function flattenContract(sourcePath) {
  if (!sourcePath) return null;
  
  // Skip v8888 package contracts (flattening issues)
  if (sourcePath.includes('@hegic/v8888')) {
    console.log(`  ⚠️  Skipping flattening for external package: ${sourcePath}`);
    return null;
  }
  
  try {
    const contractPath = path.join(__dirname, '..', sourcePath);
    if (!fs.existsSync(contractPath)) {
      // Try to find it in contracts directory
      const contractName = path.basename(sourcePath);
      const altPath = path.join(__dirname, '../contracts', contractName);
      if (!fs.existsSync(altPath)) {
        console.log(`  ⚠️  Source file not found: ${sourcePath}`);
        return null;
      }
      const { stdout } = await execPromise(`cd ${path.join(__dirname, '..')} && npx hardhat flatten ${altPath}`, {
        maxBuffer: 10 * 1024 * 1024,
        timeout: 30000
      });
      
      // Clean duplicate SPDX licenses
      const lines = stdout.split('\n');
      const seenLicenses = new Set();
      return lines.filter(line => {
        if (line.includes('SPDX-License-Identifier')) {
          if (seenLicenses.has(line.trim())) return false;
          seenLicenses.add(line.trim());
        }
        return true;
      }).join('\n');
    }
    
    const { stdout } = await execPromise(`cd ${path.join(__dirname, '..')} && npx hardhat flatten ${contractPath}`, {
      maxBuffer: 10 * 1024 * 1024,
      timeout: 30000
    });
    
    // Clean duplicate SPDX licenses
    const lines = stdout.split('\n');
    const seenLicenses = new Set();
    return lines.filter(line => {
      if (line.includes('SPDX-License-Identifier')) {
        if (seenLicenses.has(line.trim())) return false;
        seenLicenses.add(line.trim());
      }
      return true;
    }).join('\n');
  } catch (error) {
    console.log(`  ❌ Flattening failed: ${error.message}`);
    return null;
  }
}

// Verify contract via API
async function verifyContract(contractName, address) {
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
  const args = artifact.args || [];
  
  // Get source path
  const sourcePath = getSourcePath(contractName);
  if (!sourcePath) {
    return { success: false, error: 'Could not determine source path' };
  }

  // Flatten contract
  console.log(`  📝 Flattening ${sourcePath}...`);
  const flattenedCode = await flattenContract(sourcePath);
  if (!flattenedCode) {
    return { success: false, error: 'Flattening failed' };
  }

  // Get contract name from source path
  const contractNameFromPath = path.basename(sourcePath, '.sol');
  
  // Encode constructor arguments using ABI
  let constructorArgsEncoded = '';
  if (args.length > 0) {
    try {
      const { ethers } = require('ethers');
      const iface = new ethers.utils.Interface(artifact.abi);
      const constructorFragment = iface.fragments.find(f => f.type === 'constructor');
      
      if (constructorFragment && constructorFragment.inputs.length === args.length) {
        // Use ABI encoder
        const encoded = ethers.utils.defaultAbiCoder.encode(
          constructorFragment.inputs.map(i => i.type),
          args
        );
        constructorArgsEncoded = encoded.slice(2); // Remove 0x prefix
        console.log(`  📝 Constructor args encoded: ${constructorArgsEncoded.substring(0, 20)}...`);
      } else {
        console.log(`  ⚠️  Constructor args mismatch, trying without ABI encoding...`);
        // Fallback: try simple encoding
        constructorArgsEncoded = args.map(arg => {
          if (typeof arg === 'string') {
            return arg.startsWith('0x') ? arg.slice(2) : ethers.utils.hexlify(ethers.utils.toUtf8Bytes(arg)).slice(2);
          }
          return ethers.BigNumber.from(arg).toHexString().slice(2);
        }).join('');
      }
    } catch (e) {
      // If encoding fails, try without args
      console.log(`  ⚠️  Constructor args encoding failed (${e.message}), trying without...`);
      constructorArgsEncoded = '';
    }
  }

  // Submit verification using V1 API (form-urlencoded)
  try {
    const formData = new URLSearchParams();
    formData.append('apikey', ARBISCAN_API_KEY);
    formData.append('module', 'contract');
    formData.append('action', 'verifysourcecode');
    formData.append('contractaddress', address);
    formData.append('sourceCode', flattenedCode);
    formData.append('codeformat', 'solidity-single-file');
    formData.append('contractname', contractNameFromPath);
    formData.append('compilerversion', 'v0.8.15+commit.e14f2714');
    formData.append('optimizationUsed', '1');
    formData.append('runs', '200');
    formData.append('evmversion', 'default');
    formData.append('licenseType', '3'); // GPL-3.0
    if (constructorArgsEncoded) {
      formData.append('constructorArguements', constructorArgsEncoded);
    }

    console.log(`  📤 Submitting verification...`);
    const response = await axios.post(API_URL, formData, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      timeout: 30000
    });

    if (response.data.status === '1') {
      const guid = response.data.result;
      console.log(`  ✅ Verification submitted! GUID: ${guid}`);
      console.log(`  📝 Check status: https://sepolia.arbiscan.io/address/${address}#code`);
      return { success: true, guid, message: 'Verification submitted' };
    } else {
      const errorMsg = response.data.message || response.data.result || 'Unknown error';
      console.log(`  ❌ Verification failed: ${errorMsg}`);
      console.log(`  📋 Full response:`, JSON.stringify(response.data, null, 2));
      return { success: false, error: errorMsg, details: response.data };
    }
  } catch (error) {
    console.log(`  ❌ API error: ${error.message}`);
    return { success: false, error: error.message };
  }
}

// Main verification function
async function main() {
  const contracts = Object.entries(addresses);
  const total = contracts.length;
  const results = { verified: 0, submitted: 0, failed: 0, skipped: 0, alreadyVerified: 0 };

  console.log(`\n🚀 Starting verification of ${total} contracts on Arbitrum Sepolia...\n`);
  console.log(`📋 API Key: ${ARBISCAN_API_KEY.substring(0, 10)}...\n`);

  // Prioritize core contracts
  const coreContracts = ['CoverPool', 'ProfitDistributor', 'PositionsManager', 'ProfitCalculator', 'LimitController', 'OperationalTreasury'];
  const core = contracts.filter(([name]) => coreContracts.includes(name));
  const others = contracts.filter(([name]) => !coreContracts.includes(name));

  console.log(`🎯 Verifying ${core.length} core contracts first...\n`);

  // Verify core contracts first
  for (const [name, address] of core) {
    console.log(`[${core.indexOf([name, address]) + 1}/${core.length}] 🔍 Verifying ${name}...`);
    const result = await verifyContract(name, address);
    
    if (result.success) {
      if (result.alreadyVerified) {
        results.alreadyVerified++;
        console.log(`  ✅ Already verified!\n`);
      } else if (result.skipped) {
        results.skipped++;
        console.log(`  ⏭️  Skipped: ${result.message}\n`);
      } else if (result.guid) {
        results.submitted++;
        console.log(`  ✅ Submitted successfully!\n`);
      } else {
        results.verified++;
        console.log(`  ✅ Verified!\n`);
      }
    } else {
      results.failed++;
      console.log(`  ❌ Failed: ${result.error}\n`);
    }
    
    await sleep(DELAY);
  }

  console.log(`\n📊 Core Contracts Summary:`);
  console.log(`   ✅ Verified/Submitted: ${results.submitted + results.verified}`);
  console.log(`   ✅ Already Verified: ${results.alreadyVerified}`);
  console.log(`   ⏭️  Skipped: ${results.skipped}`);
  console.log(`   ❌ Failed: ${results.failed}`);
  
  console.log(`\n💡 Note: With ${others.length} additional contracts, consider verifying only unique implementations.`);
  console.log(`   Strategy contracts share similar code patterns.\n`);

  // Ask if user wants to continue with others
  console.log(`\n📝 To verify all contracts, run this script again or modify to continue.\n`);
}

main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});

