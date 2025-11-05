# Manual Contract Verification Guide - Arbitrum Sepolia

## 🚨 Current Status

**Automated verification is blocked** due to Arbiscan API migration (V1 deprecated, V2 endpoint unavailable).  
**Solution:** Manual verification via Arbiscan web UI.

---

## 📋 Prerequisites

1. **Flattened source files** - We'll generate these
2. **Constructor arguments** - Available in deployment artifacts
3. **Arbiscan account** - Not required, but helpful for tracking

---

## 🎯 Priority Contracts to Verify

| Priority | Contract | Address | Constructor Args |
|----------|----------|---------|------------------|
| 🔴 **HIGH** | OperationalTreasury | `0x3B026eD677615aDD2aC32aa5D1D5453051551EfB` | Yes |
| 🔴 **HIGH** | CoverPool | `0x7174db190fF9D9AD136B39EdeEffBC2451FC1C5b` | Yes |
| 🟡 **MEDIUM** | PositionsManager | `0x143c34DD579Ea5737284f06f4e4Ad581d4C42662` | Yes |
| 🟡 **MEDIUM** | ProfitCalculator | `0xDb7D577F1345AD74B125501F4B68240F44ed7e60` | No |
| 🟡 **MEDIUM** | LimitController | `0x6147765312700A1aaFe4Aee9c6469091C6A3F4Ac` | Yes |
| 🟡 **MEDIUM** | ProfitDistributor | `0xFF9031382D9cdd44A95FC6e5EbE74BF2C3591069` | Yes |

---

## 🔧 Step 1: Flatten Contract Source

### For Core Contracts:

```bash
cd /Users/kaifahmed/Downloads/Work/MEGAFI/Hedge/hedge-contracts/packages/herge

# Flatten CoverPool
npx hardhat flatten contracts/CoverPool.sol > CoverPool_flat.sol

# Flatten OperationalTreasury
npx hardhat flatten contracts/OperationalTreasury.sol > OperationalTreasury_flat.sol

# Flatten PositionsManager
npx hardhat flatten contracts/PositionsManager/PositionsManager.sol > PositionsManager_flat.sol

# Flatten ProfitCalculator
npx hardhat flatten contracts/Strategies/ProfitCalculator.sol > ProfitCalculator_flat.sol

# Flatten LimitController
npx hardhat flatten contracts/Strategies/LimitController.sol > LimitController_flat.sol

# Flatten ProfitDistributor
npx hardhat flatten contracts/ProfitDistributor.sol > ProfitDistributor_flat.sol
```

### Clean Up Duplicate SPDX Licenses

After flattening, open each file and:
1. Find duplicate `// SPDX-License-Identifier: GPL-3.0-or-later` lines
2. Keep **only the first one** at the top
3. Remove all other duplicates

**Quick command to check:**
```bash
grep -n "SPDX-License-Identifier" CoverPool_flat.sol
```

---

## 📝 Step 2: Get Constructor Arguments

Constructor arguments are stored in deployment artifacts. Here's how to get them:

### Option A: From Deployment Artifacts

```bash
# View constructor args for CoverPool
cat deployments/arbitrum-sepolia/CoverPool.json | grep -A 5 '"args"'
```

### Option B: Use the Helper Script

```bash
node -e "
const artifact = require('./deployments/arbitrum-sepolia/CoverPool.json');
console.log('Constructor Args:', JSON.stringify(artifact.args, null, 2));
"
```

### Constructor Arguments Reference:

**CoverPool:**
- `_coverToken`: `0x75faf114eafb1BDbe2F0316DF893fd58CE46AA4d` (USDC)
- `_profitToken`: `0x75faf114eafb1BDbe2F0316DF893fd58CE46AA4d` (USDC)
- `_payoffPool`: `0x711eE890B41fFbd23Ba3c96975DEBDB1145cbB83`
- `initialEpochChangingPrice`: `1000000000000000000000000000000`

**OperationalTreasury:**
- Check deployment artifact for full args

**PositionsManager:**
- Constructor takes 2 string parameters (name, symbol)

---

## 🌐 Step 3: Verify via Arbiscan UI

### 3.1 Navigate to Verification Page

1. Go to: **https://sepolia.arbiscan.io/verifyContract**
2. Or go to contract address page and click **"Contract"** tab → **"Verify and Publish"**

### 3.2 Fill Verification Form

| Field | Value |
|-------|-------|
| **Contract Address** | `0x7174db190fF9D9AD136B39EdeEffBC2451FC1C5b` (example: CoverPool) |
| **Compiler Type** | Solidity (Single file) |
| **Compiler Version** | `v0.8.15+commit.e14f2714` |
| **Open Source License Type** | GNU General Public License v3.0 (GPL-3.0) |
| **Optimization Enabled** | ✅ Yes |
| **Runs** | `200` |

### 3.3 Paste Source Code

1. Open the flattened `.sol` file
2. Copy **entire contents** (Ctrl+A, Ctrl+C)
3. Paste into **"Enter the Solidity Contract Code"** field

