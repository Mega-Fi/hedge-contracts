const axios = require('axios');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const util = require('util');
const execPromise = util.promisify(exec);

const ARBISCAN_API_KEY = process.env.ARBISCAN_API_KEY || 'YOUR_ARBISCAN_API_KEY';
const API_URL = 'https://api-sepolia.arbiscan.io/v2/api';
const DELAY_BETWEEN_REQUESTS = 5000; // 5 seconds between requests

// Priority contracts to verify
const PRIORITY_CONTRACTS = [
  {
    name: 'CoverPool',
    address: '0xAd02465752782893045089396277697Af935dAdB',
    contractPath: 'contracts/CoverPool.sol:CoverPool'
  },
  {
    name: 'OperationalTreasury',
    address: '0xeD5129B6Fc93C1D9c8278E540c4986dB9DC9D930',
    contractPath: 'contracts/OperationalTreasury.sol:OperationalTreasury'
  },
  {
    name: 'PositionsManager',
    address: '0x88a2887bD21974ea9a8D23553eeE532B8a8e2AB3',
    contractPath: 'contracts/PositionsManager/PositionsManager.sol:PositionsManager'
  },
  {
    name: 'ProfitCalculator',
    address: '0x1c64D2205415C4355Ad6C04250B4bA753758CcDc',
    contractPath: 'contracts/Strategies/ProfitCalculator.sol:ProfitCalculator'
  },
  {
    name: 'LimitController',
    address: '0xb20aBac673Fc2f0Eb44fe911E65B262cDEfeb3e8',
    contractPath: 'contracts/Strategies/LimitController.sol:LimitController'
  },
  {
    name: 'ProfitDistributor',
    address: '0x2770Ba51F4e1712E7B424c392cf157B42B17C739',
    contractPath: 'contracts/ProfitDistributor.sol:ProfitDistributor'
  }
];

async function flattenContract(contractPath) {
  // Extract just the file path (remove :ContractName if present)
  const filePath = contractPath.split(':')[0];
  console.log(`  📝 Flattening ${filePath}...`);
  try {
    const { stdout } = await execPromise(`npx hardhat flatten ${filePath}`);
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
    return cleaned.join('\n');
  } catch (error) {
    console.error(`  ❌ Error flattening: ${error.message}`);
    throw error;
  }
}

async function checkVerificationStatus(address) {
  try {
    const response = await axios.get(API_URL, {
      params: {
        module: 'contract',
        action: 'getsourcecode',
        address: address,
        apikey: ARBISCAN_API_KEY
      }
    });
    
    if (response.data.status === '1' && response.data.result[0].SourceCode !== '') {
      return true; // Already verified
    }
    return false;
  } catch (error) {
    console.error(`  ⚠️ Error checking status: ${error.message}`);
    return false;
  }
}

