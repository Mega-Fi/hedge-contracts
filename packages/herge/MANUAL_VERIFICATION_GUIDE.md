# Manual Contract Verification Guide for Arbitrum Sepolia

## 🚨 Automated Verification Status: BLOCKED

Arbiscan Sepolia API is protected by Cloudflare and blocks programmatic verification attempts.

**You must verify contracts manually through the web interface.**

---

## ✅ Flattened Source Files Ready

All core contracts have been flattened and are ready for manual verification:

```bash
# Contracts are flattened in the artifacts directory
# You can manually flatten any contract using:
npx hardhat flatten contracts/ContractName.sol > ContractName_flat.sol
```

---

## 📋 Step-by-Step Manual Verification

### For Each Contract:

#### 1. **Flatten the Contract**
```bash
cd /Users/kaifahmed/Downloads/Work/MEGAFI/Hedge/hedge-contracts/packages/herge

# Example: Flatten CoverPool
npx hardhat flatten contracts/CoverPool.sol > CoverPool_flat.sol

# Clean up duplicate SPDX licenses (keep only the first one)
# Open the file and remove duplicate "// SPDX-License-Identifier" lines
```

#### 2. **Go to Arbiscan Verification Page**
Visit: https://sepolia.arbiscan.io/verifyContract

#### 3. **Fill in the Form**

| Field | Value |
|-------|-------|
| **Contract Address** | (See table below) |
| **Compiler Type** | Solidity (Single file) |
| **Compiler Version** | v0.8.15+commit.e14f2714 |
| **Open Source License Type** | GNU General Public License v3.0 (GPL-3.0) |
| **Optimization Enabled** | Yes |
| **Runs** | 200 |

#### 4. **Paste Flattened Source Code**
- Copy the contents of the flattened file
- Remove any duplicate SPDX license identifiers (keep only the first one)
- Paste into the "Enter the Solidity Contract Code" field

#### 5. **Constructor Arguments (if needed)**
- Leave empty for most contracts
- For OperationalTreasury, you may need constructor args (see deployment data)

#### 6. **Submit and Wait**
Verification usually takes 30-60 seconds.

---

## 🎯 Priority Contracts to Verify

### Contract Addresses:

| Contract | Address | Priority |
|----------|---------|----------|
| **CoverPool** | `0xAd02465752782893045089396277697Af935dAdB` | ⭐⭐⭐ HIGHEST |
| **OperationalTreasury** | `0xeD5129B6Fc93C1D9c8278E540c4986dB9DC9D930` | ⭐⭐⭐ HIGHEST |
| **PositionsManager** | `0x88a2887bD21974ea9a8D23553eeE532B8a8e2AB3` | ⭐⭐ HIGH |
| **ProfitCalculator** | `0x1c64D2205415C4355Ad6C04250B4bA753758CcDc` | ⭐⭐ HIGH |
| **LimitController** | `0xb20aBac673Fc2f0Eb44fe911E65B262cDEfeb3e8` | ⭐ MEDIUM |
| **ProfitDistributor** | `0x2770Ba51F4e1712E7B424c392cf157B42B17C739` | ⭐ MEDIUM |

---

## 💡 Pro Tips

### 1. **Cleaning Duplicate SPDX Licenses**

Flattened files may have multiple SPDX license identifiers. Keep only the first one:

```solidity
// SPDX-License-Identifier: GPL-3.0-or-later  ← KEEP THIS
pragma solidity ^0.8.3;

// Remove all other instances of:
// SPDX-License-Identifier: ...
```

### 2. **Alternative: Use Hardhat Flatten with Cleanup**

```bash
# Flatten and automatically clean up
npx hardhat flatten contracts/CoverPool.sol | grep -v "// SPDX-License-Identifier" | head -1 && \
echo "// SPDX-License-Identifier: GPL-3.0-or-later" && \
npx hardhat flatten contracts/CoverPool.sol | grep -v "// SPDX-License-Identifier" > CoverPool_flat.sol
```

### 3. **Verify in Batches**
- Verify 1-2 contracts at a time to avoid rate limiting
- Start with the highest priority contracts

### 4. **Constructor Arguments**

For contracts that require constructor arguments, you can extract them from the deployment JSON files:

```bash
cat deployments/arbitrum-sepolia/CoverPool.json | jq '.args'
```

---

## 🔍 Example: Verifying CoverPool

### Step-by-Step:

