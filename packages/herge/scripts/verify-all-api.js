const axios = require('axios');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const util = require('util');
const execPromise = util.promisify(exec);

const ARBISCAN_API_KEY = process.env.ARBISCAN_API_KEY;
if (!ARBISCAN_API_KEY) {
  console.error('❌ ARBISCAN_API_KEY environment variable is required!');
  process.exit(1);
}
const API_URL = 'https://api-sepolia.arbiscan.io/api';
const DELAY_BETWEEN_REQUESTS = 3000; // 3 seconds between requests (slightly faster)

const deploymentsDir = path.join(__dirname, '../deployments/arbitrum-sepolia');
const addressesFile = path.join(deploymentsDir, '.addresses.json');
const addresses = JSON.parse(fs.readFileSync(addressesFile, 'utf8'));

// Cache for flattened source code (keyed by source file path)
const flattenedCache = {};

// Helper to extract source file from metadata
function extractSourceFile(metadataJson) {
  try {
    const metadata = JSON.parse(metadataJson);
    if (metadata.sources) {
      // Get the first (usually only) source file
      const sourceFiles = Object.keys(metadata.sources);
      if (sourceFiles.length > 0) {
        return sourceFiles[0];
      }
    }
  } catch (e) {
    // Metadata might be a string or malformed
  }
  return null;
}

// Helper to extract contract name from deployment artifact
function getContractNameFromArtifact(artifact) {
  // Try to find contract name in metadata or use filename
  if (artifact.metadata) {
    try {
      const metadata = typeof artifact.metadata === 'string' ? JSON.parse(artifact.metadata) : artifact.metadata;
      if (metadata.settings && metadata.settings.compilationTarget) {
        const targets = Object.keys(metadata.settings.compilationTarget);
        if (targets.length > 0) {
          const target = targets[0];
          const contractName = metadata.settings.compilationTarget[target];
          return { sourceFile: target, contractName };
        }
      }
    } catch (e) {
      // Ignore parse errors
    }
  }
  return null;
}

// Flatten contract source
async function flattenContract(sourceFile) {
  if (flattenedCache[sourceFile]) {
    return flattenedCache[sourceFile];
  }
  
  console.log(`  📝 Flattening ${sourceFile}...`);
  try {
    const { stdout } = await execPromise(`cd ${path.join(__dirname, '..')} && npx hardhat flatten ${sourceFile}`, {
      maxBuffer: 10 * 1024 * 1024
    });
    
    // Remove duplicate SPDX licenses
    const lines = stdout.split('\n');
    const seenLicenses = new Set();
    const cleaned = lines.filter(line => {
      if (line.includes('SPDX-License-Identifier')) {
        if (seenLicenses.has(line.trim())) {
          return false;
        }
        seenLicenses.add(line.trim());
      }
      return true;
    });
    
    const flattened = cleaned.join('\n');
    flattenedCache[sourceFile] = flattened;
    return flattened;
  } catch (error) {
    console.error(`  ❌ Error flattening ${sourceFile}: ${error.message}`);
    throw error;
  }
}

// Encode constructor arguments
function encodeConstructorArgs(artifact, args) {
  // For now, we'll try to get args from artifact
  // This is a simplified version - may need ABI encoding for complex args
  if (!args || args.length === 0) {
    return '';
  }
  
  // If args are already hex strings, return as is
  // Otherwise, we'd need to use ethers to encode them properly
  // For simplicity, returning empty string - Arbiscan can often auto-detect
  return '';
}