async function verifyContract(contract) {
  console.log(`\n🔍 Verifying ${contract.name} at ${contract.address}...`);
  
  // Check if already verified
  const isVerified = await checkVerificationStatus(contract.address);
  if (isVerified) {
    console.log(`  ✅ Already verified!`);
    return { success: true, alreadyVerified: true };
  }
  
  try {
    // Flatten the contract
    const sourceCode = await flattenContract(contract.contractPath);
    
    // Get constructor arguments from deployment
    const deploymentPath = path.join(__dirname, '..', 'deployments', 'arbitrum-sepolia', `${contract.name}.json`);
    let constructorArgs = '';
    
    if (fs.existsSync(deploymentPath)) {
      const deployment = JSON.parse(fs.readFileSync(deploymentPath, 'utf8'));
      if (deployment.args && deployment.args.length > 0) {
        // Encode constructor arguments
        const { ethers } = require('ethers');
        const iface = new ethers.utils.Interface(deployment.abi);
        const constructor = iface.fragments.find(f => f.type === 'constructor');
        if (constructor) {
          constructorArgs = iface.encodeDeploy(deployment.args).slice(2); // Remove 0x
        }
      }
    }
    
    // Submit verification request (V2 format)
    console.log(`  📤 Submitting to Arbiscan...`);
    const formData = {
      chainId: '421614',
      codeformat: 'solidity-single-file',
      contractaddress: contract.address,
      contractname: contract.contractPath.split(':')[1],
      compilerversion: 'v0.8.15+commit.e14f2714',
      optimizationUsed: '1',
      runs: '200',
      constructorArguements: constructorArgs,
      evmversion: 'default',
      licenseType: '3', // GPL-3.0
      sourceCode: sourceCode
    };
    
    const response = await axios.post(
      `${API_URL}?module=contract&action=verifysourcecode&apikey=${ARBISCAN_API_KEY}`,
      new URLSearchParams(formData).toString(),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    );
    
    if (response.data.status === '1') {
      const guid = response.data.result;
      console.log(`  ⏳ Verification submitted! GUID: ${guid}`);
      console.log(`  ⏱️ Waiting for confirmation...`);
      
      // Poll for verification result
      for (let i = 0; i < 10; i++) {
        await new Promise(resolve => setTimeout(resolve, 5000));
        
        const statusResponse = await axios.get(API_URL, {
          params: {
            module: 'contract',
            action: 'checkverifystatus',
            guid: guid,
            apikey: ARBISCAN_API_KEY
          }
        });
        
        if (statusResponse.data.status === '1') {
          console.log(`  ✅ Verified successfully!`);
          return { success: true, guid: guid };
        } else if (statusResponse.data.result.includes('Fail')) {
          console.log(`  ❌ Verification failed: ${statusResponse.data.result}`);
          return { success: false, error: statusResponse.data.result };
        }
        
        console.log(`  ⏳ Still processing... (${i + 1}/10)`);
      }
      
      console.log(`  ⏱️ Timeout waiting for verification, but it may complete later.`);
      return { success: 'pending', guid: guid };
    } else {
      console.log(`  ❌ Failed to submit: ${response.data.result}`);
      return { success: false, error: response.data.result };
    }
  } catch (error) {
    console.log(`  ❌ Error: ${error.message}`);
    if (error.response) {
      console.log(`  📋 Response: ${JSON.stringify(error.response.data)}`);
    }
    return { success: false, error: error.message };
  }
}

async function main() {
  console.log('🚀 Starting Contract Verification on Arbitrum Sepolia');
  console.log('=' .repeat(60));
  
  const results = [];
  
  for (const contract of PRIORITY_CONTRACTS) {
    const result = await verifyContract(contract);
    results.push({ contract: contract.name, ...result });
    
    // Wait between requests to avoid rate limiting
    if (PRIORITY_CONTRACTS.indexOf(contract) < PRIORITY_CONTRACTS.length - 1) {
      console.log(`\n⏸️ Waiting ${DELAY_BETWEEN_REQUESTS / 1000}s before next verification...`);
      await new Promise(resolve => setTimeout(resolve, DELAY_BETWEEN_REQUESTS));
    }
  }
  
  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('📊 VERIFICATION SUMMARY');
  console.log('='.repeat(60));
  
  const verified = results.filter(r => r.success === true).length;
  const failed = results.filter(r => r.success === false).length;
  const pending = results.filter(r => r.success === 'pending').length;
  const alreadyVerified = results.filter(r => r.alreadyVerified).length;
  
  console.log(`✅ Successfully verified: ${verified}`);
  console.log(`✅ Already verified: ${alreadyVerified}`);
  console.log(`⏳ Pending: ${pending}`);
  console.log(`❌ Failed: ${failed}`);
  
  console.log('\n📋 Detailed Results:');
  results.forEach(r => {
    const status = r.alreadyVerified ? '✅ Already' : 
                   r.success === true ? '✅ Success' : 
                   r.success === 'pending' ? '⏳ Pending' : 
                   '❌ Failed';
    console.log(`  ${status} - ${r.contract}`);
    if (r.error) {
      console.log(`    Error: ${r.error}`);
    }
  });
  
  // Save results
  const resultsPath = path.join(__dirname, '..', 'verification-results.json');
  fs.writeFileSync(resultsPath, JSON.stringify(results, null, 2));
  console.log(`\n💾 Results saved to: verification-results.json`);
  
  console.log('\n🔗 View verified contracts at:');
  console.log('   https://sepolia.arbiscan.io/address/<CONTRACT_ADDRESS>#code');
}

main().catch(console.error);