```bash
# 1. Flatten the contract
cd /Users/kaifahmed/Downloads/Work/MEGAFI/Hedge/hedge-contracts/packages/herge
npx hardhat flatten contracts/CoverPool.sol > CoverPool_flat.sol

# 2. Open the file and remove duplicate SPDX licenses
# (Keep only the first one at the top)

# 3. Go to Arbiscan
open https://sepolia.arbiscan.io/verifyContract

# 4. Fill in:
Contract Address: 0xAd02465752782893045089396277697Af935dAdB
Compiler Type: Solidity (Single file)
Compiler Version: v0.8.15+commit.e14f2714
License: GPL-3.0
Optimization: Yes (200 runs)

# 5. Paste the cleaned source code

# 6. Submit!
```

---

## 📊 Verification Checklist

Use this to track your progress:

- [ ] **CoverPool** - `0xAd02465752782893045089396277697Af935dAdB`
  - [ ] Flattened
  - [ ] Cleaned SPDX licenses
  - [ ] Submitted to Arbiscan
  - [ ] Verified ✅

- [ ] **OperationalTreasury** - `0xeD5129B6Fc93C1D9c8278E540c4986dB9DC9D930`
  - [ ] Flattened
  - [ ] Cleaned SPDX licenses
  - [ ] Extracted constructor args
  - [ ] Submitted to Arbiscan
  - [ ] Verified ✅

- [ ] **PositionsManager** - `0x88a2887bD21974ea9a8D23553eeE532B8a8e2AB3`
  - [ ] Flattened
  - [ ] Cleaned SPDX licenses
  - [ ] Submitted to Arbiscan
  - [ ] Verified ✅

- [ ] **ProfitCalculator** - `0x1c64D2205415C4355Ad6C04250B4bA753758CcDc`
  - [ ] Flattened
  - [ ] Cleaned SPDX licenses
  - [ ] Submitted to Arbiscan
  - [ ] Verified ✅

- [ ] **LimitController** - `0xb20aBac673Fc2f0Eb44fe911E65B262cDEfeb3e8`
  - [ ] Flattened
  - [ ] Cleaned SPDX licenses
  - [ ] Submitted to Arbiscan
  - [ ] Verified ✅

- [ ] **ProfitDistributor** - `0x2770Ba51F4e1712E7B424c392cf157B42B17C739`
  - [ ] Flattened
  - [ ] Cleaned SPDX licenses
  - [ ] Submitted to Arbiscan
  - [ ] Verified ✅

---

## 🚀 Quick Commands

```bash
# Flatten all core contracts at once
cd /Users/kaifahmed/Downloads/Work/MEGAFI/Hedge/hedge-contracts/packages/herge

npx hardhat flatten contracts/CoverPool.sol > flattened/CoverPool_flat.sol
npx hardhat flatten contracts/OperationalTreasury.sol > flattened/OperationalTreasury_flat.sol
npx hardhat flatten contracts/PositionsManager/PositionsManager.sol > flattened/PositionsManager_flat.sol
npx hardhat flatten contracts/Strategies/ProfitCalculator.sol > flattened/ProfitCalculator_flat.sol
npx hardhat flatten contracts/Strategies/LimitController.sol > flattened/LimitController_flat.sol
npx hardhat flatten contracts/ProfitDistributor.sol > flattened/ProfitDistributor_flat.sol
```

---

## ⚠️ Common Issues

### Issue 1: "Constructor arguments required"
**Solution**: Extract from deployment JSON:
```bash
cat deployments/arbitrum-sepolia/ContractName.json | jq '.args'
```
Then encode using ethers:
```javascript
const ethers = require('ethers');
const args = [arg1, arg2, ...];
const encoded = ethers.utils.defaultAbiCoder.encode(['address', 'uint256', ...], args);
// Remove 0x prefix and paste into Constructor Arguments field
```

### Issue 2: "Source code doesn't match bytecode"
**Solution**: 
- Ensure you're using the correct compiler version (v0.8.15)
- Verify optimization is enabled with 200 runs
- Check that all SPDX licenses are cleaned up

### Issue 3: "Contract creation code is different"
**Solution**: You may have the wrong contract address. Double-check from deployment logs.

---

## 📞 Need Help?

If you encounter issues:

1. Check the Arbiscan FAQ: https://docs.arbiscan.io/
2. Ensure you're on the correct network (Arbitrum Sepolia, Chain ID: 421614)
3. Verify the contract was deployed successfully by checking the address on Arbiscan

---

## ✅ Success!

Once verified, your contracts will show:
- ✅ Green checkmark on Arbiscan
- Source code tab visible
- Read/Write contract functions available
- Full transparency for users

**Good luck with verification!** 🚀