// Verify contract via Arbiscan API
async function verifyContractAPI(contractName, address, sourceFile, contractNameInSource, constructorArgs = '') {
  try {
    const sourceCode = await flattenContract(sourceFile);
    
    const formData = new URLSearchParams({
      apikey: ARBISCAN_API_KEY,
      module: 'contract',
      action: 'verifysourcecode',
      contractaddress: address,
      sourceCode: sourceCode,
      codeformat: 'solidity-single-file',
      contractname: contractNameInSource || contractName,
      compilerversion: 'v0.8.15+commit.e14f2714',
      optimizationUsed: '1',
      runs: '200',
      constructorArguements: constructorArgs,
      evmversion: 'default',
      licenseType: '3' // GPL-3.0
    });
    
    const response = await axios.post(API_URL, formData.toString(), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      timeout: 30000
    });
    
    if (response.data.status === '1') {
      const guid = response.data.result;
      console.log(`  ✅ Verification submitted! GUID: ${guid}`);
      return { status: 'submitted', guid };
    } else {
      console.error(`  ❌ Error: ${response.data.message || JSON.stringify(response.data.result)}`);
      return { status: 'failed', error: response.data.message || response.data.result };
    }
  } catch (error) {
    console.error(`  ❌ Exception: ${error.message}`);
    if (error.response) {
      console.error(`  Response: ${JSON.stringify(error.response.data)}`);
    }
    return { status: 'error', error: error.message };
  }
}

// Main verification function
async function verifyContractFromArtifact(contractName, address) {
  const artifactPath = path.join(deploymentsDir, `${contractName}.json`);
  
  if (!fs.existsSync(artifactPath)) {
    console.log(`  ⚠️ Artifact not found for ${contractName}`);
    return { name: contractName, address, status: 'error', error: 'artifact_not_found' };
  }
  
  const artifact = JSON.parse(fs.readFileSync(artifactPath, 'utf8'));
  const contractInfo = getContractNameFromArtifact(artifact);
  
  if (!contractInfo) {
    console.log(`  ⚠️ Could not extract contract info for ${contractName}`);
    return { name: contractName, address, status: 'error', error: 'could_not_extract_info' };
  }
  
  const constructorArgs = encodeConstructorArgs(artifact, artifact.args);
  
  console.log(`  📋 Source: ${contractInfo.sourceFile}, Contract: ${contractInfo.contractName}`);
  
  const result = await verifyContractAPI(
    contractName,
    address,
    contractInfo.sourceFile,
    contractInfo.contractName,
    constructorArgs
  );
  
  return { name: contractName, address, ...result };
}

async function main() {
  console.log(`🚀 Starting API-based verification for ${Object.keys(addresses).length} contracts...\n`);
  console.log(`⏱️ Estimated time: ~${Math.ceil(Object.keys(addresses).length * DELAY_BETWEEN_REQUESTS / 60000)} minutes\n`);
  
  const results = [];
  const contracts = Object.entries(addresses);
  
  for (let i = 0; i < contracts.length; i++) {
    const [name, address] = contracts[i];
    console.log(`\n[${i + 1}/${contracts.length}] Verifying ${name}...`);
    
    try {
      const result = await verifyContractFromArtifact(name, address);
      results.push(result);
      
      // Save progress every 10 contracts
      if ((i + 1) % 10 === 0) {
        const progressFile = path.join(__dirname, '../verification-progress-api.json');
        fs.writeFileSync(progressFile, JSON.stringify(results, null, 2));
        console.log(`\n💾 Progress saved (${i + 1}/${contracts.length} completed)`);
      }
    } catch (error) {
      console.error(`  ❌ Fatal error verifying ${name}: ${error.message}`);
      results.push({ name, address, status: 'error', error: error.message });
    }
    
    // Delay between requests
    if (i < contracts.length - 1) {
      await new Promise(resolve => setTimeout(resolve, DELAY_BETWEEN_REQUESTS));
    }
  }
  
  // Final summary
  const submitted = results.filter(r => r.status === 'submitted').length;
  const failed = results.filter(r => r.status === 'failed' || r.status === 'error').length;
  
  console.log(`\n\n📊 VERIFICATION SUMMARY`);
  console.log(`================================`);
  console.log(`✅ Submitted: ${submitted}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`Total: ${results.length}`);
  
  // Save final results
  const resultsFile = path.join(__dirname, '../verification-api-results.json');
  fs.writeFileSync(resultsFile, JSON.stringify(results, null, 2));
  console.log(`\n💾 Results saved to: ${resultsFile}`);
}

main().catch(error => {
  console.error('❌ Fatal error:', error);
  process.exit(1);
});
