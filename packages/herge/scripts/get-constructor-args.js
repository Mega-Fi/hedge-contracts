#!/usr/bin/env node
// Get constructor arguments for a deployed contract

const fs = require('fs');
const path = require('path');

const contractName = process.argv[2];

if (!contractName) {
  console.error('Usage: node get-constructor-args.js <ContractName>');
  console.error('Example: node get-constructor-args.js CoverPool');
  process.exit(1);
}

const artifactPath = path.join(__dirname, '../deployments/arbitrum-sepolia', `${contractName}.json`);

if (!fs.existsSync(artifactPath)) {
  console.error(`❌ Artifact not found: ${artifactPath}`);
  process.exit(1);
}

const artifact = JSON.parse(fs.readFileSync(artifactPath, 'utf8'));

console.log(`\n📋 Constructor Arguments for ${contractName}:`);
console.log(`   Address: ${artifact.address}\n`);

if (!artifact.args || artifact.args.length === 0) {
  console.log('   No constructor arguments (empty constructor)');
  process.exit(0);
}

console.log('   Raw Arguments:');
artifact.args.forEach((arg, idx) => {
  console.log(`     [${idx}]: ${arg}`);
});

// Try to get constructor signature from ABI
const constructor = artifact.abi.find(item => item.type === 'constructor');
if (constructor && constructor.inputs) {
  console.log('\n   Constructor Signature:');
  const params = constructor.inputs.map((input, idx) => {
    return `${artifact.args[idx]} (${input.type})`;
  });
  params.forEach((param, idx) => {
    console.log(`     [${idx}]: ${param}`);
  });
  
  // Try to encode if ethers is available
  try {
    const { ethers } = require('ethers');
    const types = constructor.inputs.map(i => i.type);
    const encoded = ethers.utils.defaultAbiCoder.encode(types, artifact.args);
    console.log(`\n   ABI-Encoded (for verification):`);
    console.log(`     ${encoded.slice(2)}`);
    console.log(`     (Remove 0x prefix when pasting into Arbiscan)`);
  } catch (e) {
    console.log('\n   💡 Install ethers.js to get ABI-encoded format');
  }
}

console.log('');

