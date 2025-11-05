const { exec } = require('child_process');
const util = require('util');
const fs = require('fs');
const path = require('path');

const execPromise = util.promisify(exec);
const DELAY_BETWEEN_REQUESTS = 5000; // 5 seconds between requests

// Load all addresses
const addressesFile = path.join(__dirname, '../deployments/arbitrum-sepolia/.addresses.json');
const addresses = JSON.parse(fs.readFileSync(addressesFile, 'utf8'));

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function verifyContract(contractName, address) {
  try {
    console.log(`\n🔍 Verifying ${contractName} at ${address}...`);
    
    // Use hardhat verify which reads from deployment artifacts
    const command = `cd ${path.join(__dirname, '..')} && npx hardhat verify --network arbitrum-sepolia ${address}`;
    
    const { stdout, stderr } = await execPromise(command, {
      timeout: 120000, // 2 minute timeout
      maxBuffer: 10 * 1024 * 1024 // 10MB buffer
    });
    
    if (stdout.includes('Successfully verified') || stdout.includes('Already Verified')) {
      console.log(`  ✅ ${contractName} verified successfully!`);
      return { name: contractName, address, status: 'verified', message: 'success' };
    } else {
      console.log(`  ⚠️ ${contractName} verification unclear. Output: ${stdout.substring(0, 200)}`);
      return { name: contractName, address, status: 'unclear', message: stdout.substring(0, 500) };
    }
  } catch (error) {
    // Check if it's already verified
    if (error.stdout && (error.stdout.includes('Already Verified') || error.stdout.includes('already verified'))) {
      console.log(`  ✅ ${contractName} already verified!`);
      return { name: contractName, address, status: 'verified', message: 'already_verified' };
    }
    
    // Check for other errors
    const errorMsg = error.stderr || error.message || '';
    if (errorMsg.includes('does not have bytecode')) {
      console.log(`  ❌ ${contractName} - Contract not found at address`);
      return { name: contractName, address, status: 'error', message: 'contract_not_found' };
    }
    
    console.log(`  ❌ ${contractName} verification failed: ${errorMsg.substring(0, 200)}`);
    return { name: contractName, address, status: 'failed', message: errorMsg.substring(0, 500) };
  }
}

async function main() {
  console.log(`🚀 Starting verification for ${Object.keys(addresses).length} contracts...\n`);
  console.log(`⚠️  This will take approximately ${Math.ceil(Object.keys(addresses).length * DELAY_BETWEEN_REQUESTS / 60000)} minutes\n`);
  
  const results = [];
  const contracts = Object.entries(addresses);
  
  for (let i = 0; i < contracts.length; i++) {
    const [name, address] = contracts[i];
    console.log(`\n[${i + 1}/${contracts.length}] Processing ${name}...`);
    
    const result = await verifyContract(name, address);
    results.push(result);
    
    // Save progress every 10 contracts
    if ((i + 1) % 10 === 0) {
      const progressFile = path.join(__dirname, '../verification-progress.json');
      fs.writeFileSync(progressFile, JSON.stringify(results, null, 2));
      console.log(`\n💾 Progress saved (${i + 1}/${contracts.length} completed)`);
    }
    
    // Delay between requests (except for last one)
    if (i < contracts.length - 1) {
      await sleep(DELAY_BETWEEN_REQUESTS);
    }
  }
  
  // Final summary
  const verified = results.filter(r => r.status === 'verified').length;
  const failed = results.filter(r => r.status === 'failed').length;
  const errors = results.filter(r => r.status === 'error').length;
  const unclear = results.filter(r => r.status === 'unclear').length;
  
  console.log(`\n\n📊 VERIFICATION SUMMARY`);
  console.log(`================================`);
  console.log(`✅ Verified: ${verified}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`⚠️  Errors: ${errors}`);
  console.log(`❓ Unclear: ${unclear}`);
  console.log(`Total: ${results.length}`);
  
  // Save final results
  const resultsFile = path.join(__dirname, '../verification-final-results.json');
  fs.writeFileSync(resultsFile, JSON.stringify(results, null, 2));
  console.log(`\n💾 Final results saved to: ${resultsFile}`);
  
  // List failed contracts
  const failedContracts = results.filter(r => r.status === 'failed' || r.status === 'error');
  if (failedContracts.length > 0) {
    console.log(`\n❌ Failed Contracts (${failedContracts.length}):`);
    failedContracts.forEach(({ name, address, message }) => {
      console.log(`  - ${name} (${address}): ${message.substring(0, 100)}`);
    });
  }
}

main().catch(error => {
  console.error('❌ Fatal error:', error);
  process.exit(1);
});