### 3.4 Enter Constructor Arguments

#### For Contracts WITH Constructor Args:

**Option A: ABI-Encoded (Recommended)**

Use ethers.js to encode:
```javascript
const { ethers } = require('ethers');

// For CoverPool
const args = [
  '0x75faf114eafb1BDbe2F0316DF893fd58CE46AA4d', // _coverToken
  '0x75faf114eafb1BDbe2F0316DF893fd58CE46AA4d', // _profitToken
  '0x711eE890B41fFbd23Ba3c96975DEBDB1145cbB83',   // _payoffPool
  '1000000000000000000000000000000'               // initialEpochChangingPrice
];

const types = ['address', 'address', 'address', 'uint256'];
const encoded = ethers.utils.defaultAbiCoder.encode(types, args);
console.log('Encoded Args:', encoded); // Remove 0x prefix
```

**Option B: Manual Encoding**

If you know the types, use an online ABI encoder:
- https://abi.hashex.org/
- Enter types: `address, address, address, uint256`
- Enter values: constructor args array
- Copy encoded result (without 0x)

#### For Contracts WITHOUT Constructor Args:

Leave the field **empty**.

### 3.5 Submit Verification

1. Click **"Verify and Publish"**
2. Wait 30-60 seconds
3. Check status on contract page

---

## ✅ Step 4: Verify Success

After submission:

1. Go to contract address page: `https://sepolia.arbiscan.io/address/[ADDRESS]`
2. Click **"Contract"** tab
3. You should see **"Contract Source Code Verified"** ✅
4. Green checkmark indicates success

---

## 🔄 Quick Verification Script

Create a helper script to automate flattening:

```bash
#!/bin/bash
# save as: scripts/flatten-for-verification.sh

CONTRACTS=(
  "CoverPool:contracts/CoverPool.sol"
  "OperationalTreasury:contracts/OperationalTreasury.sol"
  "PositionsManager:contracts/PositionsManager/PositionsManager.sol"
  "ProfitCalculator:contracts/Strategies/ProfitCalculator.sol"
  "LimitController:contracts/Strategies/LimitController.sol"
  "ProfitDistributor:contracts/ProfitDistributor.sol"
)

for contract in "${CONTRACTS[@]}"; do
  IFS=':' read -r name path <<< "$contract"
  echo "Flattening $name..."
  npx hardhat flatten "$path" > "${name}_flat.sol"
  echo "✅ Done: ${name}_flat.sol"
done
```

Usage:
```bash
chmod +x scripts/flatten-for-verification.sh
./scripts/flatten-for-verification.sh
```

---

## 📊 Verification Checklist

- [ ] CoverPool - `0x7174db190fF9D9AD136B39EdeEffBC2451FC1C5b`
- [ ] OperationalTreasury - `0x3B026eD677615aDD2aC32aa5D1D5453051551EfB`
- [ ] PositionsManager - `0x143c34DD579Ea5737284f06f4e4Ad581d4C42662`
- [ ] ProfitCalculator - `0xDb7D577F1345AD74B125501F4B68240F44ed7e60`
- [ ] LimitController - `0x6147765312700A1aaFe4Aee9c6469091C6A3F4Ac`
- [ ] ProfitDistributor - `0xFF9031382D9cdd44A95FC6e5EbE74BF2C3591069`

---

## 🚨 Troubleshooting

### Error: "Contract source code not verified"

**Possible causes:**
1. Constructor args not encoded correctly
2. Compiler version mismatch
3. Optimization settings mismatch
4. Duplicate SPDX licenses in flattened code

**Solution:**
- Double-check constructor args encoding
- Verify compiler version matches exactly
- Ensure optimization: Yes, 200 runs
- Clean flattened file of duplicate licenses

### Error: "Invalid source code"

**Possible causes:**
1. Incomplete copy of flattened source
2. Encoding issues in source file

**Solution:**
- Copy entire file (check line count)
- Save flattened file with UTF-8 encoding

### Error: "Constructor arguments not matching"

**Possible causes:**
1. Wrong constructor args
2. Incorrect ABI encoding

**Solution:**
- Verify args from deployment artifact
- Use ethers.js ABI encoder
- Check contract ABI for constructor signature

---

## 📚 Additional Resources

- **Arbiscan Verification Page:** https://sepolia.arbiscan.io/verifyContract
- **ABI Encoder Tool:** https://abi.hashex.org/
- **Deployment Artifacts:** `deployments/arbitrum-sepolia/`
- **Contract Addresses:** `deployments/arbitrum-sepolia/.addresses.json`
- **Full Deployment Doc:** `DEPLOYED_CONTRACTS_ARBITRUM_SEPOLIA.md`

---

## 💡 Tips

1. **Verify core contracts first** - They're most important
2. **Save flattened files** - Reuse for future verification
3. **Test with one contract** - Verify process works before bulk
4. **Keep constructor args** - Store in a text file for reference
5. **Check verification status** - Wait a few minutes and refresh

---

**Good luck with verification! 🚀**

*Last updated: November 5, 2025*
